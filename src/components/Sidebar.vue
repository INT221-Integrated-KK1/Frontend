<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
// import { useBoardStore } from '@/stores/useBoardStore';
import { BoardManagement } from '@/libs/BoardManagement';
import { getItems } from '@/libs/fetchUtils';
const router = useRouter();
const openSidebar = ref(true);

const Sidebar = () => {
    openSidebar.value = !openSidebar.value;
}

const OpenBoard = () => {
    router.push({ name: 'board' });
}

const boardmanager = ref(new BoardManagement());

const name = localStorage.getItem('username');

// function handleBoardAdded(addBoard) {
//     boardmanager.value.addBoard(addBoard);
// }

function signOut() {
    localStorage.clear();
    router.push({ name: 'login' });
}

const boards = ref([]);
onMounted(async () => {
    try {
        const items = await getItems(import.meta.env.VITE_BASE_BOARDS_URL);
        boardmanager.value.setBoards(items);
        boards.value = items;
    } catch (error) {
        console.error('Error fetching boards:', error);
    }
});
</script>

<template>
    <transition name="slide-fade">
        <div v-if="openSidebar" class=" bg-teal-500 w-60 h-screen p-3 font-bold text-lg text-zinc-950">
            <div class="m-3">
                <div class="flex justify-between mb-3">

                    <img src="@/assets/Logo-removebg.png" alt="logo" class="w-12 h-12" />

                    <div @click="Sidebar" role="button">

                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2">
                                <path d="m9 14l-4-4l4-4" />
                                <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                            </g>
                        </svg>
                    </div>

                </div>
                <hr class=" border-2 border-zinc-950 mb-2 " />

                <div class="font-bold text-lg hover:text-white" role="button" @click="OpenBoard">Home</div>

                <div class="text-lg font-bold hover:text-white" role="button" @click="OpenBoard">Board List</div>
                <!-- <ul v-for="(board, index) in boards" :key="index" class="rounded-box w-52">
                    <li>
                        <div @click="router.push({ name: 'task', params: { boardId: board.id } })"
                            class="menu font-semibold hover:text-white overflow-hidden">
                            {{ board.name }}
                        </div>
                    </li>
                </ul> -->


            </div>

        </div>

    </transition>
    <transition name="slide-fade">
        <div v-if="openSidebar === false" @click="Sidebar">
            <div
                class="w-14 h-14 bg-teal-500 rounded-full flex justify-center justify-items-center text-center p-2 m-3 text-xl font-bold hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-10" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1m6 2v14h11V5z" />
                </svg>
            </div>
        </div>
    </transition>

    <div class="flex flex-row fixed bottom-0 bg-slate-200 p-5 py-2 rounded-t-2xl w-auto ml-5">
        <div>
            <div class="itbkk-fullname flex items-center text-md font-bold ">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" fill-opacity="0.25"
                        d="M3 11c0-3.771 0-5.657 1.172-6.828S7.229 3 11 3h2c3.771 0 5.657 0 6.828 1.172S21 7.229 21 11v2c0 3.771 0 5.657-1.172 6.828S16.771 21 13 21h-2c-3.771 0-5.657 0-6.828-1.172S3 16.771 3 13z" />
                    <circle cx="12" cy="10" r="4" fill="currentColor" />
                    <path fill="currentColor" fill-rule="evenodd"
                        d="M18.946 20.253a.23.23 0 0 1-.14.25C17.605 21 15.836 21 13 21h-2c-2.835 0-4.605 0-5.806-.498a.23.23 0 0 1-.14-.249C5.483 17.292 8.429 15 12 15s6.517 2.292 6.946 5.253"
                        clip-rule="evenodd" />
                </svg>
                {{ name }}
            </div>

            <button @click="signOut" class="justify-items-end text-sm  font-bold mr-5 hover:text-rose-500">
                Sign Out
            </button>
        </div>

    </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-fade-enter-from {
    transform: translateX(-100%);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}
</style>