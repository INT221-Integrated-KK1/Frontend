<script setup>
import { ref } from 'vue';
import TaskDetail from './components/TaskDetail.vue';
const showModal = ref(false);
const closeModal = () => {
  showModal.value = false;
}

</script>

<template>

  <header>
    <h1 class="text-3xl text-center font-bold pt-5">IT Bangmod Kradan Kanban</h1>
  </header>

  <div class="overflow-x-auto mt-10">
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
        <!-- row 1 -->
        <tr>
          <th>1</th>
          <a @click="showModal = true">
            <td>Cy Ganderton</td>
          </a>
          <td>Quality Control Specialist</td>
          <td>Blue</td>
        </tr>
        <!-- row 2 -->
        <tr>
          <th>2</th>
          <a @click="showModal = true">
            <td>Hart Hagerty</td>
          </a>
          <td>Desktop Support Technician</td>
          <td>Purple</td>
        </tr>
        <!-- row 3 -->
        <tr>
          <th>3</th>
          <a @click="showModal = true">
            <td>Brice Swyre</td>
          </a>
          <td>Tax Accountant</td>
          <td>Red</td>
        </tr>
      </tbody>
    </table>
  </div>

  <TaskDetail @closeModal="closeModal" :showModal="showModal" />
</template>

<style scoped></style>
