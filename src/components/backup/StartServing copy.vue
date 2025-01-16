<template>
    <div class="container py-5 bg-primary text-white rounded">
      <!-- Título -->
      <h1 class="text-center mb-4">Start serving</h1>
  
      <!-- Team Cards -->
      <div class="row mb-4">
        <div class="col-md-6 d-flex justify-content-center">
          <div class="card p-4 text-center" style="width: 250px;">
            <h4>{{ team1Player1 || 'Player 1' }}</h4>
            <h4>{{ team1Player2 || 'Player 2' }}</h4>
          </div>
        </div>
        <div class="col-md-6 d-flex justify-content-center">
          <div class="card p-4 text-center" style="width: 250px;">
            <h4>{{ team2Player1 || 'Player 1' }}</h4>
            <h4>{{ team2Player2 || 'Player 2' }}</h4>
          </div>
        </div>
      </div>
  
      <!-- Flip the Coin -->
      <div class="text-center mb-4">
        <div style="font-size: 40px;">🪙</div>
        <p>Flip the coin</p>
      </div>
  
      <!-- Start Match Button -->
      <div class="text-center">
        <button class="btn btn-primary px-5 py-2" disabled>
          Start match
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  
  const team1Player1 = route.query.team1Player1;
  const team1Player2 = route.query.team1Player2;
  const team2Player1 = route.query.team2Player1;
  const team2Player2 = route.query.team2Player2;
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
  }
  
  .card {
    background-color: white;
    color: black;
    border-radius: 8px;
  }
  
  .btn-primary {
    font-size: 18px;
    font-weight: bold;
  }
  </style>
  