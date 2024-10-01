<script setup>
import { ref, onMounted } from "vue";
import { getItems, getItemById, editItem } from "@/libs/fetchUtils.js";
import { TaskManagement } from "@/libs/TaskManagement.js";
import Sidebar from "@/components/Sidebar.vue";
import AddTaskModal from "@/components/modals/task/AddTaskModal.vue";
import EditTaskModal from "@/components/modals/task/EditTaskModal.vue";
import DeleteTaskModal from "@/components/modals/task/DeleteTaskModal.vue";
import TaskDetail from "@/components/modals/task/TaskDetail.vue";
import Sort from "@/components/Sort.vue";
import Filter from "@/components/Filter.vue";
import AlertBox from "@/components/AlertBox.vue";
import { useRoute } from 'vue-router';

const taskmanager = ref(new TaskManagement());
const todo = ref([]);

const taskId = ref(null);
const EmptyStyle = "italic text-slate-400 font-semibold";

const statuses = ref([]);


const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showTaskDetail = ref(false)

const addedTitle = ref("");
const updatedTitle = ref("");

const tableType = "task";
const showAdded = ref(false);
const showAddedError = ref(false);
const showDeleted = ref(false);
const showDeletedError = ref(false);
const showUpdated = ref(false);
const showUpdatedError = ref(false);


const { params } = useRoute();
const boardId = params.boardId;
console.log(boardId);

const board = ref([]);

const taskUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`;
const statusUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`;
onMounted(async () => {
  const items = await getItems(taskUrl);
  const statusItems = await getItems(statusUrl);
  const boardItems = await getItemById(import.meta.env.VITE_BASE_BOARDS_URL, boardId);
  board.value = boardItems;
  todo.value = items;
  statuses.value = statusItems;
  taskmanager.value.setTasks(items);
  taskmanager.value.sortTask("default");
});

// ----------------------------------- add handler -----------------------------------

async function handleTaskAdded(addedTasks) {
  if (addedTasks !== null) {
    addedTitle.value = addedTasks.title;
    taskmanager.value.addTask({ ...addedTasks });
    todo.value = taskmanager.value.getTask();
    showAdded.value = true;
    setTimeout(() => {
      showAdded.value = false;
    }, 3000);
  } else {
    showAddedError.value = true;
    setTimeout(() => {
      showAddedError.value = false;
    }, 3000);
  }
};

// ----------------------------------- delete handler -----------------------------------

async function showConfirmModals(task) {
  const items = await getItemById(taskUrl, task.id);
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
  showDeleteModal.value = false;
  showDeletedError.value = true;
  setTimeout(() => {
    showDeletedError.value = false;
  }, 3000);
};

// ----------------------------------- edit handler -----------------------------------

const closeEditModal = () => {
  showEditModal.value = false;
};

async function editHandler(id) {
  const items = await getItemById(taskUrl, id);
  if (items !== undefined) {
    showEditModal.value = true;
    console.log(items);
  } else {
    showUpdatedError.value = true;
    setTimeout(() => {
      showUpdatedError.value = false;
    }, 3000);
  }
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
  if (getTaskProp.description == null || getTaskProp.description == "" || getTaskProp.description == undefined) {
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
    status: getTaskProp.status.id
  };
  console.log("getTaskProp:", getTaskProp);
  console.log("Edited task:", editedTask.status);

  updatedTitle.value = getTaskProp.title.trim();

  const existingTask = await getItemById(taskUrl, id);
  const existingStatus = await getItems(statusUrl);
  const editedTaskStatus = await getItemById(statusUrl, editedTask.status);

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
  } else {
    try {
      const item = await editItem(taskUrl, id, editedTask);
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
      }, 3000); taskId
    }
  }
}


// ----------------------------------- task details handler -----------------------------------

function taskDetailsHandler(id) {
  taskId.value = id;
  showTaskDetail.value = true;
}

function isTaskDetailModalOpen() {
  showTaskDetail.value = false;
  console.log("Task detail modal closed");
}

// ----------------------------------- sort handler -----------------------------------

const sortType = ref("asc");

