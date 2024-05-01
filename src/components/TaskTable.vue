<script setup>
import { ref, onMounted } from 'vue';
import { getItems } from '../libs/fetchUtils.js'
import EditTaskModal from './EditTaskModal.vue'; // Import your EditTaskModal component



// Define variables to store fetched data
const todo = ref()
const showDetailModal = ref(false);

const id = defineProps({
    taskId: Number
});

const EmptyStyle = 'italic text-slate-400 font-semibold';

// Fetch data when the component is mounted
onMounted(async () => {
    try {
        const items = await getItems(import.meta.env.VITE_BASE_TASK_URL);
        console.log(items);
        todo.value = items;
    } catch (error) {
        console.log(`Error fetching data: ${error}`);
    }
});

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
            return 'bg-blue-200 text-blue-800 rounded'; // Default button style for other statuses
    }
};

</script>
<template>
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
                <tr v-for="(task, index) in todo" :key="index"
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
                                <button class="itbkk-button-edit block w-full p-2 hover:bg-gray-200" >Edit</button> 
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
