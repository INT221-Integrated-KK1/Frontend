<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { isAuthenticated } from "../libs/fetchUtils.js";
import VueJwtDecode from "vue-jwt-decode";
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
    try {
        let decode = VueJwtDecode.decode(data.access_token);
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('decode', decode);
        localStorage.setItem('username', decode.name);
    } catch (error) {
        console.error("Error fetching task details:", error)
        localStorage.clear();
    }
    if (data.access_token) {
        showLoginAlert.value = false;
        router.push("/board");
        localStorage.setItem('token', data.access_token);
        console.log(data.access_token);

    } else if (data.message === "Username or Password is incorrect." || data === undefined) {

        showLoginAlert.value = true;
        setTimeout(() => {
            showLoginAlert.value = false;
        }, 3000);
    } else {
        alert("Something went wrong: " + data);
    }
};
const isPasswordToggle = ref(false);

const showPassword = () => {
    let password = document.getElementById("password");
    if (password.type === "password") {
        password.type = "text";
        isPasswordToggle.value = true;
    } else if (password.type === "text") {
        password.type = "password";
        isPasswordToggle.value = false;
    }
}

let test = VueJwtDecode.decode("aaaaaaaaaaaa");
console.log("test", test);


</script>

<template>
    <div class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="bg-teal-500 min-h-screen flex items-center justify-center">
            <div class="w-full max-w-md bg-white p-8 rounded-xl shadow-xl">
                <img src="@/assets/Logo-removebg.png" alt="itbkk-logo" class="w-40 mx-auto" />
                <div class="form-control ">
                    <div class="input-group ">
                        <label class="label">
                            <span class="label-text text-xl font-bold">Username</span>
                        </label>
                        <input type="text"
                            class="input input-bordered w-full itbkk-username rounded-xl border-zinc-300 border-2"
                            v-model="inputForm.userName" placeholder="Type your username" :maxlength="50" />
                    </div>
                    <label class="label mt-4">
                        <span class="label-text text-xl font-bold">Password</span>
                    </label>
                    <div class="relative w-full">
                        <input type="password"
                            class="input input-bordered w-full pr-10 border-zinc-300 border-2 itbkk-password autocomplete-off"
                            id="password" v-model="inputForm.password" placeholder="Type your password"
                            :maxlength="14" />
                        <i @click="showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg v-if="isPasswordToggle === true" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                                viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5">
                                    <path
                                        d="M2.899 12.735a1.87 1.87 0 0 1 0-1.47c.808-1.92 2.1-3.535 3.716-4.647S10.103 4.945 12 5.004c1.897-.059 3.768.502 5.385 1.614s2.908 2.727 3.716 4.647a1.87 1.87 0 0 1 0 1.47c-.808 1.92-2.1 3.535-3.716 4.647S13.897 19.055 12 18.996c-1.897.059-3.768-.502-5.385-1.614S3.707 14.655 2.9 12.735" />
                                    <path d="M12 15.5a3.5 3.5 0 1 0 0-7a3.5 3.5 0 0 0 0 7" />
                                </g>
                            </svg>
                            <svg v-if="isPasswordToggle === false" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
                                viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M20.645 7c-.731 2.05-1.958 3.813-3.534 5.082c-1.493 1.212-3.286 1.835-5.111 1.774c-1.825.06-3.618-.562-5.111-1.774C5.313 10.813 4.086 9.05 3.355 7M12 13.857V17m5.7-1.095l-1.919-2.947m-7.562 0L6.3 15.905m15.2-4.381L19.315 9.64m-14.63 0L2.5 11.523" />
                            </svg>



                        </i>
                    </div>
                    <button
                        :class="inputForm.userName === '' || inputForm.password === '' ? `btn btn-disabled  mt-6 w-full itbkk-button-signin disabled` : `btn bg-[#b9e185] mt-6 w-full itbkk-button-signin`"
                        @click="loginHandler">Sign In</button>
                </div>

            </div>

            <AlertBox :showLoginAlert="showLoginAlert" />
        </div>
    </div>
</template>

<style scoped></style>