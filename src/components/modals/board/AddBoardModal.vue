<script setup>
import { ref, computed } from 'vue';
import { addItem, getItems } from '@/libs/fetchUtils';
import router from '@/router';

const board = ref('');
const name = localStorage.getItem('username');
const boardName = ref(`${name} personal board`);
const emit = defineEmits(['save-board']);

const closeModal = () => {
  router.push({ name: 'board' });
};

const checkWhiteSpace = (title) => {
  return /^\s*$/.test(title);
};
const isSaveButtonDisabled = computed(() => boardName.value.trim() === '');

async function saveBoard() {
  const boardsinput = ref(boardName.value.trim());
  try {
    const items = await addItem(import.meta.env.VITE_BASE_BOARDS_URL, { name: boardsinput.value });
    try {
      const boardItem = await getItems(import.meta.env.VITE_BASE_BOARDS_URL);
      const personalBoards = boardItem.personalBoards;

      for (let i = 0; i < personalBoards.length; i++) {
        if (personalBoards[i].name === boardName.value) {
          board.value = personalBoards[i].id;
          break;
        } if (boardItem.length === 1) {
          board.value = personalBoards[0].id;
        }
      }

    } catch (error) {
      console.error("Error fetching task details:", error);
      localStorage.clear();
      router.push({ name: 'login' });
    } if (items.status === 401) {
      localStorage.clear();
      router.push({ name: 'login' });
    }
  } catch (error) {
    console.error('Error saving board:', error);
    alert('There is a problem. Please try again later.');
  }
  router.push({ name: 'task', params: { boardId: board.value } });
};

</script>

<template>
  <div v-if="$route.name === 'addboard'"
    class="itbkk-modal-new z-40 fixed inset-0 flex items-center justify-center bg-black/[.05]">
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-5">New Board</h2>

      <label for="boardName" class="block text-lg mb-2">Name</label>
      <input v-model="boardName" maxlength="120" type="text" id="boardName"
        class="itbkk-board-name bg-white w-full p-2 border rounded mb-2" placeholder="Enter board name" />

      <div class="flex justify-end space-x-4">
        <button @click="saveBoard" :disabled="isSaveButtonDisabled"
          class="btn bg-green-500 hover:bg-green-700 text-white  disabled:bg-gray-300 disabled:cursor-not-allowed">
          Save
        </button>

        <button @click="closeModal" class="btn bg-red-500 hover:bg-red-700 text-white">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>