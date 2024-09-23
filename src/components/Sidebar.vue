<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();
const openSidebar = ref(true); 

const Sidebar = () => {
    openSidebar.value = !openSidebar.value;
}

const OpenBoard = () => {
    router.push({ name: 'board' });
}

const OpenTask = () => {
    router.push({ name: 'task' });
}


</script>

<template>
    <div v-if="openSidebar" class=" bg-red-100 w-72 h-screen p-5 font-bold text-lg ">
        <div class="m-3">
            <div class="flex justify-between mb-3">
                <div class="font-bold text-xl">Side Bar</div>
                <div @click="Sidebar" role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m6 2v14h11V5z" />
                    </svg>
                </div>

            </div>
            <hr class=" border-2 border-slate-500 mb-2" />

            <div class="font-bold text-lg">Home</div>
            <div class="dropdown ">
                <div tabindex="0" class="text-lg font-bold" role="button" @click="OpenBoard">Boards List</div>
                <ul tabindex="0" v-if="OpenBoard" class="dropdown-content menu-sm rounded-box bg-slate-50 w-52">
                    <li class=""><a @click="OpenTask">Board 1</a></li>
                    <li class=""><a @click="OpenTask">Board 2</a></li>
                    <li class=""><a @click="OpenTask">Board 3</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped></style>