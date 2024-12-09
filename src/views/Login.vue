<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getItems, isAuthenticated } from "../libs/fetchUtils.js";
import VueJwtDecode from "vue-jwt-decode";
import AlertBox from "@/components/AlertBox.vue";

const router = useRouter();
const showLoginAlert = ref(false);
let inputForm = reactive({
  userName: "",
  password: "",
});

async function loginHandler() {
  if (inputForm.userName === "" || inputForm.password === "") {
    alert("Please fill in the username and password");
    return;
  }
  const data = await isAuthenticated(import.meta.env.VITE_BASE_USER_URL, inputForm);
  try {
    let decode = VueJwtDecode.decode(data.access_token);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("username", decode.name);
    localStorage.setItem("oid", decode.oid);
    localStorage.setItem("email", decode.email);
  } catch (error) {
    console.error("Error fetching task details:", error);
    localStorage.clear();
  }
  if (data.access_token) {
    showLoginAlert.value = false;
    try {
      const board = await getItems(import.meta.env.VITE_BASE_BOARDS_URL);
      // PBI 24
      // const boardLength = board.personalBoards.length ? board.personalBoards.length : 0;
      // if (boardLength === 1) {
      //     router.push({ name: "task", params: { boardId: board.personalBoards[0].id } });
      // } else {
      //     router.push("/board");
      // }
      if (board.length !== 1) {
        router.push("/board");
      } else if (board.length === 1) {
        router.push({ name: "task", params: { boardId: board[0].id } });
        console.log(board[0].id);
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      localStorage.clear();
    }
    localStorage.setItem("token", data.access_token);
    console.log(data.access_token);
  } else if (
    data.message === "Username or Password is incorrect." ||
    data === undefined
  ) {
    showLoginAlert.value = true;
    setTimeout(() => {
      showLoginAlert.value = false;
    }, 3000);
  } else {
    alert("Something went wrong: " + data);
  }
}

const isPasswordToggle = ref(false);

function showPassword() {
  isPasswordToggle.value = !isPasswordToggle.value;
}
</script>

<template>
  <div class="text-black fixed z-10 inset-0 overflow-y-auto">
    <div class="flex min-h-screen">
      <div class="w-1/2 flex items-center justify-center relative animated-bg">
        <div class="text-center text-white p x-8">
          <img src="@/assets/Logos.png" alt="itbkk-logo" class="h-64 mx-auto" />
          <h1 class="text-5xl font-bold">Welcome to ITB-KK</h1>
          <p class="mt-4 text-lg">
            Effortlessly organize and manage your tasks with Kradan Kanban Board,<br />
            a streamlined platform designed to boost productivity and collaboration.
          </p>
        </div>
      </div>

      <div class="w-3/5 flex items-center justify-center animated-slide-in">
        <div class="w-1/2 max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-6">
          <h2 class="text-2xl font-semibold text-center text-blue-500">
            Sign in to your account
          </h2>

          <div
            class="flex items-center border border-zinc-300 rounded-full w-full bg-white focus-within:border-blue-400"
          >
            <i class="pl-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </i>
            <input
              type="text"
              class="w-full bg-transparent rounded-full px-6 py-4 focus:outline-none"
              v-model="inputForm.userName"
              placeholder="Username"
              :maxlength="50"
            />
          </div>

          <div
            class="flex items-center border border-zinc-300 rounded-full w-full bg-white focus-within:border-blue-400 mt-4"
          >
            <i class="pl-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </i>
            <input
              :type="isPasswordToggle ? 'text' : 'password'"
              class="w-full bg-transparent rounded-full px-6 py-4 focus:outline-none"
              v-model="inputForm.password"
              placeholder="Password"
              :maxlength="14"
            />
            <i @click="showPassword" class="pr-4 cursor-pointer text-gray-400">
              <svg
                v-if="isPasswordToggle === true"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                >
                  <path
                    d="M2.899 12.735a1.87 1.87 0 0 1 0-1.47c.808-1.92 2.1-3.535 3.716-4.647S10.103 4.945 12 5.004c1.897-.059 3.768.502 5.385 1.614s2.908 2.727 3.716 4.647a1.87 1.87 0 0 1 0 1.47c-.808 1.92-2.1 3.535-3.716 4.647S13.897 19.055 12 18.996c-1.897.059-3.768-.502-5.385-1.614S3.707 14.655 2.9 12.735"
                  />
                  <path d="M12 15.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7" />
                </g>
              </svg>
              <svg
                v-if="isPasswordToggle === false"
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M20.645 7c-.731 2.05-1.958 3.813-3.534 5.082c-1.493 1.212-3.286 1.835-5.111 1.774c-1.825.06-3.618-.562-5.111-1.774C5.313 10.813 4.086 9.05 3.355 7M12 13.857V17m5.7-1.095l-1.919-2.947m-7.562 0L6.3 15.905m15.2-4.381L19.315 9.64m-14.63 0L2.5 11.523"
                />
              </svg>
            </i>
          </div>

          <button
            :class="
              inputForm.userName === '' || inputForm.password === ''
                ? 'btn btn-disabled w-full disabled'
                : 'btn bg-blue-500 w-full text-white font-semibold hover:bg-blue-600 transition'
            "
            @click="loginHandler"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
    <AlertBox :showLoginAlert="showLoginAlert" />
  </div>
</template>

<style scoped>
.bg-radial-gradient {
  background-image: radial-gradient(circle, #3b82f6, #8b5cf6);
}

/* Background animation */
@keyframes background-animation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-bg {
  background: linear-gradient(270deg, #3b82f6, #8b5cf6, #6dd5ed, #2193b0);
  background-size: 400% 400%;
  animation: background-animation 20s ease infinite;
}

/* Slide-in and fade-in animation for the right section */
@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animated-slide-in {
  animation: slide-in 1s ease-out forwards;
}
</style>
