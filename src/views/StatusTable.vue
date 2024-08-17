<script setup>
import { ref, onMounted } from "vue";
import { StatusManagement } from "@/libs/StatusManagement.js";
import { getItems, getItemById, editItem } from "@/libs/fetchUtils";
import AddStatusModal from "@/components/AddStatusModal.vue";
import EditStatusModal from "@/components/EditStatusModal.vue";
import DeleteStatusModal from "@/components/DeleteStatusModal.vue";
import AlertBox from "@/components/AlertBox.vue";

const tableType = "status";
const statusmanager = ref(new StatusManagement());
const todo = ref([]);
const isDefault = (status) => status.name === "No Status";


onMounted(async () => {
    try {
        const items = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
        todo.value = items;
        statusmanager.value.setStatuses(items);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
});

// ----------------------------------- add handler -----------------------------------

const showAdded = ref(false);
const showAddedError = ref(false);
const addedTitle = ref("");

const handleStatusAdded = (items) => {
    if (items !== undefined) {
        statusmanager.value.addStatus(items);
        todo.value = statusmanager.value.getStatus();
        showAdded.value = true;
        setTimeout(() => {
            showAdded.value = false;
        }, 3000);
        addedTitle.value = items.name;
    } else {
        showUpdatedError.value = true;
        setTimeout(() => {
            showUpdatedError.value = false;
        }, 3000);
    }

};


// ----------------------------------- edit handler -----------------------------------

const showUpdated = ref(false);
const showUpdatedError = ref(false);
const editModal = ref(false);

const closeEditModal = () => {
    editModal.value = false;
};


async function showEditModals(status) {
    try {
        const items = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, status.id);
        if (items !== undefined) {
            editModal.value = true;
        } else {
            showUpdatedError.value = true;
            setTimeout(() => {
                showUpdatedError.value = false;
            }, 3000);
        }
    } catch (error) {
        showUpdatedError.value = true;
        setTimeout(() => {
            showUpdatedError.value = false;
        }, 3000);
    }
}

const updatedStatusName = ref("");
const saveChanges = async (statusProp, id) => {

    updatedStatusName.value = statusProp.name.trim();
    if (statusProp.description === "") {
        statusProp.description = null;
    }

    const checkinput = ref(0);

    if (statusProp.name.length > 50) {
        alert("Name cannot contain more than 50 characters");
        checkinput.value += 1;
    }

    console.log(statusProp.description);
    if (statusProp.description == null || statusProp.description == "" || statusProp.description == undefined) {
    }
    else if (statusProp.description.length > 200) {
        console.log(statusProp.description.length);
        alert("Description cannot contain more than 200 characters");
        checkinput.value += 1;
    }

    const editedStatus = {
        id: id,
        name: statusProp.name,
        description: statusProp.description
    };
    const existingStatus = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, id);
    if (!existingStatus) {
        closeEditModal();
        showUpdatedError.value = true;
        setTimeout(() => {
            showUpdatedError.value = false;
        }, 3000);
    } else {
        try {
            const item = await editItem(import.meta.env.VITE_BASE_STATUS_URL, id, editedStatus);
            if (checkinput.value > 0) {
                showUpdatedError.value = true;
                setTimeout(() => {
                    showUpdatedError.value = false;
                }, 3000);
                closeEditModal();
            } else {
                statusmanager.value.editStatus(id, { ...editedStatus });
                closeEditModal();
                showUpdated.value = true;
                setTimeout(() => {
                    showUpdated.value = false;
                }, 3000);
            }
        }
        catch (error) {
            console.error("Error editing status:", error);
            showUpdatedError.value = true;
            setTimeout(() => {
                showUpdatedError.value = false;
            }, 3000);
        }
    }
}
const EmptyStyle = "italic text-slate-400 font-semibold";

// ----------------------------------- delete handler -----------------------------------

const deleteModal = ref(false);
const showDeleted = ref(false);
const showDeletedError = ref(false);

const closeDeleteModal = () => {
    deleteModal.value = false;
};

async function showDeleteModals(status) {
    try {
        const items = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, status.id);
        console.log(items);
        if (items !== undefined) {
            deleteModal.value = true;
        } else {
            showDeletedError.value = true;
            setTimeout(() => {
                showDeletedError.value = false;
            }, 3000);
        }
    } catch (error) {
        console.log(error);
        showDeletedError.value = true;
        setTimeout(() => {
            showDeletedError.value = false;
        }, 3000);
    }
};

const handleStatusDeleted = (deletedid) => {
    statusmanager.value.deleteStatus(deletedid);
    console.log(deletedid);
    todo.value = statusmanager.value.getStatus();
    deleteModal.value = false;
    showDeleted.value = true;
    setTimeout(() => {
        showDeleted.value = false;
    }, 3000);
}


const handleStatusDeletedNotfound = () => {
    console.log("Received status not found: ");
    showDeletedError.value = true;
    setTimeout(() => {
        showDeletedError.value = false;
    }, 3000);
};

</script>

<template>
    <!-- Alert -->
    <AlertBox 
    :tableType="tableType"    
    :showAdded="showAdded" 
    :showAddedError="showAddedError" 
    :showDeleted="showDeleted"
    :showDeletedError="showDeletedError" 
    :showUpdated="showUpdated" 
    :showUpdatedError="showUpdatedError"
    :addedTitle="addedTitle"  />

    
    <div class="flex justify-end mr-52 mt-5">
        <RouterLink :to="{ name: 'task' }">
            <div class="btn ">Home</div>
        </RouterLink>
    </div>

    <!-- table -->

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
                    <td>
                        <div v-if="status.name && status.name.length > 10">
                            <span>{{ status.name.substring(0, 25) }}</span>
                            <br>
                            <span>{{ status.name.substring(26, 50) }}</span>
                        </div>
                        <div v-else>{{ status.name }}</div>
                    </td>
                    <td class="break-words"
                        :class="status.description === null || status.description === '' ? EmptyStyle : ''">
                        <div v-if="status.description && status.description.length > 50">
                            <span>{{ status.description.substring(0, 50) }}</span>
                            <br>
                            <span>{{ status.description.substring(51, 100) }}</span>
                            <br>
                            <span>{{ status.description.substring(101, 150) }}</span>
                            <br>
                            <span>{{ status.description.substring(151, 200) }}</span>
                        </div>
                        <div v-else>{{ status.description === null || status.description === "" ? "No Description Provided" : status.description }}</div>
                    </td>

                    <td v-if="isDefault(status) == false">
                        <RouterLink :to="{ name: 'editstatus', params: { id: status.id } }">
                            <button class="btn mr-5 h-12" @click="showEditModals(status)">edit</button>
                        </RouterLink>
                        <RouterLink :to="{ name: 'deletestatus', params: { id: status.id } }">
                            <button class="btn h-12" @click="showDeleteModals(status)">delete</button>
                        </RouterLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <router-link :to="{ name: 'addstatus' }">
        <AddStatusModal @statusAdded="handleStatusAdded" />
    </router-link>
    <Teleport to="body">
        <EditStatusModal v-if="editModal" @close="closeEditModal" @saveChanges="saveChanges" />
    </Teleport>
    <Teleport to="body">
        <DeleteStatusModal v-if="deleteModal == true" @close="closeDeleteModal" @statusDeleted="handleStatusDeleted"
            @taskNotfound="handleStatusDeletedNotfound()" />
    </Teleport>

</template>

<style scoped></style>