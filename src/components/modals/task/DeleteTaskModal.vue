<script setup>
import { ref, watch } from "vue";
import { getItemById, deleteItemById } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";

const route = useRoute();
const number = ref(0);
const showModal = ref(false);

const { params } = useRoute();
const boardId = params.boardId;
const taskId = Number(params.taskId);
const task = ref(null);
const title = ref("");
const emit = defineEmits(["taskDeleted", "close", "taskNotfound"]);

const props = defineProps({
  showDeleteModal: Boolean,
  idDelete: Number,
});

watch(
  async () => {
    const idToUse = !isNaN(taskId) ? taskId : props.idDelete;
    if (idToUse) {
      await fetchTaskDetails(idToUse);
    }
  },
  { immediate: true }
);

async function fetchTaskDetails(id) {
  try {
    task.value = await getItemById(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`, id);
    number.value = task.value.id;
    title.value = task.value.title;
  } catch (error) {
    console.error("Error fetching task details:", error);
    emit("taskNotfound");
  }
};

const deleteTask = async () => {
  try {
    const idToUse = !isNaN(taskId) ? taskId : props.idDelete;
    const exist = await getItemById(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`, idToUse);
    if (exist) {
      await deleteItemById(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`, idToUse);
      console.log("Deleted task:", idToUse);
      emit("taskDeleted", idToUse);
    } else {
      emit("taskNotfound");
    }
    showModal.value = false;
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

</script>

<template>
  <div>
    <div v-if="props.showDeleteModal || $route.name === 'deleteTask'"
      class="itbkk-modal-task text-black fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
        <div class="bg-white w-1/2 p-6 rounded shadow-lg">
          <div class="">
            <h1 class="font-bold text-2xl mb-2">Delete Task</h1>
            <hr />
            <p class="text-lg py-2 mb-2 break-words">
              Do you want to delete the task "{{ title }}"?
            </p>

            <div class="text-right">
              <router-link :to="({ name: 'task', params: { boardId: params.boardId } })">
                <button class="itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mr-3"
                  @click="deleteTask()">
                  Confirm
                </button>
              </router-link>
              <router-link :to="({ name: 'task', params: { boardId: params.boardId } })">
                <button class="itbkk-button-cancel btn bg-red-500 hover:bg-red-700 text-white" @click="$emit('close')">
                  Cancel
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>