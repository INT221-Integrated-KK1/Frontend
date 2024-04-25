<script setup>
//demo modal
import { ref } from 'vue';
const { showModal } = defineProps(['showModal']);
defineEmits(['closeModal']);

//demo time to show
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const currentDate = new Date().toLocaleString("En-US", timezone);
const description = ref('');
</script>

<template>
    <!-- demo button modal -->
    <div v-if="showModal" class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
            <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">

                <div class="col-start-1 col-span-3">
                    <h1 class="font-bold">Title : </h1>
                    <input placeholder="title name" class="p-2 border-solid border-2 border-grey w-full mb-3" />
                </div>
                <hr class="col-start-1 col-span-3">
                <div class="col-start-1 col-span-2">
                    <h1 class="font-bold">Description : </h1>
                    <textarea rows="10" placeholder="No description provided"
                        class="p-2 border-solid border-2 border-grey w-full"
                        :class="description === '' ? 'italic text-gray-500' : 'not-italic text-black'">{{ description }}</textarea>
                </div>
                <div class="col-start-3 col-span-1 h-auto">
                    <h1 class="font-bold">Assignees : </h1>
                    <textarea placeholder="assignees name" class="p-2 border-solid border-2 border-grey w-full mb-3" />
                    <h1 class="font-bold">Status : </h1>
                    <select class="p-2 border-solid border-2 border-grey w-full mb-10">
                        <option value="No Status">No Status</option>
                        <option value="To Do">To Do</option>
                        <option value="Doing">Doing</option>
                        <option value="Done">Done</option>
                    </select>
                    <p> Demo data </p>
                    <h1 class="font-bold">Timezone : {{ timezone }}</h1>
                    <h1 class="font-bold">CreatedOn : {{ currentDate }} </h1>
                    <h1 class="font-bold">UpdatedOn : {{ currentDate }}</h1>
                </div>
                <div class="flex justify-end mt-4 col-start-3">
                    <button @click="$emit('closeModal', false)"
                        class="bg-red-500 hover:bg-red-700 text-white btn">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>