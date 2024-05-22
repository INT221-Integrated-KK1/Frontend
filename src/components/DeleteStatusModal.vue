<script setup>
import { ref, onMounted } from "vue";
import { getItemById, getItems, deleteItemById, editItem, deleteAndTransfer } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/libs/StatusManagement.js";
import NotFound from "@/views/NotFound.vue";

const route = useRoute();
const tranferModal = ref(false);
const confirmModal = ref(false);
const id = Number(route.params.id);
const task = ref(null);
const statusmanager = ref(new StatusManagement());

const emit = defineEmits(["taskNotfound", "close", "statusDeleted"]);
const count = ref(0);
const selectId = ref();

onMounted(async () => {
    try {
        task.value = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, id);
        console.log(task.value);
        const taskItems = await getItems(import.meta.env.VITE_BASE_TASK_URL);
        const statusItems = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
        if (taskItems.some(task => task.status.id === id)) {
            count.value = taskItems.filter(task => task.status.id === id).length;
            tranferModal.value = true;
            statusmanager.value.setStatuses(statusItems);
            statusmanager.value.deleteStatus(id);
        } else {
            confirmModal.value = true;
        }

    } catch (error) {
        console.error("Error fetching task details:", error)
        emit("taskNotfound");
    }
});
const transfer = ref(0)

async function transferConfirm(transferId) {
    if (transferId != undefined) {
        confirmModal.value = true;
        tranferModal.value = false; 
        const exist = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, id);
        console.log(exist);
        const item = await deleteAndTransfer(import.meta.env.VITE_BASE_STATUS_URL, id, transferId);
        if (item === undefined) {
            confirmModal.value = false;
            tranferModal.value = false;
            emit("taskNotfound")
        } else {
            transfer.value = 1;
            console.log(transfer);
            confirmModal.value = true;
        }
    } else {
        confirmModal.value = false;
        tranferModal.value = false;
        emit("taskNotfound")
        alert("Please select a status to transfer");
    }
}

async function DeleteStatus(deletedId) {
    try {
        const exist = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, deletedId);
        if (exist) {
            const item = await deleteItemById(import.meta.env.VITE_BASE_STATUS_URL, deletedId);
            statusmanager.value.deleteStatus(deletedId);
            emit("statusDeleted", deletedId);
        } else if (transfer.value === 1) {
            statusmanager.value.deleteStatus(deletedId);
            emit("statusDeleted", deletedId);
            transfer.value = 0;
        } else {
            emit("taskNotfound")
        }
        confirmModal.value = false;
    } catch (error) {
        console.error("Error fetching task details:", error)
        emit("taskNotfound")
    }
}


</script>

<template>
    <div v-if="$route.name === 'deletestatus'">
        <div v-if="tranferModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
                <div class="bg-white w-1/2 p-6 rounded shadow-lg">
                    <div class="">
                        <h1 class="font-bold text-2xl mb-2">Transfer a Status</h1>
                        <hr />
                        <p class="text-lg pt-2 mb-2 break-words">
                            There is {{ count }} task associated with the status
                        </p>
                        <p class="text-lg pb-2 mb-2 break-words">Tranfer this task's status to :</p>
                        <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status"
                            v-model="selectId">
                            <option v-for="(status, index) in statusmanager.getStatus()" :key="index"
                                :value="status.id">
                                {{ status.name }}
                            </option>
                        </select>
                        <div class="text-right">
                            <button class="btn bg-green-500 hover:bg-green-700 text-white mr-3"
                                @click="transferConfirm(selectId)" :disabled="selectId === undefined">
                                Transfer
                            </button>
                            <router-link :to="{ name: 'status' }">
                                <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="$emit('close')">
                                    Cancel
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="confirmModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
                <div class="bg-white w-1/2 p-6 rounded shadow-lg">
                    <div class="">
                        <h1 class="font-bold text-2xl mb-2">Confirm Status</h1>
                        <hr />
                        <p class="text-lg py-2 mb-2 break-words">
                            Do you want to confirm delete?
                        </p>

                        <div class="text-right">
                            <router-link :to="{ name: 'status' }">
                                <button class="btn bg-green-500 hover:bg-green-700 text-white mr-3"
                                    @click="DeleteStatus(id)">
                                    Confirm
                                </button>
                            </router-link>
                            <router-link :to="{ name: 'status' }">
                                <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="$emit('close')">
                                    Cancel
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <NotFound v-if="task === undefined" />
</template>

<style scoped></style>