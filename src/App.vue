<script setup>
import TaskTable from '../src/components/TaskTable.vue';

</script>

<template>
  <h1 class="text-center text-3xl font-bold pt-20">IT Bangmod Kradan Kanban</h1>
  <div>
    <RouterView />
    <!-- <TaskTable />  -->
    </div>
  <div class="fixed bottom-2 right-2"> 

  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap');
* {
  font-family: 'Noto Sans Thai', sans-serif;
}
</style>