<template>
    <div class="container py-5 bg-primary text-white rounded">
      <!-- Título -->
      <h1 class="text-center mb-4">Game settings</h1>
  
      <!-- Switch Doubles / Singles -->
      <div class="d-flex justify-content-center mb-4">
        <button 
          class="btn me-2" 
          :class="mode === 'doubles' ? 'btn-light' : 'btn-outline-light'" 
          @click="mode = 'doubles'">
          Doubles
        </button>
        <button 
          class="btn" 
          :class="mode === 'singles' ? 'btn-light' : 'btn-outline-light'" 
          @click="mode = 'singles'">
          Singles
        </button>
      </div>
  
      <!-- Team Inputs -->
      <div class="row mb-4">
        <!-- Team 1 -->
        <div class="col-md-6">
          <h4 class="text-center">Team 1</h4>
          <input 
            type="text" 
            class="form-control mb-2" 
            placeholder="Player 1" 
            v-model="team1.player1" 
          />
          <input 
            type="text" 
            class="form-control" 
            placeholder="Player 2" 
            v-model="team1.player2" 
          />
        </div>
  
        <!-- Team 2 -->
        <div class="col-md-6">
          <h4 class="text-center">Team 2</h4>
          <input 
            type="text" 
            class="form-control mb-2" 
            placeholder="Player 1" 
            v-model="team2.player1" 
          />
          <input 
            type="text" 
            class="form-control" 
            placeholder="Player 2" 
            v-model="team2.player2" 
          />
        </div>
      </div>
  
      <!-- Rule Selection -->
      <div class="d-flex justify-content-center mb-4">
        <button 
          class="btn me-2" 
          :class="rule === 'golden-point' ? 'btn-light' : 'btn-outline-light'" 
          @click="rule = 'golden-point'">
          Golden point
        </button>
        <button 
          class="btn me-2" 
          :class="rule === 'advantages' ? 'btn-light' : 'btn-outline-light'" 
          @click="rule = 'advantages'">
          Advantages
        </button>
        <button 
          class="btn" 
          :class="rule === 'adv-golden-point' ? 'btn-light' : 'btn-outline-light'" 
          @click="rule = 'adv-golden-point'">
          Advantage + Golden point
        </button>
      </div>
  
      <!-- Continue Button -->
      <div class="text-center">
        <button class="btn btn-success px-5 py-2" @click="goToNextScreen">
          Continue
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

const router = useRouter();
  
  // Variáveis reativas
  const mode = ref('doubles');
  const rule = ref('golden-point');
  
  const team1 = ref({ player1: '', player2: '' });
  const team2 = ref({ player1: '', player2: '' });
  
  const onContinue = () => {
    console.log('Configurações do jogo:', {
      mode: mode.value,
      team1: team1.value,
      team2: team2.value,
      rule: rule.value
    });
    alert('Configurações salvas!');
  };

  const goToNextScreen = () => {
  router.push({
    path: '/broadcast',
    query: {
      team1Player1: team1.value.player1,
      team1Player2: team1.value.player2,
      team2Player1: team2.value.player1,
      team2Player2: team2.value.player2
    }
  });
};
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
  }
  
  .btn {
    width: 160px;
    font-weight: bold;
    border-radius: 8px;
  }
  
  .form-control {
    border-radius: 8px;
  }
  
  .btn-success {
    font-size: 18px;
    font-weight: bold;
  }
  </style>
  