<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getItemById, getItems, addItem, editPatchItem, deleteItemById, editItem } from "@/libs/fetchUtils";
import { CollabManagement } from "@/stores/CollabManagement";
import Sidebar from "@/components/Sidebar.vue";
import CollabModal from "@/components/modals/board/CollabModal.vue";
import AlertBox from "@/components/AlertBox.vue";
import router from "@/router";
import LoadingPage from "./LoadingPage.vue";
const readAccess = ref(false);

const showModal = ref(false);
const actionType = ref('');
const collabItem = ref(null);
const isPending = ref(true)
const isLoading = ref(false);

const Owner = ref(false);
const showAddedCollab = ref(false);
const showUpdated = ref(false);
const showDeleted = ref(false);
const addedCollabName = ref("");
const updatedTitle = ref("");
const tableType = ref("Collaborator");
const statusType = ref("PENDING");
const { params } = useRoute();
const boardId = params.boardId;
const board = ref([]);
const collabmanager = CollabManagement();

const openAddModal = () => {
    actionType.value = 'add';
    showModal.value = true;
};

const openEditModal = (collab) => {
    statusType.value = collab.status;
    actionType.value = 'edit';
    collabItem.value = collab;
    showModal.value = true;
};


const openRemoveModal = (collab) => {
    statusType.value = collab.status;
    actionType.value = 'remove';
    collabItem.value = collab;
    showModal.value = true;
};


function handleAddCollab(addCollab) {
    if (addCollab === undefined || addCollab === null) {
        showAddedCollab.value = false;
    } else {
        collabmanager.addCollab(addCollab);
        addedCollabName.value = addCollab.name;
        showAddedCollab.value = true;
        setTimeout(() => {
            showAddedCollab.value = false;
        }, 3000);
    }
}

const handleUpdateCollab = async (oid, accessRight, statusType) => {
    if (Owner.value === false) {
        router.push({ name: 'Forbidden' });
    } else if (statusType != undefined) {
        const updateInvite = {
            accessRight: accessRight,
            status: statusType
        }
        try {
            await fetch(`${import.meta.env.VITE_BASE_URL}api/invitations/${oid}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...updateInvite }),
            });

            const getPendingCollab = await getItems(`${import.meta.env.VITE_BASE_URL}api/boards/${boardId}/invitations`);
            const item = getPendingCollab.data;
            for (let i = 0; i < item.length; i++) {
                if (item[i].id === oid) {
                    {
                        const collab = {
                            name: item[i].name,
                            email: item[i].email,
                            accessRight: item[i].accessRight,
                        }
                        collabmanager.updateCollab(item[i].id, { ...collab });
                    }
                }
            }
        } catch (error) {
            console.error(`Error updating access right: ${error}`);
        }

    } else {
        try {
            const updateAccess = {
                accessRight: accessRight
            };
            const collabItem = await editPatchItem(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs/${oid}`, updateAccess);
            const collabEdit = {
                oid: collabItem.collabsId,
                name: collabItem.collabsName,
                email: collabItem.collabsEmail,
                accessRight: collabItem.accessLevel,
                addedOn: collabItem.addedOn
            }
            collabmanager.updateCollab(collabItem.collabsId, { ...collabEdit });
            updatedTitle.value = collabItem.collabsName;
            showUpdated.value = true;
            setTimeout(() => {
                showUpdated.value = false;
            }, 3000);
        } catch (error) {
            console.error(`Error updating access right: ${error}`);
        }
    }
}


