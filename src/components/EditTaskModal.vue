<script setup>
import { ref, onMounted, computed, reactive, watch } from "vue";
import { getItemById, editItem } from "../libs/fetchUtils.js";
import { useRoute, useRouter } from "vue-router";
const { params } = useRoute();
const emit = defineEmits('yohoo', 'close', 'saveChanges')



const id = Number(params.id);


const task = ref(null);
const isLoaded = ref(false);
const timezoneOffset = new Date().getTimezoneOffset() * 60000

const props1 = defineProps({
  taskDetailsza: Object
});

onMounted(async () => {
  try {
    task.value = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);
    isLoaded.value = true;

  } catch (error) {
    console.error("Error fetching task details:", error)
  }
});

const EmptyStyle = "italic text-slate-400";
const EmptyAssigneeText = "Unassigned";
const EmptyDescriptionText = "No Description Provided"
const props = reactive(props1.taskDetailsza);
console.log(props1.taskDetailsza);



const getTaskProp = computed(() => {
  return {
    title: props.title,
    description: props.description,
    assignees: props.assignees,
    status: props.status,
    createdOn: props.createdOn,
    updatedOn: props.updatedOn
  }
});



// const id = reactive(getTaskProp('id'));
// const title = reactive(getTaskProp('title'));
// const taskDescription = reactive(getTaskProp('taskDescription'));
// const assignees = reactive(getTaskProp('assignees'));
// const taskStatus = reactive(getTaskProp('taskStatus'));
// const createdOn = computed(() => formatToLocalTime(task.value?.createdOn))
// const updatedOn = computed(() => formatToLocalTime(task.value?.updatedOn))


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


</script>

<template>

  <div v-if="isLoaded" class="text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
        <div class=" col-start-1 col-span-3">
          <h1 class="font-bold text-2xl py-2 mb-2">Edit Task </h1>
          <h1 class="font-bold mt-2">Title :</h1>
          <input class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 break-words"
            v-model="getTaskProp.title">
          </input>
        </div>
        <hr class="col-start-1 col-span-3" />
        <div class="col-start-1 col-span-2">
          <h1 class="font-bold">Description :</h1>
          <textarea
            class="itbkk-description placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full h-[14rem] break-words "
            :class="{ EmptyStyle: getTaskProp.description === '' }" v-model="getTaskProp.description"
            :placeholder="EmptyDescriptionText" />
        </div>
        <div class="col-start-3 col-span-1">
          <h1 class="font-bold">Assignees :</h1>
          <textarea
            class="itbkk-assignees placeholder:italic placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full  break-words"
            :class="{ EmptyStyle: getTaskProp.assignees === ''}" v-model="getTaskProp.assignees"
            :placeholder="EmptyAssigneeText" />
          <h1 class="font-bold pt-3">Status :</h1>
          <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status"
            v-model="getTaskProp.status">
            <option value="NO_STATUS">NO_STATUS</option>
            <option value="TO_DO">TO_DO</option>
            <option value="DOING">DOING</option>
            <option value="DONE">DONE</option>
          </select>
          <h1 class="font-bold itbkk-timezone">Timezone : {{ timezone }}</h1>
          <h1 class="font-bold itbkk-created-on">Created On: {{ formatToLocalTime(getTaskProp.createdOn) }}</h1>
          <h1 class="font-bold itbkk-updated-on">Updated On: {{ formatToLocalTime(getTaskProp.updatedOn) }}</h1>
        </div>
        <div class="flex justify-end mt-4 col-start-3">
          <button class="btn bg-green-500 hover:bg-green-700 text-white mx-3"
            @click="$emit('saveChanges', getTaskProp, id)">
            Save
          </button>
          <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="$emit('close')">
            Close
          </button>

        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>