<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { getItemById, getItems, getFileImage } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/stores/StatusManagement.js";
const route = useRoute();

const emit = defineEmits(['closed'])
const props = defineProps({
  id: Number,
  showTaskDetail: Boolean
});

const task = ref(null);
const statusmanager = ref(new StatusManagement());
let boardId = null;


onMounted(async () => {
  boardId = route.params.boardId;
});


watch(
  () => [route.name, route.params.taskId],
  async ([newRouteName, newTaskId]) => {
    if (newRouteName === 'taskdetail' && newTaskId) {
      await fetchTaskDetails(newTaskId);
    }
  },
  { immediate: true }
);

async function fetchTaskDetails(id) {
  try {

    files.value = [];
    const taskUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`;
    const statusUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`;

    const item = await getItemById(taskUrl, id);
    task.value = item;

    const statusItem = await getItems(statusUrl);
    statusmanager.value.setStatuses(statusItem);

    const attachmentItem = await getItems(`${import.meta.env.VITE_BASE_URL}api/attachment/task/${id}`);
    if (attachmentItem.data.length > 0) {
      attachmentItem.data.forEach((item) => {
        files.value.push(item);
      });
      await getFilePreview(files, id);
    }

  } catch (error) {
    console.error("Error fetching task details:", error);
  }
};

//  ----------------- File Preview -----------------

const files = ref([]);
const isImage = (file) => file.fileType.includes("image/");

async function getFilePreview(file, id) {
  try {
    for (let i = 0; i < file.value.length; i++) {

      file.value[i].fileUrl = null;
      let fileName = decodeURIComponent(file.value[i].fileName);
      const response = await getFileImage(`${import.meta.env.VITE_BASE_URL}api/attachment`, id, fileName)
      file.value[i].fileUrl = URL.createObjectURL(response);
    }
  } catch (error) {
    console.error("Error fetching file preview:", error);
    file.value = [];
  }
}

function downloadFile(file) {
  const link = document.createElement("a");
  link.href = file.fileUrl;
  link.download = file.fileName || "download";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const handleClose = () => {
  files.value = [];
  files.fileUrl = null;
  emit('closed');
};

//  ----------------- Task Details -----------------

const EmptyStyle = "italic text-slate-400";
const EmptyAssigneeText = "Unassigned";
const EmptyDescriptionText = "No Description Provided";

const getTaskProp = (propName) =>
  computed(() => (task.value ? task.value[propName] : ""));

const title = getTaskProp("title");
const description = getTaskProp("description");
const assignees = getTaskProp("assignees");
const status = getTaskProp("status");
const createdOn = computed(() => formatToLocalTime(task.value?.createdOn));
const updatedOn = computed(() => formatToLocalTime(task.value?.updatedOn));

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formatToLocalTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  const localDate = new Date(dateTime.getTime());
  return localDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};


</script>

<template>
  <div v-if="props.showTaskDetail || route.name === 'taskdetail'" class="text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div :class="[
        'bg-white p-6 rounded shadow-lg grid gap-3 grid-flow-row-dense grid-cols-3 w-1/2'
      ]">
        <div class="col-start-1 col-span-3">
          <h1 class="font-bold text-2xl py-2 mb-2">Task Detail</h1>
          <h1 class="font-bold">Title :</h1>
          <div class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 break-words" v-text="title"></div>
        </div>
        <hr class="col-start-1 col-span-3" />
        <div class="col-start-1 col-span-2">
          <h1 class="font-bold">Description :</h1>
          <div
            class="itbkk-description placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full h-[14rem] break-words"
            :class="description === null ? EmptyStyle : ''">
            {{ description === null ? EmptyDescriptionText : description }}
          </div>
        </div>
        <div class="col-start-3 col-span-1">
          <h1 class="font-bold">Assignees :</h1>
          <div
            class="itbkk-assignees placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full break-words"
            :class="assignees === null ? EmptyStyle : ''">
            {{ assignees === null ? EmptyAssigneeText : assignees }}
          </div>
          <h1 class="font-bold">Status :</h1>
          <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status" v-model="status" disabled>

            <option v-for="(status, index) in statusmanager.getStatus()" :key="index" :value="status">
              {{ status.name }}
            </option>
          </select>
          <h1 class="font-bold itbkk-timezone">Timezone : {{ timezone }}</h1>
          <h1 class="font-bold itbkk-created-on">Created On: {{ createdOn }}</h1>
          <h1 class="font-bold itbkk-updated-on">Updated On: {{ updatedOn }}</h1>
        </div>

        <div v-if="files.length > 0" class="bg-slate-50 p-3 rounded-lg col-start-1 col-span-3">
          <h1 class="font-bold pb-2">Attachment Preview</h1>
          <div class="flex flex-wrap gap-4">
            <div v-for="(file, index) in files" :key="index"
              class="flex flex-col items-center justify-between bg-sky-50 p-3 rounded-lg shadow hover:shadow-md transition-shadow duration-200 w-36">

              <a :href="file.fileUrl" target="_blank" :download="file.fileName"
                class="block relative w-full h-20 overflow-hidden rounded-lg">
                <img v-if="isImage(file)" :src="file.fileUrl" alt="File Preview"
                  class="w-full h-full object-cover" />
                <div v-else class="flex items-center justify-center h-full w-full bg-sky-100">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-sky-500" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="M18 22a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zM13 4l5 5h-5zM7 8h3v2H7zm0 4h10v2H7zm0 4h10v2H7z" />
                  </svg>
                </div>
              </a>


              <!-- File Info -->
              <a :href="file.fileUrl" class="cursor-pointer" target="_blank">
                <div class="mt-3 w-full text-center">
                  <p class="text-sm font-medium">{{ file.fileName }}</p>
                </div>
              </a>

              <div class="flex items-center justify-center">
                <button @click.prevent="downloadFile(file)"
                  class="mt-2 flex items-center justify-center w-8 h-8  rounded-full bg-sky-100  mr-2"
                  aria-label="Remove File">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor"
                      d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>

        <div class="flex justify-end mt-4 col-start-3">
          <RouterLink :to="{ name: 'task' }">
            <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="handleClose">Close</button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>