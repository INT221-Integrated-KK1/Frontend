<script setup>

import { getItems } from './libs/fetchUtils'; // Import the getItems function
import { onMounted } from 'vue';
import { ref } from 'vue';


const url = 'http://ip23sy2.sit.kmutt.ac.th:8080/itb-kk/v1/tasks'; // Replace this with your actual URL

// Define variables to store fetched data
const todo = ref()

// Fetch data when the component is mounted
onMounted(async () => {
  try {
    const items = await getItems(url); // Fetch data
    // Populate titles, assignees, and statuses arrays with fetched data
    todo.value = items
    console.log(todo.value)
  } catch (error) {
    console.log(`Error fetching data: ${error}`);
  }
});



</script>

<template>
  <div class="overflow-x-auto mt-10" v-if="todo">
    <table class="table">
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
        <!-- Loop through titles array to render table rows -->
        <tr v-for="(todo, index) in todo" :key="index">
          <th>{{ index + 1 }}</th>
          <td @click="showModal = true" style="cursor: pointer;">{{ todo.taskTitle }}</td>
          <!-- Render corresponding assignee and status based on index -->
          <td>{{ todo.taskAssignees }}</td>
          <td>{{ todo.taskStatus }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>
