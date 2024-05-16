<script setup>
import { ref, onMounted } from "vue";
import { getItemById, getItems, deleteItemById, editItem } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/libs/StatusManagement.js";
const { params } = useRoute();
const tranferModal = ref(false);
const confirmModal = ref(false);
const id = Number(params.id);
const statusmanager = ref(new StatusManagement());

const emit = defineEmits(["taskNotfound", "close", "statusDeleted"]);
const count = ref(0);
const selectId = ref();

onMounted(async () => {
    try {
        const taskItems = await getItems(import.meta.env.VITE_BASE_TASK_URL);
        const statusItems = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
        if (taskItems.some(task => task.status.id === id)) {
            count.value = taskItems.filter(task => task.status.id === id).length;
            tranferModal.value = true;
            statusmanager.value.setStatuses(statusItems);
            statusmanager.value.deleteStatus(id);
            console.log(statusmanager.value.getStatus());
        } else {
            confirmModal.value = true;
        }

    } catch (error) {
        console.error("Error fetching task details:", error)
        emit("taskNotfound");
    }
});

async function transferConfirm(transferId) {
    if (transferId != 0 && transferId != undefined) {
        console.log("transferId = " + transferId);
        confirmModal.value = true;
        tranferModal.value = false;

        const taskItems = await getItems(import.meta.env.VITE_BASE_TASK_URL);
        for (let index = 0; index < taskItems.length; index++) {
            if (taskItems[index].status.id === id) {
                taskItems[index].status.id = transferId;
                taskItems[index].status.name = statusmanager.value.getStatusById(transferId).name;
                taskItems[index].status.description = statusmanager.value.getStatusById(transferId).description;
                console.log(taskItems[index]);
                await editItem(import.meta.env.VITE_BASE_TASK_URL, taskItems[index].id, taskItems[index]);
            }
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
        const item = await deleteItemById(import.meta.env.VITE_BASE_STATUS_URL, deletedId);
        statusmanager.value.deleteStatus(deletedId);
        emit("statusDeleted", deletedId);
        confirmModal.value = false;
    } catch (error) {
        console.error("Error fetching task details:", error)
        emit("taskNotfound")
    }
}


</script>

<template>
    <div>
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
                                @click="transferConfirm(selectId)">
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
</template>

<style scoped></style>