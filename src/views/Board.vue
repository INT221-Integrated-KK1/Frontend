<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AddBoardModal from '@/components/AddBoardModal.vue';

// State to store whether modal is shown and to track list of boards
const showModal = ref(false);
const router = useRouter();
const route = useRoute();
const boards = ref([]); // List to store the created boards

// Open modal and change the route to /board/add
const openModal = () => {
  router.push('/board/add');
};

// Close modal and reset route to /board
const closeModal = () => {
  showModal.value = false;
  router.push('/board');
};

// Handle saving the board name and add it to the list of boards
const handleSaveBoard = (boardName) => {
  if (boardName) {
    boards.value.push(boardName);
  }
  closeModal();
};

// Watch route changes to handle opening/closing modal
watch(route, (newRoute) => {
  if (newRoute.path === '/board/add') {
    showModal.value = true;
  } else {
    showModal.value = false;
  }
});
</script>

<template>
  <h1 class="text-5xl text-center font-bold mt-10">Board List</h1>

  <div class="flex justify-end mt-5 mr-32">
    <button @click="openModal" class="bg-gray-500 text-white px-4 py-2 rounded transition transform hover:scale-105">
      Create personal board
    </button>
  </div>

  <!-- List of boards as cards -->
  <div v-if="boards.length" class="mt-10 mx-32 grid grid-cols-1 md:grid-cols-3 gap-4">
    <div v-for="(board, index) in boards" :key="index"
      class="bg-white shadow-md rounded-lg p-4 cursor-pointer transition transform hover:scale-105 hover:bg-gray-300 duration-300 ease-in-out">
      <h3 class="text-xl font-bold">{{ board }}</h3>
    </div>
  </div>

  <p v-else class="text-center mt-10">No boards available. Please create one!</p>

  <AddBoardModal v-if="showModal" @close="closeModal" @save-board="handleSaveBoard" />
</template>

<style scoped></style>
