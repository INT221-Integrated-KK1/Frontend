<script setup>
import { ref, onMounted } from "vue";
import { StatusManagement } from "@/libs/StatusManagement.js";
import { getItems } from "@/libs/fetchUtils";

const statusmanager = ref(new StatusManagement());
const todo = ref([]);

onMounted(async () => {
    try {
        const items = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
        todo.value = items;
        statusmanager.value.setStatuses(items);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});

</script>

<template>
    <div class="flex justify-end mr-52">
        <RouterLink :to="{ name: 'task' }">
            <div class="btn mt-">Home</div>
        </RouterLink>
    </div>
    <!-- demo table -->
    <div class="overflow-x-auto flex justify-center">
        <table class="table w-3/4 mt-10 rounded-lg border-solid border-2 border-black">
            <thead>
                <tr class="bg-pink-300  rounded-lg border-solid border-2 border-black text-xl text-black">
                    <th class=""></th>
                    <th class="font-bold">Name</th>
                    <th class="font-bold">Description</th>
                    <th class="font-bold">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(status, index) in statusmanager.getStatus()" :key="index"
                    class=" rounded-lg border-solid border-2 border-black">
                    <th>{{ index + 1 }}</th>
                    <td>{{ status.statusName }}</td>
                    <td>{{ status.statusDescription }}</td>
                    <td><button class="btn mr-5">edit</button>
                        <button class="btn">delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped></style>