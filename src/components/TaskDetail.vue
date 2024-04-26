<script setup>
import { ref, watch } from 'vue';
import { getItemById } from '../libs/fetchUtils.js'; 

const props = defineProps({
    showModal: Boolean,
    taskId: Number
});

const closeModal = () => {
    showModal.value = false;
}

const task = ref(null);

const url = 'http://localhost:8080/v1/tasks'; 

const fetchTaskDetails = async () => {
    try {
        task.value = await getItemById(url, props.taskId); 
    } catch (error) {
        console.error('Error fetching task details:', error);
    }
};

watch(() => props.showModal, (newVal) => {
    if (newVal) {
        fetchTaskDetails();
    }
});

// //demo time to show
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// const currentDate = new Date().toLocaleString("En-US", timezone);
// const description = ref('');
</script>

<template>
    <!-- demo button modal -->
    <div v-if="showModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
            <div v-if="task" class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">

                <div class="col-start-1 col-span-3">
                    <h1 class="font-bold">Title : </h1>
                    <input class="p-2 border-solid border-2 border-grey w-full mb-3" v-model="task.taskTitle">
                </div>
                <hr class="col-start-1 col-span-3">
                <div class="col-start-1 col-span-2">
                    <h1 class="font-bold">Description : </h1>
                    <textarea rows="10"
                        class="p-2 border-solid border-2 border-grey w-full">{{ task.taskDescription }}</textarea>
                </div>
                <div class="col-start-3 col-span-1">
                    <h1 class="font-bold">Assignees : </h1>
                    <textarea rows="2" class="p-2 border-solid border-2 border-grey w-full">
                        {{ task.taskAssignees }}
                    </textarea>
                    <h1 class="font-bold">Status : </h1>
                    <select class="p-2 border-solid border-2 border-grey w-full mb-10" v-model="task.taskStatus">
                        <option value="No Status">No Status</option>
                        <option value="To Do">To Do</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                    </select>
                    <p> Demo data </p>
                    <h1 class="font-bold">Timezone : {{ timezone }}</h1>
                    <h1 class="font-bold">CreatedOn : {{ task.CreatedOn }} </h1>
                    <h1 class="font-bold">UpdatedOn : {{ task.UpdatedOn }}</h1>
                </div>
                <div class="flex justify-end mt-4 col-start-3">
                    <button @click="$emit('closeModal', false)"
                        class="bg-red-500 hover:bg-red-700 text-white btn">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>