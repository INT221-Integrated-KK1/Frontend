<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from "vue-router";
import { getItems, addItem } from '@/libs/fetchUtils';
import router from '@/router';
const { params } = useRoute();

const boardId = params.boardId
const invitationId = params.invitationId

const ownerName = ref("")
const accessRight = ref("")
const boardName = ref("")
const email = ref("")


async function handleAccept() {
    try {
        await addItem(`${import.meta.env.VITE_BASE_URL}api/invitations/${invitationId}/accept`);

        const inputItem = {
            email: email.value,
            accessRight: accessRight.value
        };

        const addCollab = await addItem(`${import.meta.env.VITE_BASE_BOARDS_URL}/${boardId}/collabs`, inputItem)
        console.log("addCollab: ", addCollab);

        if (addCollab.status === 404) {
            window.alert("The user does not exist.");
        } else if (addCollab.status === 409) {
            window.alert("The user is already the collaborator or pending collaborator of this board.");
            if (email.value === localStorage.getItem('email')) {
                window.alert("Board owner cannot be collaborator of his/her own board.");
            } else {
                window.alert("The user is already the collaborator or pending collaborator of this board.");
            }
        } else {
            router.push({ name: 'task', params: { boardId: boardId } });
        }
    } catch (error) {
        console.log(`Error handleAccept: ${error}`);
    }
}

async function handleDecline() {
    try {
        await addItem(`${import.meta.env.VITE_BASE_URL}api/invitations/${invitationId}/decline`);
        router.push('/board');
    } catch (error) {
        console.log(`Error handleDecline: ${error}`);
    }
}

onMounted(async () => {
    try {
        const getPendingCollab = await getItems(`${import.meta.env.VITE_BASE_URL}api/boards/${boardId}/invitations`);
        const item = getPendingCollab.data.find(item => item.id === Number(invitationId));

        if (localStorage.getItem('email') !== item.email || !localStorage.getItem('email')) {
            window.alert("You are not the recipient of this invitation.");
            router.push('/board');
        } else {
            ownerName.value = item.ownerName;
            boardName.value = item.boardName;
            accessRight.value = item.accessRight;
            email.value = item.email;
        }

    } catch (error) {
        console.log(`Error fetching board items: ${error}`);
        window.alert("The invitation does not exist anymore.");
        router.push('/board');
    }
});

</script>

<template>
    <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-[#85E5FF]">
            <div class="bg-white p-6 rounded shadow-lg">
                <div class="text-center">
                    <h1 class="text-3xl font-bold pt-5">Collaborator Invitation</h1>
                    <div class="text-xl font-bold p-5">{{ ownerName }} has invited you to collaborate with
                        {{ accessRight }} access right on {{ boardName }}</div>
                    <button class="btn btn-success text-white m-2" @click="handleAccept()">Accept invitation</button>
                    <button class="btn btn-error text-white m-2" @click="handleDecline()">Decline</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>