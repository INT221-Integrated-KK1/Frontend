<script setup>
import { ref, onMounted, computed } from "vue";
import { getItemById, getItems } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/libs/StatusManagement.js";
import NotFound from "@/views/NotFound.vue";
import router from "@/router/index.js";

const emit = defineEmits(['closed'])
const props = defineProps({
  id: Number
});

const task = ref(null);
const statusmanager = ref(new StatusManagement());
const route = useRoute();
const { params } = useRoute();
const routeId = ref(null);

if (props.id === undefined) {
  routeId.value = params.taskId;
}
const boardId = params.boardId;
const taskId = ref(props.id || routeId);

const taskUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`;
const statusUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`;
const notOwner = ref(false);
onMounted(async () => {
  try {
    const item = await getItemById(taskUrl, taskId.value);
    task.value = item;
    const statusItem = await getItems(statusUrl);
    statusmanager.value.setStatuses(statusItem)
    
    item.owner.name === localStorage.getItem('username') ? notOwner.value = false : notOwner.value = true;
    // if (notOwner.value === true) {
    //   window.alert('Access denied, you do not have permission to view this page.');
    //   router.go(-1);
    // }
  } catch (error) {
    console.error("Error fetching task details:", error);
  }
});

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

// const timezoneOffset = new Date().getTimezoneOffset() * 60000;
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const formatToLocalTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  // const localTime = new Date(dateTime - timezoneOffset);
  //return localTime.toLocaleString()
  const localDate = new Date(dateTime.getTime());
  return localDate.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour time format
  });
};

</script>

<template>
  <div  class="text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
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
        <div class="flex justify-end mt-4 col-start-3">
          <RouterLink :to="{ name: 'task' }">
            <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="emit('closed')">Close</button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
  <NotFound v-if="task === undefined" />
</template>

<style scoped></style>