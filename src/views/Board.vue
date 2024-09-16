<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AddBoardModal from '@/components/AddBoardModal.vue';

const showModal = ref(false);
const router = useRouter();
const route = useRoute();

const openModal = () => {
  router.push('/board/add');
};

const closeModal = () => {
  showModal.value = false;
  router.push('/board');
};

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

  <table class="w-full mt-10 border border-gray-300">
    <thead>
      <tr>
        <th class="px-4 py-2 text-xl font-semibold border-b">No</th>
        <th class="px-4 py-2 text-xl font-semibold border-b">Name</th>
        <th class="px-4 py-2 text-xl font-semibold border-b">Action</th>
      </tr>
    </thead>
    <tbody>
      
    </tbody>
  </table>

  <AddBoardModal v-if="showModal" @close="closeModal" />
</template>

<style scoped></style>
