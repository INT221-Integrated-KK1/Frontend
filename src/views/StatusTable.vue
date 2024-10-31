<script setup>
import { ref, onMounted } from "vue";
import { StatusManagement } from "@/libs/StatusManagement.js";
import { getItems, getItemById, editItem } from "@/libs/fetchUtils";
import Sidebar from "@/components/Sidebar.vue";
import AddStatusModal from "@/components/modals/status/AddStatusModal.vue";
import EditStatusModal from "@/components/modals/status/EditStatusModal.vue";
import DeleteStatusModal from "@/components/modals/status/DeleteStatusModal.vue";
import AlertBox from "@/components/AlertBox.vue";
import DeleteIcons from "@/components/icons/DeleteIcons.vue";
import EditIcons from "@/components/icons/EditIcons.vue";
import { useRoute } from 'vue-router';
const { params } = useRoute();
const boardId = params.boardId;
const notOwner = ref(false);
const board = ref({});
const tableType = "status";
const statusmanager = ref(new StatusManagement());
const todo = ref([]);
const isDefault = (status) => status.name === "No Status" || status.name === "Done";

const statusUrl = `${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/statuses`;
onMounted(async () => {
    try {
        const items = await getItems(statusUrl);
        todo.value = items;
        statusmanager.value.setStatuses(items);
        const boardItems = await getItemById(import.meta.env.VITE_BASE_BOARDS_URL, boardId);
        board.value = boardItems;
        boardItems.owner.oid === localStorage.getItem('oid') ? notOwner.value = false : notOwner.value = true;
        console.log(notOwner.value);

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


async function showEditModals(id) {
    try {
        const items = await getItemById(statusUrl, id);
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

    if (statusProp.description == null || statusProp.description == "" || statusProp.description == undefined) {
    }
    else if (statusProp.description.length > 200) {
        alert("Description cannot contain more than 200 characters");
        checkinput.value += 1;
    }

    const editedStatus = {
        id: id,
        name: statusProp.name,
        description: statusProp.description
    };
    const existingStatus = await getItemById(statusUrl, id);
    if (!existingStatus) {
        closeEditModal();
        showUpdatedError.value = true;
        setTimeout(() => {
            showUpdatedError.value = false;
        }, 3000);
    } else {
        try {
            const item = await editItem(statusUrl, id, editedStatus);
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
        const items = await getItemById(statusUrl, status.id);
        if (items !== undefined) {
            deleteModal.value = true;
        } else {
            showDeletedError.value = true;
            setTimeout(() => {
                showDeletedError.value = false;
            }, 3000);
        }
    } catch (error) {
        console.error("Error fetching status:", error);
        showDeletedError.value = true;
        setTimeout(() => {
            showDeletedError.value = false;
        }, 3000);
    }
};

const handleStatusDeleted = (deletedid) => {
    statusmanager.value.deleteStatus(deletedid);
    todo.value = statusmanager.value.getStatus();
    deleteModal.value = false;
    showDeleted.value = true;
    setTimeout(() => {
        showDeleted.value = false;
    }, 3000);
}


const handleStatusDeletedNotfound = () => {
    showDeletedError.value = true;
    setTimeout(() => {
        showDeletedError.value = false;
    }, 3000);
};

</script>

<template>
    <div class="flex">
        <div>
            <Sidebar />
        </div>
        <div class="w-screen">
            <!-- Alert -->
            <AlertBox :tableType="tableType" :showAdded="showAdded" :showAddedError="showAddedError"
                :showDeleted="showDeleted" :showDeletedError="showDeletedError" :showUpdated="showUpdated"
                :showUpdatedError="showUpdatedError" :addedTitle="addedTitle" />
            <h1 class="text-4xl text-center font-bold mt-10">Status Management</h1>



            <div class="flex justify-between mx-52 mt-5 items-center ">
                <div class="flex justify-items-center ">
                    <RouterLink :to="{ name: 'task', params: { boardId: params.boardId } }">
                        <span class="mx-2 font-semibold text-teal-700">{{ board.name }} </span>
                    </RouterLink>
                    <span class="font-semibold">> Status</span>

                </div>

                <div class=" flex">

                    <div v-if="notOwner === true">
                        <div class="itbkk-button-add bg-green-500 text-white hover:bg-green-600 btn font-semibold mr-5"
                            disabled="disabled">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
                            </svg>
                            Add Status
                        </div>
                    </div>
                    <div v-else>
                        <router-link :to="{ name: 'addstatus' }">
                            <div
                                class="itbkk-button-add bg-green-500 text-white hover:bg-green-600 btn font-semibold mr-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
                                </svg>
                                Add Status
                            </div>
                        </router-link>
                    </div>

                    <RouterLink :to="{ name: 'task', params: { boardId: params.boardId } }">
                        <div class="btn ">Back to Board</div>
                    </RouterLink>
                </div>
            </div>

            <!-- table -->

            <div class="overflow-x-auto flex justify-center ">
                <table class="table w-3/4 mt-5 border-solid border-2 rounded-m border-black">
                    <thead>
                        <tr class="bg-orange-200 
         border-solid border-2 border-black text-xl text-black">
                            <th class="w-20"></th>
                            <th class="font-bold">Name</th>
                            <th class="font-bold">Description</th>
                            <th class="font-bold"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(status, index) in statusmanager.getStatus()" :key="index"
                            class="itbkk-item h-16 border-solid border-2 border-black">
                            <th class="font-semibold text-center">{{ index + 1 }}</th>
                            <td>
                                <div v-if="status.name && status.name.length > 10" class="itbkk-status-name">
                                    <span>{{ status.name.substring(0, 25) }}</span><br>
                                    <span>{{ status.name.substring(26, 50) }}</span>
                                </div>
                                <div v-else class="itbkk-status-name">{{ status.name }}</div>
                            </td>
                            <td class="break-words"
                                :class="status.description === null || status.description === '' ? EmptyStyle : ''">
                                <div v-if="status.description && status.description.length > 50">
                                    <span>{{ status.description.substring(0, 50) }}</span><br>
                                    <span>{{ status.description.substring(51, 100) }}</span><br>
                                    <span>{{ status.description.substring(101, 150) }}</span><br>
                                    <span>{{ status.description.substring(151, 200) }}</span>
                                </div>
                                <div v-else>
                                    {{ status.description === null || status.description === "" ?
                                    "No Description Provided" : status.description }}
                                </div>
                            </td>
                            <div v-if="!isDefault(status)" class="flex justify-center ">
                                <div v-if="notOwner === true">
                                    <td class="itbkk-button-edit">
                                        <EditIcons :isOff="notOwner" />
                                    </td>
                                </div>
                                <div v-else>
                                    <RouterLink :to="{ name: 'editstatus', params: { id: status.id } }">
                                        <td class="itbkk-button-action" @click="showEditModals(status.id)">
                                            <EditIcons :isOff="notOwner" />
                                        </td>
                                    </RouterLink>
                                </div>
                                <div v-if="notOwner === true">
                                    <td class="itbkk-button-delete">

                                        <DeleteIcons :isOff="notOwner" />
                                    </td>
                                </div>
                                <div v-else>
                                    <RouterLink :to="{ name: 'deletestatus', params: { id: status.id } }">
                                        <td class="itbkk-button-action" @click="showDeleteModals(status)">

                                            <DeleteIcons :isOff="notOwner" />
                                        </td>
                                    </RouterLink>
                                </div>
                            </div>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- <RouterView /> -->

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