<script setup>
import { ref, onMounted } from "vue";
import { getItems, getItemById, editItem } from "../libs/fetchUtils.js";
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
const showTaskDetail = ref(false)
const idza = ref(null);
const EmptyStyle = "italic text-slate-400 font-semibold";

const statuses = ref([]);

onMounted(async () => {
  const items = await getItems(import.meta.env.VITE_BASE_TASK_URL);
  const statusItems = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
  todo.value = items;
  statuses.value = statusItems;
  taskmanager.value.setTasks(items);
  console.log("Received tasks:", items);
});

// add handler

async function handleTaskAdded(addedTasks) {
  if (addedTasks !== null) {
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

function taskDetailsHandler(id) {
  console.log(id);
  idza.value = id;
  showTaskDetail.value = true;
}

const saveChanges = async (getTaskProp, id) => {

  const checkinput = ref(0);
  console.log(getTaskProp);

  if (getTaskProp.title.length > 100) {
    alert("Title cannot contain more than 100 characters");
    checkinput.value += 1;
    console.log("Title Alert:", getTaskProp.title.length);
  } 
  
  console.log(getTaskProp.description);
  if (getTaskProp.description == null ||  getTaskProp.description == "" || getTaskProp.description == undefined){ 
    }
  else if (getTaskProp.description.length > 500) {
    console.log(getTaskProp.description.length);
    alert("Description cannot contain more than 500 characters");
    checkinput.value += 1;
    console.log("Description Alert:", getTaskProp.description.length);
  } 
  

  if (getTaskProp.assignees === null || getTaskProp.assignees === "" || getTaskProp.assignees === undefined) {
    
  } else if (getTaskProp.assignees.length > 30) {
      alert("Assignees cannot contain more than 30 characters");
      checkinput.value += 1;
      console.log("Assignees Alert:", getTaskProp.assignees.length);
    }
  

  const editedTask = {
    id: id,
    title: getTaskProp.title,
    description: getTaskProp.description,
    assignees: getTaskProp.assignees,
    status: getTaskProp.status
  };
  console.log("getTaskProp:", getTaskProp);
  console.log("Edited task:", editedTask.status);

  updatedTaskTitle.value = getTaskProp.title.trim();

  const existingTask = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);
  const existingStatus = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
  const editedTaskStatus = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, editedTask.status);
  const statusItems = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
  
  if (!existingTask) {
    closeEditModal();
    showUpdatedError.value = true;
    setTimeout(() => {
      showUpdatedError.value = false;
    }, 3000);
  } else if (!existingStatus.some((status) => status.id === editedTask.status)) {
    closeEditModal();
    showUpdatedError.value = true;
    setTimeout(() => {
      showUpdatedError.value = false;
    }, 3000);
  } 
  
  // else if (editedTaskStatus) {
  //   closeEditModal();
  //   showUpdatedError.value = true;
  //   setTimeout(() => {
  //     showUpdatedError.value = false;
  //   }, 3000);
  // } 
  
  else {
    try {
      const item = await editItem(import.meta.env.VITE_BASE_TASK_URL, id, editedTask);
      console.log(item);
      console.log(checkinput.value);
      if (checkinput.value > 0) {
        showUpdatedError.value = true;
        setTimeout(() => {
          showUpdatedError.value = false;
        }, 3000);
        closeEditModal();
      } else {
        const ShowEditedTask = {
          id: id,
          title: getTaskProp.title,
          description: getTaskProp.description,
          assignees: getTaskProp.assignees,
          status: {
            id: getTaskProp.status,
            name: editedTaskStatus.name
          }
        };
        taskmanager.value.editTask(id, { ...ShowEditedTask });
        console.log({ ...ShowEditedTask });

      closeEditModal();
      showUpdated.value = true;
      setTimeout(() => {
        showUpdated.value = false;
      }, 3000);
    }
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
    taskmanager.value.sortTask("asc");
    sortType.value = "desc";
    showDefaultSort.value = false;
    showAscSort.value = true;
    showDescSort.value = false;
  } else if (currentSortType === "desc") {
    console.log("Sorting tasks descending");
    taskmanager.value.sortTask("desc");
    sortType.value = "default";
    showDefaultSort.value = false;
    showAscSort.value = false;
    showDescSort.value = true;
  } else {
    console.log("Default:", sortType.value);
    taskmanager.value.sortTask("default");
    sortType.value = "asc";
    showDefaultSort.value = true;
    showAscSort.value = false;
    showDescSort.value = false;
  }
}




// filter handler
const showFilterDropdown = ref(false);
const selectedStatuses = ref([]);

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};

