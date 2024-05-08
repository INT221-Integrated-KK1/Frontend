<script setup>
import { ref, onMounted } from "vue";
import { getItems, getItemById, editItem } from "../libs/fetchUtils.js";
import { TaskManagement } from "../libs/TaskManagement.js";
import AddModal from "./AddModal.vue";
import EditTaskModal from "./EditTaskModal.vue";
import DeleteModal from "./DeleteModal.vue";


const taskmanager = ref(new TaskManagement());
const todo = ref([]);
const taskDetails = ref({});
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const addedTasksTitle = ref("");
const showNewTaskAdded = ref(false);
const showNewTaskError = ref(false);
const showDeleted = ref(false);
const showDeletedError = ref(false);
const showUpdated = ref(false);
const updatedTaskTitle = ref("");
const showUpdatedError = ref(false);
const EmptyStyle = "italic text-slate-400 font-semibold";

onMounted(async () => {
  const items = await getItems(import.meta.env.VITE_BASE_TASK_URL);
  todo.value = items;
  taskmanager.value.setTasks(items);
  console.log("Received tasks:", items);
});

// add handler

const handleTaskAdded = (addedTasks) => {
  if (addedTasks.id !== 0) {
    showNewTaskAdded.value = true;
    addedTasksTitle.value = addedTasks.title;
    taskmanager.value.addTask(addedTasks);
    todo.value = taskmanager.getTask();
  } else {
    showNewTaskError.value = true;
  }
};

//delete handler

const showConfirmModals = () => {
  showDeleteModal.value = true;
}

const closeConfirmModals = () => {
  showDeleteModal.value = false;
};

const handleTaskDeleted = (deletedid) => {
  taskmanager.value.deleteTask(deletedid);
  todo.value = taskmanager.value.getTask();
  showDeleteModal.value = false;
  showDeleted.value = true;
};

const handleTaskDeletedNotfound = () => {
  showDeletedError.value = true;
};


// edit handler

const closeEditModal = () => {
  showEditModal.value = false;
};

async function editHandler(id) {
  const items = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);
  if (items !== null || undefined) {
    taskDetails.value = items;
    showEditModal.value = true;
    console.log(items);
  }else{
    showUpdatedError.value = true;
  }
}

function yohooHandler(obj) {
  const task = taskmanager.value.getTaskById();
  task.title = obj.title;
  task.description = obj.description;
  task.assignees = obj.assignees;
  task.status = obj.status;
  task.createOn = obj.createOn;
  task.updatedOn = obj.updatedOn;
}

const saveChanges = async (getTaskProp, id) => {
  const editedTask = {
    id: id,
    title: getTaskProp.title.trim(),
    description: getTaskProp.description.trim(),
    assignees: getTaskProp.assignees,
    status: getTaskProp.status,
  };
  updatedTaskTitle.value = getTaskProp.title.trim();
  try {
    const response = await editItem(import.meta.env.VITE_BASE_TASK_URL, id, editedTask);
    console.log("Response:", response);
    taskmanager.value.editTask(id, editedTask);

    closeModal();
    if (response.status === 200) {
      console.log("Task updated successfully");
      showUpdated.value = true;
    } else {
      showUpdatedError.value = true;
      console.log("Task not updated");
    }


  } catch (error) {    
      // Other error
      console.error("Error editing task:", error);
      showUpdatedError.value = true;  
  }
};

// status handler

const getStatusClass = (status) => {
  switch (status) {
    case "NO_STATUS":
      return { class: "bg-gray-200 text-gray-800 rounded", label: formatStatus(status) };
    case "TO_DO":
      return { class: "bg-red-200 text-red-800 rounded", label: formatStatus(status) };
    case "DOING":
      return { class: "bg-yellow-200 text-yellow-800 rounded", label: formatStatus(status) };
    case "DONE":
      return { class: "bg-green-200 text-green-800 rounded", label: formatStatus(status) };
    default:
      return { class: "bg-gray-200 text-gray-800 rounded", label: formatStatus(status) };
  }
};

const formatStatus = (status) => {
  const parts = status.split("_");
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].slice(1).toLowerCase();
  }

  return parts.join(" ");
};

</script>

