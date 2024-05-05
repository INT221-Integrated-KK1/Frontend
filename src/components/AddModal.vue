<script setup>
import { ref } from "vue";
import { addItem } from "../libs/fetchUtils.js";
// import router from '@/router';

const title = ref("");
const description = ref(null);
const assignees = ref(null);
const status = ref("No Status");
const CreatedOn = ref(new Date().toISOString());
const UpdatedOn = ref(new Date().toISOString());

const emit = defineEmits(["taskAdded"]);
const AddTask = async () => {
  if (title.value.length === 0) {
    alert("Please fill in the title");
  } else {
    const newItem = {
      title: title.value,
      description: description.value,
      assignees: assignees.value,
      status: status.value,
      createdOn: CreatedOn.value,
      updatedOn: UpdatedOn.value,
    };

    try {
      const items = await addItem(import.meta.env.VITE_BASE_TASK_URL, newItem);
      console.log(items);
      // Emit the 'taskAdded' event with the items
      emit("taskAdded", items);
      console.log("Emitting taskAdded event:", items);

      title.value = "";
      description.value = "";
      assignees.value = "";
      status.value = "No Status";

      showModal.value = false;
    } catch (error) {
      console.log(`Error fetching data: ${error}`);
    }
  }
};

const showModal = ref(false);
</script>

<template>
  <button
    @click="showModal = true"
    class="itbkk-button-add right-3 bottom-3 p-4 px-6 text-lg fixed bg-green-500 text-white hover:bg-green-600 rounded-full"
  >
    +
  </button>

  <div v-if="showModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
      <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
        <div class="col-start-1 col-span-3">
          <h1 class="font-bold text-2xl py-2 mb-2">Add new task</h1>
          <h1 class="font-bold mt-2">Title : <span class="text-red-600">*</span></h1>
          <input
            class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 break-words"
            placeholder="Title name here"
            v-model.trim="title"
            required
          />
        </div>
        <hr class="col-start-1 col-span-3" />
        <div class="col-start-1 col-span-2">
          <h1 class="font-bold">Description :</h1>
          <textarea
            class="itbkk-description p-2 border-solid border-2 border-grey w-full h-[14rem] break-words"
            placeholder="Description here"
            v-model="description"
          />
        </div>
        <div class="col-start-3 col-span-1">
          <h1 class="font-bold">Assignees :</h1>
          <textarea
            class="itbkk-assignees p-2 border-solid border-2 border-grey w-full break-words"
            placeholder="Assignees here"
            v-model="assignees"
          />
          <h1 class="font-bold pt-3">Status :</h1>
          <select
            class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status"
            v-model="status"
          >
            <option value="No Status" selected>No Status</option>
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div class="flex justify-end mt-4 col-start-3">
          <router-link to="/task">
            <button
              class="btn bg-green-500 hover:bg-green-700 text-white mx-3"
              @click="AddTask"
              :disabled="title === '' || title === ' '"
            >
              Save
            </button>
          </router-link>
          <router-link to="/task">
            <button
              class="btn bg-red-500 hover:bg-red-700 text-white"
              @click="showModal = false"
            >
              Close
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