const clearSelectedStatues = async () => {
  selectedStatuses.value = [];
  const items = await getItems(import.meta.env.VITE_BASE_TASK_URL);
  taskmanager.value.setTasks(items);
  taskmanager.value.getTask();
};

const applyFilter = async () => {
  if (selectedStatuses.value.length === 0) {
    clearSelectedStatues();
  } else if (selectedStatuses.value.length > 0) {
    let filteredTasks = [];
    for (let i = 0; i < selectedStatuses.value.length; i++) {
      let tasksWithSelectedStatus = todo.value.filter(task => task.status.name.includes(selectedStatuses.value[i]));
      filteredTasks = [...filteredTasks, ...tasksWithSelectedStatus];
    }
    taskmanager.value.setTasks(filteredTasks);
  }
};
// conflic area
function isTaskDetailModalOpen() {
  showTaskDetail.value = false;
  console.log("Task detail modal closed");
}

</script>

<template>
  <!-- add task alert -->
  <!-- <div class="flex justify-center items-center fixed">
    <div class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
      <div class="p-4">
        <div class="flex justify-between mb-3">
          <h1 class="text-2xl font-bold">Success</h1>
          <button class="px-4 py-2rounded">✖</button>
        </div>
        <p class="itbkk-message text-lg font-bold break-words">
          The task "{{ addedTasksTitle }}" is added successfully
        </p>
      </div>
    </div>
  </div> -->
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

  <div class="flex justify-between mx-52 mt-5 items-center">
    <!-- filter -->
    <div class="flex items-center">
      <div>

        <details class="dropdown mx-5">
          <summary class="btn font-bold flex" @click="toggleFilterDropdown">
            <div v-if="selectedStatuses.length > 0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                <path fill="#de5b23"
                  d="M11 18q-.425 0-.712-.288T10 17t.288-.712T11 16h2q.425 0 .713.288T14 17t-.288.713T13 18zm-4-5q-.425 0-.712-.288T6 12t.288-.712T7 11h10q.425 0 .713.288T18 12t-.288.713T17 13zM4 8q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z" />
              </svg>
            </div>
            <div v-if="selectedStatuses.length === 0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                <path fill="#888888"
                  d="M11 18q-.425 0-.712-.288T10 17t.288-.712T11 16h2q.425 0 .713.288T14 17t-.288.713T13 18zm-4-5q-.425 0-.712-.288T6 12t.288-.712T7 11h10q.425 0 .713.288T18 12t-.288.713T17 13zM4 8q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z" />
              </svg>
            </div>
            Filter
          </summary>

          <ul v-if="showFilterDropdown"
            class="p-2 shadow menu dropdown-content z-10 bg-white rounded-lg w-56 mt-2 ring-1 ring-black ring-opacity-5">
            <template v-for="status in statuses" :key="status.id">
              <li>
                <label :for="status.id"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
                  <input type="checkbox" :id="status.id" :value="status.name" class="mr-2" v-model="selectedStatuses"
                    @change="applyFilter()">
                  {{ status.name }}
                </label>
              </li>
            </template>
          </ul>
        </details>


      </div>

      <div class="btn btn-ghost flex font-bold text-sm cursor-pointer" v-if="selectedStatuses.length > 0"
        @click="clearSelectedStatues">
        Reset<span class="px-2">✖</span>
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
          <th class="font-bold">
            <div @click='handleSort(sortType)' class="cursor-pointer flex items-center ">
              <span class="font-bold mr-2">Status</span>
              <div v-if="showDefaultSort == true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#9c9995"
                    d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm12.9 8V3h-2v13h-3l4 5l4-5zm-8-3H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
                </svg>
              </div>
              <div v-if="showAscSort == true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#de5b23"
                    d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm12.9 8V3h-2v13h-3l4 5l4-5zm-8-3H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
                </svg>
              </div>
              <div v-if="showDescSort == true">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#de5b23"
                    d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm15.9 0l-4-5l-4 5h3v13h2V8zm-11 5H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
                </svg>
              </div>
            </div>

          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>

        <tr v-for="(task, index) in taskmanager.getTask()" :key="index"
          class="itbkk-item h-16 border-solid border-2 border-black" v-if="todo">

          <th class="font-semibold text-center">{{ index + 1 }}</th>

          <router-link :to="{ name: 'taskdetail', params: { id: task.id } }">
            <td @click="taskDetailsHandler(task.id)" class="itbkk-title cursor-pointer">
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

  <Teleport to="body">
    <EditTaskModal v-if="showEditModal" @close="closeEditModal()" :taskDetailsza="taskDetails"
      @saveChanges="saveChanges" />
  </Teleport>

  <Teleport to="body">
    <TaskDetail v-if="showTaskDetail" :id="idza" @closed="isTaskDetailModalOpen" />
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
