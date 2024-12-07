<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { getItemById, getItems } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/stores/StatusManagement.js";
import { FileManagement } from "@/stores/FileManagement";
const route = useRoute();

const emit = defineEmits(['closed'])
const props = defineProps({
  id: Number,
  showTaskDetail: Boolean
});

const task = ref(null);
const statusmanager = ref(new StatusManagement());
const filemanager = ref(new FileManagement());
const { params } = useRoute();
const routeId = Number(params.taskId);

const boardId = params.boardId;
const taskId = ref(props.id || routeId.value);


const taskUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`;
const statusUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`;


watch(
  () => [route.name, props.showTaskDetail],
  async ([routeName, show]) => {
    if (routeName === 'taskdetail' || show) {
      console.log("routeId: ", Number(routeId));
  
      const idToUse = !isNaN(routeId) ? routeId : props.id;
      console.log("idToUse: ", idToUse);
      
      if (idToUse) {
        await fetchTaskDetails(idToUse);
      }
    }
  },
  { immediate: true }
);

// file handle
const isImage = (file) => file.fileType.startsWith("image/");

function getFileType(fileName) {
  return fileName.substring(fileName.lastIndexOf('.')) || '';
}

function getFileName(fileName) {
  return fileName.substring(0, fileName.lastIndexOf('.'));
}


async function fetchTaskDetails(id) {
  try {
    console.log("fetchTaskDetails id: ", id);

    const item = await getItemById(taskUrl, id);
    task.value = item;

    const statusItem = await getItems(statusUrl);
    statusmanager.value.setStatuses(statusItem);

    const attachmentItem = await getItems(`${import.meta.env.VITE_BASE_URL}api/attachment/task/${id}`);
    console.log("attachmentItem: ", attachmentItem);
    
    filemanager.value.setFiles(attachmentItem.data);
    console.log(filemanager.value.getFiles());

    for (let i = 0; i < filemanager.value.getFiles().length; i++) {
      if (isImage(filemanager.value.getFiles()[i])) {
        const fileName = decodeURIComponent(filemanager.value.getFiles()[i].fileName);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}api/attachment/${id}/${filemanager.value.getFiles()[i].fileName}`, {
          method: "GET",
        }
        );

        if (response.ok) {
          console.log(`Fetched file ${fileName}:`, response);
          
          // const blob = await response.blob();
          // blobImage.push(fileName +" "+ blob.size);
          // console.log(`Blob for file ${fileName}:`, blob);

          // const objectUrl = URL.createObjectURL(blob);
          // console.log(`Object URL for file ${fileName}:`, objectUrl);
        } else {
          console.error(`Failed to fetch file ${fileName}:`, response.status, response.statusText);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching task details:", error);
  }
};


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
        'bg-white p-6 rounded shadow-lg grid gap-3 grid-flow-row-dense',
        filemanager.getFiles().length > 1 ? 'grid-cols-4 w-2/3' : 'grid-cols-3 w-1/2'
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

        <div v-if="filemanager.getFiles().length > 1"
          class="col-start-4 col-span-1 row-span-3 bg-slate-50 p-3 rounded-md">
          <div>
            <h1 class="font-bold pb-2">Attachment Preview : </h1>
            <ul>
              <li v-for="(file, index) in filemanager.getFiles()" :key="index"
                class="flex items-center p-2 m-2 rounded-lg bg-sky-100 hover:bg-sky-200 shadow-sm justify-between">
                <div class="flex items-center pr-2">
                  <a :href="file.fileUrl" target="_blank">
                    <img v-if="isImage(file)" :src="encodeURI(file.fileUrl)" alt="File Preview"
                      class="size-10 rounded mr-2" />

                    <div v-else>
                      <svg xmlns="http://www.w3.org/2000/svg" class="size-10 mr-2" viewBox="0 0 24 24">
                        <path fill="#55a3d3"
                          d="M18 22a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zM13 4l5 5h-5zM7 8h3v2H7zm0 4h10v2H7zm0 4h10v2H7z" />
                      </svg>
                    </div>
                  </a>
                  <div>
                    <a :href="file.fileUrl" :download="file.fileName">
                      <p class="w-16 text-xs text-ellipsis overflow-hidden text-wrap">
                        {{ getFileName(file.fileName) }}
                        <span class="inline">{{ getFileType(file.fileName) }}</span>
                      </p>
                      <p class="text-xs text-base-content/70">
                        {{ file.size < 1024 * 1024 ? (file.size / 1024).toFixed(2) + ' KB' : (file.size / (1024 *
                          1024)).toFixed(2) + ' MB' }} </p>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div :class="[
          'flex justify-end mt-4 ',
          filemanager.getFiles().length > 1 ? 'col-start-4' : 'col-start-3'
        ]">
          <RouterLink :to="{ name: 'task' }">
            <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="emit('closed')">Close</button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>