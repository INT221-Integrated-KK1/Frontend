<script setup>
import { ref, watch, onMounted } from 'vue';
import { getItemById, getItems } from '../libs/fetchUtils.js';
import { useRoute } from "vue-router"
const { params } = useRoute()
// const props = defineProps({
//     taskId: Number
// });


const url = 'http://localhost:8080/v1/tasks';
const id = params.taskId


console.log(id) 
const task = ref(null);
onMounted(async () => {
    console.log(id)

    const task = await getItems(url);
    console.log(task)
})

const showModal = ref(false);




const EmptyStyle = 'italic text-slate-400';
const EmptyAssigneeText = 'Unassigned';
const EmptyDescriptionText = 'No Description Provided';

const fetchTaskDetails = async () => {
    try {
        task.value = await getItemById(url, id);
    } catch (error) {
        console.error('Error fetching task details:', error);
    }
};

// watch(() => props.showModal, (newVal) => {
//     if (newVal) {
//         fetchTaskDetails();
//     }
// });

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

</script>

<template>
    <!-- demo button modal -->
    <div v-if="showModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
            <div v-if="taskId" class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">

                <div class="col-start-1 col-span-3">
                    <h1 class="font-bold">Title : </h1>
                    <input class="itbkk-title p-2 border-solid border-2 border-grey w-full mb-3 "
                        v-model="task.taskTitle">
                </div>
                <hr class="col-start-1 col-span-3">
                <div class="col-start-1 col-span-2">
                    <h1 class="font-bold">Description : </h1>
                    <textarea class="itbkk-description placeholder:italic
                        placeholder:text-slate-400  p-2 border-solid border-2 border-grey w-full" rows="10"
                        :class="task.taskDescription === null ? EmptyStyle : ''"
                        :value="task.taskDescription === null ? EmptyDescriptionText : task.taskDescription">
                    </textarea>
                </div>
                <div class="col-start-3 col-span-1">
                    <h1 class="font-bold">Assignees : </h1>
                    <textarea rows="2" class=" placeholder:italic
                        placeholder:text-slate-400 p-2 border-solid border-2 border-grey w-full itbkk-assignees"
                        :class="task.taskAssignees === null ? EmptyStyle : ''"
                        :value="task.taskAssignees === null ? EmptyAssigneeText : task.taskAssignees">
                    </textarea>
                    <h1 class="font-bold">Status : </h1>
                    <select class="p-2 border-solid border-2 border-grey w-full mb-10 itbkk-status"
                        v-model="task.taskStatus">
                        <option value="No Status">No Status</option>
                        <option value="To Do">To Do</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                    </select>
                    <h1 class="font-bold itbkk-timezone">Timezone : {{ timezone }}</h1>
                    <h1 class="font-bold itbkk-created-on">CreatedOn :
                        {{ new Date(task.createdOn).toLocaleString("en-GB", { timeZone: timezone }) }}
                    </h1>
                    <h1 class="font-bold itbkk-updated-on">UpdatedOn :
                        {{ new Date(task.updatedOn).toLocaleString("en-GB", { timeZone: timezone }) }}
                    </h1>
                </div>
                <div class="flex justify-end mt-4 col-start-3">
                    <button @click="$emit('closeModal', false)"
                        class="btn bg-green-500 hover:bg-green-700 text-white btn">Save</button>
                    <button @click="$emit('closeModal', false)"
                        class="btn bg-red-500 hover:bg-red-700 text-white btn">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>