<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { getItems, getItemById, deleteItemById } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/stores/StatusManagement.js";
import DeleteIcons from "@/components/icons/DeleteIcons.vue";
import router from "@/router";

const emit = defineEmits(['close', 'taskEdited', 'filesAdded']);
const route = useRoute();


let boardId = null;
let taskId = null;


const statusmanager = ref(new StatusManagement());

const EmptyAssigneeText = "Unassigned";
const EmptyDescriptionText = "No Description Provided";

let task = reactive({
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

const files = ref([]);


onMounted(async () => {
  boardId = route.params.boardId;
  taskId = Number(route.params.taskId);
});

watch(
  () => [route.name, route.params.taskId],
  async ([newRouteName, newTaskId]) => {
    if (newRouteName === 'editTaskModal' && newTaskId) {
      await fetchTaskDetails(newTaskId);
    }
  },
  { immediate: true }
);


const handleFiles = async (event) => {
  const selectedFiles = Array.from(event.target.files || event.dataTransfer.files);
  files.value = [...files.value, ...selectedFiles].slice(0, 10);
  for (let i = 0; i < files.value.length; i++) {
    if (isImage(files.value[i])) {
      const fileName = decodeURIComponent(files.value[i].name);
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}api/attachment/${taskId}/${fileName}`, {
        method: "GET",
      });
      if (response.ok) {
        files.value[i].fileUrl = URL.createObjectURL(await response.blob());
      } else {
        files.value[i].fileUrl = null;
      }
    }
  }
};

async function removeFile(index) {
  // try {
    files.value.splice(index, 1);
    // const exist = await getItemById(`${import.meta.env.VITE_BASE_URL}api/attachment/${taskId}/${fileName}`);
    // if (exist) {
    //   await deleteItemById(`${import.meta.env.VITE_BASE_URL}api/attachment/${taskId}/${fileName}`);
    // }

  // } catch (error) {
  //   console.error("Error removing file:", error);
  // }
}


const isImage = (file) => file.type.startsWith("image/");
const getFilePreview = (file) => {
  return file.fileUrl || URL.createObjectURL(file);
};


async function fetchTaskDetails(id) {
  try {

    files.value = [];
    task.value = {
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
    };

    const attachmentItem = await getItems(`${import.meta.env.VITE_BASE_URL}api/attachment/task/${id}`);

    if (attachmentItem.data.length > 0) {
      attachmentItem.data.forEach((item) => {
        const file = new File([item.file], item.fileName, { type: item.fileType });
        files.value = [...files.value, file];
      });

      for (let i = 0; i < files.value.length; i++) {
        if (isImage(files.value[i])) {
          const fileName = decodeURIComponent(files.value[i].name);
          const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}api/attachment/${taskId}/${fileName}`, {
            method: "GET",
          });
          if (response.ok) {
            files.value[i].fileUrl = URL.createObjectURL(await response.blob());
          } else {
            files.value[i].fileUrl = null;
          }
        }
      }
    }



    const item = await getItemById(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`, id);

    if (!item) {
      emit("taskEdited", null, null);
    }

    const statusItem = await getItems(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`);
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
    emit("taskEdited", task, task.id);
  }
  if (files.value.length > 0) {
    emit("filesAdded", files.value, task.id);
  }
  router.push({ name: 'task', params: { boardId: route.params.boardId } });
};

const handleClose = () => {
  taskId = null;
  emit("close");

};

const handleDrop = (event) => {
  event.preventDefault();
  handleFiles(event);
};

const handleDragOver = (event) => {
  event.preventDefault();
};

const countOptionalCharacters = (text) => {
  return (text ?? "").trim().length;
};



</script>

<template>
  <div v-if="$route.name === 'editTaskModal'" class="itbkk-modal-task text-black fixed z-10 inset-0 overflow-y-auto">
    <form @submit.prevent="taskEdited">
      <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
        <div :class="[
          'bg-white p-6 rounded shadow-lg grid gap-3 grid-flow-row-dense grid-cols-3 w-1/2'
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
              class="itbkk-description placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full h-64 break-words"
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
            <span class="text-gray-500 text-sm"
              :class="{ 'text-red-500': countOptionalCharacters(task.assignees) > 30 }">
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

          <div class="col-start-1 col-span-3">

            <!-- File Drop Zone -->
            <div class="col-span-4">
              <h1 class="font-bold mb-4">File Drop and Upload:</h1>
              <div
                class="mb-4 text-center rounded-xl border-dashed border-2 border-gray-300 hover:border-sky-500 transition duration-300 ease-in-out transform hover:shadow-md"
                @dragover="handleDragOver" @drop="handleDrop">
                <label for="fileInput" class="p-8 cursor-pointer flex flex-col items-center space-y-2">
                  <svg class="w-7 h-7 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="m7 8l5-5l5 5m-5 7V3m10 12v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4" />
                  </svg>
                  <span class="text-gray-600">Drag and drop your files here</span>
                  <span class="text-gray-500 text-sm">(or click to select)</span>
                </label>
                <input type="file" accept="*" id="fileInput" class="hidden" multiple @change="handleFiles">
              </div>

              <!-- File Preview -->
              <div v-if="files.length > 0" class=" bg-slate-50 p-3 rounded-lg ">
                <div class="">
                  <h1 class="font-bold pb-2">Attachment Preview : </h1>
                  <ul class="flex overflow-x-auto">
                    <li v-for="(file, index) in files" :key="index"
                      class="flex items-center p-2 m-2 rounded-lg bg-sky-100 hover:bg-sky-200 shadow-sm  justify-between">
                      <a :href="file.fileUrl" target="_blank" >
                        <img v-if="isImage(file)" :src="file.fileUrl" alt="File Preview"
                          class="size-10 rounded-md shadow-md mr-8" />

                        <div v-else>
                          <svg xmlns="http://www.w3.org/2000/svg" class="size-10 mr-2" viewBox="0 0 24 24">
                            <path fill="#55a3d3"
                              d="M18 22a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zM13 4l5 5h-5zM7 8h3v2H7zm0 4h10v2H7zm0 4h10v2H7z" />
                          </svg>
                        </div>
                      </a>
                        <div class="pr-2">
                          <a :href="getFilePreview(file)">
                          </a>
                          <div :class="{ 'text-red-500': ((file.size / (1024 * 1024)).toFixed(2)) > 10.00 }">
                            <a :href="getFilePreview(file)" :download="file.name" target="_blank">
                              <p class=" text-ellipsis overflow-hidden text-warp ">
                                {{ file.name }}
                              </p>
                              <p class="text-xs text-base-content/70"
                                :class="{ 'text-red-500': ((file.size / (1024 * 1024)).toFixed(2)) > 10.00 }">
                                {{ file.size < 1024 * 1024 ? (file.size / 1024).toFixed(2) + ' KB' : (file.size / (1024
                                  * 1024)).toFixed(2) + ' MB' }} </p>
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



            </div>




            <div class="flex justify-end mt-4 col-start-3">
              <button type="submit" class="itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3"
                :disabled="!isFormModified || checkWhiteSpace(task.title)">
                Save
              </button>
              <router-link :to="{ name: 'task', params: { boardId: route.params.boardId } }">
                <button class="itbkk-button-cancel btn bg-red-500 hover:bg-red-700 text-white" @click="handleClose">
                  Close
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>