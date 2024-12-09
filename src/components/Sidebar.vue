<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { getItems } from "@/libs/fetchUtils";

const router = useRouter();

const unAuthorized = localStorage.getItem("token") === null;
const openSidebar = ref(true); // Controls the visibility of the sidebar
const collapsedSidebar = ref(false); // Controls the expanded/narrow state of the sidebar
const name = localStorage.getItem("username") || "Guest";
const boards = ref([]);

onMounted(() => {
  const savedSidebarState = localStorage.getItem("openSidebar");
  openSidebar.value = savedSidebarState !== null ? JSON.parse(savedSidebarState) : true;

  const savedCollapsedState = localStorage.getItem("collapsedSidebar");
  collapsedSidebar.value =
    savedCollapsedState !== null ? JSON.parse(savedCollapsedState) : false;

  // Fetch boards on mount
  fetchBoards();
});

const toggleCollapseSidebar = () => {
  collapsedSidebar.value = !collapsedSidebar.value;
  localStorage.setItem("collapsedSidebar", JSON.stringify(collapsedSidebar.value));
};

const OpenBoard = () => {
  router.push({ name: "board" });
};

const OpenLogin = () => {
  router.push({ name: "login" });
};

const signOut = () => {
  localStorage.clear();
  router.push({ name: "login" });
};

const fetchBoards = async () => {
  try {
    const items = await getItems(import.meta.env.VITE_BASE_BOARDS_URL);
    boards.value = items;
  } catch (error) {
    console.error("Error fetching boards:", error);
  }
};
</script>

<template>
  <!-- Sidebar -->
  <transition name="slide-fade">
    <div
      v-if="openSidebar"
      :class="[
        'bg-[#2193b0] h-screen p-4 font-bold text-lg text-white fixed z-10 transition-all duration-300',
        collapsedSidebar ? 'w-15' : 'w-60',
      ]"
    >
      <div class="flex justify-between items-center mb-4">
        <img
          v-if="!collapsedSidebar"
          src="@/assets/Logos.png"
          alt="logo"
          class="w-14 h-14"
        />
        <button @click="toggleCollapseSidebar" class="hover:text-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>
      <hr class="border-gray-400 mb-4" />

      <!-- Sidebar Links -->
      <ul class="space-y-4">
        <li>
          <a
            class="flex items-center space-x-3 hover:text-gray-200 cursor-pointer"
            @click="OpenBoard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z"
              />
            </svg>
            <span v-if="!collapsedSidebar">Home</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center space-x-3 hover:text-gray-200 cursor-pointer"
            @click="OpenBoard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                d="M5 3.5A1.5 1.5 0 0 1 6.5 2h3A1.5 1.5 0 0 1 11 3.5H5ZM4.5 5A1.5 1.5 0 0 0 3 6.5v.041a3.02 3.02 0 0 1 .5-.041h9c.17 0 .337.014.5.041V6.5A1.5 1.5 0 0 0 11.5 5h-7ZM12.5 8h-9A1.5 1.5 0 0 0 2 9.5v3A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 12.5 8Z"
              />
            </svg>
            <span v-if="!collapsedSidebar">Personal Boards</span>
          </a>
        </li>
        <li>
          <a
            class="flex items-center space-x-3 hover:text-gray-200 cursor-pointer"
            @click="OpenBoard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
              />
            </svg>
            <span v-if="!collapsedSidebar">Collaborator Boards</span>
          </a>
        </li>
      </ul>
    </div>
  </transition>

  <!-- Main Content -->
  <div :class="openSidebar ? (collapsedSidebar ? 'ml-20' : 'ml-60') : 'ml-0'">
    <div class="p-1">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        <!-- Board cards -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Sidebar slide transition */
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
