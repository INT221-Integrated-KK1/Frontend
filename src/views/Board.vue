<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '@/components/Sidebar.vue';
import { getItems } from '@/libs/fetchUtils';
import { BoardManagement } from '@/libs/BoardManagement';
const router = useRouter();
const emit = defineEmits(['save-board-sidebar']);
const boardmanager = ref(new BoardManagement());
const personalBoards = ref([]);
const collabBoards = ref([]);

const openModal = () => {
  router.push({ name: 'addboard' });
};

onMounted(async () => {
  try {
    const items = await getItems(import.meta.env.VITE_BASE_BOARDS_URL);
    boardmanager.value.setBoards(items);
    personalBoards.value = items.personalBoards;
    collabBoards.value = items.collabBoards;
    console.log(collabBoards.value);
  } catch (error) {
    console.error('Error fetching personalBoards:', error);
  }
});

</script>

<template>
  <div class="flex ">
    <div>
      <Sidebar />
    </div>

    <div class="w-screen bg-slate-50 ">

      <h1 class="text-5xl text-center font-bold mt-10">Personal Boards</h1>
      <div class="mt-10 mx-32 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div @click="openModal"
          class="itbkk-button-create rounded-xl p-4 cursor-pointer transition transform hover:scale-105  duration-300 ease-in-out text-xl font-semibold text-center flex items-center justify-center h-40 w-auto border-dashed border-2 border-slate-400">
          + Add New Board
        </div>

        <div v-for="(board, index) in personalBoards" :key="index">
          <div
            class="card bg-base-100 w-auto h-auto shadow-xl transition transform hover:scale-105 duration-300 ease-in-out relative">

            <figure class="w-full h-20 relative">
              <img src="@/assets/board-bg.jpg" alt="board" class="absolute inset-0 w-full h-full object-cover" />
            </figure>

            <div @click="router.push({ name: 'task', params: { boardId: board.id } })"
              class="card-title pt-3 pl-3 relative z-10 flex">
              <div class="font-bold text-md ">{{ board.visibility.toUpperCase() }} </div>
            </div>
            <div class="font-semibold overflow-auto text-base px-3 pb-3">{{ board.name }}</div>
            <div class="absolute top-0 right-0 p-3 ">
              <div
                class="dropdown dropdown-right cursor-pointer backdrop-blur-md bg-white/40 rounded-full w-8 h-8 flex items-center justify-center ">
                <div tabindex="0" role="button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="M5 17h14M5 12h14M5 7h14" />
                  </svg>
                </div>
                <ul tabindex="0" class="dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li class="w-full text-base p-2 rounded-lg hover:bg-teal-600 hover:text-white "><a>Edit</a></li>
                  <li class="w-full text-base p-2 rounded-lg hover:bg-red-600 hover:text-white "><a>Delete</a></li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        <router-view />
      </div>

      <div>
        <h1 class="text-5xl text-center font-bold mt-20">Collaborator Boards</h1>
        <div class="mt-10 mx-32 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="(board, index) in collabBoards" :key="index">
            <div
              class="card bg-base-100 w-auto h-auto shadow-xl transition transform hover:scale-105 duration-300 ease-in-out relative">

              <figure class="w-full h-20 relative">
                <img src="@/assets/board-bg.jpg" alt="board" class="absolute inset-0 w-full h-full object-cover" />
              </figure>

              <div @click="router.push({ name: 'task', params: { boardId: board.id } })"
                class="card-title pt-3 pl-3 relative z-10 flex">
                <div class="font-bold text-md ">{{ board.visibility.toUpperCase() }} </div>
              </div>
              <div class="font-semibold overflow-auto text-base px-3">{{ board.name }}</div>
              <div class="font-semibold overflow-auto text-sm text-gray-600 px-3 pb-3">Owner: {{ board.owner.name }}
              </div>
              <div class="absolute top-0 right-0 p-3 ">
                <div
                  class="dropdown dropdown-right cursor-pointer backdrop-blur-md bg-white/40 rounded-full w-8 h-8 flex items-center justify-center ">
                  <div tabindex="0" role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" d="M5 17h14M5 12h14M5 7h14" />
                    </svg>
                  </div>
                  <ul tabindex="0" class="dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li class="w-full text-base p-2 rounded-lg hover:bg-red-600 hover:text-white "><a>Leave</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!-- <router-view /> -->
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>
