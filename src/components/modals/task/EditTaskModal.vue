<script setup>
import { ref, watch, computed, reactive } from "vue";
import { getItems, getItemById } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/stores/StatusManagement.js";
import DeleteIcons from "@/components/icons/DeleteIcons.vue";

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

const files = ref([]);

const handleFiles = (event) => {
  const selectedFiles = Array.from(event.target.files);
  files.value = [...files.value, ...selectedFiles].slice(0, 10);
  console.log(files.value);
  console.log(selectedFiles);

  if (files.value.length > 10) {
    selectedFiles.value = files.value.slice(0, 10);
  }
};

const removeFile = (index) => {
  files.value.splice(index, 1);
};

const isImage = (file) => file.type.startsWith("image/");
const getFilePreview = (file) => URL.createObjectURL(file);

</script>

<template>
  <div v-if="props.showEditModal || $route.name === 'editTaskModal'"
    class="itbkk-modal-task text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div :class="[
        'bg-white p-6 rounded shadow-lg grid gap-3 grid-flow-row-dense',
  files.length > 1 ? 'grid-cols-4 w-2/3' : 'grid-cols-3 w-1/2'
      ]">
        <div class="col-start-1 col-span-3">
          <h1 class="font-bold text-2xl py-2 mb-2">Edit Task</h1>
          <h1 class="font-bold mt-2">Title:</h1>
          <input class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 break-words"
            v-model="task.title" />
          <span class="text-gray-500 text-sm"
            :class="{ 'text-red-500': task.title.trim().length > 100 || task.title.trim().length === 0 }">
            {{ task.title.trim().length }} / 100 characters
          </span>

          <hr class="my-3" />
        </div>

        <div class="col-start-1 col-span-2 row-start-auto">
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
        <div class="col-start-3 col-span-1 row-start-auto">
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
          <div class="col-start-3 col-span-1 row-start-auto mb-5">
            <h1 class="font-bold pb-2">Attachment : </h1>
            <input type="file" multiple @change="handleFiles"
              class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
          </div>

          <h1 class="font-bold itbkk-timezone">Timezone: {{ timezone }}</h1>
          <h1 class="font-bold itbkk-created-on">Created On: {{ formatToLocalTime(task.createdOn) }}</h1>
          <h1 class="font-bold itbkk-updated-on">Updated On: {{ formatToLocalTime(task.updatedOn) }}</h1>
        </div>

        <div v-if="files.length > 1" class="col-start-4 col-span-1 row-span-3 bg-slate-50 p-3 rounded-md">
          <div class="">
            <h1 class="font-bold pb-2">Attachment Preview : </h1>
            <ul>
              <li v-for="(file, index) in files" :key="index"
                class="flex items-center p-2 m-2 rounded-lg bg-sky-100 hover:bg-sky-200 shadow-sm  justify-between">

                <div class="flex items-center pr-2">
                  <a :href="getFilePreview(file)" target="_blank">
                    <img v-if="isImage(file)" :src="getFilePreview(file)" alt="File Preview"
                      @click="openImagePreview(file)" class="size-10 rounded mr-2" />
                    <div v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="size-8 mr-2" viewBox="0 0 24 24">
                        <path fill="#55a3d3"
                          d="M18 22a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zM13 4l5 5h-5zM7 8h3v2H7zm0 4h10v2H7zm0 4h10v2H7z" />
                      </svg>
                    </div>
                  </a>
                  <div :class="{ 'text-red-500': ((file.size / (1024 * 1024)).toFixed(2)) > 10.00 }">
                    <a :href="getFilePreview(file)" :download="file.name">
                      <p class="w-[150px] text-xs text-ellipsis overflow-hidden text-warp ">{{ file.name }}</p>
                      <p class="text-xs text-base-content/70">
                      {{ file.size < 1024 * 1024 ? (file.size / 1024).toFixed(2) + ' KB' : (file.size / (1024 * 1024)).toFixed(2) + ' MB' }}
                      </p>
                    </a>
                  </div>
                </div>
                <button @click="removeFile(index)" class="justify-self-end">
                  <DeleteIcons />
                </button>

              </li>
            </ul>
          </div>
        </div>

        <div class="flex justify-end mt-4 col-start-3">
          <router-link :to="{ name: 'task', params: { boardId: route.params.boardId } }">
            <button class="itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3" @click="taskEdited"
              :disabled="!isFormModified || checkWhiteSpace(task.title)">
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