<script setup>
import { ref, watch, computed, reactive } from "vue";
import { getItems, getItemById } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/stores/StatusManagement.js";

const emit = defineEmits(['close', 'taskEdited']);
const route = useRoute();
const boardId = route.params.boardId;
const taskId = route.params.taskId;

const statusmanager = ref(new StatusManagement());

const EmptyAssigneeText = "Unassigned";
const EmptyDescriptionText = "No Description Provided";

const props = defineProps({
  showEditModal: Boolean,
  idEdit: Number,
});

const task = reactive({
  id: 0,
  title: "",
  description: "",
  assignees: "",
  status: {
    id: 1,
    name: "",
    description: "",
  },
  createdOn: "",
  updatedOn: "",
});

const taskUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`;
const statusUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`;

watch(
  () => [props.showEditModal, route.name],
  async ([showEditModal, routeName]) => {
    if (showEditModal || routeName === 'editTaskModal') {
      const idToUse = !isNaN(taskId) ? taskId : props.idEdit;
      if (idToUse) {
        await fetchTaskDetails(idToUse);
        initialTask = JSON.stringify(task);
      }
    }
  },
  { immediate: true }
);


async function fetchTaskDetails(id) {
  try {

    const item = await getItemById(taskUrl, id);

    if (!item) {
      console.error("No task found with the given ID");
      return;
    }

    const statusItem = await getItems(statusUrl);
    statusmanager.value.setStatuses(statusItem);

    task.id = item.id;
    task.title = item.title;
    task.description = item.description ?? "";
    task.assignees = item.assignees ?? "";
    task.status.id = item.status.id;
    task.status.name = item.status.name;
    task.status.description = item.status.description;
    task.createdOn = item.createdOn;
    task.updatedOn = item.updatedOn;

  } catch (error) {
    console.error("Error fetching task details:", error);
  }
}

const checkWhiteSpace = (title) => {
  return /^\s*$/.test(title);
};

let initialTask = "";
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const formatToLocalTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString)
  const localDate = new Date(dateTime.getTime());
  return localDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false 
  });
};

const isFormModified = computed(() => {
  return JSON.stringify(task) !== initialTask;
});

const taskEdited = () => {
  if (isFormModified.value) {
    emit("taskEdited", task, task.id || props.idEdit);
  }
};

const countOptionalCharacters = (text) => {
  return (text ?? "").trim().length;
};
</script>

<template>
  <div v-if="props.showEditModal || $route.name === 'editTaskModal'"
    class="itbkk-modal-task text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
        <div class="col-start-1 col-span-3">
          <h1 class="font-bold text-2xl py-2 mb-2">Edit Task</h1>
          <h1 class="font-bold mt-2">Title:</h1>
          <input class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 break-words"
            v-model="task.title" />
          <span class="text-gray-500 text-sm"
            :class="{ 'text-red-500': task.title.trim().length > 100 || task.title.trim().length === 0 }">
            {{ task.title.trim().length }} / 100 characters
          </span>
        </div>
        <hr class="col-start-1 col-span-3" />
        <div class="col-start-1 col-span-2">
          <h1 class="font-bold">Description :</h1>
          <textarea
            class="itbkk-description placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full h-[14rem] break-words"
            :class="{ EmptyStyle: task.description === '' }" v-model="task.description"
            :placeholder="EmptyDescriptionText"></textarea>
          <span class="text-gray-500 text-sm"
            :class="{ 'text-red-500': countOptionalCharacters(task.description) > 500 }">
            {{ countOptionalCharacters(task.description) }} / 500 characters
          </span>
        </div>
        <div class="col-start-3 col-span-1">
          <h1 class="font-bold">Assignees :</h1>
          <textarea
            class="itbkk-assignees placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full break-words"
            :class="{ EmptyStyle: task.assignees === '' }" v-model="task.assignees"
            :placeholder="EmptyAssigneeText"></textarea>
          <span class="text-gray-500 text-sm" :class="{ 'text-red-500': countOptionalCharacters(task.assignees) > 30 }">
            {{ countOptionalCharacters(task.assignees) }} / 30 characters
          </span>
          <h1 class="font-bold pt-3">Status :</h1>
          <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status" v-model="task.status.id">
            <option v-for="(status, index) in statusmanager.getStatus()" :key="index" :value="status.id">
              {{ status.name }}
            </option>
          </select>

          <h1 class="font-bold itbkk-timezone">Timezone: {{ timezone }}</h1>
          <h1 class="font-bold itbkk-created-on">Created On: {{ formatToLocalTime(task.createdOn) }}</h1>
          <h1 class="font-bold itbkk-updated-on">Updated On: {{ formatToLocalTime(task.updatedOn) }}</h1>
        </div>
        <div class="flex justify-end mt-4 col-start-3">
          <router-link :to="{ name: 'task', params: { boardId: route.params.boardId } }">
            <button class="itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3"
              @click="taskEdited" :disabled="!isFormModified || checkWhiteSpace(task.title)">
              Save
            </button>
          </router-link>
          <router-link :to="{ name: 'task', params: { boardId: route.params.boardId } }">
            <button class="itbkk-button-cancel btn bg-red-500 hover:bg-red-700 text-white" @click="$emit('close')">
              Close
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>