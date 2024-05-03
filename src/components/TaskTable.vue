<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getItems, getItemById, editItem } from '../libs/fetchUtils.js'
import EditTaskModal from './EditTaskModal.vue'; // Import your EditTaskModal component
import { TaskManagement } from '../libs/TaskManagement.js'

const taskmanager = ref(new TaskManagement())
// Define variables to store fetched data
const todo = ref()
const taskDetails = ref({});
const showEditModal = ref(false);
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

// Fetch data when the component is mounted
onMounted(async () => {
    const items = await getItems(import.meta.env.VITE_BASE_TASK_URL);
    todo.value = items;
    taskmanager.value.setTasks(items)
    console.log(taskmanager.value.getTask());
});
async function editHandler(id) {
    const items = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id)
    if (items) {
        taskDetails.value = items;
        showEditModal.value = true;
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

// async function editHandler(taskId) {
//     try {
//         // ดึงข้อมูลของงานที่ถูกแก้ไขจากเซิร์ฟเวอร์
//         const updatedTask = await getItemById(import.meta.env.VITE_BASE_TASK_URL, taskId);
//         console.log(updatedTask);

//         // ค้นหา index ของงานที่ถูกแก้ไขใน todo
//         const index = todo.value.findIndex(task => task.taskId === taskId);

//         if (index !== -1) {
//             // ทำการอัพเดทข้อมูลของงานที่ถูกแก้ไขใน todo
//             todo.value[index] = updatedTask;
//         }
//     } catch (error) {
//         console.error(`Error updating task ${taskId}:`, error);
//     }
// }


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
    <Teleport to="body">
        <EditTaskModal v-if="showEditModal" @close="closeModal" :taskDetailsza="taskDetails" @yohoo="yohooHandler"
            @saveChanges="saveChanges" />
    </Teleport>
    <div class="flex justify-center items-center">
        <table class=" overflow-x-auto  mt-10 table w-3/4 border-collapse border-hidden rounded-3xl text-md">
            <!-- head -->
            <thead class="text-xl text-black border-slate-600 bg-orange-200 ">
                <tr class="">
                    <th class="w-[20px]"></th>
                    <th class="font-bold ">Title</th>
                    <th class="font-bold">Assignees</th>
                    <th class="font-bold">Status</th>
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
                    <td class="itbkk-assignees" :class="task.taskAssignees === null ? EmptyStyle : ''">{{
            task.taskAssignees
                === null
                ? "Unassigned" : task.taskAssignees }}</td>
                    <td :class="getStatusClass(task.taskStatus)" class="itbkk-status text-center">{{
            task.taskStatus }}</td>
                    <td class="itbkk-button-action text-black text-xl">
                        <span class="cursor-pointer" @click="task.showDetailModal = !task.showDetailModal">⋮</span>
                        <div v-if="task.showDetailModal" class="absolute bg-white rounded shadow text-sm">
                            <router-link :to="{ name: 'editTaskModal', params: { taskId: task.taskId } }">
                                <button class="itbkk-button-edit block w-full p-2 hover:bg-gray-200"
                                    @click="editHandler(task.taskId)">Edit</button>
                            </router-link>
                            <button class="itbkk-button-delete block w-full p-2 hover:bg-gray-200">Delete</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>








</template>
<style scoped></style>
