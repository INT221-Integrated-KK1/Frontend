<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import AddBoardModal from '@/components/modals/board/AddBoardModal.vue';
import { useBoardStore } from '@/stores/useBoardStore';
const router = useRouter();
const boards = ref([]);
const boardStore = useBoardStore();

const openModal = () => {
  router.push("/board/add");
};

onMounted(async () => {
  try {
    boards.value = boardStore.getBoards();
    console.log('Boards:', boards.value);
  } catch (error) {
    console.error('Error fetching boards:', error);
  }
});

</script>

<template>
  <div class="flex">
    <div>
      <Sidebar />
    </div>

    <div class="w-screen bg-slate-50">
      <Header />
      <h1 class="text-5xl text-center font-bold mt-10">Board List</h1>
      <div class="mt-10 mx-32 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div @click="openModal"
          class="bg-white shadow-md rounded-lg p-4 cursor-pointer transition transform hover:scale-105 hover:bg-gray-300 duration-300 ease-in-out text-3xl font-semibold text-center flex items-center justify-center h-32 w-auto border-dashed border-2 border-slate-400">
          +
        </div>
          <div v-for="(board, index) in boards" :key="index" @click="router.push({ name: 'task'})"
            class="bg-white shadow-md rounded-lg p-4 cursor-pointer transition transform hover:scale-105 hover:bg-gray-300 duration-300 ease-in-out text-lg font-semibold text-center flex items-center justify-center h-32 w-auto">
            {{ board }}
          </div>
      </div>
    </div>
  </div>
  <router-view v-slot="{ AddBoardModal }">
    <transition name="fade">
      <AddBoardModal />
    </transition>
  </router-view>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
