<template>
    <div class="container text-center  px-5 mt-5">
      <div class="row justify-content-center text-white mb-4 g-4">
        <div class="d-flex justify-content-around">
      <!-- Incrementar pontos -->
      <button class="btn btn-primary" @click="scorePoint(1, 'increment')" :disabled="isGameOver">
        + Ponto para {{ player1Name }}
      </button>
      <button class="btn btn-danger" @click="scorePoint(2, 'increment')" :disabled="isGameOver">
        + Ponto para {{ player2Name }}
      </button>
    </div>
    <p>Games: <span class="fw-bold">{{ player2Games }}</span></p>
        <!-- Jogador 1 -->
        <div class="col-3 border-custom shadow p-5">
          <input v-model="player1" class="form-control mb-3 text-center text-white border-input" placeholder="Jogador 1" />
          <div class="d-flex mb-2 justify-content-between align-items-center">
            <button class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer1('set1')">-</button>
            <span class="fs-3">{{ setPlayer1.set1 }}</span>
            <button class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer1('set1')">+</button>
          </div>
          <div class="d-flex mb-2 justify-content-between align-items-center">
            <button class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer1('set2')">-</button>
            <span class="fs-3">{{ setPlayer1.set2 }}</span>
            <button class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer1('set2')">+</button>
          </div>
          <div class="d-flex mb-2 justify-content-between align-items-center">
            <button class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer1('set3')">-</button>
            <span class="fs-3">{{ setPlayer1.set3 }}</span>
            <button class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer1('set3')">+</button>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-primary rounded-circle" @click="decrementScore('player1')">-</button>
            <span class="fs-3">{{ scores.player1 }}</span>
            <button class="btn btn-primary rounded-circle" @click="incrementScore('player1')">+</button>
          </div>
        </div>
  
        <!-- Timer -->
        <div class="col-4 px-5">
            <div class="row">
                <div class="col-12 border-custom  d-flex justify-content-center align-items-center mb-2">
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
                <div class="col-12 border-custom p-3 d-flex justify-content-center align-items-center">
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
                <div class="col-12">
                    <div class="d-flex justify-content-center mt-2">
                        <button
                            class="btn btn-lg w-100"
                            :class="isRunning ? 'btn-danger' : 'btn-success'"
                            @click="startTimer"
                            >
                            {{ isRunning ? 'Stop' : 'Start' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Jogador 2 -->
        <div class="col-3 border-custom shadow p-4">
          <input v-model="player2" class="form-control mb-3 text-center text-white border-input" placeholder="Jogador 2" />
          <div class="d-flex mb-2 justify-content-between align-items-center">
            <button class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer2('set1')">-</button>
            <span class="fs-3">{{ setPlayer2.set1 }}</span>
            <button class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer2('set1')">+</button>
          </div>
          <div class="d-flex mb-2 justify-content-between align-items-center">
            <button class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer2('set2')">-</button>
            <span class="fs-3">{{ setPlayer2.set2 }}</span>
            <button class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer2('set2')">+</button>
          </div>
          <div class="d-flex mb-2 justify-content-between align-items-center">
            <button class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer2('set3')">-</button>
            <span class="fs-3">{{ setPlayer2.set3 }}</span>
            <button class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer2('set3')">+</button>
          </div>
          <div class="d-flex mb-2 justify-content-between align-items-center">
            <button class="btn btn-primary rounded-circle" @click="decrementScore('player2')">-</button>
            <span class="fs-3">{{ scores.player2 }}</span>
            <button class="btn btn-primary rounded-circle" @click="incrementScore('player2')">+</button>
          </div>
        </div>
        <button class="btn btn-outline-warning" @click="startStreaming">
                            <i class="bi bi-people"></i> Stream
                        </button>
        <div class="col-12">
            <div class="accordion" id="accordionExample">
            <div class="accordion-item bg-transparent border-custom">
                <h2 class="accordion-header">
                <button class="accordion-button bg-transparent rounded-4 rounded-top-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <i class="bi bi-chevron-down"></i> Configurações avançadas
                </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <strong>This is the first item's accordion body.</strong>
                    <div class="d-flex mb-4 gap-2 flex-wrap justify-content-center">
                        <button class="btn btn-primary" @click="resetTime">Reset time</button>
                        <button class="btn btn-outline-primary" @click="resetAll">Reset all</button>
                        <button class="btn btn-outline-primary">Swap teams</button>
                        <button class="btn btn-outline-warning" @click="startStreaming">
                            <i class="bi bi-people"></i> Stream
                        </button>
                    </div>

                    <div class="row">
                      <div class="col-12">
                        <input v-model="sponsor" class="form-control mb-3 text-left text-white border-input" placeholder="Patrocinador" />
                      </div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </template>
  
  <script setup>
  import { storeToRefs } from "pinia";
  import { ref, computed,onMounted,watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { io } from 'socket.io-client';
  import useContentDefault from "@/stores/ContentStore"
  const contentStoreDefault = useContentDefault();


  // Conexão com o servidor WebSocket em outro projeto
  const socket = io('http://localhost:3007'); // URL do servidor backend

  const router = useRouter();
  const route = useRoute();

  // Variáveis de controle
const player1Points = ref(0);
const player2Points = ref(0);

const player1Games = ref(0);
const player2Games = ref(0);
// Estado do gameParts 
const gameParts  = ref(1);

  const sponsor = ref('');
  // Estados para os jogadores
  const player1 = ref('Home');
  const setPlayer1=ref({
    set1:0,
    set2:0,
    set3:0
  })

  const player2 = ref('Away');
  const setPlayer2=ref({
    set1:0,
    set2:0,
    set3:0
  })
  
  // Pontuações
  const scores = ref({
    player1: 0,
    player2: 0,
  });
  const scoreValues = [0, 15, 30, 40];
  
  // Timer
  const timer = ref(0); // Timer em segundos
  const isRunning = ref(false);
  const interval = ref(null);

  // Calcula se o jogo acabou
const isGameOver = computed(() => checkGameOver());

// Função auxiliar para exibir os pontos corretamente
function displayPoints(points) {
  if (points === 0) return '0';
  if (points === 1) return '15';
  if (points === 2) return '30';
  if (points === 3) return '40';
  return 'Vantagem';
}

  function scorePoint(player, action) {
  //if (isGameOver.value) return; // Impede novas ações se o jogo acabou

  if (action === 'increment') {
    if (player === 1) player1Points.value++;
    else if (player === 2) player2Points.value++;
  } else if (action === 'decrement') {
    if (player === 1 && player1Points.value > 0) player1Points.value--;
    else if (player === 2 && player2Points.value > 0) player2Points.value--;
  }

  checkGameWinner();
}

function checkGameWinner() {
  // Jogador 1 vence o game
  if (player1Points.value >= 4 && player1Points.value - player2Points.value >= 2) {
    player1Games.value++;
    resetGame();
    checkSetWinner();
  }
  // Jogador 2 vence o game
  else if (player2Points.value >= 4 && player2Points.value - player1Points.value >= 2) {
    player2Games.value++;
    resetGame();
    checkSetWinner();
  }
}

// Função para verificar vencedor do set
function checkSetWinner() {
  const currentSet = getCurrentSet();
  if (player1Games.value >= 6 && player1Games.value - player2Games.value >= 2) {
    setPlayer1.value[currentSet] = player1Games.value;
    setPlayer2.value[currentSet] = player2Games.value;
    resetSet();
  } else if (player2Games.value >= 6 && player2Games.value - player1Games.value >= 2) {
    setPlayer2.value[currentSet] = player2Games.value;
    setPlayer1.value[currentSet] = player1Games.value;
    resetSet();
  }

  //checkGameOver();
}

  // Funções de pontuação
  const incrementScore = (player) => {
  const currentScore = scores.value[player];
  const currentIndex = scoreValues.indexOf(currentScore);

  if (currentIndex < scoreValues.length - 1) {
    scores.value[player] = scoreValues[currentIndex + 1];
  }
};

const decrementScore = (player) => {
  const currentScore = scores.value[player];
  const currentIndex = scoreValues.indexOf(currentScore);

  if (currentIndex > 0) {
    scores.value[player] = scoreValues[currentIndex - 1];
  }
};

// Função auxiliar para descobrir o set atual
function getCurrentSet() {
  const totalSetsPlayed =
    (setPlayer1.value.set1 > 0 || setPlayer2.value.set1 > 0 ? 1 : 0) +
    (setPlayer1.value.set2 > 0 || setPlayer2.value.set2 > 0 ? 1 : 0);

  // Retorna o próximo set a ser atualizado
  if (totalSetsPlayed === 0) return 'set1';
  if (totalSetsPlayed === 1) return 'set2';
  return 'set3';
}

// Verifica se o jogo acabou
function checkGameOver() {
  const player1SetsWon = (setPlayer1.value.set1 > setPlayer2.value.set1 ? 1 : 0) +
    (setPlayer1.value.set2 > setPlayer2.value.set2 ? 1 : 0);
  const player2SetsWon = (setPlayer2.value.set1 > setPlayer1.value.set1 ? 1 : 0) +
    (setPlayer2.value.set2 > setPlayer1.value.set2 ? 1 : 0);

  return player1SetsWon === 2 || player2SetsWon === 2;
}
// Função para resetar pontos de um game
function resetGame() {
  player1Points.value = 0;
  player2Points.value = 0;
}

// Função para resetar um set
function resetSet() {
  player1Games.value = 0;
  player2Games.value = 0;
}

// Funções de incremento e decremento Display part game
  const increment = () => gameParts .value++;
  const decrement = () => {
  if (gameParts .value > 0) gameParts .value--;
  };

  // Formatação do tempo em MM:SS
  const formattedTime = computed(() => {
    const minutes = String(Math.floor(timer.value / 60)).padStart(2, '0');
    const seconds = String(timer.value % 60).padStart(2, '0');
    return ${minutes}:${seconds};
  });
  

  // Funções de setPlayer1
  const incrementSetPlayer1 = (set) => setPlayer1.value[set]++;
  const decrementSetPlayer1 = (set) => {
    if (setPlayer1.value[set] > 0) setPlayer1.value[set]--;
  };

  // Funções de setPlayer2
  const incrementSetPlayer2 = (set) => setPlayer2.value[set]++;
  const decrementSetPlayer2 = (set) => {
    if (setPlayer2.value[set] > 0) setPlayer2.value[set]--;
  };
  
  // Funções do timer
  const incrementMinutes = () => (timer.value += 60);
  const decrementMinutes = () => {
    if (timer.value >= 60) timer.value -= 60;
  };
  const incrementSeconds = () => (timer.value += 1);
  const decrementSeconds = () => {
    if (timer.value > 0) timer.value -= 1;
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
      player1: player1.value,
      setPlayer1:setPlayer1.value,
      player2: player2.value,
      setPlayer2:setPlayer2.value,
      sponsor: sponsor.value,
      scores: scores.value,
      timer: timer.value,
    };
   // Emite os dados via WebSocket
   socket.emit('updateGame', data);

   const code = route.query.code || '';
   const url = /broadcast?code=${code};
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
    sponsor.value=data.sponsor || ''
    player1.value= data.player1|| 'Home'
    player2.value= data.player2|| 'Away'
    setPlayer1.value.set1=data.setPlayer1.set1
    setPlayer1.value.set2=data.setPlayer1.set2
    setPlayer1.value.set3=data.setPlayer1.set3
    setPlayer2.value.set1=data.setPlayer2.set1
    setPlayer2.value.set2=data.setPlayer2.set2
    setPlayer2.value.set3=data.setPlayer2.set3

    scores.value.player1=data.scores.player1
    scores.value.player2=data.scores.player2
  }
  console.log('Atualização recebida:', data);
});
  const resetTime = () => {
    timer.value = 0;
   };
  const resetAll = () => {
    timer.value = 0;
    scores.value.player1 = 0;
    scores.value.player2 = 0;
    gameParts .value=1
   };

   watch([player1, player2, sponsor, scores.value,setPlayer1.value,setPlayer2.value], () => {
  const data = {
    code: route.query.code || '',
    player1: player1.value || 'Home',
    setPlayer1:setPlayer1.value,
    player2: player2.value || 'Away',
    setPlayer2:setPlayer2.value,
    sponsor: sponsor.value || '',
    scores: scores.value,
    timer: timer.value,
  };
  socket.emit('updateGame', data); // Envia as atualizações em tempo real
});
   // Restaura o timer ao recarregar a página
  onMounted(() => {
    socket.emit('getGame', { code: route.query.code || '' });
    socket.emit('getTimer', { code: route.query.code || '' });
    socket.on('currentTimer', (data) => {
      console.log("currentTimer",data)
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
  