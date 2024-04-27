<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { getItemById, getItems } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";
const { params } = useRoute();

const url = "http://localhost:8080/v1/tasks";
const id = params.taskId;
console.log(id);

const task = ref(null);
const timezoneOffset = new Date().getTimezoneOffset() * 60000
console.log(task);



onMounted(async () => {
  try {
    task.value = await getItemById(url, id);
    console.log(task);

  } catch (error) {
    console.error("Error fetching task details:", error)
  }
});



const EmptyStyle = "italic text-slate-400";
const EmptyAssigneeText = "Unassigned";
const EmptyDescriptionText = "No Description Provided"

const getTaskProp = (propName) => computed(() => task.value ? task.value[propName] : "");
const taskId = getTaskProp('taskId');
const taskTitle = getTaskProp('taskTitle');
const taskDescription = getTaskProp('taskDescription');
const taskAssignees = getTaskProp('taskAssignees');
const taskStatus = getTaskProp('taskStatus');
const createdOn = computed(() => formatToLocalTime(task.value?.createdOn))
const updatedOn = computed(() => formatToLocalTime(task.value?.updatedOn))

const isValidTaskId = () => {
  return id === taskId;
};

if (isValidTaskId() === false) {
  window.alert('Invalid taskId: ' + id + '    taskId: ' + taskId);
  window.history.back();
}

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formatToLocalTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString)
  const localTime = new Date(dateTime - timezoneOffset)
  //return localTime.toLocaleString()
  const localDate = new Date(dateTime.getTime() - timezoneOffset);
  return localDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Use 24-hour time format
  });
};

</script>

<template>

  <div class="text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
        <div class="col-start-1 col-span-3">
          <h1 class="font-bold">Title :</h1>
          <input class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3" v-model="taskTitle" />
        </div>
        <hr class="col-start-1 col-span-3" />
        <div class="col-start-1 col-span-2">
          <h1 class="font-bold">Description :</h1>
          <textarea
            class="itbkk-description placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full"
            rows="10" :class="taskDescription === null ? EmptyStyle : ''" :value="taskDescription === null ? EmptyDescriptionText : taskDescription
            ">
          </textarea>
        </div>
        <div class="col-start-3 col-span-1">
          <h1 class="font-bold">Assignees :</h1>
          <textarea rows="2"
            class="placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full itbkk-assignees"
            :class="taskAssignees === null ? EmptyStyle : ''"
            :value="taskAssignees === null ? EmptyAssigneeText : taskAssignees">
          </textarea>
          <h1 class="font-bold">Status :</h1>
          <select class="p-2 border-solid border-2 border-grey w-full mb-10 itbkk-status" v-model="taskStatus">
            <option value="No Status">No Status</option>
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
          <h1 class="font-bold itbkk-timezone">Timezone : {{ timezone }}</h1>
          <h1 class="font-bold itbkk-created-on">Created On: {{ createdOn }}</h1>
          <h1 class="font-bold itbkk-updated-on">Updated On: {{ updatedOn }}</h1>
        </div>
        <div class="flex justify-end mt-4 col-start-3">
          <RouterLink :to="{ name: 'task' }">
            <button @click="$emit('closeModal', false)" class="btn bg-red-500 hover:bg-red-700 text-white btn">
              Close
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>