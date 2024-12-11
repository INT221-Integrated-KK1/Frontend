<script setup>
import { ref, computed } from 'vue';
import { addItem, getItems } from '@/libs/fetchUtils';
import { BoardManagement } from '../../../libs/BoardManagement.js';
import router from '@/router';

// State variables
const board = ref('');
const boardmanager = ref(new BoardManagement());
const boardName = ref('');
const userName = localStorage.getItem('username') || 'Guest';
const defaultBoardName = `${userName} personal board`; // Default board name
boardName.value = defaultBoardName; // Initialize with default name

// Emit to inform parent component
const emit = defineEmits(['save-board']);

// Close modal and navigate back
const closeModal = () => {
  router.push({ name: 'board' });
};

// Check if the input contains only whitespace
const checkWhiteSpace = (title) => {
  return /^\s*$/.test(title);
};

// Disable Save button if input is empty or whitespace
const isSaveButtonDisabled = computed(() => boardName.value.trim() === '');

// Save the board
async function saveBoard() {
  try {
    // Save the board with a trimmed name
    const newBoardName = boardName.value.trim();
    const items = await addItem(import.meta.env.VITE_BASE_BOARDS_URL, { name: newBoardName });

    // Fetch boards to get the newly added board ID
    const boardItems = await getItems(import.meta.env.VITE_BASE_BOARDS_URL);
    const personalBoards = boardItems.personalBoards;

    for (let i = 0; i < personalBoards.length; i++) {
      if (personalBoards[i].name === newBoardName) {
        board.value = personalBoards[i].id;
        break;
      }
    }

    // Navigate to the tasks page for the new board
    router.push({ name: 'task', params: { boardId: board.value } });
  } catch (error) {
    console.error('Error saving board:', error);
    alert('There was a problem saving the board. Please try again later.');
  }
}
</script>

<template>
  <div v-if="$route.name === 'addboard'"
    class="itbkk-modal-new z-40 fixed inset-0 flex items-center justify-center bg-black/[.05]">
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-5 text-green-800">New Board</h2>

      <!-- Board Name Input -->
      <label for="boardName" class="block text-lg mb-2">Name</label>
      <input
        v-model="boardName"
        maxlength="120"
        type="text"
        id="boardName"
        class="itbkk-board-name bg-white w-full p-2 border rounded mb-2"
        placeholder="Enter board name"
      />

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          @click="saveBoard"
          :disabled="checkWhiteSpace(boardName) || isSaveButtonDisabled"
          class="itbkk-button-ok bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Save
        </button>

        <button
          @click="closeModal"
          class="itbkk-button-cancel bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* AddModal styles */
.itbkk-modal-new {
  backdrop-filter: blur(5px);
}

.itbkk-board-name {
  font-size: 1rem;
}

.itbkk-button-ok,
.itbkk-button-cancel {
  font-size: 1rem;
  font-weight: bold;
}
</style>
