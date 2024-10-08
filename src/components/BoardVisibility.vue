<script setup>
import { ref } from 'vue';

const props = defineProps({
    boardId: String,
});
//รอจัดการส่วน owner

const isChecked = ref(false);
const showModal = ref(false);

const pendingState = ref(null);

const toggleVisibility = () => {
    pendingState.value = !isChecked.value;
    showModal.value = true;
};

const confirmChange = () => {
    isChecked.value = pendingState.value;
    showModal.value = false;
};


const cancelChange = () => {
    showModal.value = false;
};
</script>

<template>
    <div class="flex justify-center items-center space-x-4 mr-5">

        <input type="checkbox" class="toggle toggle-accent" :checked="isChecked" @click.prevent="toggleVisibility" />

        <span class="text-md font-semibold">
            {{ isChecked ? 'Public' : 'Private' }}
        </span>
    </div>


    <div v-if="showModal && isChecked === false" class="modal modal-open itbkk-modal-alert">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Alert: board visibility to Public</h3>
            <p class="py-4">
                In public, any one can view the board, task list and task detail of tasks in the board.
            </p>
            <p class="itbkk-message">
                Do you want to change board visibility to public?
            </p>
            <div class="modal-action">
                <button class="btn btn-outline itbkk-button-cancel" @click="cancelChange">Cancel</button>
                <button class="btn btn-primary itbkk-button-confirm" @click="confirmChange">Confirm</button>
            </div>
        </div>
    </div>

    <div v-else-if="showModal && isChecked === true" class="modal modal-open itbkk-modal-alert">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Alert: board visibility to Private</h3>
            <p class="py-4">In private, only board owner can access/control board.

            </p>
            <p class="itbkk-message">
                Do you want to change the visibility to private?
            </p>
            <div class="modal-action">
                <button class="btn btn-outline itbkk-button-cancel" @click="cancelChange">Cancel</button>
                <button class="btn btn-primary itbkk-button-confirm" @click="confirmChange">Confirm</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
