<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import { getItemById, getItems, addItem } from '@/libs/fetchUtils';
import router from '@/router';
const { params } = useRoute();

const boardId = params.boardId
const invitationId = params.invitationId

const boardOwnerName = ref("")
const accessRight = ref("")
const boardName = ref("")
const collaboratorEmail = ref("")


async function handleAccept() {
    try {
        await addItem(`${import.meta.env.VITE_BASE_URL}api/invitations/${invitationId}/accept`);

        const inputItem = {
            collaboratorEmail: collaboratorEmail.value,
            accessRight: accessRight.value
        };

        const addCollab = await addItem(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`, inputItem)
        if (addCollab.status === 404) {
            window.alert("The user does not exist.");
        } else if (addCollab.status === 409) {
            window.alert("The user is already the collaborator or pending collaborator of this board.");
            if (collaboratorEmail.value === localStorage.getItem('email')) {
                window.alert("Board owner cannot be collaborator of his/her own board.");
            } else {
                window.alert("The user is already the collaborator or pending collaborator of this board.");
            }
        } else {
            // const recentCollab = await getItemById(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`, addCollab.collabsId);
            // collabmanager.addCollab(recentCollab);
            window.alert("Invitation accepted");
            router.push({ name: 'task', params: { boardId: boardId } });
        }
    } catch (error) {
        console.log(`Error handleAccept: ${error}`);
    }
}

async function handleDecline() {
    try {
        await addItem(`${import.meta.env.VITE_BASE_URL}api/invitations/${invitationId}/decline`);
        window.alert("Invitation declined");
    } catch (error) {
        console.log(`Error handleDecline: ${error}`);
    }
}

onMounted(async () => {
    try {
        const boardItems = await getItemById(import.meta.env.VITE_BASE_BOARDS_URL, boardId);
        const inviteItems = await getItems(`${import.meta.env.VITE_BASE_URL}api/boards/${boardId}/invitations`)
        let item = inviteItems.data.find(item => item.id === Number(invitationId));

        boardOwnerName.value = boardItems.owner.name;
        boardName.value = boardItems.name;
        accessRight.value = item.accessRight;
        collaboratorEmail.value = item.collaboratorEmail;

    } catch (error) {
        console.log(`Error get boardItems: ${error}`);
    }

})

</script>

<template>
    <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-teal-700">
            <div class="bg-white p-6 rounded shadow-lg">
                <div class="text-center">
                    <h1 class="text-3xl font-bold pt-5">Collaborator Invitation</h1>
                    <div class="text-xl font-bold p-5">{{ boardOwnerName }} has invited you to collaborate with
                        {{ accessRight }} access right on {{ boardName }}</div>
                    <button class="btn btn-success text-white m-2" @click="handleAccept()">Accept invitation</button>
                    <button class="btn btn-error text-white m-2" @click="handleDecline()">Decline</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>