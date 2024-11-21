<script setup>
import { ref } from 'vue';

const boardOwnerName = ref("ITBKK SIAM")
const accessRight = ref("READ")
const boardName = ref("SIAM board")

</script>

<template>
    <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-teal-700">
            <div class="bg-white p-6 rounded shadow-lg">
                <div class="text-center">
                    <h1 class="text-3xl font-bold pt-5">Collaborator Invitation</h1>
                    <div class="text-xl font-bold p-5">{{ boardOwnerName }} has invited you to collaborate with
                        {{ accessRight }} access right on {{ boardName }}</div>
                    <button class="btn btn-success text-white m-2">Accept invitation</button>
                    <button class="btn btn-error text-white m-2">Decline</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>