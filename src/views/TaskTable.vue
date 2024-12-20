<script setup>
import { ref, onMounted } from "vue";
import { getItems, getItemById, editItem } from "@/libs/fetchUtils.js";
import { TaskManagement } from "@/stores/TaskManagement.js";
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
import router from "@/router";
import LoadingPage from "./LoadingPage.vue";

const readAccess = ref(false);
const unAuthorized = localStorage.getItem('token') === null;

const taskmanager = TaskManagement();
const todo = ref([]);

const taskId = ref(null);
const EmptyStyle = "italic text-slate-400 font-semibold";

const statuses = ref([]);
const isLoading = ref(false);


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

const taskUrl = `${import.meta.env.VITE_BASE_URL}/boards/${boardId}/tasks`;
const statusUrl = `${import.meta.env.VITE_BASE_URL}/boards/${boardId}/statuses`;
const collabUrl = `${import.meta.env.VITE_BASE_URL}/boards/${boardId}/collabs`;

onMounted(async () => {
  try {
    isLoading.value = true;

    const items = await getItems(taskUrl);
    if (items.status === 403) {
      window.alert("Access denied, you do not have permission to view this board");
      router.go(-1);
    } if (items.status === 401) {
      window.alert("Unauthorized, please login to view this board");
      router.push({ name: 'login' });
    }

    const statusItems = await getItems(statusUrl);
    const boardItems = await getItemById(`${import.meta.env.VITE_BASE_URL}/boards`, boardId);
    const collabItems = await getItems(collabUrl);

    for (let i = 0; i < collabItems.length; i++) {
      if (collabItems[i].oid === localStorage.getItem('oid')) {
        if (collabItems[i].accessRight === "READ") {
          readAccess.value = true;
        }
      }
    }

    for (let i = 0; i < items.length; i++) {
      const attachmentItem = await getItems(`${import.meta.env.VITE_BASE_URL}/attachment/task/${items[i].id}`);
      items[i] = { ...items[i], attachments: attachmentItem.data.length, attachmentItem: attachmentItem.data };
    }

    board.value = boardItems;
    todo.value = items;
    statuses.value = statusItems;
    taskmanager.setTasks(items);
    taskmanager.sortTask("default");

  } catch (error) {
    console.error("Error fetching task details:", error);
  } finally {
    isLoading.value = false;
  }

});

// ----------------------------------- add handler -----------------------------------

