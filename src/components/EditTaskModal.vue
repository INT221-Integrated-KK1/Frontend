<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { getItemById, getItems } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/libs/StatusManagement.js";

const emit = defineEmits( 'close', 'saveChanges','status-updated');
const { params } = useRoute();
const id = Number(params.id);
const statusmanager = ref(new StatusManagement());
const task = ref(null);
const isLoaded = ref(false);
const props1 = defineProps({
  taskDetailsza: Object
});
const EmptyStyle = "italic text-slate-400";
const EmptyAssigneeText = "Unassigned";
const EmptyDescriptionText = "No Description Provided";
const props = reactive(props1.taskDetailsza);
const taskProp = reactive({
  title: props.title,
  description: props.description,
  assignees: props.assignees,
  status: {
    id: props.status.id,
    name: props.status.name,
    description: props.status.description
  },
  createdOn: props.createdOn,
  updatedOn: props.updatedOn
});

console.log("taskProp", taskProp.status.id);


const initialTask = JSON.stringify(taskProp);
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
    hour12: false // Use 24-hour time format
  });
};
const isFormModified = computed(() => JSON.stringify(taskProp) !== initialTask);


onMounted(async () => {
  try {
    task.value = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);
    isLoaded.value = true;
    const items = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
    statusmanager.value.setStatuses(items);
  } catch (error) {
    console.error("Error fetching task details:", error)
  }
});

const saveChanges = () => {
  if (isFormModified.value) {
    emit('saveChanges', taskProp, id);
    console.log("taskProp", taskProp);
  }
}

</script>

<template>
  <div v-if="isLoaded" class="text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
        <div class=" col-start-1 col-span-3">
          <h1 class="font-bold text-2xl py-2 mb-2">Edit Task </h1>
          <h1 class="font-bold mt-2">Title :</h1>
          <input class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 break-words"
            v-model="taskProp.title">
          </input>
        </div>
        <hr class="col-start-1 col-span-3" />
        <div class="col-start-1 col-span-2">
          <h1 class="font-bold">Description :</h1>
          <textarea
            class="itbkk-description placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full h-[14rem] break-words "
            :class="{ EmptyStyle: taskProp.description === '' }" v-model="taskProp.description"
            :placeholder="EmptyDescriptionText"></textarea>
        </div>
        <div class="col-start-3 col-span-1">
          <h1 class="font-bold">Assignees :</h1>
          <textarea
            class="itbkk-assignees placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full  break-words"
            :class="{ EmptyStyle: taskProp.assignees === '' }" v-model="taskProp.assignees"
            :placeholder="EmptyAssigneeText"></textarea>
          <h1 class="font-bold pt-3">Status :</h1>
          <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status"
            v-model="taskProp.status.id">
            <option v-for="(status, index) in statusmanager.getStatus()" :key="index" :value="status.id">
              {{ status.statusName }}
            </option>
          </select>
          <h1 class="font-bold itbkk-timezone">Timezone : {{ timezone }}</h1>
          <h1 class="font-bold itbkk-created-on">Created On: {{ formatToLocalTime(taskProp.createdOn) }}</h1>
          <h1 class="font-bold itbkk-updated-on">Updated On: {{ formatToLocalTime(taskProp.updatedOn) }}</h1>
        </div>
        <div class="flex justify-end mt-4 col-start-3">
          <router-link to="/task">
            <button class="btn bg-green-500 hover:bg-green-700 text-white mx-3" @click="saveChanges"
              :disabled="!isFormModified">
              Save
            </button>
          </router-link>
          <router-link to="/task">
            <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="$emit('close')">
              Close
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped></style>