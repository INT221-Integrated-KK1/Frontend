<script setup>
import { onMounted, ref } from "vue";
import { getItems, addItem } from "../libs/fetchUtils.js";
import { StatusManagement } from "@/libs/StatusManagement";

const title = ref("");
const description = ref("");
const assignees = ref("");
const status = ref(1);

const showModal = ref(false);
const disabled = "itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3 disabled";

const statusmanager = ref(new StatusManagement());

const emit = defineEmits(["taskAdded"]);
const checkWhiteSpace = (title) => {
  return /^\s*$/.test(title);
};

const AddTask = async () => {
  const trimTitle = ref(title.value.trim());
  const trimDescription = ref(description.value.trim());

  const newItem = {
    title: trimTitle.value,
    description: trimDescription.value,
    assignees: assignees.value,
    status: status.value
  };
  const checkinput = ref(0);

  if (trimTitle.value.length > 100) {
    alert("Title cannot contain more than 100 characters");
    checkinput.value += 1;
    title.value = "";
    description.value = "";
    assignees.value = "";
    status.value = 1;
    emit("taskAdded", null);
    showModal.value = false;
  } else if (trimDescription.value.length > 500) {
    alert("Description cannot contain more than 500 characters");
    checkinput.value += 1;
    title.value = "";
    description.value = "";
    assignees.value = "";
    status.value = 1;
    emit("taskAdded", null);
    showModal.value = false;
  } else if (assignees.value.length > 30) {
    alert("Assignees cannot contain more than 30 characters");
    checkinput.value += 1;
    title.value = "";
    description.value = "";
    assignees.value = "";
    status.value = 1;
    emit("taskAdded", null);
    showModal.value = false;
  } else {

    try {
      const items = await addItem(import.meta.env.VITE_BASE_TASK_URL, newItem);
      title.value = "";
      description.value = "";
      assignees.value = "";
      status.value = 1;
      showModal.value = false;
      if (checkinput.value === 0) {
        emit("taskAdded", items);
      } else {
        emit("taskAdded", null);
      }
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }

  }
};

onMounted(async () => {
  try {
    const items = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
    statusmanager.value.setStatuses(items);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
});


</script>

<template>
  <button @click="showModal = true"
    class="itbkk-button-add right-3 bottom-3 p-4 px-6 text-lg fixed bg-green-500 text-white hover:bg-green-600 rounded-full">
    +
  </button>

  <div v-if="$route.name === 'addtask' || showModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
        <div class="col-start-1 col-span-3">
          <h1 class="font-bold text-2xl py-2 mb-2">Add new task</h1>
          <h1 class="font-bold mt-2">Title : <span class="none text-red-600"
              :class="{ 'hidden': title.trim().length > 0 }">*</span></h1>
          <input class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 break-words"
            placeholder="Title name here" v-model="title" required />
          <span class="text-gray-500 text-sm"
            :class="{ 'text-red-500': title.trim().length > 100 || title.trim().length === 0 }">{{ title.trim().length
            }} / 100 characters</span>
        </div>
        <hr class="col-start-1 col-span-3" />
        <div class="col-start-1 col-span-2">
          <h1 class="font-bold">Description :</h1>
          <textarea class="itbkk-description p-2 border-solid border-2 border-grey w-full h-[14rem] break-words"
            placeholder="Description here" v-model="description" />
          <span class="text-gray-500 text-sm" :class="{ 'text-red-500': description.trim().length > 500}">{{
            description.trim().length }} / 500 characters</span>
        </div>
        <div class="col-start-3 col-span-1">
          <h1 class="font-bold">Assignees :</h1>
          <textarea class="itbkk-assignees p-2 border-solid border-2 border-grey w-full break-words"
            placeholder="Assignees here" v-model.trim="assignees" />
          <span class="text-gray-500 text-sm" :class="{ 'text-red-500': assignees.trim().length > 30 }">{{
            assignees.trim().length }} / 30 characters</span>
          <h1 class="font-bold pt-3">Status :</h1>

          <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status" v-model="status">
            <option v-for="(status, index) in statusmanager.getStatus()" :key="index" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>
        <div class="flex justify-end mt-4 col-start-3">
          <router-link to="/task">
            <button @click="AddTask"
              :class="title === '' || title === ' ' ? disabled : 'itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3 '"
              :disabled="checkWhiteSpace(title)">
              Save
            </button>
          </router-link>
          <router-link to="/task">
            <button class="itbkk-button-cancel btn bg-red-500 hover:bg-red-700 text-white" @click="showModal = false">
              Cancel
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>