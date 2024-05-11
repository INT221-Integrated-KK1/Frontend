<script setup>
import { ref, onMounted } from "vue";
import { StatusManagement } from "@/libs/StatusManagement.js";
import { getItems, getItemById } from "@/libs/fetchUtils";
import AddStatusModal from "@/components/AddStatusModal.vue";
import EditStatusModal from "./EditStatusModal.vue";

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

// add handler
const showNewTaskAdded = ref(false);
const showUpdatedError = ref(false);
const addedTasksTitle = ref("");

const handleStatusAdded = (items) => {
    if (items.statusId !== 0) {
        statusmanager.value.addStatus(items);
        todo.value = statusmanager.value.getStatus();
        showNewTaskAdded.value = true;
        setTimeout(() => {
            showNewTaskAdded.value = false;
        }, 3000);
        addedTasksTitle.value = items.statusName;
    } else {
        showUpdatedError.value = true;
    }
    
};



// edit handler

const editModal = ref(false);

const closeEditModal = () => {
    editModal.value = false;
};

const taskDetails = ref({});
async function showEditModals(status) {
    const items = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, status.statusId);
    if (items !== null || undefined) {
        taskDetails.value = items;
        editModal.value = true;

    } else {
        showUpdatedError.value = true;
    }
}

const saveChanges = async (editedTask, id) => {
    statusmanager.value.editStatus(id, editedTask);
    statusmanager.value.getStatus();
    todo.value = statusmanager.value.getStatus();
    console.log(todo.value);
    closeEditModal();
}

const actionBtn = `<RouterLink :to="{ name: 'editstatus', params: { id: status.statusId }  }"> <button class="btn mr-5 h-12">edit</button> </RouterLink> <button class="btn h-12">delete</button>`;

</script>

<template>

    <div class="flex justify-center items-center">
        <div v-if="showNewTaskAdded" class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showNewTaskAdded = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold break-words">
                    The task "{{ addedTasksTitle }}" is added successfully
                </p>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center">
        <div v-if="showNewTaskError" class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Error</h1>
                    <button @click="showNewTaskError = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold break-words">
                    An error occurred adding the new task
                </p>
            </div>
        </div>
    </div>

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
                    <!-- <td v-html="status.statusName === 'No Status' ? '' : actionBtn"></td> -->
                    <td>
                        <RouterLink :to="{ name: 'editstatus', params: { id: status.statusId } }">
                            <button class="btn mr-5 h-12" @click="showEditModals(status)" :disabled="status.statusName === 'No Status'">edit</button>
                        </RouterLink>
                        <button class="btn h-12" :disabled="status.statusName === 'No Status'">delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <router-link :to="{ name: 'addstatus' }">
        <AddStatusModal @statusAdded="handleStatusAdded" />
    </router-link>
    <Teleport to="body">
        <EditStatusModal v-if="editModal == true" @close="closeEditModal" @saveChanges="saveChanges"
            :taskDetailsProp="taskDetails" />
    </Teleport>

</template>

<style scoped></style>