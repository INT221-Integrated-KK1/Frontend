<script setup>
import { ref, onMounted } from 'vue';

import { getItems } from './libs/fetchUtils'; // Import the getItems function

import TaskDetail from './components/TaskDetail.vue';
const todo = ref()
const url = 'http://ip23sy2.sit.kmutt.ac.th:8080/itb-kk/v1/tasks';
const showModal = ref(false);
const closeModal = () => {
  showModal.value = false;
  selectedTaskId.value = null;
}

const selectedTaskId = ref(null);

const showModalWithId = (taskId) => {
  selectedTaskId.value = taskId;
  showModal.value = true;
};

onMounted(async () => {
  try {
    const items = await getItems(url); 
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
          <td @click="showModalWithId(todo.id)" style="cursor: pointer;">{{ todo.taskTitle }}</td>
          <!-- Render corresponding assignee and status based on index -->
          <td>{{ todo.taskAssignees }}</td>
          <td>{{ todo.taskStatus }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <TaskDetail @closeModal="closeModal" :showModal="showModal" :taskId="selectedTaskId" />
</template>
<style scoped></style>