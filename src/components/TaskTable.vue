<script setup>
import { ref, onMounted } from "vue";
import { getItems, getItemById, editItem } from "../libs/fetchUtils.js";
import { TaskManagement } from "../libs/TaskManagement.js";
import AddTaskModal from "./AddTaskModal.vue";
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
    setTimeout(() => {
      showNewTaskAdded.value = false;
    }, 3000);
    addedTasksTitle.value = addedTasks.title;
    taskmanager.value.addTask(addedTasks);
    todo.value = taskmanager.value.getTask();
  } else {
    showNewTaskError.value = true;
  }
};

//delete handler

async function showConfirmModals(task) {
  const items = await getItemById(import.meta.env.VITE_BASE_TASK_URL, task.id);
  console.log(task.id);
  showDeleteModal.value = true;
  console.log(items);
}

const handleClose = () => {
  showDeleteModal.value = false;
};

const handleTaskDeleted = (deletedid) => {
  taskmanager.value.deleteTask(deletedid);
  todo.value = taskmanager.value.getTask();
  showDeleteModal.value = false;
  showDeleted.value = true;
  setTimeout(() => {
    showDeleted.value = false;
  }, 3000);
};

const handleTaskDeletedNotfound = () => {
  console.log("Received task not found: ");
  showDeletedError.value = true;
  setTimeout(() => {
    showDeletedError.value = false;
  }, 3000);
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
  } else {
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
    description: getTaskProp.description,
    assignees: getTaskProp.assignees,
    status: {
      statusId: getTaskProp.status
    }
  };

  updatedTaskTitle.value = getTaskProp.title.trim();

  const existingTask = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);
  if (!existingTask) {
    closeEditModal();
    showUpdatedError.value = true;
    setTimeout(() => {
      showUpdatedError.value = false;
    }, 3000);
  } else {
    try {
      await editItem(import.meta.env.VITE_BASE_TASK_URL, id, editedTask);
      taskmanager.value.editTask(id, editedTask);

      closeEditModal();
      showUpdated.value = true;
      setTimeout(() => {
        showUpdated.value = false;
      }, 3000);
    }
    catch (error) {
      console.error("Error editing task:", error);
      showUpdatedError.value = true;
      setTimeout(() => {
        showUpdatedError.value = false;
      }, 3000);
    }
  }
}


// status handler

const getStatusClass = (status) => {
  switch (status) {
    case "No Status":
      return { class: "bg-gray-200 text-gray-800 rounded" };
    case "To Do":
      return { class: "bg-red-200 text-red-800 rounded" };
    case "Doing":
      return { class: "bg-yellow-200 text-yellow-800 rounded" };
    case "Done":
      return { class: "bg-green-200 text-green-800 rounded" };
    default:
      return { class: "bg-gray-200 text-gray-800 rounded" };
  }
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
        <p class="itbkk-message text-lg font-bold break-words">
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
        <p class="itbkk-message text-lg font-bold break-words">The task "{{ updatedTaskTitle }}" is updated successfully
        </p>
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

  <div class="flex justify-end mr-52 mt-5">
    <RouterLink :to="{ name: 'status' }">
      <div class="btn">Manage Status</div>
    </RouterLink>
  </div>

  <div class="overflow-x-auto flex justify-center">
    <table class="table w-3/4 mt-10 border-solid border-2 border-black">
      <thead>
        <tr class="bg-orange-200 border-solid border-2 border-black text-xl text-black">
          <th class="w-20"></th>
          <th class="font-bold">Title</th>
          <th class="font-bold">Assignees</th>
          <th class="font-bold">Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in taskmanager.getTask()" :key="index"
          class="itbkk-item h-16 border-solid border-2 border-black" v-if="todo">

          <th class="font-semibold text-center">{{ index + 1 }}</th>


          <td class="itbkk-title cursor-pointer ">
            <router-link :to="{ name: 'taskdetail', params: { id: task.id } }">
              {{ task.title }}
            </router-link>
          </td>


          <td class="itbkk-assignees" :class="task.assignees === null || task.assignees === '' ? EmptyStyle : ''">
            {{ task.assignees === null || task.assignees === "" ? "Unassigned" : task.assignees
            }}
          </td>

          <td class="itbkk-status " :class="getStatusClass(task.status.statusName).class">
            {{ task.status.statusName }}
          </td>

          <div class="flex justify-center">
            <router-link :to="{ name: 'editTaskModal', params: { id: task.id } }">
              <td class="itbkk-button-action" @click="editHandler(task.id)">
                <span class="itbkk-button-edit block  p-2 text-center">✏️</span>
              </td>
            </router-link>

            <router-link :to="{ name: 'deleteTask', params: { id: task.id } }">
              <td class="itbkk-button-action" @click="showConfirmModals(task)">
                <span class="itbkk-button-delete block p-2 text-center" :id="task.id">🗑️️</span>
              </td>
            </router-link>
          </div>
        </tr>
      </tbody>
    </table>
  </div>

  <Teleport to="body">
    <DeleteModal v-if="showDeleteModal == true" @close="handleClose" @taskDeleted="handleTaskDeleted"
      @taskNotfound="handleTaskDeletedNotfound" />
  </Teleport>
  <router-link :to="{ name: 'addtask' }">
    <AddTaskModal @taskAdded="handleTaskAdded" />
    <!-- <AddTaskModal  /> -->
  </router-link>
</template>



<style scoped></style>
