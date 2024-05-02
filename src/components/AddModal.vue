<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { addItem } from '../libs/fetchUtils.js';
import router from '@/router';


const taskTitle = ref('');
const taskDescription = ref('');
const taskAssignees = ref('');
const taskStatus = ref('No Status');

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const time = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
});

const AddTask = async () => {
    // if (taskTitle.value === '') {
    //     alert('Please enter a title');
    //     return;
    // } else {
        const newItem = {
            taskTitle: taskTitle.value,
            taskDescription: taskDescription.value,
            taskAssignees: taskAssignees.value,
            taskStatus: taskStatus.value
        };
        try {
            const items = await addItem(import.meta.env.VITE_BASE_TASK_URL, newItem);
            console.log(items);
            console.log(newItem);
            // router.go();

            // Add the new item to the existing list without refreshing
            // tasks.value.push(newItem);
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    // }

};



onMounted(async () => {

});

</script>

<template>
    <div>

        <div class="text-black fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
                <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
                    <div class=" col-start-1 col-span-3">
                        <h1 class="font-bold text-2xl py-2 mb-2">Add new task</h1>
                        <h1 class="font-bold mt-2">Title : <span class="text-red-600">*</span> </h1>
                        <input class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 break-words"
                            placeholder="Title name here" v-model.trim="taskTitle" required>
                        </input>
                    </div>
                    <hr class="col-start-1 col-span-3" />
                    <div class="col-start-1 col-span-2">
                        <h1 class="font-bold">Description :</h1>
                        <textarea
                            class="itbkk-description p-2 border-solid border-2 border-grey w-full h-[14rem] break-words"
                            placeholder="Description here" v-model="taskDescription" />

                    </div>
                    <div class="col-start-3 col-span-1">
                        <h1 class="font-bold">Assignees :</h1>
                        <textarea class="itbkk-assignees  p-2 border-solid border-2 border-grey w-full  break-words"
                            placeholder="Assignees here" v-model="taskAssignees" />
                        <h1 class="font-bold pt-3">Status :</h1>
                        <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status"
                            v-model="taskStatus">
                            <option value="No Status" selected>No Status</option>
                            <option value="To Do">To Do</option>
                            <option value="Doing">Doing</option>
                            <option value="Done">Done</option>
                        </select>
                        <h1 class="font-bold itbkk-timezone">Timezone : {{ timezone }}</h1>
                        <h1 class="font-bold itbkk-created-on">Created On: {{ time }}</h1>
                        <h1 class="font-bold itbkk-updated-on">Updated On: {{ time }}</h1>
                    </div>
                    <div class="flex justify-end mt-4 col-start-3">
                        <router-link :to="{ name: 'task' }">
                                <button class="btn bg-green-500 hover:bg-green-700 text-white" @click.prevent="AddTask" :disabled="taskTitle === ''">
                                    Save
                                </button>
                        </router-link>
                        <router-link :to="{ name: 'task' }">
                            <button class="btn bg-red-500 hover:bg-red-700 text-white">
                                Close
                            </button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>