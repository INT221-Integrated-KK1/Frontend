<script setup>
import { onMounted, ref } from "vue";
import { getItemById, deleteItemById } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import NotFound from "@/views/NotFound.vue";

const route = useRoute();
const number = ref(0);
const showModal = ref(false);

const { params } = useRoute();
const boardId = params.boardId;
const taskId = Number(params.taskId);
console.log(taskId);

const task = ref(null);
const title = ref("");
const emit = defineEmits(["taskDeleted", "close", "taskNotfound"]);

const taskUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`;
const statusUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`;
onMounted(async () => {
  try {
    task.value = await getItemById(taskUrl, taskId);
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
    const exist = await getItemById(taskUrl, deleteid);
    if (exist) {
      await deleteItemById(taskUrl, deleteid);
      console.log("Deleted task:", deleteid);
      emit("taskDeleted", deleteid);
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
    <div v-if="title" class="itbkk-modal-task text-black fixed z-10 inset-0 overflow-y-auto">
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
                <button class="btn bg-green-500 hover:bg-green-700 text-white mr-3" @click="deleteTask(taskId)">
                  Confirm
                </button>
              </router-link>
              <router-link :to="({ name: 'task', params: { boardId: params.boardId } })">
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

  <NotFound v-if="task === undefined" />
</template>

<style scoped></style>