<script setup>

</script>

<template>
    <div class="min-h-screen flex items-center justify-center">
        <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h1 class="text-3xl font-bold text-center mb-10">Welcome To ITB-KK</h1>
            <div class="form-control">
                <label class="label">
                    <span class="label-text text-xl font-bold">Username</span>
                </label>
                <div class="input-group itbkk-username">
                    <input type="text" placeholder="John" class="input input-bordered w-full" />
                </div>
                <label class="label mt-4">
                    <span class="label-text text-xl font-bold">Password</span>
                </label>
                <div class="input-group itbkk-password">
                    <input type="password" placeholder="#1234" class="input input-bordered w-full" />
                </div>
                <button class="btn btn-primary mt-6 w-full">Sign In</button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>