<script setup>
import { onMounted, ref } from "vue";
import { getItemById, deleteItemById } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";

const route = useRoute();
const number = ref(0);
const showModal = ref(false);
const id = Number(route.params.id);
const task = ref(null);
const title = ref("");
const emit = defineEmits(["taskDeleted", "close", "taskNotfound"]);

onMounted(async () => {
  try {
    task.value = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);
    number.value = task.value.id;
    console.log(task.value);
    title.value = task.value.title;

    console.log(route.params.id)
    console.log(title.value);
    console.log(task.value.title);
  } catch (error) {
    console.error("Error fetching task details:", error);
    emit("taskNotfound");
  }
});

const deleteTask = async (deleteid) => {
  try {

    await deleteItemById(import.meta.env.VITE_BASE_TASK_URL, deleteid);
    console.log("Deleted task:", deleteid);

    showModal.value = false;
    emit("taskDeleted", deleteid);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

</script>

<template>
  <div>
    <div v-if="title" class="text-black fixed z-10 inset-0 overflow-y-auto">
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
                <button class="btn bg-green-500 hover:bg-green-700 text-white mr-3"
                  @click="deleteTask(route.params.id)">
                  Confirm
                </button>
              </router-link>
              <router-link to="/task">
                <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="$emit('close')">
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