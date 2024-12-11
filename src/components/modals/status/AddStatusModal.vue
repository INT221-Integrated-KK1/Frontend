<script setup>
import { ref } from "vue";
import { addItem, getItems } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";

const { params } = useRoute();
const boardId = params.boardId;
const statusUrl = `${import.meta.env.VITE_BASE_URL}/boards/${boardId}/statuses`;
const showModal = ref(false);
const name = ref("");
const description = ref("");
const emit = defineEmits(["statusAdded"]);

const checkWhiteSpace = (title) => {
    return /^\s*$/.test(title);
};

const AddStatus = async () => {
    const notOwner = ref(false);

    const trimStatusName = ref(name.value.trim());
    const trimStatusDescription = ref(description.value.trim());

    const newItem = {
        name: trimStatusName.value,
        description: trimStatusDescription.value
    };

    const existingStatus = await getItems(statusUrl);
    if (existingStatus.some((status) => status.name.toLowerCase() === newItem.name.toLowerCase())) {
        alert("Status name already exists");
        name.value = "";
        description.value = "";
        emit("statusAdded", undefined);
        showModal.value = false;
    } else if (newItem.name === "") {
        alert("Status name cannot be empty");
        name.value = "";
        description.value = "";
        emit("statusAdded", undefined);
        showModal.value = false;
    } else if (trimStatusName.value.length > 50) {
        alert("Status name cannot contain more than 50 characters");
        name.value = "";
        description.value = "";
        emit("statusAdded", undefined);
        showModal.value = false;
    } else if (trimStatusDescription.value.length > 200) {
        alert("Description cannot contain more than 200 characters");
        emit("statusAdded", undefined);
        showModal.value = false;
    } else {
        try {
            const items = await addItem(statusUrl, newItem);
            name.value = "";
            description.value = "";
            showModal.value = false;
            emit("statusAdded", items);
        } catch (error) {
            console.error(`Error fetching data: ${error}`);
            emit("statusAdded", undefined);
        }
    }

};
</script>

<template>
    <div v-if="$route.name === 'addstatus' || showModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
            <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">

                <div class="itbkk-modal-status col-start-1 col-span-3">
                    <h1 class="font-bold text-2xl py-2 mb-2">Add new status</h1>

                    <h1 class="font-bold mt-2">Name : <span class="none text-red-600"
                            :class="{ 'hidden': name.trim().length > 0 }">*</span></h1>
                    <input class="itbkk-status-name p-2 border-solid border-2 border-grey w-full mb-3 break-words"
                        placeholder="Name here" v-model="name" />
                    <span class="text-gray-500 text-sm"
                        :class="{ 'text-red-500': name.trim().length > 50 || name.trim().length === 0 }"> {{
                            name.trim().length }} / 50 characters </span>

                    <h1 class=" font-bold mt-2">Description : </h1>
                    <textarea
                        class="itbkk-status-description p-2 border-solid border-2 border-grey w-full mb-3 break-words"
                        rows="4" placeholder="Description here" v-model="description" />
                    <span class="text-gray-500 text-sm" :class="{ 'text-red-500': description.trim().length > 200 }">{{
                        description.trim().length }} / 200 characters</span>
                </div>
                <hr class=" col-start-1 col-span-3" />

                <div class="flex justify-end mt-4 col-start-3 ">
                    <router-link :to="{ name: 'status' }">
                        <button class='itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3'
                            @click="AddStatus" :disabled="checkWhiteSpace(name)">
                            Save
                        </button>
                    </router-link>
                    <router-link :to="{ name: 'status' }">
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

<style scoped></style>