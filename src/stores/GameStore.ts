import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';
import { ref, computed } from 'vue';
import useScoreDefault from "@/stores/ScoreStore";

interface GameState {
  code: string;
  currentSet: number;
  player1: string;
  setPlayer1: {
    set1: number;
    set2: number | null;
    set3: number | null;
  };
  player2: string;
  setPlayer2: {
    set1: number;
    set2: number | null;
    set3: number | null;
  };
  sponsor: string;
  scores: {
    player1: number;
    player2: number;
  };
  hideBoard: boolean;
  gameOver: boolean;
  deuceRule: string;
  timer: number;
  setType: string;
  isTimerUpdate?: boolean;
}

export const useGameStore = defineStore('game', () => {
  // Socket connection
  const socket = ref<Socket | null>(null);
  const storedToken = ref<string | null>(null);
  const lastSentData = ref<GameState | null>(null);
  const debounceTimeout = ref<number | null>(null);
  const code = ref('');
  const codigo = ref('');
  
  // Game state
  const player1Score = ref(0);
  const player2Score = ref(0);
  const player1Games = ref(0);
  const player2Games = ref(0);
  const currentSet = ref(1);
  const gameOver = ref(false);
  const hideBoard = ref(true);
  const deuceRule = ref('goldenPoint');
  const gameParts = ref(1);
  const player1Sets = ref(0);
  const player2Sets = ref(0);
  const setType = ref('normal');  
  // Players
  const player1 = ref('');
  const player2 = ref('');
  const setPlayer1 = ref({
    set1: 0,
    set2: null as number | null,
    set3: null as number | null
  });
  const setPlayer2 = ref({
    set1: 0,
    set2: null as number | null,
    set3: null as number | null
  });

  // Timer
  const timer = ref(0);
  const isRunning = ref(false);
  let interval: number | null = null;

  // Tie Break
  const isTieBreak = ref(false);
  const tieBreakPlayer1 = ref(0);
  const tieBreakPlayer2 = ref(0);

  // Other
  const sponsor = ref('');
  const message = ref('');
  const isLoadVisible = ref(false);
  const scores = ref({ player1: 0, player2: 0 });

  const scoreStoreDefault = useScoreDefault();

  // Initialize socket connection
  const initSocket = (code: string) => {
    codigo.value = code;
    const baseUrl = import.meta.env.VITE_WEBSOCKT_BASE_URL || 'http://localhost:3007';
    socket.value = io(baseUrl, {
      query: { code },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    setupSocketListeners();
  };

  // Socket event listeners setup
  const setupSocketListeners = () => {
    if (!socket.value) return;

    socket.value.on('connect', () => {
      emitGameUpdate();
    });

    socket.value.on('disconnect', () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    });

    socket.value.on('timerUpdated', (data: { code: string; timer: number; isRunning: boolean }) => {
      if (data.code === lastSentData.value?.code) {
        if (isRunning.value !== data.isRunning) {
          timer.value = data.timer;
          isRunning.value = data.isRunning;
        
          if (isRunning.value && !interval) {
            interval = window.setInterval(() => {
              timer.value++;
            }, 1000);
          } else if (!isRunning.value && interval) {
            clearInterval(interval);
            interval = null;
          }
        }
      }
    });

    socket.value.on('gameUpdated', (data: GameState) => {
      updateGameState(data);
    });

    socket.value.on('forceLogout', () => {
      socket.value?.disconnect();
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      resetAll();
    });

    socket.value.on('error', (error: any) => {
      console.error('Erro no socket:', error);
    });
  };

  // Reset all game state
  const resetAll = () => {
    deuceRule.value = 'goldenPoint';
    setType.value = 'normal';
    currentSet.value = 1;
    sponsor.value = '';
    isTieBreak.value = false;
    hideBoard.value = true;
    gameOver.value = false;
    player1.value = '';
    player2.value = '';
    player1Score.value = 0;
    player2Score.value = 0;
    player1Games.value = 0;
    player2Games.value = 0;
    setPlayer1.value = { set1: 0, set2: null, set3: null };
    setPlayer2.value = { set1: 0, set2: null, set3: null };
    timer.value = 0;
    scores.value = { player1: 0, player2: 0 };
    gameParts.value = 1;
    isRunning.value = false;
    tieBreakPlayer1.value = 0;
    tieBreakPlayer2.value = 0;
    
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    
    resetTimer();
    emitGameUpdate();
  };

  const updateGameState = (data: GameState) => {
    if (data.code === lastSentData.value?.code) {
      if (data.isTimerUpdate) {
        timer.value = data.timer;
        return;
      }
      
      code.value = data.code;
      deuceRule.value = data.deuceRule;
      setType.value = data.setType;
      currentSet.value = data.currentSet;
      hideBoard.value = data.hideBoard;
      gameOver.value = data.gameOver;
      player1Score.value = data.player1Score;
      player2Score.value = data.player2Score;
      setPlayer1.value = data.setPlayer1;
      setPlayer2.value = data.setPlayer2;
      player1Games.value = data.scores.player1;
      player2Games.value = data.scores.player2;
      sponsor.value = data.sponsor;
      player1.value = data.player1;
      player2.value = data.player2;
      
      lastSentData.value = data;
    }
  };

  const emitGameUpdate = () => {
    const data: GameState = {
      code: codigo.value  || '',
      currentSet: currentSet.value,
      player1: player1.value,
      setPlayer1: setPlayer1.value,
      player2: player2.value,
      setPlayer2: setPlayer2.value,
      sponsor: sponsor.value,
      player1Score:player1Score.value,
      player2Score:player2Score.value,
      scores: {
        player1: player1Games.value,
        player2: player2Games.value
      },
      hideBoard: hideBoard.value,
      gameOver: gameOver.value,
      deuceRule: deuceRule.value,
      setType: setType.value,
      timer: timer.value
    };

    if (socket.value && JSON.stringify(lastSentData.value) !== JSON.stringify(data)) {
      lastSentData.value = data;
      if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
      debounceTimeout.value = window.setTimeout(() => {
        socket.value?.emit('updateGame', data);
      }, 300);
    }
  };

  // Timer functions
  const toggleTimer = () => {
    if (socket.value) {
      const timerData: GameState = {
        code: codigo.value || '',
        currentSet: currentSet.value,
        player1: player1.value,
        setPlayer1: setPlayer1.value,
        player2: player2.value,
        setPlayer2: setPlayer2.value,
        sponsor: sponsor.value,
        scores: scores.value,
        hideBoard: hideBoard.value,
        gameOver: gameOver.value,
        deuceRule: deuceRule.value,
        timer: timer.value,
        setType: setType.value,
        isTimerUpdate: true
      };

      socket.value.emit('toggleTimer', { 
        code: lastSentData.value?.code || '',
        timer: timer.value,
        isRunning: !isRunning.value
      });

      isRunning.value = !isRunning.value;
      if (isRunning.value) {
        interval = window.setInterval(() => {
          timer.value++;
        }, 1000);
      } else {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
    }
  };

  const resetTimer = () => {
    timer.value = 0;
    if (socket.value) {
      socket.value.emit('resetTimer', { code: lastSentData.value?.code || '' });
    }
  };

  const incrementMinutes = () => {
    timer.value += 60;
    socket.value?.emit('updateTimerValue', { 
      code: lastSentData.value?.code || '', 
      timer: timer.value 
    });
    emitGameUpdate();
  };

  const decrementMinutes = () => {
    if (timer.value >= 60) {
      timer.value -= 60;
      socket.value?.emit('updateTimerValue', { 
        code: lastSentData.value?.code || '', 
        timer: timer.value 
      });
      emitGameUpdate();
    }
  };

  const incrementSeconds = () => {
    timer.value += 1;
    socket.value?.emit('updateTimerValue', { 
      code: lastSentData.value?.code || '', 
      timer: timer.value 
    });
    emitGameUpdate();
  };

  const decrementSeconds = () => {
    if (timer.value > 0) {
      timer.value -= 1;
      socket.value?.emit('updateTimerValue', { 
        code: lastSentData.value?.code || '', 
        timer: timer.value 
      });
      emitGameUpdate();
    }
  };

  // Computed properties
  const formattedTime = computed(() => {
    const minutes = String(Math.floor(timer.value / 60)).padStart(2, '0');
    const seconds = String(timer.value % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  const setWinner = computed(() => {
    if (setType.value === 'normal') {
      if (player1Games.value >= 6 && player1Games.value - player2Games.value >= 2) {
        return 'Jogador 1';
      } else if (player2Games.value >= 6 && player2Games.value - player1Games.value >= 2) {
        return 'Jogador 2';
      }
      if (player1Games.value === 6 && player2Games.value === 6) {
        isTieBreak.value = true;
        return 'Tie-Break';
      }
    } else if (setType.value === 'pontosCorridos') {
      if (player1Games.value === 9) {
        return 'Jogador 1';
      } else if (player2Games.value === 9) {
        return 'Jogador 2';
      }
      if (player1Games.value === 9 && player2Games.value === 9) {
        isTieBreak.value = true;
        return 'Tie-Break';
      }
    }
    return 'Nenhum';
  });

  // Score methods
  const incrementPlayer1 = () => {
    if (player1Score.value === 40 && player2Score.value === 40) {
      applyDeuceRule('player1');
    } else if (player1Score.value === 40) {
      player1Score.value = 0;
      player2Score.value = 0;
      player1Games.value++;
      updateSetScore('player1');
      checkSetWinner();
    } else {
      player1Score.value = nextScore(player1Score.value);
    }
    emitGameUpdate();
  };

  const incrementPlayer2 = () => {
    if (player2Score.value === 40 && player1Score.value === 40) {
      applyDeuceRule('player2');
    } else if (player2Score.value === 40) {
      player2Score.value = 0;
      player1Score.value = 0;
      player2Games.value++;
      updateSetScore('player2');
      checkSetWinner();
    } else {
      player2Score.value = nextScore(player2Score.value);
    }
    emitGameUpdate();
  };

  const decrementPlayer1 = () => {
    if (player1Score.value === 0) return;
    if (player1Score.value === 15) {
      player1Score.value = 0;
    } else if (player1Score.value === 30) {
      player1Score.value = 15;
    } else if (player1Score.value === 40) {
      player1Score.value = 30;
    } else if (player1Score.value === 40 && player2Score.value === 40 && deuceRule.value === 'advantage') {
      player1Score.value = 40;
      player2Score.value = 40;
    }
    emitGameUpdate();
  };

  const decrementPlayer2 = () => {
    if (player2Score.value === 0) return;
    if (player2Score.value === 15) {
      player2Score.value = 0;
    } else if (player2Score.value === 30) {
      player2Score.value = 15;
    } else if (player2Score.value === 40) {
      player2Score.value = 30;
    } else if (player2Score.value === 40 && player1Score.value === 40 && deuceRule.value === 'advantage') {
      player2Score.value = 40;
      player1Score.value = 40;
    }
    emitGameUpdate();
  };

  // Set methods
  const incrementSetPlayer1 = (set: string) => {
    player1Score.value = 0;
    setPlayer1.value[set]++;
    incrementPointSetPlayer1(setPlayer1.value[set]);
    emitGameUpdate();
  };

  const incrementPointSetPlayer1 = (score:number) =>{
    player1Games.value = score;
  }

  const decrementSetPlayer1 = (set: string) => {
    if (setPlayer1.value[set] > 0) {
      setPlayer1.value[set]--;
      decrementPointSetPlayer1(setPlayer1.value[set]);
    }
    emitGameUpdate();
  };

  const decrementPointSetPlayer1 = (score: number) => {
    player1Games.value = score;
  };

  const incrementSetPlayer2 = (set: string) => {
    player2Score.value = 0;
    setPlayer2.value[set]++;
    incrementPointSetPlayer2(setPlayer2.value[set]);
    emitGameUpdate();
  };

  const incrementPointSetPlayer2 = (score: number) => {
    player2Games.value = score;
  };

  const decrementSetPlayer2 = (set: string) => {
    if (setPlayer2.value[set] > 0) {
      setPlayer2.value[set]--;
      decrementPointSetPlayer2(setPlayer2.value[set]);
    }
    emitGameUpdate();
  };

  const decrementPointSetPlayer2 = (score: number) => {
    player2Games.value = score;
  };

  // Tie break methods
  const incrementTieBreakPlayer1 = () => {
    if (tieBreakPlayer1.value < 7 || tieBreakPlayer1.value - tieBreakPlayer2.value < 2) {
      tieBreakPlayer1.value++;
      checkTieBreakWinner();
    }
  };

  const incrementTieBreakPlayer2 = () => {
    if (tieBreakPlayer2.value < 7 || tieBreakPlayer2.value - tieBreakPlayer1.value < 2) {
      tieBreakPlayer2.value++;
      checkTieBreakWinner();
    }
  };

  const checkTieBreakWinner = () => {
    if (tieBreakPlayer1.value >= 7 && tieBreakPlayer1.value - tieBreakPlayer2.value >= 2) {
      player1Sets.value++;
      updateSetScore('player1', true);
      resetTieBreak();
      if (player1Sets.value === 2) {
        gameOver.value = true;
      } else if (player1Sets.value < 3) {
        currentSet.value++;
      }
    } else if (tieBreakPlayer2.value >= 7 && tieBreakPlayer2.value - tieBreakPlayer1.value >= 2) {
      player2Sets.value++;
      updateSetScore('player2', true);
      resetTieBreak();
      if (player2Sets.value === 2) {
        gameOver.value = true;
      } else if (player2Sets.value < 3) {
        currentSet.value++;
      }
    }
    emitGameUpdate();
  };

  const resetTieBreak = () => {
    tieBreakPlayer1.value = 0;
    tieBreakPlayer2.value = 0;
    isTieBreak.value = false;
  };

  // Helper methods
  const nextScore = (currentScore: number): number => {
    if (currentScore === 0) return 15;
    if (currentScore === 15) return 30;
    if (currentScore === 30) return 40;
    return 0;
  };

  const checkSetWinner = () => {
    if (setWinner.value === 'Jogador 1') {
      player1Sets.value++;
      updateSetScore('player1');
      resetGame();
      if (setType.value === 'pontosCorridos' || player1Sets.value === 2) {
        // Fim de jogo para pontos corridos ou quando um jogador vence dois sets consecutivos
        gameOver.value = true;
      } else if (player1Sets.value < 3) {
        currentSet.value++;
      }
    } else if (setWinner.value === 'Jogador 2') {
      player2Sets.value++;
      updateSetScore('player2');
      resetGame();
      if (setType.value === 'pontosCorridos' || player2Sets.value === 2) {
        // Fim de jogo para pontos corridos ou quando um jogador vence dois sets consecutivos
        gameOver.value = true;
      } else if (player2Sets.value < 3) {
        currentSet.value++;
      }
    }
  };

  // Função auxiliar para resetar o game atual
  const resetGame = () => {
    player1Score.value = 0;
    player2Score.value = 0;
    player1Games.value = 0;
    player2Games.value = 0;
    
    // Gerenciamento dos sets baseado no set atual
    if (currentSet.value === 1) {
      setPlayer1.value.set2 = 0;
      setPlayer2.value.set2 = 0;
    } else if (currentSet.value === 2) {
      if (player1Sets.value === 2 || player2Sets.value === 2) {
        // Se um jogador ganhou dois sets consecutivos, o terceiro set não é necessário
        setPlayer1.value.set3 = null;
        setPlayer2.value.set3 = null;
      } else {
        // Caso contrário, inicializa o terceiro set
        setPlayer1.value.set3 = 0;
        setPlayer2.value.set3 = 0;
      }
    }
    
    // Emitir atualizações após resetar o game
    emitGameUpdate();
  };

  const applyDeuceRule = (player: string) => {
    if (deuceRule.value === 'advantage') {
      // Se um jogador alcançar a vantagem, ele precisa ganhar mais um ponto
      if (player === 'player1') {
        player1Score.value = 40; // Vantagem para Jogador 1
        player2Score.value = 30;
      } else {
        player2Score.value = 40; // Vantagem para Jogador 2
        player1Score.value = 30;
      }
    } else if (deuceRule.value === 'goldenPoint') {
      // Primeiro jogador a fazer um ponto vence o game
      if (player === 'player1') {
        player1Score.value = 0;
        player2Score.value = 0;
        player1Games.value++;
        updateSetScore('player1');
        checkSetWinner();
      } else {
        player2Score.value = 0;
        player1Score.value = 0;
        player2Games.value++;
        updateSetScore('player2');
        checkSetWinner();
      }
    }
    emitGameUpdate();
  };

  // Função auxiliar para atualizar o placar do set
  const updateSetScore = (player: string, isTieBreak: boolean = false) => {
    if (player === 'player1') {
      if (currentSet.value === 1) {
        setPlayer1.value.set1 = isTieBreak ? 7 : player1Games.value;
      } else if (currentSet.value === 2) {
        setPlayer1.value.set2 = isTieBreak ? 7 : player1Games.value;
      } else if (currentSet.value === 3) {
        setPlayer1.value.set3 = isTieBreak ? 7 : player1Games.value;
      }
    } else if (player === 'player2') {
      if (currentSet.value === 1) {
        setPlayer2.value.set1 = isTieBreak ? 7 : player2Games.value;
      } else if (currentSet.value === 2) {
        setPlayer2.value.set2 = isTieBreak ? 7 : player2Games.value;
      } else if (currentSet.value === 3) {
        setPlayer2.value.set3 = isTieBreak ? 7 : player2Games.value;
      }
    }
    emitGameUpdate();
  };

  const resetScores = () => {
    player1Score.value = 0;
    player2Score.value = 0;
  };

  const updateScore = async () => {
    isLoadVisible.value = true;
    const data = {
      id: scoreStoreDefault._detailsEvents?.[0]?.id,
      code: scoreStoreDefault._detailsEvents?.[0]?.code,
      name: scoreStoreDefault._detailsEvents?.[0]?.name,
      description: scoreStoreDefault._detailsEvents?.[0]?.description,
      status: 2,
      sport_type: '',
      storedToken: storedToken.value
    };

    try {
      const result = await scoreStoreDefault.updateScore(data);
      if (result.code === 1) {
        setTimeout(() => {
          message.value = 'Jogo Finalizado! ';
          isLoadVisible.value = false;
        }, 1000);
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      isLoadVisible.value = false;
      message.value = 'Ocorreu um erro ao finalizar o jogo';
    }
  };

  return {
    // State
    socket,
    code,
    storedToken,
    player1Score,
    player2Score,
    player1Games,
    player2Games,
    currentSet,
    gameOver,
    hideBoard,
    deuceRule,
    player1,
    player2,
    setPlayer1,
    setPlayer2,
    timer,
    isRunning,
    sponsor,
    message,
    isLoadVisible,
    scores,
    gameParts,
    isTieBreak,
    tieBreakPlayer1,
    tieBreakPlayer2,
    lastSentData,
    debounceTimeout,
    formattedTime,
    player1Sets,
    player2Sets,
    setType,
    setWinner,

    // Actions
    initSocket,
    toggleTimer,
    resetTimer,
    updateGameState,
    emitGameUpdate,
    incrementPlayer1,
    decrementPlayer1,
    incrementSetPlayer1,
    decrementSetPlayer1,
    incrementSetPlayer2,
    decrementSetPlayer2,
    incrementTieBreakPlayer1,
    incrementTieBreakPlayer2,
    setupSocketListeners,
    resetAll,
    updateScore,
    checkSetWinner,
    resetGame,
    checkTieBreakWinner,
    resetTieBreak,
    incrementPlayer2,
    decrementPlayer2,
    incrementPointSetPlayer2,
    decrementPointSetPlayer1,
    incrementPointSetPlayer1,
    incrementMinutes,
    decrementMinutes,
    incrementSeconds,
    decrementSeconds,
  };
}); 