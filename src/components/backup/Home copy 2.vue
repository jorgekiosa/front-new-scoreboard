<template>
    <div class="container text-center px-5 mt-5">
      <div class="row justify-content-center mb-4 g-4">
        <!-- Jogador 1 -->
        <div class="col-3 border-custom p-5">
          <input v-model="player1" class="form-control mb-3 text-center border-input" placeholder="Jogador 1" />
          <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-outline-primary rounded-circle" @click="decrementScore('player1')">-</button>
            <span class="fs-3">{{ scores.player1 }}</span>
            <button class="btn btn-outline-primary rounded-circle" @click="incrementScore('player1')">+</button>
          </div>
          <button class="btn btn-outline-primary mt-3">Add penalty</button>
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
                    <span class="fs-1 fw-bold mx-2">{{ count }}</span>
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
        <div class="col-3 border-custom p-4">
          <input v-model="player2" class="form-control mb-3 text-center border-input" placeholder="Jogador 2" />
          <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-outline-primary rounded-circle" @click="decrementScore('player2')">-</button>
            <span class="fs-3">{{ scores.player2 }}</span>
            <button class="btn btn-outline-primary rounded-circle" @click="incrementScore('player2')">+</button>
          </div>
          <button class="btn btn-outline-primary mt-3">Add penalty</button>
        </div>
      </div>

            <!-- Configurações Avançadas -->
        <div class="mt-4 text-white">
            <button class="btn " @click="toggleAdvancedSettings">
                Configurações avançadas
            </button>
            <div v-if="showAdvancedSettings" class="mt-2">
                <p>Exemplo de configurações avançadas aqui...</p>
            </div>
        </div>

        <div class="accordion" id="accordionExample">
            <div class="accordion-item">
                <h2 class="accordion-header">
                <button class="accordion-button" type="button" @click="toggleAdvancedSettings" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Configurações avançadas
                </button>
                </h2>
                <div v-if="showAdvancedSettings" id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <strong>This is the first item's accordion body.</strong>
                </div>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  // Estado do contador
  const count = ref(0);
  // Estados para os jogadores
  const player1 = ref('Jorge/Yosica');
  const player2 = ref('Lourenço/Júlio');
  
  // Pontuações
  const scores = ref({
    player1: 0,
    player2: 0,
  });
  
  // Timer
  const timer = ref(0); // Timer em segundos
  const isRunning = ref(false);
  const interval = ref(null);

  // Funções de incremento e decremento Display part game
    const increment = () => count.value++;
    const decrement = () => {
    if (count.value > 0) count.value--;
    };
  
  // Formatação do tempo em MM:SS
  const formattedTime = computed(() => {
    const minutes = String(Math.floor(timer.value / 60)).padStart(2, '0');
    const seconds = String(timer.value % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  });
  
  // Funções de pontuação
  const incrementScore = (player) => scores.value[player]++;
  const decrementScore = (player) => {
    if (scores.value[player] > 0) scores.value[player]--;
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
      clearInterval(interval.value); // Para o timer
      isRunning.value = false;
    } else {
      interval.value = setInterval(() => {
        timer.value++; // Incrementa os segundos
      }, 1000);
      isRunning.value = true;
    }
  };

  // Configurações avançadas
const showAdvancedSettings = ref(false);
const toggleAdvancedSettings = () => {
  showAdvancedSettings.value = !showAdvancedSettings.value;
};
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
  