<script setup>
import { ref, onMounted } from "vue";
import { StatusManagement } from "@/libs/StatusManagement.js";
import { getItems } from "@/libs/fetchUtils";
import AddStatusModal from "@/components/AddStatusModal.vue";

const statusmanager = ref(new StatusManagement());
const todo = ref([]);

const handleStatusAdded = (items) => {
    statusmanager.value.addStatus(items);
    todo.value = statusmanager.value.getStatus();
};

onMounted(async () => {
    try {
        const items = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
        todo.value = items;
        statusmanager.value.setStatuses(items);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});

const actionBtn = `<button class="btn mr-5 h-12">edit</button>
                        <button class="btn h-12">delete</button>`;

</script>

<template>
    <div class="flex justify-end mr-52 mt-5">
        <RouterLink :to="{ name: 'task' }">
            <div class="btn ">Home</div>
        </RouterLink>
    </div>
    <!-- demo table -->
    <div class="overflow-x-auto flex justify-center">
        <table class="table w-3/4 mt-10 border-solid border-2 border-black">
            <thead>
                <tr class="bg-orange-200 border-solid border-2 border-black text-xl text-black">
                    <th class="w-20"></th>
                    <th class="font-bold">Name</th>
                    <th class="font-bold">Description</th>
                    <th class="font-bold">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(status, index) in statusmanager.getStatus()" :key="index"
                    class="border-solid border-2 border-black h-16">
                    <th class="font-semibold text-center">{{ index + 1 }}</th>
                    <td>{{ status.statusName }}</td>
                    <td>{{ status.statusDescription }}</td>
                    <td v-html="status.statusName === 'No Status' ? '' :actionBtn "></td>
                </tr>
            </tbody>
        </table>
    </div>

    <router-link :to="{ name: 'addstatus' }">
        <AddStatusModal @statusAdded="handleStatusAdded" />
    </router-link>
</template>

<style scoped></style>