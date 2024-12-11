<script setup>

import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();

const unAuthorized = localStorage.getItem("token") === null;
const openSidebar = ref(true); // Controls the visibility of the sidebar
const collapsedSidebar = ref(false); // Controls the expanded/narrow state of the sidebar
const userName = localStorage.getItem("username") || "Guest";
const userRole = localStorage.getItem("role") || "User";


const toggleCollapseSidebar = () => {
  collapsedSidebar.value = !collapsedSidebar.value;
  localStorage.setItem("collapsedSidebar", JSON.stringify(collapsedSidebar.value));
};

const signOut = () => {
  localStorage.clear();
  router.push({ name: "login" });
};

onMounted(() => {
  const savedSidebarState = localStorage.getItem("openSidebar");
  openSidebar.value = savedSidebarState !== null ? JSON.parse(savedSidebarState) : true;

  const savedCollapsedState = localStorage.getItem("collapsedSidebar");
  collapsedSidebar.value =
    savedCollapsedState !== null ? JSON.parse(savedCollapsedState) : false;
});
</script>

<template>
  <!-- Sidebar -->
  <transition name="slide-fade">
    <div
      v-if="openSidebar"
      :class="[
        'bg-cyan-500 h-screen p-4 font-bold text-lg text-white fixed z-10 transition-all duration-300 flex flex-col justify-between',
        collapsedSidebar ? 'w-16' : 'w-60',
      ]"
    >
      <!-- Top Section -->
      <div>
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
              @click="router.push({ name: 'board' })"
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
              @click="router.push({ name: 'board' })"
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
              <span v-if="!collapsedSidebar">All Boards</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- User Info -->
      <div class="flex items-center mt-auto p-2 bg-white text-cyan-600 rounded-lg">
        <img
          src="https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
          alt="Profile Picture"
          class="w-10 h-10 rounded-full"
          v-if="!collapsedSidebar"
        />
        <div v-if="!collapsedSidebar" class="ml-2">
    <p class="text-sm font-semibold">{{ userName }}</p>
    <p class="text-xs text-gray-500">{{ userRole }}</p>
  </div>
        <button
          @click="signOut"
          class="ml-auto p-2 rounded-full text-white"
        >
          <svg
            class="w-6 h-6 text-red-500 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
            />
          </svg>
        </button>
      </div>
    </div>
  </transition>

  <!-- Main Content -->
  <div
    :class="[
      'transition-all duration-300',
      openSidebar ? (collapsedSidebar ? 'ml-16' : 'ml-60') : 'ml-0',
    ]"
  >
    
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
