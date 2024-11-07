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
import BoardVisibility from "@/components/modals/board/BoardVisibility.vue";
import DeleteIcons from "@/components/icons/DeleteIcons.vue";
import EditIcons from "@/components/icons/EditIcons.vue";
import { CollabManagement } from "@/libs/CollabManagement";

const readAccess = ref(false);

const taskmanager = ref(new TaskManagement());
const collabmanager = ref(new CollabManagement());
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
const board = ref([]);

const taskUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/tasks`;
const statusUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`;
const collabUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`;

// collabmanager.value.getCollabs();
// console.log(collabmanager.value.getCollabs());

onMounted(async () => {
  try {
    const items = await getItems(taskUrl);
    const statusItems = await getItems(statusUrl);
    const boardItems = await getItemById(import.meta.env.VITE_BASE_BOARDS_URL, boardId);
    const collabItems = await getItems(collabUrl);

    for (let i = 0; i < collabItems.length; i++) {
      if (collabItems[i].oid === localStorage.getItem('oid')) {
        if (collabItems[i].accessRight === "READ") {
          readAccess.value = true;
        }
      } 
    }
    console.log(readAccess.value);

    board.value = boardItems;
    todo.value = items;
    statuses.value = statusItems;
    taskmanager.value.setTasks(items);
    taskmanager.value.sortTask("default");
  } catch (error) {
    console.error("Error fetching task details:", error);
  }

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
  showDeleteModal.value = true;
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
  } else {
    showUpdatedError.value = true;
    setTimeout(() => {
      showUpdatedError.value = false;
    }, 3000);
  }
}

const saveChanges = async (getTaskProp, id) => {

  const checkinput = ref(0);

  if (getTaskProp.title.length > 100) {
    alert("Title cannot contain more than 100 characters");
    checkinput.value += 1;
  }

  if (getTaskProp.description == null || getTaskProp.description == "" || getTaskProp.description == undefined) {
  }
  else if (getTaskProp.description.length > 500) {
    alert("Description cannot contain more than 500 characters");
    checkinput.value += 1;
  }


  if (getTaskProp.assignees === null || getTaskProp.assignees === "" || getTaskProp.assignees === undefined) {

  } else if (getTaskProp.assignees.length > 30) {
    alert("Assignees cannot contain more than 30 characters");
    checkinput.value += 1;
  }

  const editedTask = {
    id: id,
    title: getTaskProp.title,
    description: getTaskProp.description,
    assignees: getTaskProp.assignees,
    status: getTaskProp.status.id
  };

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
        <div class="flex justify-items-center">
          <Filter @filter="applyFilter" @reset="clearSelectedStatues" />
        </div>

        <div class="flex">
          <!-- toggle -->
          <BoardVisibility :boardId="boardId" />

          <!-- manage collaborator -->
          <RouterLink :to="{ name: 'collabTable', params: { boardId: params.boardId } }">
            <div class="itbkk-manage-collaborator mr-5 btn font-bold">Manage Collaborator</div>
          </RouterLink>

          <!-- manage status -->
          <RouterLink :to="{ name: 'status', params: { boardId: params.boardId } }">
            <div class="itbkk-manage-status btn font-bold mr-5">Manage Status</div>
          </RouterLink>

          <!-- add task -->
          <div v-if="readAccess === true">
            <div class="itbkk-button-add  bg-grey-500 btn rounded-full cursor-not-allowed disabled">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
              </svg>
            </div>
          </div>
          <div v-else>
            <router-link :to="{ name: 'addtask' }">
              <div class="itbkk-button-add bg-green-500 text-white hover:bg-green-600 btn font-semibold rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
                </svg>
              </div>
            </router-link>
          </div>


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


              <td class="itbkk-status itbkk-button-action" :class="getStatusClass(task.status.name).class">
                {{ task.status.name }}
              </td>

              <div class="flex justify-center ">
                <div v-if="readAccess === true">
                  <td class="itbkk-button-edit cursor-not-allowed">
                    <EditIcons :isOff="readAccess" />
                  </td>
                </div>
                <div v-else>
                  <router-link :to="{ name: 'editTaskModal', params: { boardId: params.boardId, taskId: task.id } }">
                    <td class="itbkk-button-edit" @click="editHandler(task.id)">
                      <EditIcons :isOff="readAccess" />
                    </td>
                  </router-link>
                </div>

                <div v-if="readAccess === true">
                  <td class="itbkk-button-delete cursor-not-allowed">
                    <!-- <DeleteOffIcons /> -->
                    <DeleteIcons :isOff="readAccess" />
                  </td>
                </div>
                <div v-else>
                  <router-link :to="{ name: 'deleteTask', params: { taskId: task.id } }">
                    <td class="itbkk-button-delete" @click="showConfirmModals(task)">
                      <DeleteIcons :isOff="readAccess" />
                    </td>
                  </router-link>
                </div>
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

  <router-view />

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

  <Teleport to="body">
    <AddTaskModal @taskAdded="handleTaskAdded" />
  </Teleport>

</template>



<style scoped></style>