<script setup>
import { ref, computed } from 'vue';
import { addItem, getItems } from '@/libs/fetchUtils';
import { BoardManagement } from '@/libs/BoardManagement';
import router from '@/router';


const showModal = ref(false);
const props = defineProps({
    boardId: String,
    notOwner: Boolean
});

const openModal = () => {
    showModal.value = true;
};

const confirmChange = () => {
    console.log('confirmChange');
    showModal.value = false;
};

const cancelChange = () => {
    console.log('cancelChange');
    showModal.value = false;
};



</script>

<template>

    <!-- add task -->
    <div v-if="notOwner === true">
        <div class="itbkk-button-add bg-green-500 hover:bg-green-600 btn font-semibold mr-5" disabled="disabled">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
            </svg>
            Add Collaborator
        </div>
    </div>
    <div v-else @click.prevent="openModal">
        <div class="itbkk-button-add bg-green-500 text-white hover:bg-green-600 btn font-semibold mr-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
            </svg>
            Add Collaborator
        </div>
    </div>

    <div v-if="showModal === true" class="modal modal-open itbkk-modal-alert">
        <div class="modal-box space-y-4 ">
            <h3 class="font-bold text-xl text-gray-800 ml-2">Add Collaborator</h3>

            <div class="flex p-2">
                <div class="w-full mr-3">
                    <label class="font-semibold text-gray-700 block">Collaborator e-mail</label>
                    <input type="email" class="input input-bordered w-full " placeholder="Enter Collaborator e-mail"
                        v-model="email" />
                </div>
                <div class="w-1/2">
                    <label class="font-semibold text-gray-700 block">Access Right</label>
                    <select class="select select-bordered w-full max-w-xs">
                        <option selected>READ</option>
                        <option>WRITE</option>
                    </select>
                </div>
            </div>

            <div class="modal-action space-x-2">
                <button class="btn bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md px-4 py-2"
                    @click="confirmChange">
                    Confirm
                </button>
                <button class="btn bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-md px-4 py-2"
                    @click="cancelChange">
                    Cancel
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped></style>
