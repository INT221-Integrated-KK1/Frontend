<script setup>
import { ref } from 'vue';

const showNewTaskAdded = ref(false);
const showNewTaskError = ref(false);
const showDeleted = ref(false);
const showDeletedError = ref(false);
const showUpdated = ref(false);
const showUpdatedError = ref(false);
const addedTasksTitle = ref('');
const updatedTaskTitle = ref('');

if (showNewTaskAdded.value == true || showNewTaskError.value == true || showDeleted.value == true || showDeletedError.value == true || showUpdated.value == true || showUpdatedError.value == true) {
    setTimeout(() => {
        showNewTaskAdded.value = false;
        showNewTaskError.value = false;
        showDeleted.value = false;
        showDeletedError.value = false;
        showUpdated.value = false;
        showUpdatedError.value = false;
    }, 3000);
}

function AlertTaskAdded() {
    showNewTaskAdded.value = true;
    console.log(showNewTaskAdded.value);
    
}
</script>

<template>

    <!-- add task alert -->
    <div class="flex justify-center items-center" @AlertTaskAdded="AlertTaskAdded">
        <div  class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showNewTaskAdded = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold break-words">
                    The task "{{ addedTasksTitle }}" is added successfully
                </p>
            </div>
        </div>
    </div>



    <div class="flex justify-center items-center">
        <div v-if="showNewTaskError" class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Error</h1>
                    <button @click="showNewTaskError = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">
                    An error occurred adding the new task
                </p>
            </div>
        </div>
    </div>

    <!-- delete task alert -->
    <div class="flex justify-center items-center">
        <div v-if="showDeleted" class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showDeleted = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">The task has been deleted</p>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center">
        <div v-if="showDeletedError" class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Error</h1>
                    <button @click="showDeletedError = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">
                    An error occurred, the task does not exist
                </p>
            </div>
        </div>
    </div>


    <!-- edit task alert -->

    <div v-if="showUpdated" class="flex justify-center items-center">
        <div class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showUpdated = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold break-words">The task "{{ updatedTaskTitle }}" is updated
                    successfully
                </p>
            </div>
        </div>
    </div>

    <div v-if="showUpdatedError" class="flex justify-center items-center">
        <div class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Error</h1>
                    <button @click="showUpdatedError = false" class="px-4 py-2 rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">
                    An error has occurred, the task does not exist
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>