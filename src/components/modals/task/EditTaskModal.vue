<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { getItems, getItemById ,getFileImage } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/stores/StatusManagement.js";
import DeleteIcons from "@/components/icons/DeleteIcons.vue";
import router from "@/router";

const emit = defineEmits(['close', 'taskEdited', 'filesAdded']);
const route = useRoute();

let boardId = null;

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
const removeFiles = ref([]);
const addFiles = ref([]);

const initialTask = ref("");
const initialFiles = ref([]);

// ---------------------- File Handle ----------------------

const handleFiles = async (event) => {
  const selectedFiles = Array.from(event.target.files || event.dataTransfer.files);
  for (let i = 0; i < selectedFiles.length; i++) {
    selectedFiles[i].fileUrl = URL.createObjectURL(selectedFiles[i] || selectedFiles[i].fileUrl);
  }
  files.value = [...files.value, ...selectedFiles];
  addFiles.value = [...selectedFiles];
};



function removeFile(index) {
  if (addFiles.value.includes(files.value[index])) {
    addFiles.value.splice(addFiles.value.indexOf(files.value[index]), 1);
  } else {
    removeFiles.value.push(files.value[index]);
  }
  files.value.splice(index, 1);
}

const MAX_FILE_SIZE_MB = 20;

const invalidFiles = computed(() => {
  const fileNames = [];
  const duplicateNames = [];
  const oversizedFiles = [];
  const errors = [];

  for (const file of files.value) {
    if (files.value.length > 10) {
      errors.push("Maximum of 10 files can be uploaded at a time.");
      break;
    }
    if (file.size > 20 * 1024 * 1024) {
      oversizedFiles.push(file.name);
    }
    if (fileNames.includes(file.name)) {
      if (!duplicateNames.includes(file.name)) {
        duplicateNames.push(file.name);
      }
    } else {
      fileNames.push(file.name);
    }
  }

  if (oversizedFiles.length > 0) {
    errors.push(
      `Each file cannot be larger than ${MAX_FILE_SIZE_MB}MB. The following files are not added: ${oversizedFiles.join(", ")}`
    );
  }
  if (duplicateNames.length > 0) {
    errors.push(
      `Files with the same filename cannot be added or updated. Please delete the duplicate and add again to update. Duplicate file names: ${duplicateNames.join(", ")}`
    );
  }

  return errors;
});


const isHasInvalidFiles = computed(() => {
  return invalidFiles.value.length > 0 
});


const isImage = (file) => {
  if (file.type) {
    return file.type.includes("image/");
  } else if (file.fileType) {
    return file.fileType.includes("image/")
  } else {
    return false;
  }
};

async function getFilePreview(file, id) {
  try {
    for (let i = 0; i < file.value.length; i++) {
      file.value[i].fileUrl = null;
      let fileName = decodeURIComponent(file.value[i].name);

      const response = await getFileImage(`${import.meta.env.VITE_BASE_URL}api/attachment`, id, fileName)
      file.value[i].fileUrl = URL.createObjectURL(response);
    }
  } catch (error) {
    console.error("Error fetching file preview:", error);
    file.value = [];
  }
}

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

function downloadFile(file) {
  const link = document.createElement("a");
  link.href = file.fileUrl;
  link.download = file.name || "download";
  console.log(link);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------------------- Fetch Handle ----------------------

onMounted(async () => {
  boardId = route.params.boardId;
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
        files.value.push(
          {
            name: item.fileName,
            type: item.fileType,
            fileUrl: item.fileUrl,
          }
        );
      });

      await getFilePreview(files, id);
    }

    initialFiles.value = files.value.map((file) => ({ name: file.name, size: file.size, type: file.type }));

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
    task.attachmentItem = attachmentItem.data;

    initialTask.value = JSON.stringify(task);
  } catch (error) {
    console.error("Error fetching task details:", error);
  }
}

const checkWhiteSpace = (title) => {
  return /^\s*$/.test(title);
};

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
  const isTaskModified = JSON.stringify(task) !== initialTask.value;
  const areFilesModified = files.value.length !== initialFiles.value.length;
  return isTaskModified || areFilesModified || removeFiles.value.length > 0;
});


// ---------------------- Task Handle ----------------------

const taskEdited = () => {
  if (isFormModified.value) {
    emit("taskEdited", task, task.id);

    if (files.value.length !== initialFiles.value.length || removeFiles.value.length > 0) {
      emit("filesAdded", addFiles.value, task.id, removeFiles.value);
      removeFiles.value = [];
    }
  }
  router.push({ name: 'task', params: { boardId: route.params.boardId } });
};


const handleClose = () => {
  removeFiles.value = [];
  files.value = [];
  emit("close");
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
              <div v-if="files.length > 0" class="bg-slate-50 p-3 rounded-lg">
                <h1 class="font-bold pb-2">Attachment Preview</h1>
                <div class="flex flex-wrap gap-4">
                  <div v-for="(file, index) in files" :key="index"
                    class="flex flex-col items-center justify-between bg-sky-50 p-3 rounded-lg shadow hover:shadow-md transition-shadow duration-200 w-36">

                    <!-- File Preview -->
                    <a :href="file.fileUrl" target="_blank"
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
                        <p class="text-sm font-medium">{{ file.name }}</p>
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
                        <button @click.prevent="removeFile(index)" class="mt-2  w-8 h-8  rounded-full bg-sky-100 "
                          aria-label="Remove File">
                          <DeleteIcons />
                        </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>


            <div v-if="invalidFiles.length > 0" class="text-red-500 mb-4 col-start-1">
              <p v-for="(error, index) in invalidFiles" :key="index">{{ error }}</p>
            </div>

            <div class="flex justify-end mt-4 col-start-3">
              <button type="submit" class="itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3"
                :disabled="!isFormModified || checkWhiteSpace(task.title) || isHasInvalidFiles">
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