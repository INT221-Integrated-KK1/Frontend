<script setup>
import { onMounted, ref } from "vue";
import { getItemById, deleteItemById } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";
import router from "@/router";
import { TaskManagement } from "../libs/TaskManagement.js";

const { params } = useRoute();
const showModal = ref(false);

const id = Number(params.id);
const task = ref(null);
const title = ref("");
const emit = defineEmits(["taskDeleted"]);

onMounted(async () => {
  try {
    task.value = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);
    title.value = task.value.title;
  } catch (error) {
    console.error("Error fetching task details:", error);
  }
});

// const deleteTask = async () => {
//   try {
//     await deleteItemById(import.meta.env.VITE_BASE_TASK_URL, id);
//     console.log("Task deleted:", id);
//     emit("taskDeleted", id);
//     showModal.value = false;
//     router.push("/task");
//   } catch (error) {
//     showModal.value = false;
//     console.error("Error deleting task:", error);
//   }
// };
const deleteTask = async () => {
  try {
    await deleteItemById(import.meta.env.VITE_BASE_TASK_URL, id);
    taskmanager.deleteTask(deletedid);
    //todo.value = taskmanager.getTask();
    console.log("Deleted task:", deletedid);
    emit("taskDeleted", id);
    showModal.value = false;
    router.push("/task");
  } catch (error) {
    // if (error.response && error.response.status === 404) {
    //   showModal.value = false;
    //   console.error("Task not found:", id);
    // } else {
    //   showModal.value = false;
    //   console.error("Error deleting task:", error);
    // }
  }
};
</script>

<template>
  <div>
    <div class="text-black fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
        <div class="bg-white w-1/2 p-6 rounded shadow-lg">
          <div class="">
            <h1 class="font-bold text-2xl mb-2">Delete Task</h1>
            <hr />
            <p class="text-lg py-2 mb-2 break-words">
              Do you want to delete the task "{{ title }}"?
            </p>

            <div class="text-right">
              <router-link to="/task">
                <button
                  class="btn bg-green-500 hover:bg-green-700 text-white mr-3"
                  @click="deleteTask"
                >
                  Confirm
                </button>
              </router-link>
              <router-link to="/task">
                <button
                  class="btn bg-red-500 hover:bg-red-700 text-white"
                  @click="showModal = false"
                >
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
