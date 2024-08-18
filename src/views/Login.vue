<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "../libs/fetchUtils.js";

const router = useRouter();
const showLoginAlert = ref(false);

let inputForm = reactive({
    username: "",
    password: ""
});

async function loginHandler() {
    const data = await isAuthenticated(import.meta.env.VITE_BASE_USER_URL, inputForm.username, inputForm.password);
    if (data.status === 200) {
        router.push("/task");
    } else if (data.status === 401) {
        showLoginAlert.value = true;
    } else if (data.status === 500) {
        alert("Internal Server Error");
    }
};

const showPassword = () => {
    let password = document.getElementById("password");
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }

}
</script>

<template>
    <div class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class=" bg-slate-200 min-h-screen flex items-center justify-center">
            <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 class="text-3xl font-bold text-center mb-10">Welcome To ITB-KK</h1>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text text-xl font-bold">Username</span>
                    </label>
                    <div class="input-group itbkk-username">
                        <input type="text" class="input input-bordered w-full" v-model="inputForm.username"
                            placeholder="Type your username" />
                    </div>
                    <label class="label mt-4">
                        <span class="label-text text-xl font-bold">Password</span>
                    </label>
                    <div class="input-group itbkk-password">
                        <input type="password" class="input input-bordered w-full" id="password"
                            v-model="inputForm.password" placeholder="Type your password" />
                        <input type="checkbox" class="mt-4" @click="showPassword"> Show Password
                    </div>
                    <button class="btn btn-primary mt-6 w-full" @click="loginHandler">Sign In</button>
                </div>
            </div>


            <div v-if="showLoginAlert" class="bg-red-100 rounded-md border-2 border-red-500 fixed top-5">
                <div class="p-4">
                    <div class="flex justify-between">
                        <h1 class="text-xl font-bold mr-3">Username or Password is incorrect</h1>
                        <button class="px-4 py-2rounded" @click="showLoginAlert = false">✖</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped></style>