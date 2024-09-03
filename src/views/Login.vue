<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "../libs/fetchUtils.js";
// import { jwtDecode } from "jwt-decode"



import AlertBox from "@/components/AlertBox.vue";
const router = useRouter();
const showLoginAlert = ref(false);
let inputForm = reactive({
    userName: "",
    password: ""
});

async function loginHandler() {
    if (inputForm.userName === "" || inputForm.password === "") {
        alert("Please fill in the username and password");
        return;
    }
    const data = await isAuthenticated(import.meta.env.VITE_BASE_USER_URL, inputForm);
    if (data.access_token) {
        showLoginAlert.value = false;
        router.push("/task");
        localStorage.setItem('token', data.access_token);
        // const decoded = jwtDecode(data.access_token);
        // localStorage.setItem('user', decoded.name);
    } else if (data.message === "Username or Password is incorrect.") {
        showLoginAlert.value = true;
        setTimeout(() => {
            showLoginAlert.value = false;
        }, 3000);
    } else {
        alert("Something went wrong: " + data);
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
        <div class="bg-slate-200 min-h-screen flex items-center justify-center">
            <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 class="text-3xl font-bold text-center mb-10">Welcome To ITB-KK</h1>

                <div class="form-control">
                    <label class="label">
                        <span class="label-text text-xl font-bold">Username</span>
                    </label>
                    <div class="input-group ">
                        <input type="text" class="input input-bordered w-full itbkk-username"
                            v-model="inputForm.userName" placeholder="Type your username" :maxlength="50" />
                    </div>
                    <label class="label mt-4">
                        <span class="label-text text-xl font-bold">Password</span>
                    </label>
                    <div class="input-group">
                        <input type="password" class="input input-bordered w-full itbkk-password" id="password"
                            v-model="inputForm.password" placeholder="Type your password" :maxlength="14"/>

                        <input type="checkbox" class="mt-4" @click="showPassword"> Show Password
                    </div>
                    <button
                        :class="inputForm.userName === '' || inputForm.password === '' ? `btn btn-disabled   mt-6 w-full itbkk-button-signin disabled` : `btn btn-primary mt-6 w-full itbkk-button-signin`"
                        @click="loginHandler">Sign In</button>
                </div>

            </div>

            <AlertBox :showLoginAlert="showLoginAlert" />
        </div>
    </div>
</template>

<style scoped></style>