<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import { getItems } from '@/libs/fetchUtils';
import { BoardManagement } from '@/libs/BoardManagement';
const router = useRouter();
const emit = defineEmits(['save-board-sidebar']);
const boardmanager = ref(new BoardManagement());
const boards = ref([]);

// function handleBoardAdded(addBoard) {
//   console.log('Board added:', addBoard);
//   boardmanager.value.addBoard(addBoard);
// }

const openModal = () => {
  console.log('Opening modal');
  router.push({ name: 'addboard' });
};

onMounted(async () => {
  try {
    const items = await getItems(import.meta.env.VITE_BASE_BOARDS_URL);
    boardmanager.value.setBoards(items);
    boards.value = items;
  } catch (error) {
    console.error('Error fetching boards:', error);
  }
});

</script>

<template>
  <div class="flex ">
    <div>
      <Sidebar />
    </div>

    <div class="w-screen bg-slate-50 ">

      <h1 class="text-5xl text-center font-bold mt-10">Board List</h1>
      <div class="mt-10 mx-32 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div @click="openModal"
          class="itbkk-button-create rounded-xl p-4 cursor-pointer transition transform hover:scale-105  duration-300 ease-in-out text-xl font-semibold text-center flex items-center justify-center h-32 w-auto border-dashed border-2 border-slate-400">
          + Add New Board
        </div>

        <div v-for="(board, index) in boards" :key="index">
          <div @click="router.push({ name: 'task', params: { boardId: board.id } })"
            class="card bg-base-100 w-auto h-auto shadow-xl transition transform hover:scale-105 duration-300 ease-in-out">
            <figure>
              <img src="@/assets/board-bg.jpg" alt="board" class="w-full h-20" />
            </figure>

            <div class="card-title text-base font-semibold p-3 overflow-auto">
              {{ board.name }}
            </div>
          </div>
        </div>
        <router-view  />
        <!-- <router-view @save-board="handleBoardAdded" /> -->
      </div>
    </div>
  </div>

</template>

<style scoped></style>
