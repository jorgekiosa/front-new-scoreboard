<script setup>
import Dashboard from "@/components/Dashboard.vue"
import {onMounted, computed} from "vue"
import { useRouter } from "vue-router";
const router = useRouter();

const userLogado = computed(() => {
  return localStorage.getItem("DO_USER_SESSION")
})
const islogado=()=>{
  if (
    userLogado.value == null ||
    userLogado.value == "" ||
    userLogado.value.length == 0
  ) {
    router.push('/')
  }
}

onMounted(()=>{
  islogado()
})
</script>
<template>
  <div>
    <Dashboard/>
  </div>
</template>
