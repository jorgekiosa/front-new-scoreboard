<template>
    <div class="container text-center px-4 mt-4">
		<div class="col-12 text-white border-custom ">
			<div class="row">
			  <div class="12 p-3 mb-1 d-flex justify-content-center align-items-center">
			        <!-- Botões Laterais: Minutos -->
					<div class="d-flex flex-column align-items-center me-3">
                        <button class="btn btn-success mb-2 rounded-circle" @click="incrementMinutes">+</button>
                        <button class="btn btn-success rounded-circle" @click="decrementMinutes">-</button>
                    </div>
                    <!-- Contador -->
                    <div class="text-center">
                        <div class="fs-2 mb-2">{{ formattedTime }}</div>
                    </div>
                    <!-- Botões Laterais: Segundos -->
                    <div class="d-flex flex-column align-items-center ms-3">
                        <button class="btn btn-success mb-2 rounded-circle" @click="incrementSeconds">+</button>
                        <button class="btn btn-success rounded-circle" @click="decrementSeconds">-</button>
                    </div>
			   </div>
			</div>

			<div class="d-flex mb-2 gap-1 justify-content-center flex-wrap">
				<button
					class="btn btn-sm w-49 w-md-auto"
					:class="isRunning ? 'btn-danger' : 'btn-success'"
					@click="startTimer"
				>
					{{ isRunning ? 'Stop' : 'Start' }}
				</button>
				<button class="btn btn-secondary text-light btn-sm w-48 w-md-auto" @click="resetTime">
					Redefinir tempo
				</button>
			</div>
       </div>
      <div class="row text-white mb-4">
            <!-- Jogador 1 -->
        <div class="col-6 p-2">
		  <div class="p-3 border-custom shadow">
            <p>Games: <span class="fw-bold">{{ player1Games }}</span></p>
            <input v-model="player1" class="form-control mb-3 text-center text-white border-input" placeholder="Jogador 1" disabled readonly />
            <div class="d-flex mb-2 justify-content-between align-items-center" v-for="(value, set) in setPlayer1" :key="set" v-if="value!==null">
                <button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer1(set)">-</button>
                <span   v-if="value!==null" class="fs-3 px-2">{{ value }}</span>
                <button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer1(set)">+</button>
            </div>
            <div class="d-flex mb-2 justify-content-between align-items-center">
                <button :class="deuceRule === 'advantage'? 'btn btn-success rounded-circle': deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" @click="decrementPlayer1">-</button>
                <span class="fs-3 px-2">{{ player1Score }}</span>
                <button :class="deuceRule === 'advantage'? 'btn btn-success rounded-circle': deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" @click="incrementPlayer1" :disabled="gameOver || isTieBreak">+</button>
            </div>
          </div>
        </div>

        <!-- Jogador 2 -->
        <div class="col-6 p-2">
		 <div class="p-3 border-custom shadow">
			<p>Games: <span class="fw-bold">{{ player2Games }}</span></p>
			<input v-model="player2" class="form-control mb-3 text-center text-white border-input" read-only placeholder="Jogador 2" disabled readonly />
			<div class="d-flex mb-2 justify-content-between align-items-center" v-for="(value, set) in setPlayer2" :key="set" v-if="value!==null">
				<button v-if="value!==null"  class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer2(set)">-</button>
				<span   v-if="value!==null" class="fs-3 px-2">{{ value }}</span>
				<button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer2(set)">+</button>
			</div>
			<div class="d-flex mb-2 justify-content-between align-items-center">
				<button :class="deuceRule === 'advantage'? 'btn btn-success rounded-circle': deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" @click="decrementPlayer2">-</button>
				<span class="fs-3 px-2">{{ player2Score }}</span>
				<button :class="deuceRule === 'advantage'? 'btn btn-success rounded-circle': deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" @click="incrementPlayer2" :disabled="gameOver || isTieBreak">+</button>
			</div>
          </div>
        </div>
         <!-- Timer -->
        <div class="col-12 px-5 mb-2">
            <div class="row">
                <div v-if="false" class="col-12 border-custom  d-flex justify-content-center align-items-center mb-2">
                    <!-- Caixa principal com borda -->
                    <div class="d-flex justify-content-center align-items-center px-4 py-2">
                    <!-- Botão de decremento -->
                    <button class="btn btn-primary rounded-circle btn-custom me-3" @click="decrement">-</button>
                    <!-- Valor central -->
                    <span class="fs-1 fw-bold mx-2">{{ gameParts }}</span>
                    <!-- Botão de incremento -->
                    <button class="btn btn-primary rounded-circle btn-custom ms-3" @click="increment">+</button>
                    </div>
                </div>

                <div class="col-12">
					<!--<div class="d-flex justify-content-center">
                        <button
                            class="btn btn-lg w-100"
                            :class="isRunning ? 'btn-danger' : 'btn-success'"
                            @click="startTimer"
                            >
                            {{ isRunning ? 'Stop' : 'Start' }}
                        </button>
                    </div> -->
					<div class="p-3 border-custom shadow"  v-if="player1Score === 40 && player2Score === 40">
                          <p class="fs-4 fw-bolder">Escolha a regra do Deuce </p>
                          <div class="row g-3  align-items-center">
                            <div class="col">
                              <div class="form-check form-check-inline">
                                <input class="form-check-input cursor-pointer" type="radio"  id="gridRadios1" v-model="deuceRule" value="advantage" >
                                <label class="form-check-label" for="gridRadios1">
                                  Vantagem
                                </label>
                            </div>
                            </div>
                            <div class="col">
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="radio" id="gridRadios1" v-model="deuceRule" value="goldenPoint">
									<label class="form-check-label" for="gridRadios2">
									Ponto de Ouro
									</label>
								</div>
							   </div>
							</div>
                          </div>

                    <div v-if="isTieBreak">
                      <h3>Tie-Break!</h3>
                      <p>Jogador 1: {{ tieBreakPlayer1 }} - Jogador 2: {{ tieBreakPlayer2 }}</p>
                      <div class="d-flex mb-4 gap-5 flex-wrap justify-content-center">
                        <button class="btn btn-success mb-2 rounded-circle" @click="incrementTieBreakPlayer1">+1</button>
                        <button class="btn btn-success mb-2 rounded-circle" @click="incrementTieBreakPlayer2">+1</button>
                      </div>
                    </div>
                    <div v-if="gameOver" class="text-center mt-3">
                      <h3 class="text-success">Jogo Finalizado! 🎾</h3>
                    </div>
                </div>
            </div>
        </div>
