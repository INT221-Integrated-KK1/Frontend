<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const count = ref(3);

onMounted(() => {
    const interval = setInterval(() => {
        count.value--;
        if (count.value === 0) {
            clearInterval(interval);
            router.go(-1);
        }
    }, 1000);
});

</script>

<template>
    <div class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-orange-300">
            <div class="bg-white w-1/2 p-6 rounded shadow-lg">
                <div class="">
                    <h1 class="text-center text-3xl font-bold pt-5 text-red-500">409</h1>
                    <div class="text-center text-2xl font-bold pt-5">Conflict: email not belong to owner.</div>
                    <div class="text-center text-xl font-bold pt-3 pb-10">This we'll return to the previous page in {{
                        count }} seconds
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>