<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBoardStore } from '@/stores/useBoardStore';
import router from '@/router';

const boardStore = useBoardStore();
const emit = defineEmits(['close', 'save-board']);
const name = localStorage.getItem('username');


const boardName = ref(`${name} personal board`);
const errorMessage = ref('');


const isValid = computed(() => {
  if (boardName.value.trim() === '') {
    errorMessage.value = 'Board name cannot be empty';
    return false;
  } else if (boardName.value.length > 120) {
    errorMessage.value = 'Board name must not exceed 120 characters';
    return false;
  } else if (boardStore.getBoards().includes(boardName.value)) {
    errorMessage.value = 'Board name already exists';
    return false;
  }
  errorMessage.value = '';
  return true;
});


const saveBoard = () => {
  if (isValid.value) {
    boardStore.addBoard(boardName.value);
    emit('save-board', boardName.value);
    closeModal();
  }
};


const closeModal = () => {
  router.push({ name: 'board' });
};


const characterCount = computed(() => boardName.value.length);
const isSaveButtonDisabled = computed(() => boardName.value.trim() === '');

</script>

<template>
  <div v-if="$route.name === 'addboard' "class=" fixed inset-0 flex items-center justify-center bg-black/[.05]">
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-5 text-green-800">New Board</h2>

      <label for="boardName" class="block text-lg mb-2">Name</label>
      <input v-model="boardName" id="boardName" type="text" class="w-full p-2 border rounded mb-2"
        placeholder="Enter board name" />

      <p class="text-gray-600 mb-2">{{ characterCount }}/120</p>

      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

      <div class="flex justify-end space-x-4">
        <button @click="saveBoard" :disabled="isSaveButtonDisabled"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
          Save
        </button>
        <button @click="closeModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
