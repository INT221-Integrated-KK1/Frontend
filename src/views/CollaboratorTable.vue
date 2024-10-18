<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getItemById, getItems } from "@/libs/fetchUtils";
import { CollabManagement } from "@/libs/CollabManagement";
import Sidebar from "@/components/Sidebar.vue";
import AddCollabModal from "@/components/modals/board/AddCollabModal.vue";
import AlertBox from "@/components/AlertBox.vue";
import router from "@/router";

const notOwner = ref(false);
const showAddedCollab = ref(false);
const addedCollabName = ref("");
const { params } = useRoute();
const boardId = params.boardId;
const board = ref([]);
const collabs = ref([]);
const collabmanager = ref(new CollabManagement());

function handleAddCollab(addCollab) {
    console.log("addCollab in CollboratorTable", addCollab);
    if (addCollab === undefined || addCollab === null) {
        showAddedCollab.value = false;
    } else {
        collabmanager.value.addCollab(addCollab);
        collabs.value = collabmanager.value.getCollabs();
        addedCollabName.value = addCollab.name;
        showAddedCollab.value = true;
        setTimeout(() => {
            showAddedCollab.value = false;
        }, 3000);
    }
}

onMounted(async () => {
    try {
        const boardItem = await getItemById(import.meta.env.VITE_BASE_BOARDS_URL, boardId);
        const collabMembers = await getItems(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`);

        boardItem.owner.oid === localStorage.getItem('oid') ? notOwner.value = false : notOwner.value = true;
        board.value = boardItem;
        collabs.value = collabMembers;
        // collabStore.setCollabs(collabMembers);
    } catch (error) {
        console.error("Error fetching task details:", error)
    }
})

</script>

<template>


    <div class="flex">
        <div>
            <Sidebar />
        </div>

        <div class="w-screen">
            <AlertBox :showAddedCollab="showAddedCollab" :addedCollabName="addedCollabName" />
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
                    <div v-if="notOwner === true">
                        <AddCollabModal :boardId="boardId" :notOwner="notOwner" @addCollab="handleAddCollab"
                            disabled="disabled" />
                    </div>
                    <div v-else>
                        <AddCollabModal :boardId="boardId" :notOwner="notOwner" @addCollab="handleAddCollab" />
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
                        <tr v-for="(collab, index) in collabs" :key="index"
                            class="h-16 border-solid border-2 border-black">
                            <td class="font-semibold text-center">{{ index + 1 }}</td>
                            <td class="">{{ collab.name }}</td>
                            <td class="">{{ collab.email }}</td>
                            <td class="">
                                <select
                                    class="w-full p-3 rounded-md text-zinc-950 bg-slate-50  border-2 border-zinc-700 max-w-xs"
                                    v-model="collab.accessRight" disabled>
                                    <option>READ</option>
                                    <option>WRITE</option>
                                </select>
                            </td>
                            <td>
                                <div v-if="notOwner === true">
                                    <button class="btn btn-outline btn-error" disabled="disabled">Remove</button>
                                </div>
                                <div v-else>
                                    <button class="btn btn-outline btn-error">Remove</button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="collabs.length < 1">
                            <td colspan="5" class="text-center text-slate-500 italic"> No Collaborator found</td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>



<style scoped>
.itbkk-button-action:hover svg {
    fill: #007bff;
    cursor: pointer;
}
</style>