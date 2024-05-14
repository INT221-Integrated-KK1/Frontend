<script setup>
import { ref, onMounted } from "vue";
import { getItemById, getItems } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/libs/StatusManagement.js";
const { params } = useRoute();
const tranferModal = ref(false);
const confirmModal = ref(false);
const id = Number(params.id);
const statusmanager = ref(new StatusManagement());

const emit = defineEmits(["close"]);
const count = ref(0);

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
    }
});

const transferConfirm = () => {
    confirmModal.value = true;
    tranferModal.value = false;
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
                            There is {{count}} task associated with the status
                        </p>
                        <p class="text-lg pb-2 mb-2 break-words">Tranfer this task's status to :</p>
                        <select class="p-2 border-solid border-2 border-grey w-full mb-5 itbkk-status">
                            <option v-for="(status, index) in statusmanager.getStatus()" :key="index" :value="status.id">
                                {{ status.name }}
                            </option>
                        </select>
                        <div class="text-right">
                                <button class="btn bg-green-500 hover:bg-green-700 text-white mr-3"
                                    @click="transferConfirm()">
                                    Transfer
                                </button>
                            <router-link :to="{ name: 'status'}" >
                                <button class="btn bg-red-500 hover:bg-red-700 text-white" 
                                @click="$emit('close')">
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
                            <router-link :to="{ name: 'status'}">
                                <button class="btn bg-green-500 hover:bg-green-700 text-white mr-3"
                                   >
                                    Confirm
                                </button>
                            </router-link>
                            <router-link :to="{ name: 'status'}" >
                                <button class="btn bg-red-500 hover:bg-red-700 text-white" 
                                @click="$emit('close')">
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