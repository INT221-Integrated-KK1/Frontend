<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import AddBoardModal from "@/components/modals/board/AddBoardModal.vue"; // Import AddBoardModal component
import LeaveBoardModal from "@/components/modals/board/LeaveBoardModal.vue";
import AlertBox from "@/components/AlertBox.vue";
import { getItems } from "@/libs/fetchUtils";
import { BoardManagement } from "@/libs/BoardManagement.js";

const router = useRouter();
const emit = defineEmits(["save-board-sidebar"]);
const boardmanager = ref(new BoardManagement());
const personalBoards = ref([]);
const collabBoards = ref([]);
const showRemoveModal = ref(false);
const showAddModal = ref(false); // State for AddBoardModal visibility
const boardId = ref("");
const boardName = ref("");
const boardType = ref("");
const tableType = ref("board");
const showDeleted = ref(false);
const showDeletedError = ref(false);
const isLoading = ref(false);

const openAddModal = () => {
  showAddModal.value = true; // Show AddBoardModal
};

const closeAddModal = () => {
  showAddModal.value = false; // Hide AddBoardModal
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const items = await getItems(import.meta.env.VITE_BASE_BOARDS_URL);
    boardmanager.value.setBoards(items);
    personalBoards.value = items.personalBoards;
    collabBoards.value = items.collabBoards;
  } catch (error) {
    console.error("Error fetching boards:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="flex">
    <Sidebar />
    <div class="w-screen bg-slate-50">
      <AlertBox
        :tableType="tableType"
        :showDeleted="showDeleted"
        :showDeletedError="showDeletedError"
      />

      <!-- Personal Boards -->
      <h1 class="text-5xl text-center font-bold mt-10">Personal Boards</h1>
      <div class="mt-10 mx-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <!-- Add New Board Button -->
        <div
          @click="openAddModal"
          class="itbkk-button-create rounded-xl p-4 cursor-pointer transition transform hover:scale-105 duration-300 ease-in-out text-xl font-semibold text-center flex items-center justify-center h-40 w-auto border-dashed border-2 border-slate-400"
        >
          + Add New Board
        </div>

        <!-- Personal Board Cards -->
        <div
          v-for="(board, index) in boardmanager.getBoards().personalBoards"
          :key="index"
          class="card-wrapper"
        >
          <div class="card bg-white shadow-md rounded-lg transition transform hover:scale-105 relative overflow-hidden">
            <div class="h-24 bg-gradient-to-r from-cyan-300 to-teal-300"></div>
            <div class="p-5">
              <h2
                @click="router.push({ name: 'task', params: { boardId: board.id } })"
                class="text-lg font-semibold cursor-pointer hover:underline mb-3"
              >
                {{ board.name }}
              </h2>
            </div>
            <div class="absolute top-3 right-3 bg-orange-400 text-white px-3 py-1 rounded-full text-xs shadow">
              {{ board.visibility.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Collaborator Boards -->
      <h1 class="text-5xl text-center font-bold mt-20 mb-10">Collaborator Boards</h1>
      <div
        v-if="collabBoards.length === 0"
        class="text-3xl text-center text-gray-500 italic mt-10 mb-20"
      >
        No collaborator boards found.
      </div>
      <div
        v-else
        class="mt-10 mx-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
      >
        <div v-for="(board, index) in collabBoards" :key="index" class="card-wrapper">
          <div class="card bg-white shadow-md rounded-lg transition transform hover:scale-105 relative overflow-hidden">
            <div class="h-24 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
            <div class="p-5">
              <h2
                @click="router.push({ name: 'task', params: { boardId: board.id } })"
                class="text-lg font-semibold cursor-pointer hover:underline mb-3"
              >
                {{ board.name }}
              </h2>
              <p class="text-sm text-gray-600 mt-2">Owner: {{ board.owner.name }}</p>
            </div>
            <div class="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs shadow">
              {{ board.visibility.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Board Modal -->
  <AddBoardModal
    v-if="showAddModal"
    @close="closeAddModal"
  />

  <LeaveBoardModal
    :showRemoveModal="showRemoveModal"
    :boardId="boardId"
    :boardName="boardName"
    :boardType="boardType"
    @leaveBoardCollab="leaveBoard(boardId)"
    @closeModal="closeModal"
  />
</template>

<style scoped>
.card-wrapper {
  transition: transform 0.3s ease-in-out;
  margin-bottom: 2rem;
}
.card-wrapper:hover {
  transform: scale(1.05);
}

.card {
  transition: box-shadow 0.3s ease-in-out;
}
.card:hover {
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
}

.bg-gradient-to-r {
  height: 6rem;
}

.mb-10,
.mb-20 {
  margin-bottom: 2.5rem;
}
</style>