const handleRemoveCollab = async (id, statusType) => {
    if (Owner.value === false) {
        router.push({ name: 'Forbidden' });
    } else if (statusType != undefined) {
        try {
            const token = localStorage.getItem("token");
            await fetch(`${import.meta.env.VITE_BASE_URL}api/invitations/${id}/cancel`, {

                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            collabmanager.removeCollab(id);
            showDeleted.value = true;
            setTimeout(() => {
                showDeleted.value = false;
            }, 3000);
        } catch (error) {
            console.error(`Error removing access right: ${error}`);
        }
    } else {
        try {
            await deleteItemById(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`, id);
            collabmanager.removeCollab(id);
            showDeleted.value = true;
            setTimeout(() => {
                showDeleted.value = false;
            }, 3000);
        } catch (error) {
            console.error(`Error removing access right: ${error}`);
        }
    }
}

async function handleiInviteCollab(inputItem) {
    try {
        isLoading.value = true;
        const existingCollab = collabmanager.getCollabs().find(collab => collab.email === inputItem.collaboratorEmail);

        if (existingCollab) {
            window.alert("The user is already a collaborator or pending collaborator of this board.");
            return;
        }

        if (localStorage.email === inputItem.collaboratorEmail) {
            window.alert("You cannot invite yourself to be a collaborator of this board.");
            return;
        }

        const inviteCollab = await addItem(`${import.meta.env.VITE_BASE_URL}api/boards/${boardId}/invite`, inputItem);

        if (inviteCollab.status === 404) {
            window.alert("User not found or AccessRight incorrect. Please recheck.");
        } else if (inviteCollab.status === 409) {
            window.alert("The user is already a collaborator or pending collaborator of this board.");
        } else if (inviteCollab.status === 200) {
            console.log(inviteCollab.message);
            const getPendingCollab = await getItems(`${import.meta.env.VITE_BASE_URL}api/boards/${boardId}/invitations`);
            const pendingCollabs = getPendingCollab.data;

            pendingCollabs.forEach(item => {
                if (item.email === inputItem.collaboratorEmail && item.boardId === boardId) {
                    const collab = {
                        name: item.name,
                        email: item.email,
                        accessRight: item.accessRight,
                        status: item.status
                    };
                    collabmanager.addCollab(collab);
                }
            });
        }
    } catch (error) {
        console.error(`Error adding collaborator: ${error}`);
    } finally {
        isLoading.value = false;
    }
}

const closeModal = () => {
    showModal.value = false;
};


onMounted(async () => {
    try {
        isLoading.value = true;

        const pending = await getItems(`${import.meta.env.VITE_BASE_URL}api/boards/${boardId}/invitations`);
        const collabMembers = await getItems(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`);

        if (collabMembers.status === 403) {
            window.alert("Access denied, you do not have permission to view this board");
            router.go(-1);
        } if (collabMembers.status === 401) {
            window.alert("Unauthorized, please login to view this board");
            router.push({ name: 'login' });
        }

        for (let i = 0; i < collabMembers.length; i++) {
            if (collabMembers[i].oid === localStorage.getItem('oid')) {
                if (collabMembers[i].accessRight === "READ") {
                    readAccess.value = true;
                }
            }
        }

        const boardItem = await getItemById(import.meta.env.VITE_BASE_BOARDS_URL, boardId);
        boardItem.owner.oid === localStorage.getItem('oid') ? Owner.value = true : Owner.value = false;
        board.value = boardItem;
        collabmanager.setCollabs(collabMembers);
        if (pending.data.length > 0) {
            for (let i = 0; i < pending.data.length; i++) {
                if (pending.data[i].status === 'PENDING') {
                    collabmanager.addCollab(pending.data[i]);
                } else if (pending.data[i].status === 'ACCEPTED' || pending.data[i].status === 'CANCEL') {
                    collabmanager.removeCollab(pending.data[i].id);
                }
            }
        }

        console.log("pending", pending);
        console.log("collabMembers", collabMembers);
    } catch (error) {
        console.error("Error fetching task details:", error)
    } finally {
        isLoading.value = false;
    }
})

</script>

<template>

    <LoadingPage :isLoading="isLoading" />
    <div class="flex">
        <div>
            <Sidebar />
        </div>

        <div class="w-screen">
            <AlertBox :tableType="tableType" :showAddedCollab="showAddedCollab" :addedCollabName="addedCollabName"
                :showUpdated="showUpdated" :showDeleted="showDeleted" :updatedTitle="updatedTitle" />
            <h1 class="text-4xl text-center font-bold mt-10">Collaborator Management</h1>
            <!-- filter -->
            <div class="flex justify-between mx-52 mt-5 items-center ">
                <div class="flex justify-items-center ">
                    <RouterLink :to="{ name: 'task', params: { boardId: params.boardId } }">
                        <span class="mx-2 font-semibold text-teal-700">{{ board.name }} </span>
                    </RouterLink>
                    <span class="font-semibold">> Collaborator</span>

                </div>

                <div class=" flex">
                    <div v-if="Owner === false" class="tooltip"
                        data-tip="You need to be board owner to perform this action">
                        <div
                            class="itbkk-button-add bg-slate-300 text-white hover:bg-slate-400 btn font-semibold mr-5 cursor-not-allowed ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
                            </svg>
                            Add Collaborator
                        </div>
                    </div>
                    <div v-else @click.prevent="openAddModal">
                        <div class="itbkk-button-add bg-green-500 text-white hover:bg-green-600 btn font-semibold mr-5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#ffffff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
                            </svg>
                            Add Collaborator
                        </div>
                    </div>

                    <RouterLink :to="{ name: 'task', params: { boardId: params.boardId } }">
                        <div class="btn ">Back to Board</div>
                    </RouterLink>

                </div>
            </div>

            <!-- table -->

            <div class="flex justify-center ">
                <table class="table w-3/4 mt-5 border-solid border-2 rounded-m border-black">
                    <thead>
                        <tr class="bg-orange-200 
         border-solid border-2 border-black text-xl text-black">
                            <th class="font-bold text-center">No</th>
                            <th class="font-bold">Name</th>
                            <th class="font-bold">E-mail</th>
                            <th class="font-bold">Access Right</th>
                            <th class="font-bold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(collab, index) in collabmanager.getCollabs()" :key="index"
                            class="h-16 border-solid border-2 border-black">
                            <td class="font-semibold text-center">{{ index + 1 }}</td>
                            <td class="">{{ collab.status === 'PENDING' ? (collab.name || collab.collabsName) +
                                ' (Pending Invite)' : collab.name || collab.collabsName }} </td>
                            <td class="">{{ collab.email || collab.collabsEmail }}</td>
                            <td class="">
                                <div v-if="Owner === false"
                                    class="tooltip w-full p-3 rounded-md text-zinc-950 bg-slate-50 border-2 border-zinc-700 max-w-xs cursor-not-allowed "
                                    data-tip="You need to be board owner to perform this action">
                                    <div class="flex justify-between"> {{ collab.accessRight || collab.accessLevel }}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                            viewBox="0 0 24 24">
                                            <path fill="currentColor" d="m12 15l5-5H7z" />
                                        </svg>
                                    </div>
                                </div>
                                <div v-else
                                    class="w-full p-3 rounded-md text-zinc-950 bg-slate-50 border-2 border-zinc-700 max-w-xs"
                                    @click="openEditModal(collab)">
                                    <div class="flex justify-between"> {{ collab.accessRight || collab.accessLevel }}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                                            viewBox="0 0 24 24">
                                            <path fill="currentColor" d="m12 15l5-5H7z" />
                                        </svg>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div v-if="Owner === false" class="tooltip"
                                    data-tip="You need to be board owner to perform this action">
                                    <button class="btn  bg-slate-300 text-white hover:bg-slate-400 cursor-not-allowed">
                                        {{ collab.status === 'PENDING' ? 'Cancel' : 'Remove' }}</button>
                                </div>
                                <div v-else>
                                    <button class="btn btn-outline btn-error" @click="openRemoveModal(collab)"> {{
                                        collab.status === 'PENDING' ? 'Cancel' : 'Remove' }}</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="collabmanager.getCollabs().length < 1">
                            <td colspan="5" class="text-center text-slate-500 italic"> No Collaborator found</td>
                        </tr>

                    </tbody>
                </table>


            </div>
        </div>
    </div>

    <CollabModal :showModal="showModal" :readAccess="readAccess" :boardId="boardId" :actionType="actionType"
        :collabItem="collabItem" :statusType="statusType" @addCollab="handleAddCollab" @closeModal="closeModal"
        @removeCollab="handleRemoveCollab" @editCollab="handleUpdateCollab" @inviteCollab="handleiInviteCollab" />

</template>



<style scoped>
.itbkk-button-action:hover svg {
    fill: #007bff;
    cursor: pointer;
}
</style>