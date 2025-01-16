<template>
  <div class="container text-center px-4 mt-4">
    <div v-if="route.query.c=='p'">
    <div class="col-12 text-white border-custom">
      <div class="row">
        <div class="12 p-3 mb-1 d-flex justify-content-center align-items-center">
              <!-- Botões Laterais: Minutos -->
          <div class="d-flex flex-column align-items-center me-3">
                        <button class="btn btn-success mb-2 rounded-circle" @click="gameStore.incrementMinutes">+</button>
                        <button class="btn btn-success rounded-circle" @click="gameStore.decrementMinutes">-</button>
                    </div>
                    <!-- Contador -->
                    <div class="text-center">
                        <div class="fs-2 mb-2">{{ gameStore.formattedTime }}</div>
                    </div>
                    <!-- Botões Laterais: Segundos -->
                    <div class="d-flex flex-column align-items-center ms-3">
                        <button class="btn btn-success mb-2 rounded-circle" @click="gameStore.incrementSeconds">+</button>
                        <button class="btn btn-success rounded-circle" @click="gameStore.decrementSeconds">-</button>
                    </div>
              </div>
            </div>

          <div class="d-flex mb-2 gap-1 justify-content-center flex-wrap">
            <button
              class="btn btn-sm w-49 w-md-auto"
              :class="gameStore.isRunning ? 'btn-danger' : 'btn-success'"
              @click="gameStore.toggleTimer"
            >
              {{ gameStore.isRunning ? 'Stop' : 'Start' }}
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
              <p>Games: <span class="fw-bold">{{ gameStore.player1Games }}</span></p>
              <input 
                :value="gameStore.player1"
                @blur="(e) => {
                  gameStore.player1 = e.target.value;
                  gameStore.emitGameUpdate();
                }"
                @keyup.enter="(e) => {
                  gameStore.player1 = e.target.value;
                  gameStore.emitGameUpdate();
                }"
                class="form-control mb-3 text-center text-white border-input" 
                placeholder="Jogador 1" 
                disabled readonly />
              <div class="d-flex mb-2 justify-content-between align-items-center" v-for="(value, set) in setPlayer1" :key="set" v-if="value!==null">
                  <button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer1(set)">-</button>
                  <span   v-if="value!==null" class="fs-3 px-2">{{ value }}</span>
                  <button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer1(set)">+</button>
              </div>
              <div class="d-flex mb-2 justify-content-between align-items-center">
                  <button 
                    :class="player1Score === 40 && player2Score === 40 && deuceRule === 'advantage'? 'btn btn-success rounded-circle': player1Score === 40 && player2Score === 40 &&deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" 
                    @click="gameStore.decrementPlayer1"
                  >-</button>
                  <span class="fs-3 px-2">{{ player1Score }}</span>
                  <button 
                    :class="player1Score === 40 && player2Score === 40 && deuceRule === 'advantage'? 'btn btn-success rounded-circle': player1Score === 40 && player2Score === 40 &&deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" 
                    @click="gameStore.incrementPlayer1"
                    :disabled="gameOver || isTieBreak"
                  >+</button>
              </div>
            </div>
          </div>

        <!-- Jogador 2 -->
        <div class="col-6 p-2">
          <div class="p-3 border-custom shadow">
            <p>Games: <span class="fw-bold">{{ gameStore.player2Games }}</span></p>
            <input 
              :value="gameStore.player2"
              @blur="(e) => {
                gameStore.player2 = e.target.value;
                gameStore.emitGameUpdate();
              }"
              @keyup.enter="(e) => {
                gameStore.player2 = e.target.value;
                gameStore.emitGameUpdate();
              }"
              class="form-control mb-3 text-center text-white border-input" 
              placeholder="Jogador 2"
              read-only />
            <div class="d-flex mb-2 justify-content-between align-items-center" v-for="(value, set) in setPlayer2" :key="set" v-if="value!==null">
              <button v-if="value!==null"  class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer2(set)">-</button>
              <span   v-if="value!==null" class="fs-3 px-2">{{ value }}</span>
              <button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer2(set)">+</button>
            </div>
            <div class="d-flex mb-2 justify-content-between align-items-center">
              <button 
                :class="player1Score === 40 && player2Score === 40 && deuceRule === 'advantage'? 'btn btn-success rounded-circle': player1Score === 40 && player2Score === 40 &&deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" 
                @click="gameStore.decrementPlayer2"
              >-</button>
              <span class="fs-3 px-2">{{ player2Score }}</span>
              <button 
                :class="player1Score === 40 && player2Score === 40 && deuceRule === 'advantage'? 'btn btn-success rounded-circle': player1Score === 40 && player2Score === 40 &&deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" 
                @click="gameStore.incrementPlayer2"
                :disabled="gameOver || isTieBreak"
              >+</button>
            </div>
          </div>
        </div>
        <div class="col-12 px-5 mb-2">
          <div class="row">
              <div class="col-12">
                  <div v-if="isTieBreak">
                    <h3>Tie-Break!</h3>
                    <p>Jogador 1: {{ tieBreakPlayer1 }} - Jogador 2: {{ tieBreakPlayer2 }}</p>
                    <div class="d-flex mb-4 gap-5 flex-wrap justify-content-center">
                      <button class="btn btn-success mb-2 rounded-circle" @click="gameStore.incrementTieBreakPlayer1">+1</button>
                      <button class="btn btn-success mb-2 rounded-circle" @click="gameStore.incrementTieBreakPlayer2">+1</button>
                    </div>
                  </div>
                  <div v-if="gameOver" class="text-center mt-3">
                    <h3 class="text-success">Jogo Finalizado! 🎾</h3>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>

     <div class="row justify-content-center text-white mb-4 g-4" v-if="route.query.c=='c'">
        <!-- Jogador 1 -->
      <div class="col-3 border-custom shadow p-4">
          <p>Games: <span class="fw-bold">{{ gameStore.player1Games }}</span></p>
          <input 
            :value="gameStore.player1"
            @blur="(e) => {
              gameStore.player1 = e.target.value;
              gameStore.emitGameUpdate();
            }"
            @keyup.enter="(e) => {
              gameStore.player1 = e.target.value;
              gameStore.emitGameUpdate();
            }"
            class="form-control mb-3 text-center text-white border-input" 
            placeholder="Home" />
          <div class="d-flex mb-2 justify-content-between align-items-center" v-for="(value, set) in setPlayer1" :key="set" v-if="value!==null">
            <button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer1(set)">-</button>
            <span   v-if="value!==null" class="fs-3">{{ value }}</span>
            <button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer1(set)">+</button>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <button :class="player1Score === 40 && player2Score === 40 && deuceRule === 'advantage'? 'btn btn-success rounded-circle': player1Score === 40 && player2Score === 40 && deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" @click="gameStore.decrementPlayer1">-</button>
            <span class="fs-3">{{ player1Score }}</span>
            <button :class="player1Score === 40 && player2Score === 40 && deuceRule === 'advantage'? 'btn btn-success rounded-circle': player1Score === 40 && player2Score === 40 && deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" @click="gameStore.incrementPlayer1" :disabled="gameOver || isTieBreak">+</button>
          </div>
      </div>
  
        <!-- Timer -->
        <div class="col-4 px-5">
            <div class="row">
                <div v-if="false" class="col-12 border-custom d-flex justify-content-center align-items-center mb-2">
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
                <div class="col-12 border-custom p-3 mb-3 d-flex justify-content-center align-items-center">
                 <!-- Botões Laterais: Minutos -->
                    <div class="d-flex flex-column align-items-center me-3">
                        <button class="btn btn-success mb-2 rounded-circle" @click="gameStore.incrementMinutes">+</button>
                        <button class="btn btn-success rounded-circle" @click="gameStore.decrementMinutes">-</button>
                    </div>
                    <!-- Contador -->
                    <div class="text-center">
                        <div class="fs-2 mb-2">{{ gameStore.formattedTime }}</div>
                    </div>
                    <!-- Botões Laterais: Segundos -->
                    <div class="d-flex flex-column align-items-center ms-3">
                        <button class="btn btn-success mb-2 rounded-circle" @click="gameStore.incrementSeconds">+</button>
                        <button class="btn btn-success rounded-circle" @click="gameStore.decrementSeconds">-</button>
                    </div>
                </div>
                <div class="col-12">
                    <div class="d-flex justify-content-center">
                        <button
                            class="btn btn-lg w-100"
                            :class="gameStore.isRunning ? 'btn-danger' : 'btn-success'"
                            @click="gameStore.toggleTimer"
                            >
                            {{ gameStore.isRunning ? 'Stop' : 'Start' }}
                        </button>
                    </div>
                    <div v-if="isTieBreak && route.query.c=='c'">
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

        <!-- Jogador 2 -->
        <div class="col-3 border-custom shadow p-4">
          <p>Games: <span class="fw-bold">{{ gameStore.player2Games }}</span></p>
          <input 
            :value="gameStore.player2"
            @blur="(e) => {
              gameStore.player2 = e.target.value;
              gameStore.emitGameUpdate();
            }"
            @keyup.enter="(e) => {
              gameStore.player2 = e.target.value;
              gameStore.emitGameUpdate();
            }"
            class="form-control mb-3 text-center text-white border-input" 
            placeholder="Away" />
          <div class="d-flex mb-2 justify-content-between align-items-center" v-for="(value, set) in setPlayer2" :key="set" v-if="value!==null">
            <button v-if="value!==null"  class="btn btn-outline-primary rounded-circle" @click="decrementSetPlayer2(set)">-</button>
            <span   v-if="value!==null" class="fs-3">{{ value }}</span>
            <button v-if="value!==null" class="btn btn-outline-primary rounded-circle" @click="incrementSetPlayer2(set)">+</button>
          </div>
          <div class="d-flex mb-2 justify-content-between align-items-center">
            <button :class="player1Score === 40 && player2Score === 40 && deuceRule === 'advantage'? 'btn btn-success rounded-circle': player1Score === 40 && player2Score === 40 &&deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" @click="gameStore.decrementPlayer2">-</button>
            <span class="fs-3">{{ player2Score }}</span>
            <button :class="player1Score === 40 && player2Score === 40 && deuceRule === 'advantage'? 'btn btn-success rounded-circle': player1Score === 40 && player2Score === 40 &&deuceRule==='goldenPoint'?'btn btn-warning text-white rounded-circle':'btn btn-primary rounded-circle'" @click="gameStore.incrementPlayer2" :disabled="gameOver || isTieBreak">+</button>
          </div>
        </div>
        <div class="col-12">
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
                        <label class="btn" :class="hideBoard ? 'btn-success' : 'btn-danger'" for="btn-check-2">Ocultar Placar</label>
                      </div>
                        <button class="btn btn-secondary text-light" @click="resetTime">Redifinir tempo</button>
                        <button class="btn btn-primary" @click="handleResetAll">Redefinir tudo</button>
                        <button class="btn btn-warning text-light" @click="startStreaming">
                          <font-awesome-icon :icon="['fas', 'video']" /> Stream
                        </button>
                    </div>
                    <hr class="border border-white border-1 opacity-50">
                    <div class="col-12 text-white ">
                      <div class="row g-4">
                        <div class="col-6 p-4 mb-4">
                          <div class="p-3 border-custom shadow">
                          <p class="fs-4 fw-bolder">Escolha um tipo de set </p>
                          <div class="row g-3 px-5 align-items-center">
                            <div class="col">
                              <div class="form-check form-check-inline">
                                <input 
                                  class="form-check-input cursor-pointer" 
                                  type="radio"  
                                  id="gridRadios1" 
                                  value="normal"
                                  v-model="setType"
                                >
                                <label class="form-check-label" for="gridRadios1">
                                  Normal
                                </label>
                              </div>
                            </div>
                            <div class="col">
                              <div class="form-check form-check-inline">
                                <input 
                                  class="form-check-input" 
                                  type="radio" 
                                  id="gridRadios2"
                                  value="pontosCorridos"
                                  v-model="setType"
                                >
                                <label class="form-check-label" for="gridRadios2">
                                  Com Pontos Corridos
                                </label>
                              </div>
                             </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-6 p-4 mb-4">
                          <div class="p-3 border-custom shadow">
                          <p class="fs-4 fw-bolder">Escolha uma regra do jogo</p>
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
                        <input
                        class="form-control mb-3 text-left text-white border-input" 
                        placeholder="Digite o nome do patrocinador" 
                        :value="gameStore.sponsor"
                        @blur="(e) => {
                          gameStore.sponsor = e.target.value;
                          gameStore.emitGameUpdate();
                        }"
                        @keyup.enter="(e) => {
                          gameStore.sponsor = e.target.value;
                          gameStore.emitGameUpdate();
                        }"
                        />
                      </div>
                    </div>
                </div>
                </div>
            </div>
          </div>
        </div>

      </div>

      <div class="toast-container position-fixed top-0 end-0 p-3">
        <div
            id="liveToast"
            class="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            ref="toast"
        >
            <div class="toast-header text-white bg-success">
            <font-awesome-icon class="text-white rounded me-2" :icon="['fas', 'trophy']" />
            <strong class="me-auto text-white">Aviso</strong>
            <small class="fw-bold">{{ formatDate(new Date()) }}</small>
            <button
                type="button"
                class="btn-close btn-white text-white"
                data-bs-dismiss="toast"
                aria-label="Close"
            ></button>
            </div>
            <div class="toast-body">{{ message }}</div>
        </div>
      </div>

    </div>
  </template>
  
