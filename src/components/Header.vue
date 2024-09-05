<script setup>
const name = localStorage.getItem('username');
</script>

<template>
    <div class="bg-gradient-to-r from-yellow-100 via-blue-100 to-red-100 flex justify-between p-4">
        <div class="text-center text-xl font-bold">📋 Welcome to ITBKK-KANBAN</div>
        <div class="flex justify-end">
            <div class="itbkk-fullname text-center text-xl font-bold mr-5">{{ name }}</div>
            <RouterLink :to="{ name: 'login' }">
                <div class="text-center text-lg font-bold mr-5 hover:text-cyan-500">log out</div>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped></style>