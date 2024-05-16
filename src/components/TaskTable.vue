<script setup>
import { ref, onMounted } from "vue";
import { getItems, getItemById, editItem, addItem } from "../libs/fetchUtils.js";
import { TaskManagement } from "../libs/TaskManagement.js";
import { StatusManagement } from "../libs/StatusManagement.js";
import AddTaskModal from "./AddTaskModal.vue";
import EditTaskModal from "./EditTaskModal.vue";
import DeleteModal from "./DeleteModal.vue";
import TaskDetail from "./TaskDetail.vue";


const taskmanager = ref(new TaskManagement());
const statusmanager = ref(new StatusManagement());
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

async function handleTaskAdded(addedTasks) {
  if (addedTasks !== undefined || addedTasks !== null) {
    addedTasksTitle.value = addedTasks.title;
    taskmanager.value.addTask({ ...addedTasks });
    todo.value = taskmanager.value.getTask();
    showNewTaskAdded.value = true;
    setTimeout(() => {
      showNewTaskAdded.value = false;
    }, 3000);
  } else {
    showNewTaskError.value = true;
    setTimeout(() => {
      showNewTaskError.value = false;
    }, 3000);
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
  if (items !== undefined) {
    taskDetails.value = items;
    showEditModal.value = true;
    console.log(items);
  } else {
    showUpdatedError.value = true;
  }
}

const saveChanges = async (getTaskProp, id) => {
  const editedTask = {
    id: id,
    title: getTaskProp.title,
    description: getTaskProp.description,
    assignees: getTaskProp.assignees,
    status: {
      id: getTaskProp.status.id,
      name: getTaskProp.status.name,
      description: getTaskProp.status.description
    }
  };
  console.log("Edited task:", editedTask.status.id);

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
      const item = await editItem(import.meta.env.VITE_BASE_TASK_URL, id, editedTask);
      taskmanager.value.editTask(id, { ...editedTask });
      console.log({ ...editedTask });

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


// sort handler

const showDefaultSort = ref(true);
const showAscSort = ref(false);
const showDescSort = ref(false);
const sortType = ref("asc");

function handleSort() {
  const currentSortType = sortType.value;
  if (currentSortType === "asc") {
    console.log("Sorting tasks ascending");
    todo.value = taskmanager.value.sortTask("asc");
    sortType.value = "desc";
    showDefaultSort.value = false;
    showAscSort.value = true;
    showDescSort.value = false;
  } else if (currentSortType === "desc") {
    console.log("Sorting tasks descending");
    todo.value = taskmanager.value.sortTask("desc");
    sortType.value = "default";
    showDefaultSort.value = false;
    showAscSort.value = false;
    showDescSort.value = true;
  } else {
    console.log("Default:", sortType.value);
    todo.value = taskmanager.value.sortTask("default");
    sortType.value = "asc";
    showDefaultSort.value = true;
    showAscSort.value = false;
    showDescSort.value = false;
  }
}

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
    <EditTaskModal v-if="showEditModal" @close="closeEditModal" :taskDetailsza="taskDetails"
      @saveChanges="saveChanges" />
  </Teleport>

  <div class="flex justify-end mr-52 mt-5">
    <div class="mr-5">
      <div v-if="showDefaultSort == true" @click='handleSort(sortType)'
        class="btn cursor-pointer flex items-center justify-center">
        <span class="font-bold">Sort</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#9c9995"
            d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm12.9 8V3h-2v13h-3l4 5l4-5zm-8-3H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
        </svg>
      </div>
      <div v-if="showAscSort == true" @click='handleSort(sortType)'
        class="btn cursor-pointer flex items-center justify-center">
        <span class="font-bold">Sort</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#de5b23"
            d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm12.9 8V3h-2v13h-3l4 5l4-5zm-8-3H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
        </svg>
      </div>
      <div v-if="showDescSort == true" @click='handleSort(sortType)'
        class="btn cursor-pointer flex items-center justify-center">
        <span class="font-bold">Sort</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path fill="#de5b23"
            d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm15.9 0l-4-5l-4 5h3v13h2V8zm-11 5H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
        </svg>
      </div>
    </div>
    <RouterLink :to="{ name: 'status' }">
      <div class="btn font-bold">Manage Status</div>
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
          <th ></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in taskmanager.getTask()" :key="index"
          class="itbkk-item h-16 border-solid border-2 border-black" v-if="todo">

          <th class="font-semibold text-center">{{ index + 1 }}</th>

          <router-link :to="{ name: 'taskdetail', params: { id: task.id } }">
            <td class="itbkk-title cursor-pointer">
              <span class=" block py-2 text-center">{{ task.title }}</span>
            </td>
          </router-link>

          <td class="itbkk-assignees" :class="task.assignees === null || task.assignees === '' ? EmptyStyle : ''">
            {{ task.assignees === null || task.assignees === "" ? "Unassigned" : task.assignees
            }}
          </td>


          <td class="itbkk-status " :class="getStatusClass(task.status.name).class">
            {{ task.status.name }}
          </td>

          <div class="flex justify-center">
            <router-link :to="{ name: 'editTaskModal', params: { id: task.id } }">
              <td class="itbkk-button-action" @click="editHandler(task.id)">
                <span class="itbkk-button-edit block  p-2 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <g fill="none" fill-rule="evenodd">
                      <path
                        d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                      <path fill="#888888"
                        d="M13.896 3.03a2 2 0 0 1 2.701-.117l.127.117l4.243 4.243a2 2 0 0 1 .117 2.7l-.117.128l-10.314 10.314a2 2 0 0 1-1.238.578L9.239 21H4.006a1.01 1.01 0 0 1-1.004-.9l-.006-.11v-5.233a2 2 0 0 1 .467-1.284l.12-.13L13.895 3.03ZM12.17 7.584l-7.174 7.174V19H9.24l7.174-7.174l-4.243-4.243Zm3.14-3.14L13.584 6.17l4.243 4.243l1.726-1.726z" />
                    </g>
                  </svg>
                </span>
              </td>
            </router-link>

            <router-link :to="{ name: 'deleteTask', params: { id: task.id } }">
              <td class="itbkk-button-action" @click="showConfirmModals(task)">
                <span class="itbkk-button-delete block p-2 text-center" :id="task.id">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <g fill="none">
                      <path
                        d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                      <path fill="#888888"
                        d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07A1.01 1.01 0 0 1 4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z" />
                    </g>
                  </svg>
                </span>
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



<style scoped>
.itbkk-button-action:hover svg {
  fill: #007bff;
  cursor: pointer;
}
</style>