async function handleTaskAdded(addedTasks) {
  if (addedTasks.status >= 400) {
    showAddedError.value = true;
    setTimeout(() => {
      showAddedError.value = false;
    }, 3000);
  } else if (addedTasks !== null || addedTasks.title !== undefined) {
    addedTitle.value = addedTasks.title;
    taskmanager.addTask({ ...addedTasks });
    todo.value = taskmanager.getTask();
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

const handleClose = () => {
  showDeleteModal.value = false;
};

const handleTaskDeleted = (deletedid) => {
  taskmanager.deleteTask(deletedid);
  todo.value = taskmanager.getTask();
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

const handleTaskEdit = async (getTaskProp, id) => {

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

  if (editedTask === existingTask) {
    closeEditModal();
    showUpdatedError.value = true;
    setTimeout(() => {
      showUpdatedError.value = false;
    }, 3000);
  } else if (!existingTask) {
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
        taskmanager.editTask(id, { ...item });
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


// ----------------------------------- task details handler -----------------------------------

function isTaskDetailModalOpen() {
  showTaskDetail.value = false;
}

// ----------------------------------- sort handler -----------------------------------

const sortType = ref("asc");

function handleSort() {
  const currentSortType = sortType.value;
  switch (currentSortType) {
    case "asc":
      taskmanager.sortTask("asc");
      sortType.value = "desc";
      break;
    case "desc":
      taskmanager.sortTask("desc");
      sortType.value = "default";
      break;
    default:
      taskmanager.sortTask("default");
      sortType.value = "asc";
      break;
  }
}
// ----------------------------------- filter handler -----------------------------------

const selectedStatuses = ref([]);


const clearSelectedStatues = async () => {
  selectedStatuses.value = [];
  const items = await getItems(taskUrl);
  taskmanager.setTasks(items);
  taskmanager.getTask();
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
    taskmanager.setTasks(filteredTasks);
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

// ----------------------------------- attachment handler -----------------------------------

async function handleFiles(addFiles, taskId, removeFiles) {
  try {

    if (removeFiles && removeFiles.length > 0) {
      await handleRemoveFiles(taskId, removeFiles);
    }

    if (addFiles && addFiles.length > 0) {
      await handleAddFiles(taskId, addFiles);
    }

    const attachmentItem = await getItems(`${import.meta.env.VITE_BASE_URL}/attachment/task/${taskId}`);
    taskmanager.editTask(taskId, { attachments: attachmentItem.data.length });
  } catch (error) {
    console.error("Error during file operations:", error);
  }
}

async function handleAddFiles(taskId, files) {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    await fetch(`${import.meta.env.VITE_BASE_URL}/attachment/${taskId}/attachments`, {
      method: "POST",
      body: formData,
    });

  } catch (error) {
    console.error("Error during file addition:", error);
  }
}

async function handleRemoveFiles(taskId, removeFiles) {
  for (let i = 0; i < removeFiles.length; i++) {
    try {
      const fileId = taskmanager
        .getTaskById(taskId)
        .attachmentItem.find((attachment) => attachment.fileName === removeFiles[i].name).id;

      await fetch(`${import.meta.env.VITE_BASE_URL}/attachment/${fileId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

    } catch (error) {
      console.error("Error during file removal:", error);
    }
  }
}





</script>

<template>
  <LoadingPage :isLoading="isLoading" />
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
          <!-- Manage Collaborator -->
          <RouterLink :to="{ name: 'collabTable', params: { boardId: params.boardId } }">
            <div
              class="btn font-bold mr-5 bg-orange-300 hover:bg-orange-400 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
              Manage Collaborator
            </div>
          </RouterLink>

          <!-- Manage Status -->
          <RouterLink :to="{ name: 'status', params: { boardId: params.boardId } }">
            <div
              class="btn font-bold mr-5 bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out">
              Manage Status
            </div>
          </RouterLink>

          <!-- add task -->
          <div v-if="readAccess === true || unAuthorized" class="tooltip"
            data-tip="You need to be board owner or has write access to perform this action">
            <div
              class="itbkk-button-add  bg-slate-300 text-white hover:bg-slate-400  btn rounded-full cursor-not-allowed ">
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
            <tr class="bg-[#85E5FF]
         border-solid border-2 border-black text-xl text-black">
              <th class="w-20"></th>
              <th class="font-bold text-center">Title</th>
              <th class="font-bold text-center">Assignees</th>
              <th class="font-bold text-center">Attachment</th>
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


              <td class="itbkk-title text-center">
                <router-link :to="{ name: 'taskdetail', params: { boardId: params.boardId, taskId: task.id } }">
                  {{ task.title }}
                </router-link>
              </td>

              <td class="itbkk-assignees text-center"
                :class="task.assignees === null || task.assignees === '' ? EmptyStyle : ''">
                {{ task.assignees === null || task.assignees === "" ? "Unassigned" : task.assignees
                }}
              </td>

              <td class="text-center"> {{ task.attachments > 0 ? task.attachments : '-' }}</td>


              <td class="itbkk-status itbkk-button-action" :class="getStatusClass(task.status.name).class">
                {{ task.status.name }}
              </td>

              <div class="flex justify-center ">
                <div v-if="readAccess === true || unAuthorized" class="tooltip"
                  data-tip="You need to be board owner or has write access to perform this action">
                  <td class="itbkk-button-edit cursor-not-allowed">
                    <EditIcons :isOff="readAccess || unAuthorized" />
                  </td>
                </div>
                <div v-else>
                  <router-link :to="{ name: 'editTaskModal', params: { boardId: params.boardId, taskId: task.id } }">
                    <td class="itbkk-button-edit">
                      <EditIcons :isOff="readAccess || unAuthorized" />
                    </td>
                  </router-link>
                </div>

                <div v-if="readAccess === true || unAuthorized" class="tooltip"
                  data-tip="You need to be board owner or has write access to perform this action">
                  <td class="itbkk-button-delete cursor-not-allowed">
                    <!-- <DeleteOffIcons /> -->
                    <DeleteIcons :isOff="readAccess || unAuthorized" />
                  </td>
                </div>
                <div v-else>
                  <router-link :to="{ name: 'deleteTask', params: { taskId: task.id } }">
                    <td class="itbkk-button-delete">
                      <DeleteIcons :isOff="readAccess || unAuthorized" />
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

  <Teleport to="body">
    <DeleteTaskModal @close="handleClose" @taskDeleted="handleTaskDeleted" @taskNotfound="handleTaskDeletedNotfound" />
  </Teleport>

  <Teleport to="body">
    <EditTaskModal @close="closeEditModal" @taskEdited="handleTaskEdit" @filesAdded="handleFiles" />
  </Teleport>

  <Teleport to="body">
    <TaskDetail @closed="isTaskDetailModalOpen" />
  </Teleport>

  <Teleport to="body">
    <AddTaskModal @taskAdded="handleTaskAdded" />
  </Teleport>

</template>



<style scoped>
/* Additional hover effects for better interactivity */
.btn {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}
</style>