<template>
  <!-- add task alert -->
  <div class="flex justify-center items-center">
    <div v-if="showNewTaskAdded" class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
      <div class="p-4">
        <div class="flex justify-between mb-3">
          <h1 class="text-2xl font-bold">Success</h1>
          <button @click="showNewTaskAdded = false" class="px-4 py-2rounded">✖</button>
        </div>
        <p class="itbkk-message text-lg font-bold">
          The task "{{ addedTasksTitle }}" is added successfully
        </p>
      </div>
    </div>
  </div>

  <div class="flex justify-center items-center">
    <div v-if="showNewTaskError" class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
      <div class="p-4">
        <div class="flex justify-between mb-3">
          <h1 class="text-2xl font-bold">Error</h1>
          <button @click="showNewTaskError = false" class="px-4 py-2rounded">✖</button>
        </div>
        <p class="itbkk-message text-lg font-bold">
          An error occurred adding the new task
        </p>
      </div>
    </div>
  </div>

  <!-- delete task alert -->
  <div class="flex justify-center items-center">
    <div v-if="showDeleted" class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
      <div class="p-4">
        <div class="flex justify-between mb-3">
          <h1 class="text-2xl font-bold">Success</h1>
          <button @click="showDeleted = false" class="px-4 py-2rounded">✖</button>
        </div>
        <p class="itbkk-message text-lg font-bold">The task has been deleted</p>
      </div>
    </div>
  </div>

  <div class="flex justify-center items-center">
    <div v-if="showDeletedError" class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
      <div class="p-4">
        <div class="flex justify-between mb-3">
          <h1 class="text-2xl font-bold">Error</h1>
          <button @click="showDeletedError = false" class="px-4 py-2rounded">✖</button>
        </div>
        <p class="itbkk-message text-lg font-bold">
          An error occurred, the task does not exist
        </p>
      </div>
    </div>
  </div>


  <!-- edit task alert -->

  <div v-if="showUpdated" class="flex justify-center items-center">
    <div class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
      <div class="p-4">
        <div class="flex justify-between mb-3">
          <h1 class="text-2xl font-bold">Success</h1>
          <button @click="showUpdated = false" class="px-4 py-2rounded">✖</button>
        </div>
        <p class="itbkk-message text-lg font-bold">The task "{{ updatedTaskTitle }}" is updated successfully</p>
      </div>
    </div>
  </div>

  <div v-if="showUpdatedError" class="flex justify-center items-center">
    <div class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
      <div class="p-4">
        <div class="flex justify-between mb-3">
          <h1 class="text-2xl font-bold">Error</h1>
          <button @click="showUpdatedError = false" class="px-4 py-2 rounded">✖</button>
        </div>
        <p class="itbkk-message text-lg font-bold">
          An error has occurred, the task does not exist
        </p>
      </div>
    </div>
  </div>



  <Teleport to="body">
    <EditTaskModal v-if="showEditModal" @close="closeEditModal" :taskDetailsza="taskDetails" @yohoo="yohooHandler"
      @saveChanges="saveChanges" />
  </Teleport>

  <div class="flex justify-center items-center">
    <table class="overflow-x-auto mt-10 table w-3/4 border-collapse border-hidden rounded-3xl text-md">
      <thead class="text-xl text-black border-slate-600 bg-orange-200">
        <tr class="">
          <th class="w-[20px]"></th>
          <th class="font-bold">Title</th>
          <th class="font-bold">Assignees</th>
          <th class="font-bold">Status</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in taskmanager.getTask()" :key="index"
          class="itbkk-item border-slate-600 borderrounded-e-2xl bg-yellow-50" v-if="todo">
          <th class="font-semibold text-center">{{ index + 1 }}</th>
          <router-link :to="{ name: 'taskdetail', params: { id: task.id } }">
            <td style="cursor: pointer; word-break" class="itbkk-title">
              {{ task.title }}
            </td>
          </router-link>
          <td class="itbkk-assignees" :class="task.assignees === null || task.assignees === '' ? EmptyStyle : ''">
            {{
            task.assignees === null || task.assignees === ""
            ? "Unassigned"
            : task.assignees
            }}
          </td>

          <td :class="getStatusClass(task.status).class" class="itbkk-status text-center">
            {{ getStatusClass(task.status).label }}
          </td>
          <td class="itbkk-button-action">
            <router-link :to="{ name: 'editTaskModal', params: { id: task.id } }">
              <span class="itbkk-button-edit block w-[10px] p-2 text-center" @click="editHandler(task.id)">✏️</span>
            </router-link>
          </td>
          <td>
            <router-link :to="{ name: 'deleteTask', params: { id: task.id } }">
              <span class="itbkk-button-delete block w-[10px] p-2 text-center" @click="showConfirmModals"
                :id="task.id">🗑️️</span>

            </router-link>
          </td>

        </tr>
      </tbody>
    </table>
  </div>

  <Teleport to="body">
    <DeleteModal v-if="showDeleteModal == true" @close="closeConfirmModals" @taskDeleted="handleTaskDeleted"
      @taskNotfound="handleTaskDeletedNotfound" />
  </Teleport>
  <router-link :to="{ name: 'addtask' }">
    <AddModal @taskAdded="handleTaskAdded" />
    <!-- <AddModal  /> -->
  </router-link>
</template>



<style scoped></style>
