<script setup>
import { changeBoardVisibility, getItemById } from '@/libs/fetchUtils';
import { ref, onMounted } from 'vue';

const props = defineProps({
    boardId: String,
});

const isChecked = ref(false);
const showModal = ref(false);

const pendingState = ref(null);

const toggleVisibility = () => {
    pendingState.value = !isChecked.value;
    showModal.value = true;
};

const confirmChange = () => {
    isChecked.value = pendingState.value;
    const visibilityState = isChecked.value ? 'public' : 'private';
    changeBoardVisibility(import.meta.env.VITE_BASE_BOARDS_URL, props.boardId, visibilityState);
    showModal.value = false;
};


const cancelChange = () => {
    showModal.value = false;
};
const disabled = ref(false);

onMounted(async () => {
    const boardItems = await getItemById(import.meta.env.VITE_BASE_BOARDS_URL, props.boardId);
    boardItems.owner.name === localStorage.getItem('username') ? disabled.value = false : disabled.value = true;    
    const state = boardItems.visibility === 'public' ? true : false;
    isChecked.value = state;
});
</script>

<template>
    <div class="flex justify-center items-center space-x-4 mr-5">

        <input type="checkbox" class="toggle toggle-accent itbkk-board-visibility" :checked="isChecked"
            @click.prevent="toggleVisibility" :disabled="disabled"/>

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
                Do you want to change board visibility to private?
            </p>
            <div class="modal-action">
                <button class="btn btn-outline itbkk-button-cancel" @click="cancelChange">Cancel</button>
                <button class="btn btn-primary itbkk-button-confirm" @click="confirmChange">Confirm</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
