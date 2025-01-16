<template>
    <div class="bg-body-tertiary p-5 rounded mt-5 mt-lg-1">
        <h2>Seja Bem-vindo, {{  userLogado ? JSON.parse(userLogado).name || "" : ""}}</h2>
        <p class="lead"></p>
    </div>
  </template>
<script setup>
import {ref, computed} from "vue"
import { useRouter, RouterLink} from "vue-router";
const router = useRouter();

const userLogado = computed(() => {
  return localStorage.getItem("DO_USER_SESSION")
})


</script>
  
<style scoped>

</style>
  