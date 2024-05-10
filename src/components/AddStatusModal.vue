<script setup>
import { onMounted, ref } from "vue";
import { addItem, getItems } from "../libs/fetchUtils.js";
const showModal = ref(false);


const statusName = ref("");
const statusDescription = ref("");
const emit = defineEmits(["statusAdded"]);

const AddStatus = async () => {
    const newItem = {
        statusName: statusName.value,
        statusDescription: statusDescription.value
    };
    try {
        const items = await addItem(import.meta.env.VITE_BASE_STATUS_URL, newItem);
        console.log(items);
        console.log(newItem);
        statusName.value = "";
        statusDescription.value = "";
        showModal.value = false;
        emit("statusAdded", items);
    } catch (error) {
        console.log(`Error fetching data: ${error}`);
    }
};


</script>
 
<template>

    <button @click="showModal = true"
        class="itbkk-button-add right-3 bottom-3 p-4 px-6 text-lg fixed bg-green-500 text-white hover:bg-green-600 rounded-full">
        +
    </button>

    <div v-if="showModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
            <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">

                <div class="itbkk-modal-status col-start-1 col-span-3">
                    <h1 class="font-bold text-2xl py-2 mb-2">Add new status</h1>

                    <h1 class="font-bold mt-2">Name : <span class="text-red-600">*</span></h1>
                    <input class="itbkk-status-name p-2 border-solid border-2 border-grey w-full mb-3 break-words"
                        placeholder="Name here" v-model="statusName" />
                    <h1 class="font-bold mt-2">Description : </h1>
                    <textarea
                        class="itbkk-status-description p-2 border-solid border-2 border-grey w-full mb-3 break-words"
                        rows="4" placeholder="Description here" v-model="statusDescription" />
                </div>
                <hr class="col-start-1 col-span-3" />

                <div class="flex justify-end mt-4 col-start-3">
                    <router-link :to="{ name: 'status' }">
                        <button class='itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3' @click="AddStatus">
                            Save
                        </button>
                    </router-link>
                    <router-link :to=" { name: 'status' }">
                        <button class="itbkk-button-cancel btn bg-red-500 hover:bg-red-700 text-white"
                            @click="showModal = false">
                            Cancel
                        </button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

    <style scoped>

    </style>
