<script setup>
import { ref, watch } from "vue";
import { getItemById, getItems, deleteItemById, deleteAndTransfer } from "@/libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/stores/StatusManagement.js";
const route = useRoute();
const tranferModal = ref(false);
const confirmModal = ref(false);
const id = Number(route.params.id);
const task = ref(null);

const statusmanager = ref(new StatusManagement());

const emit = defineEmits(["taskNotfound", "close", "statusDeleted"]);
const count = ref(0);
const selectId = ref();
const transfer = ref(0)
const boardId = route.params.boardId;
const taskUrl = `${import.meta.env.VITE_BASE_URL}/boards/${boardId}/tasks`;
const statusUrl = `${import.meta.env.VITE_BASE_URL}/boards/${boardId}/statuses`;

const props = defineProps({
    deleteModal: Boolean,
    idDelete: Number,
});

watch(
    () => [props.deleteModal, route.name],
    async ([deleteModal, routeName]) => {
        if (deleteModal || routeName === 'deletestatus') {
            await fetchTaskDetails(id || props.idDelete);
        }
    },
    { immediate: true }
);

async function fetchTaskDetails(id) {
    try {
        task.value = await getItemById(statusUrl, id);
        const taskItems = await getItems(taskUrl);
        const statusItems = await getItems(statusUrl);
        statusmanager.value.setStatuses(statusItems);
        if (taskItems.some(task => task.status.id === id)) {
            count.value = taskItems.filter(task => task.status.id === id).length;
            tranferModal.value = true;
            confirmModal.value = false;
        } else {
            tranferModal.value = false;
            confirmModal.value = true;
        }

    } catch (error) {
        console.error("Error fetching task details:", error)
        emit("taskNotfound");
    }
};

async function transferConfirm(transferId) {
    if (transferId != undefined) {
        confirmModal.value = true;
        tranferModal.value = false;
        // await getItemById(statusUrl, id || props.idDelete);
        await deleteAndTransfer(statusUrl, id || props.idDelete, transferId);
        transfer.value = 1;
        confirmModal.value = true;
    } else {
        confirmModal.value = false;
        tranferModal.value = false;
        emit("taskNotfound")
        alert("Please select a status to transfer");
    }
}

async function DeleteStatus(deletedId) {
    try {
        if (transfer.value === 1) {
            statusmanager.value.deleteStatus(deletedId);
            emit("statusDeleted", deletedId);
            transfer.value = 0;
        } else {
            const exist = await getItemById(statusUrl, deletedId);
            if (exist) {
                await deleteItemById(statusUrl, deletedId);
                statusmanager.value.deleteStatus(deletedId);
                emit("statusDeleted", deletedId);
            } else {
                emit("taskNotfound")
            }
        }
        confirmModal.value = false;
        tranferModal.value = false;
    } catch (error) {
        console.error("Error fetching task details:", error)
        emit("taskNotfound")
    }
}

const closeModal = () => {
    tranferModal.value = false;
    confirmModal.value = false;
    emit("close");
};


</script>

<template>
    <div v-if="deleteModal || $route.name === 'deletestatus'">
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
                            <option
                                v-for="(status, index) in statusmanager.getStatus().filter(status => status.id !== (id || props.idDelete))"
                                :key="index" :value="status.id">
                                {{ status.name }}
                            </option>
                        </select>
                        <div class="text-right">
                            <button class="itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mr-3"
                                @click="transferConfirm(selectId)" :disabled="selectId === undefined">
                                Transfer
                            </button>
                            <router-link :to="{ name: 'status' }">
                                <button class="itbkk-button-cancel btn bg-red-500 hover:bg-red-700 text-white"
                                    @click="closeModal">
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
                                    @click="DeleteStatus(id || props.idDelete)">
                                    Confirm
                                </button>
                            </router-link>
                            <router-link :to="{ name: 'status' }">
                                <button class="btn bg-red-500 hover:bg-red-700 text-white" @click="closeModal">
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