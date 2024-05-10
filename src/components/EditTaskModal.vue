<script setup>
import { ref, onMounted, computed, reactive, defineEmits } from "vue";
import { getItemById, editItem } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";
import router from "@/router";

const emit = defineEmits('yohoo', 'close', 'saveChanges');
const { params } = useRoute();
const id = Number(params.id);
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
  status: props.status,
  createdOn: props.createdOn,
  updatedOn: props.updatedOn
});
const initialTask = JSON.stringify(taskProp);
const timezoneOffset = new Date().getTimezoneOffset() * 60000
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
  } catch (error) {
    console.error("Error fetching task details:", error)
  }
});

const saveChanges = async () => {
  if (isFormModified.value) {
    const editedTask = {
      id: id,
      title: taskProp.title.trim(),
      description: taskProp.description.trim(),
      assignees: taskProp.assignees,
      status: taskProp.status,
    };

    const fetching = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);

    if (fetching === undefined) {
      await editItem(import.meta.env.VITE_BASE_TASK_URL, id, editedTask);
      emit('saveChanges', taskProp, undefined);
      console.log(fetching);
    } else {
      router.push({ name: 'task' });
      emit('saveChanges', taskProp, id);
      console.log(fetching)
    }

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
          <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status" v-model="taskProp.status">
            <option value="NO STATUS">No Status</option>
            <option value="TO DO">To Do</option>
            <option value="DOING">Doing</option>
            <option value="DONE">Done</option>
          </select>
          <h1 class="font-bold itbkk-timezone">Timezone : {{ timezone }}</h1>
          <h1 class="font-bold itbkk-created-on">Created On: {{ formatToLocalTime(taskProp.createdOn) }}</h1>
          <h1 class="font-bold itbkk-updated-on">Updated On: {{ formatToLocalTime(taskProp.updatedOn) }}</h1>
        </div>
        <div class="flex justify-end mt-4 col-start-3">
          <RouterLink to="/task">
            <button class="btn bg-green-500 hover:bg-green-700 text-white mx-3" @click="saveChanges"
              :disabled="!isFormModified">
              Save
            </button>
          </RouterLink>
          <RouterLink to="/task">
            <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="$emit('close')">
              Close
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped></style>