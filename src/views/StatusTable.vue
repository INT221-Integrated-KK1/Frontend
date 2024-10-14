<script setup>
import { ref, onMounted } from "vue";
import { StatusManagement } from "@/libs/StatusManagement.js";
import { getItems, getItemById, editItem } from "@/libs/fetchUtils";
import Sidebar from "@/components/Sidebar.vue";
import AddStatusModal from "@/components/modals/status/AddStatusModal.vue";
import EditStatusModal from "@/components/modals/status/EditStatusModal.vue";
import DeleteStatusModal from "@/components/modals/status/DeleteStatusModal.vue";
import AlertBox from "@/components/AlertBox.vue";
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
                            <div class="itbkk-button-add bg-green-500 text-white hover:bg-green-600 btn font-semibold mr-5"
                                >
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
                                        <span class=" block p-2 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                viewBox="0 0 24 24">
                                                <path fill="#888888"
                                                    d="M15.748 2.947a2 2 0 0 1 2.829 0l2.474 2.475a2 2 0 0 1 0 2.829l-2.35 2.35l-2.202 2.202l-1.415-1.414l1.496-1.496l-2.475-2.474l-1.495 1.495L11.195 7.5l2.203-2.203zm-.228 3.057l2.474 2.475l1.643-1.643l-2.475-2.474zM4 2.586L21.414 20L20 21.414l-6.056-6.056l-4.786 4.786l-6.38 1.076l1.077-6.38l4.785-4.785L2.586 4zm6.055 8.883L5.72 15.803l-.503 2.977l2.977-.502l4.335-4.334z" />
                                            </svg>
                                        </span>
                                    </td>
                                </div>
                                <div v-else>
                                    <RouterLink :to="{ name: 'editstatus', params: { id: status.id } }">
                                        <td class="itbkk-button-action" @click="showEditModals(status.id)">
                                            <span class="itbkk-button-edit block p-2 text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                    viewBox="0 0 24 24">
                                                    <g fill="none" fill-rule="evenodd">
                                                        <path
                                                            d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z" />
                                                        <path fill="#888888"
                                                            d="M13.896 3.03a2 2 0 0 1 2.701-.117l.127.117l4.243 4.243a2 2 0 0 1 .117 2.7l-.117.128l-10.314 10.314a2 2 0 0 1-1.238.578L9.239 21H4.006a1.01 1.01 0 0 1-1.004-.9l-.006-.11v-5.233a2 2 0 0 1 .467-1.284l.12-.13L13.895 3.03ZM12.17 7.584l-7.174 7.174V19H9.24l7.174-7.174l-4.243-4.243Zm3.14-3.14L13.584 6.17l4.243 4.243l1.726-1.726z" />
                                                    </g>
                                                </svg>
                                            </span>
                                        </td>
                                    </RouterLink>
                                </div>
                                <div v-if="notOwner === true">
                                    <td class="itbkk-button-delete">
                                        <span class="block p-2 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                viewBox="0 0 24 24">
                                                <path fill="#888888"
                                                    d="M3.94 5L2.22 3.28a.75.75 0 1 1 1.06-1.06l18.5 18.5a.75.75 0 0 1-1.06 1.06l-2.19-2.19A3.75 3.75 0 0 1 15.025 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm13.338 13.34L15 16.06v1.19a.75.75 0 0 1-1.5 0v-2.69l-3-3v5.69a.75.75 0 0 1-1.5 0v-7.19L5.59 6.652l1.144 11.816a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033zM13.5 10.318l1.5 1.5V9.75a.75.75 0 0 0-1.5 0zM18.424 6.5l-.771 7.971l1.374 1.374l.904-9.345h1.319a.75.75 0 0 0 0-1.5H15.5a3.5 3.5 0 1 0-7 0h-.318l1.5 1.5zM14 5h-4a2 2 0 1 1 4 0" />
                                            </svg>
                                        </span>
                                    </td>
                                </div>
                                <div v-else>
                                    <RouterLink :to="{ name: 'deletestatus', params: { id: status.id } }">
                                        <td class="itbkk-button-action" @click="showDeleteModals(status)">
                                            <span class="itbkk-button-delete block p-2 text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                    viewBox="0 0 24 24">
                                                    <g fill="none">
                                                        <path
                                                            d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                                        <path fill="#888888"
                                                            d="M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07A1.01 1.01 0 0 1 4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z" />
                                                    </g>
                                                </svg>
                                            </span>
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