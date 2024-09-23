<script setup>
import { useRouter } from 'vue-router';
import { useBoardStore } from '@/stores/useBoardStore';
const router = useRouter();

const name = localStorage.getItem('username');
const boardStore = useBoardStore();

function signOut() {
    localStorage.clear();
    boardStore.removeAllBoards();
    router.push({ name: 'login' });
}
</script>

<template>
    <div class="bg-gradient-to-r from-yellow-100 via-blue-100 to-red-100 flex justify-between p-4">
        <div class="text-center text-xl font-bold">📋 Welcome to ITBKK-KANBAN</div>
        <div class="flex justify-end">
            <div class="itbkk-fullname text-center text-xl font-bold mr-5">{{ name }}</div>
            <button @click="signOut" class="text-center text-lg font-bold mr-5 hover:text-cyan-500">
                Sign Out
            </button>
        </div>
    </div>
</template>

<style scoped></style>