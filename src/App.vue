<script setup>
import Header from "@/components/Header.vue";

</script>

<template>
  <Header />
  <div>
    <RouterView />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap');
* {
  font-family: 'Noto Sans Thai', sans-serif;
}
</style>