<script setup>
import { onMounted, ref } from 'vue';
import { getItemById, deleteItemById } from '../libs/fetchUtils.js';
import { useRoute } from "vue-router";

const { params } = useRoute();
const showModal = ref(false);

const id = Number(params.taskId);
const task = ref(null);
const emit = defineEmits(['taskDeleted']);

onMounted(async () => {
    try {
        task.value = await getItemById(import.meta.env.VITE_BASE_TASK_URL, id);

    } catch (error) {
        console.error("Error fetching task details:", error)
    }
});

const deleteTask = async () => {
    try {
        await deleteItemById(import.meta.env.VITE_BASE_TASK_URL, id);
        console.log('Task deleted:', id);

        emit('taskDeleted', id);
        showModal.value = false;
    } catch (error) {
        console.error("Error deleting task:", error)
    }
}

</script>

<template>
    <div>
        <div class="text-black fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
                <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
                    <div class=" col-start-1 col-span-3">
                        <h1 class="font-bold text-2xl py-2 mb-2">Delete this task?</h1>
                        <router-link to="/task">
                            <button class="btn bg-green-500 hover:bg-green-700 text-white" @click="deleteTask">
                                Save
                            </button>
                        </router-link>
                        <router-link to="/task">
                            <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="showModal = false">
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