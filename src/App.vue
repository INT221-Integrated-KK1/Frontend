<script setup>

import { getItems } from './libs/fetchUtils'; // Import the getItems function
import { onMounted } from 'vue';
import { ref } from 'vue';




const url = 'http://localhost:8080/v1/tasks'; // Replace this with your actual URL

// Define variables to store fetched data
const todo = ref()



// Fetch data when the component is mounted
onMounted(async () => {
  try {
    const items = await getItems(url);
    todo.value = items;
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
});

const getStatusClass = (status) => {
  switch (status) {
    case 'No Status':
      return 'bg-gray-200 text-gray-800 px-2 py-1 rounded'; // Gray button style for No Status
    case 'To Do':
      return 'bg-red-200 text-red-800 px-2 py-1 rounded'; // Red button style for To Do
    case 'Doing':
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded'; // Yellow button style for Doing
    case 'Done':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded'; // Green button style for Done
    default:
      return 'bg-blue-200 text-blue-800 px-2 py-1 rounded'; // Default button style for other statuses
  }
};

</script>



<template>
  <h1 class="text-center text-3xl font-bold mt-10">IT Bangmod Kradan Kanban</h1>

  <table class="overflow-x-auto mt-10 table">
    <!-- head -->
    <thead>
      <tr class="text-xl text-black">
        <th></th>
        <th>Title</th>
        <th>Assignees</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      
      <tr v-for="(task, index) in todo" :key="index" class="itbkk-item"  v-if="todo">
        <th>{{ index + 1 }}</th>
        <td @click="showModal = true" style="cursor: pointer;" class="itbkk-title">{{ task.taskTitle }}</td>
        
        <td class="itbkk-assignees">{{ task.taskAssignees }}</td>
        <td :class="getStatusClass(task.taskStatus)" class="itbkk-status">{{ task.taskStatus }}</td>
      </tr>
    </tbody>
  </table>

</template>
<style scoped></style>