<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as bootstrap from "bootstrap";
import { storeToRefs } from "pinia";
import { ref, computed,onMounted,watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { io } from 'socket.io-client';
import useContentDefault from "@/stores/ContentStore"
const contentStoreDefault = useContentDefault();
import useScoreDefault from "@/stores/ScoreStore"
const scoreStoreDefault = useScoreDefault();
import { useGameStore } from '@/stores/GameStore';
import { formatDate } from '@/utils/dateUtils';

const gameStore = useGameStore();
const route = useRoute();


const setupInitialListeners = () => {
  if (!gameStore.socket) return;
  gameStore.socket.emit('requestToken');
  gameStore.socket.emit('getTimer', { code: route.query.code || '' });
  retrievedData();
};

const showToast = () => {
  const toast = document.getElementById('liveToast');
  if (toast) {
    const bootstrapToast = new bootstrap.Toast(toast);
    bootstrapToast.show();
  }
};

// Watch for game over
watch(
  () => gameStore.gameOver,
  (newVal) => {
    if (newVal === true) {
      gameStore.updateScore().then(() => {
        if (gameStore.message) {
          showToast();
        }
      });
    }
  },
  { immediate: true }
);

const { 
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
  setType,
  message, 
  formattedTime,
  scores,
  isTieBreak,
  tieBreakPlayer1,
  tieBreakPlayer2
} = storeToRefs(gameStore);

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

// Funções de incremento e decremento Display part game
const increment = () => gameStore.gameParts++;
const decrement = () => {
  if (gameStore.gameParts > 0) gameStore.gameParts--;
};

// Funções de manipulação dos sets
const incrementSetPlayer1 = (set) => {
  gameStore.incrementSetPlayer1(set);
};

const decrementSetPlayer1 = (set) => {
  gameStore.decrementSetPlayer1(set);
};

const incrementSetPlayer2 = (set) => {
  gameStore.incrementSetPlayer2(set);
};

const decrementSetPlayer2 = (set) => {
  gameStore.decrementSetPlayer2(set);
};

const startTimer = () => { 
  gameStore.toggleTimer();
};

const emitUpdate = (data) => {
  if (!gameStore.socket) return;
  
  const gameData = {
    code: route.query.code || '',
    currentSet: gameStore.currentSet,
    player1: gameStore.player1,
    setPlayer1: gameStore.setPlayer1,
    player2: gameStore.player2,
    setPlayer2: gameStore.setPlayer2,
    sponsor: gameStore.sponsor,
    setType: gameStore.setType,
    player1Games: gameStore.player1Games,
    player2Games: gameStore.player2Games,
    player1Score: gameStore.player1Score,
    player2Score: gameStore.player2Score,
    scores: gameStore.scores,
    hideBoard: gameStore.hideBoard,
    gameOver: gameStore.gameOver,
    deuceRule: gameStore.deuceRule,
    timer: gameStore.timer,
  };

  if (JSON.stringify(gameStore.lastSentData) !== JSON.stringify(gameData)) {
    gameStore.lastSentData = gameData;
    clearTimeout(gameStore.debounceTimeout);
    gameStore.debounceTimeout = setTimeout(() => {
      gameStore.socket.emit("updateGame", gameData);
    }, 300);
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
    setType: setType.value,
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
 //emitUpdate(data);

 const code = route.query.code || '';
 const url = `/broadcast?code=${code}`;
 const newWindow = window.open(url, '_blank');
  
// Aguardar a nova aba carregar e garantir que ela se conecte ao WebSocket
newWindow.onload = () => {
  emitUpdate(data);  // Emitir dados para a nova aba
};
};

const retrievedData = () => {
  if (!gameStore.socket) return;

  gameStore.socket.on('gameUpdated', (data) => {
    if (data.code === route.query.code) {
      gameStore.updateGameState(data);
    }
  });
};

const connectSocket = () => {
  if (!gameStore.socket) return;

  // Evento de notificação de desconexão
  gameStore.socket.on('forceLogout', () => {
    alert('Você foi desconectado do servidor!');
    gameStore.socket.disconnect();
    resetAll();
  });
};

const disconnectClient = () => {
  if (gameStore.socket) {
    gameStore.socket.emit('forceDisconnect', { code: route.query.code });
  }
};

const reconnectClient = () => {
  if (gameStore.socket && !gameStore.socket.connected) {
    gameStore.socket.connect();
    gameStore.socket.emit('forceReconnect', { code: route.query.code });
    alert('Tentando reconectar manualmente ao servidor...');
  } else {
    alert('Você já está conectado.');
  }
};

const listOneScore = async (storedToken)=> {
  gameStore.isLoadVisible = true;
  const result = await scoreStoreDefault.listOneScore({
    id: route.query.code,
    storedToken: storedToken
  });
  
  if (result.code === 1) {
        setTimeout(() => {
      gameStore.isLoadVisible = false;
        }, 1000);
  } else {
    gameStore.isLoadVisible = false;
    gameStore.message = 'Ocorreu um erro ao finalizar o jogo';
    showToast();
  }
};

const updateScore = async () => {
  gameStore.isLoadVisible = true;
  const data = {
    id: scoreStoreDefault._detailsEvents?.[0]?.id,
    code: scoreStoreDefault._detailsEvents?.[0]?.code,
    name: scoreStoreDefault._detailsEvents?.[0]?.name,
    description: scoreStoreDefault._detailsEvents?.[0]?.description,
    status: 2,
    sport_type: '',
    storedToken: gameStore.storedToken
  };

  try {
    const result = await scoreStoreDefault.updateScore(data);
    if (result.code === 1) {
      setTimeout(() => {
        gameStore.message = 'Jogo Finalizado! 🎾';
        gameStore.isLoadVisible = false;
        showToast();
      }, 1000);
    } else {
      throw new Error('Update failed');
    }
  } catch (error) {
    gameStore.isLoadVisible = false;
    gameStore.message = 'Ocorreu um erro ao finalizar o jogo';
    showToast();
  }
};

// Watch for game over
watch(
  () => gameStore.gameOver,
  (newVal) => {
    if (newVal === true) {
      updateScore();
    }
  },
  { immediate: true }
);
   // Restaura o timer ao recarregar a página
  onMounted(() => {
    gameStore.initSocket(route.query.code);
    setupInitialListeners();
    //connectSocket()
    //listOneScore()
    retrievedData()
    gameStore.socket.emit('requestToken');
    //socket.emit('getGame', { code: route.query.code || '' });
    gameStore.socket.emit('getTimer', { code: route.query.code || '' });
  });

const resetTime = () => {
  gameStore.resetTimer();
};

const handleResetAll = () => {
  gameStore.resetAll();
  showToast();
};

// Watch para mudanças nos nomes dos jogadores e setType
watch(
  () => [gameStore.setType],
  () => {
    const gameData = {
      code: route.query.code || '',
      currentSet: gameStore.currentSet,
      player1: gameStore.player1,
      setPlayer1: gameStore.setPlayer1,
      player2: gameStore.player2,
      setPlayer2: gameStore.setPlayer2,
      sponsor: gameStore.sponsor,
      setType: gameStore.setType,
      player1Games: gameStore.player1Games,
      player2Games: gameStore.player2Games,
      player1Score: gameStore.player1Score,
      player2Score: gameStore.player2Score,
      scores: gameStore.scores,
      hideBoard: gameStore.hideBoard,
      gameOver: gameStore.gameOver,
      deuceRule: gameStore.deuceRule,
      timer: gameStore.timer,
    };
    emitUpdate(gameData);
  },
  { deep: true }
);
  </script>
  
  <style scoped>
  ::placeholder {
    color: white;
    opacity: 1;
  }
  :focus::placeholder {
    opacity: 0;
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
  