<!--<div class="col-12">
            <div class="accordion" id="accordionExample">
            <div class="accordion-item bg-transparent border-custom">
                <h2 class="accordion-header">
                <button class="accordion-button bg-transparent rounded-4 rounded-top-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"  :aria-expanded="player1Score === 40 && player2Score === 40" :class="{'collapsed': !(player1Score === 40 && player2Score === 40)}" aria-controls="collapseOne">
                    <i class="bi bi-chevron-down"></i> Configurações avançadas
                </button>
                </h2>
                <div id="collapseOne" :class="player1Score === 40 && player2Score === 40 ? 'show' : ''" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <div class="d-flex mb-4 gap-2 flex-wrap justify-content-center">
                      <div>
                        <input 
                          type="checkbox" 
                          class="btn-check" 
                          id="btn-check-2" 
                          v-model="hideBoard" 
                          autocomplete="off"
                        >
                        <label class="btn" :class="hideBoard ? 'btn-success' : 'btn-danger'" for="btn-check-2">Hide board</label>
                      </div>
                        <button class="btn btn-warning text-light" @click="resetTime">Reset time</button>
                        <button class="btn btn-primary" @click="resetAll">Reset all</button>
                        <button class="btn btn-warning text-light" @click="startStreaming">
                          <font-awesome-icon :icon="['fas', 'video']" /> Stream
                        </button>
                    </div>
                    <hr class="border border-white border-1 opacity-50">
                    <div class="col-12 text-white ">
                      <div class="row g-4">
                        <div :class="player1Score === 40 && player2Score === 40?'col-6 p-4 mb-4':'col-12 p-4 mb-4'">
							<div class="p-3 border-custom shadow">
                          <p class="fs-4 fw-bolder">Escolha um tipo de Set </p>
                          <div class="row g-3 px-5 align-items-center">
                            <div class="col">
                              <div class="form-check form-check-inline">
                                <input class="form-check-input cursor-pointer" type="radio"  id="gridRadios1" v-model="setType" value="normal" >
                                <label class="form-check-label" for="gridRadios1">
                                  Set Normal
                                </label>
                            </div>
                            </div>
                            <div class="col">
                              <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" id="gridRadios1" v-model="setType" value="pontosCorridos">
                                <label class="form-check-label" for="gridRadios2">
                                  Set com Pontos Corridos
                                </label>
                            </div>
                            </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 p-4 mb-4" 
                         v-if="player1Score === 40 && player2Score === 40"
                        >
						<div class="p-3 border-custom shadow">
                          <p class="fs-4 fw-bolder">Escolha a regra do Deuce </p>
                          <div class="row g-3 px-5 align-items-center">
                            <div class="col">
                              <div class="form-check form-check-inline">
                                <input class="form-check-input cursor-pointer" type="radio"  id="gridRadios1" v-model="deuceRule" value="advantage" >
                                <label class="form-check-label" for="gridRadios1">
                                  Vantagem
                                </label>
                            </div>
                            </div>
                            <div class="col">
								<div class="form-check form-check-inline">
									<input class="form-check-input" type="radio" id="gridRadios1" v-model="deuceRule" value="goldenPoint">
									<label class="form-check-label" for="gridRadios2">
									Ponto de Ouro
									</label>
								</div>
							   </div>
							</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="row">
                      <div class="col">
                        <input v-model="sponsor" class="form-control placeholder-white mb-3 text-left text-white border-input" placeholder="Digite o nome do patrocinador" />
                      </div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div> -->

      </div>

    </div>
  </template>
  
  <script setup>
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { storeToRefs } from "pinia";
  import { ref, computed,onMounted,watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { io } from 'socket.io-client';
  import useContentDefault from "@/stores/ContentStore"
  const contentStoreDefault = useContentDefault();


// Conexão com o servidor WebSocket em outro projeto
const socket = io(import.meta.env.VITE_WEBSOCKT_BASE_URL || 'http://localhost:3007'); // URL do servidor backend

const route = useRoute();

const hideBoard=ref(true)

// Estados para pontos, games e sets
const player1Score = ref(0);
const player2Score = ref(0);
const player1Games = ref(0);
const player2Games = ref(0);
// Estado do gameParts 
const gameParts  = ref(1);

const sponsor = ref('');

const currentSet = ref(1);
const player1Sets = ref(0);
const player2Sets = ref(0);
const gameOver = ref(false); // Estado para indicar fim de jogo
// Estados para Tie-Break
const isTieBreak = ref(false);
const tieBreakPlayer1 = ref(0);
const tieBreakPlayer2 = ref(0);
// Estados para os jogadores
const player1 = ref('Home');
const setPlayer1=ref({
  set1:0,
  set2:null,
  set3:null
})

const player2 = ref('Away');
const setPlayer2=ref({
  set1:0,
  set2:null,
  set3:null
})

// Pontuações
const scores = ref({
  player1: 0,
  player2: 0,
});

// Tipo de set (normal ou pontos corridos)
const setType = ref('normal'); // "normal" é o tipo de set padrão
// Regra do Deuce
const deuceRule = ref(''); // Pode ser 'advantage' ou 'goldenPoint'
  
// Timer
const timer = ref(0); // Timer em segundos
const isRunning = ref(false);
const interval = ref(null);

  // Calcula se o jogo acabou
/* const isGameOver = computed(() => checkGameOver()); */

// Função auxiliar para exibir os pontos corretamente
function displayPoints(points) {
  if (points === 0) return '0';
  if (points === 1) return '15';
  if (points === 2) return '30';
  if (points === 3) return '40';
  return 'Vantagem';
}

  // Formatação do tempo em MM:SS
  const formattedTime = computed(() => {
    const minutes = String(Math.floor(timer.value / 60)).padStart(2, '0');
    const seconds = String(timer.value % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  // Funções do timer
  const incrementMinutes = () => (timer.value += 60);
  const decrementMinutes = () => {
    if (timer.value >= 60) timer.value -= 60;
  };
  const incrementSeconds = () => (timer.value += 1);
  const decrementSeconds = () => {
    if (timer.value > 0) timer.value -= 1;
  };
  

  // Computed para determinar o vencedor do set
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

// Computed para determinar o vencedor final
const winner = computed(() => {
  if (gameOver.value) {
    return player1Sets.value > player2Sets.value ? 'Jogador 1' : 'Jogador 2';
  }
  return 'Jogo em andamento';
});

// Funções para incrementar os pontos
function incrementPlayer1() {
  if (player1Score.value === 40 && player2Score.value === 40) {
    applyDeuceRule('player1');
  } else if (player1Score.value === 40) {
    // Finaliza o game quando um jogador chega a 40
    player1Score.value = 0;
    player2Score.value = 0;
    player1Games.value++;
    updateSetScore('player1');
    checkSetWinner();
  } else {
    // Incrementa os pontos conforme a lógica normal
    player1Score.value = nextScore(player1Score.value);
  }
}

function incrementPlayer2() {
  if (player2Score.value === 40 && player1Score.value === 40) {
    applyDeuceRule('player2');
  } else if (player2Score.value === 40) {
    // Finaliza o game quando um jogador chega a 40
    player2Score.value = 0;
    player1Score.value = 0;
    player2Games.value++;
    updateSetScore('player2');
    checkSetWinner();
  } else {
    // Incrementa os pontos conforme a lógica normal
    player2Score.value = nextScore(player2Score.value);
  }
}

function decrementPlayer1() {
  if (player1Score.value === 0) return; // Evita pontuação negativa
  if (player1Score.value === 15) {
    player1Score.value = 0;
  } else if (player1Score.value === 30) {
    player1Score.value = 15;
  } else if (player1Score.value === 40) {
    player1Score.value = 30;
  } else if (player1Score.value === 40 && player2Score.value === 40 && deuceRule.value === 'advantage') {
    // Remove a vantagem do Jogador 1 no caso de Deuce com regra de vantagem
    player1Score.value = 40;
    player2Score.value = 40;
  }
}

function decrementPlayer2() {
  if (player2Score.value === 0) return; // Evita pontuação negativa
  if (player2Score.value === 15) {
    player2Score.value = 0;
  } else if (player2Score.value === 30) {
    player2Score.value = 15;
  } else if (player2Score.value === 40) {
    player2Score.value = 30;
  } else if (player2Score.value === 40 && player1Score.value === 40 && deuceRule.value === 'advantage') {
    // Remove a vantagem do Jogador 2 no caso de Deuce com regra de vantagem
    player2Score.value = 40;
    player1Score.value = 40;
  }
}


// Função que aplica a regra do Deuce (Vantagem ou Ponto de Ouro)
function applyDeuceRule(winner) {
  if (deuceRule.value === 'advantage') {
    // Se um jogador alcançar a vantagem, ele precisa ganhar mais um ponto
    if (winner === 'player1') {
      player1Score.value = 40; // Vantagem para Jogador 1
      player2Score.value = 30;
    } else {
      player2Score.value = 40; // Vantagem para Jogador 2
      player1Score.value = 30;
    }
  } else if (deuceRule.value === 'goldenPoint') {
    // Primeiro jogador a fazer um ponto vence o game
    if (winner === 'player1') {
      player1Score.value = 0;
      player2Score.value = 0;
      player1Games.value++;
      updateSetScore('player1');
      checkSetWinner();
      deuceRule.value=''
    } else {
      player2Score.value = 0;
      player1Score.value = 0;
      player2Games.value++;
      updateSetScore('player2');
      checkSetWinner();
      deuceRule.value=''
    }
  }
}

// Função para determinar o próximo valor de pontos
function nextScore(currentScore) {
  if (currentScore === 0) return 15;
  if (currentScore === 15) return 30;
  if (currentScore === 30) return 40;
  return 0;
}

// Função para verificar se o set foi vencido
function checkSetWinner() {
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
}

// Função para atualizar o placar do set atual
function updateSetScore(player, isTieBreak = false) {
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
}

// Função para o Tie-Break
function incrementTieBreakPlayer1() {
  if (tieBreakPlayer1.value < 7 || tieBreakPlayer1.value - tieBreakPlayer2.value < 2) {
    tieBreakPlayer1.value++;
    checkTieBreakWinner();
  }
}

function incrementTieBreakPlayer2() {
  if (tieBreakPlayer2.value < 7 || tieBreakPlayer2.value - tieBreakPlayer1.value < 2) {
    tieBreakPlayer2.value++;
    checkTieBreakWinner();
  }
}

// Função para verificar o vencedor do Tie-Break
function checkTieBreakWinner() {
  if (tieBreakPlayer1.value >= 7 && tieBreakPlayer1.value - tieBreakPlayer2.value >= 2) {
    player1Sets.value++;
    updateSetScore('player1', true); // Ajuste para marcar como 7-6 após Tie-Break
    resetTieBreak();
    if (player1Sets.value === 2) {
      gameOver.value = true; // Jogador 1 venceu dois sets consecutivos
    } else if (player1Sets.value < 3) {
      currentSet.value++;
    }
  } else if (tieBreakPlayer2.value >= 7 && tieBreakPlayer2.value - tieBreakPlayer1.value >= 2) {
    player2Sets.value++;
    updateSetScore('player2', true); // Ajuste para marcar como 7-6 após Tie-Break
    resetTieBreak();
    if (player2Sets.value === 2) {
      gameOver.value = true; // Jogador 2 venceu dois sets consecutivos
    } else if (player2Sets.value < 3) {
      currentSet.value++;
    }
  }
}

// Função para resetar a pontuação do game
function resetGame() {
  player1Score.value = 0;
  player2Score.value = 0;
  player1Games.value = 0;
  player2Games.value = 0;

  if (currentSet.value === 1) {
    setPlayer1.value.set2 = 0;
    setPlayer2.value.set2 = 0;
  } else if (currentSet.value === 2) {
    if (player1Sets.value === 2 || player2Sets.value === 2) {
      setPlayer1.value.set3 = null;
      setPlayer2.value.set3 = null;
    } else {
      setPlayer1.value.set3 = 0;
      setPlayer2.value.set3 = 0;
    }
  }
}


// Função para resetar o Tie-Break
function resetTieBreak() {
  tieBreakPlayer1.value = 0;
  tieBreakPlayer2.value = 0;
  isTieBreak.value = false;
  resetGame();
}

// Função para resetar o jogo
function resetMatch() {
  player1Score.value = 0;
  player2Score.value = 0;
  player1Games.value = 0;
  player2Games.value = 0;
  player1Sets.value = 0;
  player2Sets.value = 0;
  tieBreakPlayer1.value = 0;
  tieBreakPlayer2.value = 0;
  isTieBreak.value = false;
  gameOver.value = false;
  currentSet.value = 1;
  hideBoard.value=true

  setPlayer1.value = {
    set1: 0,
    set2: null,
    set3: null,
  };
  setPlayer2.value = {
    set1: 0,
    set2: null,
    set3: null,
  };
}

// Watch para resetar o jogo ao alterar o tipo de set
watch(setType, () => {
  resetMatch();
});
// Funções de incremento e decremento Display part game
const increment = () => gameParts .value++;
  const decrement = () => {
  if (gameParts .value > 0) gameParts .value--;
  };
  // Funções de setPlayer1
  const incrementSetPlayer1 = (set) =>{ 
    setPlayer1.value[set]++;
  }
  const decrementSetPlayer1 = (set) => {
    if (setPlayer1.value[set] > 0) setPlayer1.value[set]--;
  };

  // Funções de setPlayer2
  const incrementSetPlayer2 = (set) => setPlayer2.value[set]++;
  const decrementSetPlayer2 = (set) => {
    if (setPlayer2.value[set] > 0) setPlayer2.value[set]--;
  };
  

  
  const startTimer = () => {
    if (isRunning.value) {
      clearInterval(interval.value);
      isRunning.value = false;
      // Envia o status atualizado ao servidor
      socket.emit('updateTimer', {
        timer: timer.value,
        isRunning: isRunning.value,
        code: route.query.code || '',
      });
    } else {
      interval.value = setInterval(() => {
        timer.value++;
        // Envia o valor atualizado do timer via WebSocket
        socket.emit('updateTimer', { timer: timer.value, code: route.query.code || '',isRunning: true });
      }, 1000);
      isRunning.value = true;
    }
  };
  
  const startStreaming = () => {
    const data = {
      code:route.query.code || '',
      currentSet:currentSet.value || 1,
      player1: player1.value,
      setPlayer1:setPlayer1.value,
      player2: player2.value,
      setPlayer2:setPlayer2.value,
      sponsor: sponsor.value,
      player1Games: player1Games.value,
      player2Games: player2Games.value,
      player1Score: player1Score.value,
      player2Score: player2Score.value,
      scores: scores.value,
      hideBoard:hideBoard.value,
      gameOver:gameOver.value,
      deuceRule:deuceRule.value || '',
      timer: timer.value,
    };
   // Emite os dados via WebSocket
   socket.emit('updateGame', data);

   const code = route.query.code || '';
   const url = `/broadcast?code=${code}`;
   const newWindow = window.open(url, '_blank');
  
  // Aguardar a nova aba carregar e garantir que ela se conecte ao WebSocket
  newWindow.onload = () => {
    socket.emit('updateGame', data);  // Emitir dados para a nova aba
  };
 };

 // Recebe atualizações do servidor para manter o timer sincronizado
socket.on('timerUpdated', (data) => {
  if (data.code === route.query.code) {
    timer.value = data.timer; // Atualiza o timer localmente
    isRunning.value = data.isRunning; // Atualiza o status do timer
  }
});

 socket.on('gameUpdated', (data) => {
  if (data.code === route.query.code) {
    deuceRule.value=data.deuceRule || ''
    currentSet.value=data.currentSet || 1
    sponsor.value=data.sponsor || ''
    hideBoard.value=data.hideBoard || true
    gameOver.value=data.gameOver || false,
    player1.value= data.player1|| 'Home'
    player2.value= data.player2|| 'Away'
    setPlayer1.value.set1=data.setPlayer1.set1 || 0
    setPlayer1.value.set2=data.setPlayer1.set2 || null
    setPlayer1.value.set3=data.setPlayer1.set3 || null
    setPlayer2.value.set1=data.setPlayer2.set1 || 0
    setPlayer2.value.set2=data.setPlayer2.set2 || null
    setPlayer2.value.set3=data.setPlayer2.set3 || null

    player1Games.value= data.player1Games ||0,
    player2Games.value= data.player2Games ||0,
    player1Score.value= data.player1Score ||0,
    player2Score.value= data.player2Score ||0

    scores.value.player1=data.scores.player1
    scores.value.player2=data.scores.player2
  }
});
  const resetTime = () => {
    timer.value = 0;
   };
  const resetAll = () => {
    deuceRule.value=''
    currentSet.value = 1;
    sponsor.value= ''
    hideBoard.value= true
    isTieBreak.value= false
    gameOver.value = false
    player1.value='Home'
    player2.value='Away'
    player1Score.value = 0;
    player2Score.value = 0;
    player1Games.value = 0;
    player2Games.value = 0;
    setPlayer1.value.set1=0
    setPlayer1.value.set2=null
    setPlayer1.value.set3=null
    setPlayer2.value.set1=0
    setPlayer2.value.set2= null
    setPlayer2.value.set3=null
    timer.value = 0;
    scores.value.player1 = 0;
    scores.value.player2 = 0;
    gameParts.value=1
  };

watch([player1, player2, sponsor,hideBoard,gameOver,deuceRule, timer,player1Score,player2Score,player1Games,player2Games,scores.value,setPlayer1.value,setPlayer2.value], () => {
  const data = {
    currentSet:currentSet.value || 1,
    code: route.query.code || '',
    player1: player1.value || 'Home',
    setPlayer1:setPlayer1.value,
    player2: player2.value || 'Away',
    setPlayer2:setPlayer2.value,
    sponsor: sponsor.value || '',
    scores: scores.value,
    player1Score:player1Score.value,
    player2Score:player2Score.value,
    player1Games:player1Games.value,
    player2Games:player2Games.value,
    hideBoard:hideBoard.value,
    gameOver:gameOver.value,
    timer: timer.value,
    deuceRule:deuceRule.value
  };
  socket.emit('updateGame', data); // Envia as atualizações em tempo real
});
   // Restaura o timer ao recarregar a página
  onMounted(() => {
    socket.emit('getGame', { code: route.query.code || '' });
    socket.emit('getTimer', { code: route.query.code || '' });
    socket.on('currentTimer', (data) => {
      if (data.code === route.query.code) {
        timer.value = data.timer;
        isRunning.value = data.isRunning;
    // Se o timer estava rodando, reinicia o intervalo localmente
      if (isRunning.value) {
        interval.value = setInterval(() => {
          timer.value++;
          socket.emit('updateTimer', {
            timer: timer.value,
            isRunning: true,
            code: route.query.code || '',
          });
        }, 1000);
      }
      }
    });
  });
  </script>
  
  <style scoped>
  .home{
  background-color: #033380;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
  .placeholder-white::placeholder {
    color: white;
    opacity: 1; /* Garante que a opacidade do placeholder seja consistente */
  }

  .custom-switch {
  width: 40px; /* Ajusta a largura */
  height: 20px; /* Ajusta a altura */
  transform: scale(1.5); /* Aumenta proporcionalmente o tamanho */
  cursor: pointer;
}

.custom-switch:checked {
  background-color: #4caf50; /* Cor ao ativar */
}

.custom-switch:focus {
  box-shadow: 0 0 5px #4caf50;
}
  /* Estilização de botões */
  .btn {
    font-size: 1.2rem;
  }
  
  .btn.rounded-circle {
    width: 40px; /* Define largura fixa */
    height: 40px; /* Define altura fixa */
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Texto formatado */
  .fs-2 {
    font-weight: bold;
  }
  
  /* Estilo das bordas personalizadas */
  .border-custom {
    border: 2px solid #ccc;
    border-radius: 20px; /* Arredondamento */
    background-color: transparent; /* Remove o fundo */
  }
  
  /* Input personalizado */
  .border-input {
    border: 2px solid #ccc;
    border-radius: 10px;
    background-color: transparent;
  }
  </style>
  