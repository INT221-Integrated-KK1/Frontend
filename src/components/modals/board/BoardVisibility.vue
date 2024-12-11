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
    changeBoardVisibility(`${import.meta.env.VITE_BASE_URL}/boards`, props.boardId, visibilityState);
    showModal.value = false;
};


const cancelChange = () => {
    showModal.value = false;
};
const disabled = ref(false);

onMounted(async () => {
    const boardItems = await getItemById(`${import.meta.env.VITE_BASE_URL}/boards`, props.boardId);
    boardItems.owner.oid === localStorage.getItem('oid') ? disabled.value = false : disabled.value = true;
    const state = boardItems.visibility === 'public' ? true : false;
    isChecked.value = state;
});
</script>

<template>
    <div :class="disabled ? 'flex justify-center items-center space-x-4 mr-5 tooltip' : 'flex justify-center items-center space-x-4 mr-5'"
        :data-tip="disabled ? 'You need to be board owner to perform this action' : ''">
        <input type="checkbox" class="toggle toggle-accent itbkk-board-visibility" :checked="isChecked"
            @click.prevent="toggleVisibility" :disabled="disabled" />

        <span class="text-md font-semibold">
            {{ isChecked ? ' Public' : 'Private' }} </span>
    </div>

    <div v-if="showModal && isChecked === false" class="itbkk-modal-task text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
            <div class="bg-white w-1/3 p-6 rounded shadow-lg">
                <div class="">
                    <h1 class="text-2xl font-bold">Alert: board visibility to Public</h1>
                    <p class="py-2">
                        In public, any one can view the board, task list and task detail of tasks in the board.
                    </p>
                    <p class="itbkk-message">
                        Do you want to change board visibility to public?
                    </p>
                    <div class="modal-action">
                        <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="cancelChange">Cancel</button>
                        <button class="btn bg-green-500 hover:bg-green-700 text-white mx-3"
                            @click="confirmChange">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else-if="showModal && isChecked === true"
        class="itbkk-modal-task text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
            <div class="bg-white w-1/3 p-6 rounded shadow-lg">
                <div class="">
                    <h1 class="text-2xl font-bold">Alert: board visibility to Private</h1>
                    <p class="py-2">In private, only board owner can access/control board.

                    </p>
                    <p class="itbkk-message">
                        Do you want to change board visibility to private?
                    </p>
                    <div class="modal-action">
                        <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="cancelChange">Cancel</button>
                        <button class="btn bg-green-500 hover:bg-green-700 text-white mx-3"
                            @click="confirmChange">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped></style>
