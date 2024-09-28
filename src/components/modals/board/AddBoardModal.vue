<script setup>
import { ref, computed } from 'vue';
import { addItem } from '@/libs/fetchUtils';
import { useBoardStore } from '@/stores/useBoardStore';

// import { BoardManagement } from '@/libs/BoardManagement';
import router from '@/router';

const boardStore = useBoardStore();

const emit = defineEmits(['save-board']);
const name = localStorage.getItem('username');

// const boardmanager = ref(new BoardManagement());

const boardName = ref(`${name} personal board`);
const errorMessage = ref('');


const isValid = computed(() => {
  if (boardName.value.trim() === '') {
    errorMessage.value = 'Board name cannot be empty';
    return false;
  } else if (boardName.value.length > 120) {
    errorMessage.value = 'Board name must not exceed 120 characters';
    return false;
  }
  errorMessage.value = '';
  return true;
});

const closeModal = () => {
  router.push({ name: 'board' });
};


const characterCount = computed(() => boardName.value.length);
const isSaveButtonDisabled = computed(() => boardName.value.trim() === '');

async function saveBoard() {
  if (isValid.value) {
    const boardsinput = boardName.value;
    try {
      const items = await addItem(import.meta.env.VITE_BASE_BOARDS_URL, { name: boardsinput });
      boardStore.addBoard(items);
      // boardmanager.value.addBoard(items);
      console.log("items", items);
      console.log('Board saved:', boardName.value);
      
      emit('save-board', items);

      if (items.status === 401) {
        localStorage.clear();
        router.push({ name: 'login' });
      }
    } catch (error) {
      console.error('Error saving board:', error);
      router.push({ name: 'login' });
    }
    closeModal();
  }
};


</script>

<template>
  <div v-if="$route.name === 'addboard' "
    class="itbkk-modal-new z-index fixed inset-0 flex items-center justify-center bg-black/[.05]">
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-5 text-green-800">New Board</h2>

      <label for="boardName" class="block text-lg mb-2">Name</label>
      <input v-model="boardName" type="text" class="itbkk-board-name z-index w-full p-2 border rounded mb-2"
        placeholder="Enter board name" />

      <p class="text-gray-600 mb-2">{{ characterCount }}/120</p>

      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

      <div class="flex justify-end space-x-4">
        <button @click="saveBoard" :disabled="isSaveButtonDisabled"
          class="itbkk-button-ok bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
          Save
        </button>
        <button @click="closeModal"
          class="itbkk-button-cancel bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