function handleSort() {
  const currentSortType = sortType.value;
  switch (currentSortType) {
    case "asc":
      taskmanager.value.sortTask("asc");
      sortType.value = "desc";
      break;
    case "desc":
      taskmanager.value.sortTask("desc");
      sortType.value = "default";
      break;
    default:
      taskmanager.value.sortTask("default");
      sortType.value = "asc";
      break;
  }
}
// ----------------------------------- filter handler -----------------------------------

const selectedStatuses = ref([]);


const clearSelectedStatues = async () => {
  selectedStatuses.value = [];
  const items = await getItems(taskUrl);
  taskmanager.value.setTasks(items);
  taskmanager.value.getTask();
};

const applyFilter = async (filter) => {
  selectedStatuses.value = filter;
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

// ----------------------------------- status handler -----------------------------------

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

  <div class="flex">
    <div>
      <Sidebar />
    </div>

    <div class="w-screen">
      <!-- Alert -->
      <AlertBox :tableType="tableType" :showAdded="showAdded" :showAddedError="showAddedError"
        :showDeleted="showDeleted" :showDeletedError="showDeletedError" :showUpdated="showUpdated"
        :showUpdatedError="showUpdatedError" :addedTitle="addedTitle" :updatedTitle="updatedTitle" />
      <h1 class="text-4xl overflow-x-auto text-center font-bold mt-10">{{ board.name }}</h1>
      <!-- filter -->
      <div class="flex justify-between mx-52 mt-5 items-center">
        <Filter @filter="applyFilter" @reset="clearSelectedStatues" />
        <!-- add task -->
        <div class="flex">
          <router-link :to="{ name: 'addtask' }">
            <div class="itbkk-button-add bg-green-500 text-white hover:bg-green-600 btn font-semibold mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
              </svg>
              Add Task

            </div>
          </router-link>

          <!-- manage status -->
          <RouterLink :to="{ name: 'status', params: { boardId: params.boardId } }">
            <div class="itbkk-manage-status btn font-bold">Manage Status</div>
          </RouterLink>
        </div>
      </div>

      <!-- table -->

      <div class="overflow-x-auto flex justify-center ">
        <table class="table w-3/4 mt-5 border-solid border-2 rounded-m border-black">
          <thead>
            <tr class="bg-orange-200 
         border-solid border-2 border-black text-xl text-black">
              <th class="w-20"></th>
              <th class="font-bold">Title</th>
              <th class="font-bold">Assignees</th>
              <th class="font-bold">
                <Sort @click="handleSort" />
              </th>
              <th></th>

            </tr>
          </thead>
          <tbody>

            <tr v-for="(task, index) in taskmanager.getTask()" :key="index"
              class="itbkk-item h-16 border-solid border-2 border-black" v-if="todo">

              <th class="font-semibold text-center">{{ index + 1 }}</th>

              <router-link :to="{ name: 'taskdetail', params: { boardId: params.boardId, taskId: task.id } }">
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

              <div class="flex justify-center itbkk-button-action">
                <router-link :to="{ name: 'editTaskModal', params: { boardId: params.boardId, taskId: task.id } }">

                  <td class="itbkk-button-edit" @click="editHandler(task.id)">
                    <span class=" block  p-2 text-center">
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

                <router-link :to="{ name: 'deleteTask', params: { taskId: task.id } }">
                  <td class="itbkk-button-delete" @click="showConfirmModals(task)">
                    <span class=" block p-2 text-center" :id="task.id">
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
            <tr v-if="todo.length < 1">
              <td colspan="5" class="text-center text-slate-500 italic"> No tasks found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- <RouterView /> -->

  <Teleport to="body">
    <DeleteTaskModal v-if="showDeleteModal == true" @close="handleClose" @taskDeleted="handleTaskDeleted"
      @taskNotfound="handleTaskDeletedNotfound" />
  </Teleport>

  <Teleport to="body">
    <EditTaskModal v-if="showEditModal" @close="closeEditModal()" @saveChanges="saveChanges" />
  </Teleport>

  <Teleport to="body">
    <TaskDetail :id="taskId" v-if="showTaskDetail" @closed="isTaskDetailModalOpen" />
  </Teleport>

  <AddTaskModal @taskAdded="handleTaskAdded" />

</template>



<style scoped>
.itbkk-button-action:hover svg {
  fill: #007bff;
  cursor: pointer;
}
</style>