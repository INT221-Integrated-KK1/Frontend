<script setup>

import { ref, onMounted, watch, reactive } from 'vue';
import { getItems, getItemById, editItem } from '../libs/fetchUtils.js';
import { TaskManagement } from '../libs/TaskManagement.js'; // Assuming you have a TaskManagement class
import AddModal from './AddModal.vue';
const showDetailModal = ref(false);
import EditTaskModal from './EditTaskModal.vue'; // Import your EditTaskModal component
import DeleteModal from './DeleteModal.vue';


const taskmanager = new TaskManagement()
// Define variables to store fetched data
const todo = ref([])
const taskDetails = ref({});
const showEditModal = ref(false);
const showDeleteModal = ref(false);

const openEditModal = () => {
    showEditModal.value = true;
};

const closeModal = () => {
    showEditModal.value = false;
}


const id = defineProps({
    taskId: Number
});

const EmptyStyle = 'italic text-slate-400 font-semibold';


onMounted(async () => {
    const items = await getItems(import.meta.env.VITE_BASE_TASK_URL);
    todo.value = items;
    taskmanager.setTasks(items)
    console.log('Received tasks:', items);
});

const addedTasksTitle = ref('');
const showNewTaskAdded = ref(false);
const showNewTaskError = ref(false);

const handleTaskAdded = (addedTasks) => {
    if (addedTasks.taskId === 0 && addedTasks.taskTitle !== '') {
        addedTasks.taskId = todo.value[todo.value.length - 1].taskId + 1;
        showNewTaskAdded.value = true;
        addedTasksTitle.value = addedTasks.taskTitle;
        taskmanager.addTask(addedTasks);
        todo.value = taskmanager.getTask();
    } else {
        showNewTaskError.value = true;
    }
};

const handleTaskDeleted = (deletedTaskId) => {
    taskmanager.deleteTask(deletedTaskId);
    todo.value = taskmanager.getTask();
    console.log('Deleted task:', deletedTaskId);
};



async function editHandler(id) {
    const items = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id)
    if (items) {
        taskDetails.value = items;
        showEditModal.value = true;
        console.log(items);
    }

}

async function deleteHandler(id) {
    const items = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id)
    if (items) {
        taskDetails.value = items;
        showDeleteModal.value = true;
        console.log(items);
    }

}
function yohooHandler(obj) {
    const task = taskmanager.value.getTaskById();
    task.taskTitle = obj.taskTitle;
    task.taskDescription = obj.taskDescription;
    task.taskAssignees = obj.taskAssignees;
    task.taskStatus = obj.taskStatus;
    task.createOn = obj.createOn;
    task.updatedOn = obj.updatedOn;
}


const saveChanges = async (getTaskProp, id) => {
    console.log(getTaskProp);
    const editedTask = {
        taskId: id,
        taskTitle: getTaskProp.taskTitle,
        taskDescription: getTaskProp.taskDescription,
        taskAssignees: getTaskProp.taskAssignees,
        taskStatus: getTaskProp.taskStatus
    };

    try {
        console.log(id);
        // Send the data to the API
        await editItem(import.meta.env.VITE_BASE_TASK_URL, id, editedTask);
        taskmanager.value.editTask(id, editedTask)
        console.log(taskmanager.value.getTask());
        closeModal();

    } catch (error) {
        console.error("Error editing task:", error);
    }

};

const getStatusClass = (status) => {
    switch (status) {
        case 'No Status':
            return 'bg-gray-200 text-gray-800 rounded '; // Gray button style for No Status
        case 'To Do':
            return 'bg-red-200 text-red-800 rounded'; // Red button style for To Do
        case 'Doing':
            return 'bg-yellow-200 text-yellow-800  rounded'; // Yellow button style for Doing
        case 'Done':
            return 'bg-green-200 text-green-800  rounded'; // Green button style for Done     
        default:
            return 'bg-gray-200 text-gray-800 rounded'; // สไตล์ปุ่มเริ่มต้นสำหรับสถานะอื่น ๆ
    }
};

</script>

<template>

    <!-- add task alert -->
    <div class="flex justify-center items-center">
        <div v-if="showNewTaskAdded" class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4 ">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold "> Success </h1>
                    <button @click="showNewTaskAdded = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">The task "{{ addedTasksTitle }}" is added successfully</p>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center">
        <div v-if="showNewTaskError" class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4 ">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold "> Error </h1>
                    <button @click="showNewTaskError = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">An error occurred adding the new task
                </p>
            </div>
        </div>
    </div>

    <!-- delete task alert -->

    <div class="flex justify-center items-center">
        <div class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4 ">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold "> Success </h1>
                    <button @click="" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">The task "" is deleted successfully</p>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center">
        <div class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4 ">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold "> Error </h1>
                    <button @click="" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">An error occurred deleting the task ""
                </p>
            </div>
        </div>
    </div>

    <!-- edit task alert -->

    <div class="flex justify-center items-center">
        <div class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4 ">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold "> Success </h1>
                    <button @click="" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">The task "" is updated successfully</p>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center">
        <div class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4 ">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold "> Error </h1>
                    <button @click="" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">An error occurred updated the task ""
                </p>
            </div>
        </div>
    </div>


    <Teleport to="body">
        <EditTaskModal v-if="showEditModal" @close="closeModal" :taskDetailsza="taskDetails" @yohoo="yohooHandler"
            @saveChanges="saveChanges" />
    </Teleport>
    <Teleport to="body">
        <DeleteModal v-if="showDeleteModal" @close="showDeleteModal = false" @taskDeleted="handleTaskDeleted" />
    </Teleport>
    <div class="flex justify-center items-center">
        <table class="overflow-x-auto mt-10 table w-3/4 border-collapse border-hidden rounded-3xl text-md">
            <thead class="text-xl text-black border-slate-600 bg-orange-200 ">
                <tr class="">
                    <th class="w-[20px]"></th>
                    <th class="font-bold ">Title</th>
                    <th class="font-bold">Assignees</th>
                    <th class="font-bold">Status</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(task, index) in taskmanager.getTask()" :key="index"
                    class="itbkk-item  border-slate-600 borderrounded-e-2xl bg-yellow-50  " v-if="todo">
                    <th class="font-semibold text-center"> {{ task.taskId }}</th>
                    <router-link :to="{ name: 'taskdetail', params: { taskId: task.taskId } }">
                        <td style="cursor: pointer; word-break" class="itbkk-title">{{ task.taskTitle }}</td>
                    </router-link>
                    <td class="itbkk-assignees"
                        :class="task.taskAssignees === null || task.taskAssignees === '' ? EmptyStyle : ''">{{
                        task.taskAssignees
                        === null || task.taskAssignees === ''
                        ? "Unassigned" : task.taskAssignees }}</td>
                    <td :class="getStatusClass(task.taskStatus)" class="itbkk-status text-center">{{
                        task.taskStatus }}</td>
                    <td>
                        <router-link :to="{ name: 'editTaskModal', params: { taskId: task.taskId } }">
                            <span class="itbkk-button-edit block w-[10px] p-2 text-center"
                                @click="editHandler(task.taskId)">✏️</span>
                        </router-link>
                    </td>
                    <td>
                        <router-link :to="{ name: 'deleteTask', params: { taskId: task.taskId } }">
                            <span class="itbkk-button-delete block w-[10px] p-2 text-center">🗑️</span>
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>

    <router-link :to="{ name: 'addtask' }">
        <AddModal @taskAdded="handleTaskAdded" />
        <!-- <AddModal  /> -->
    </router-link>


</template>
<style scoped></style>
