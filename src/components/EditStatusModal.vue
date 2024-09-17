<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { getItemById } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";


const emit = defineEmits(['saveChanges', 'close'])

const { params } = useRoute();
const id = Number(params.id);
console.log(id);

const isLoaded = ref(false);

const status = reactive({
    id: 1,
    name: "",
    description: ""
});
console.log(status);

onMounted(async () => {
    try {
        const items = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, id);
        status.id = items.id;
        status.name = items.name;
        status.description = items.description;
        console.log(status.id);
        console.log(status.name);

        isLoaded.value = true;
    } catch (error) {
        console.error("Error fetching task details:", error)
    }
});

if (status.name === null) {
    status.name = "";
}

if (status.description === null) {
    status.description = "";
}

const checkWhiteSpace = (title) => {
    return /^\s*$/.test(title);
};


const initialTask = ref(JSON.stringify(status));
const isFormModified = computed(() => JSON.stringify(status) !== initialTask.value);



const EditStatus = () => {
    if (isFormModified.value) {
        isLoaded.value = false;
        emit('saveChanges', status, id);
    }
}

const countOptionalCharacters = (text) => {
    if (text === null || text === undefined) {
        text = "";
        return text.trim().length;
    } else {
        return text.trim().length;
    }
}
</script>

<template>
    <div v-if="isLoaded" class="text-black fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen bg-black/[.05]">
            <div class="bg-white w-1/2 p-6 rounded shadow-lg grid grid-cols-3 gap-3">
                <div class="itbkk-modal-status col-start-1 col-span-3">
                    <h1 class="font-bold text-2xl py-2 mb-2">Edit new status</h1>
                    <h1 class="font-bold mt-2">Name : <span class="text-red-600">*</span></h1>
                    <input class="itbkk-status-name p-2 border-solid border-2 border-grey w-full mb-3 break-words"
                        placeholder="Name here" v-model="status.name" />
                    <span class="text-gray-500 text-sm"
                        :class="{ 'text-red-500': status.name.trim().length > 50 || status.name.trim().length === 0 }">{{
                            status.name.trim().length }} / 50 characters</span>
                    <h1 class="font-bold mt-2">Description : </h1>
                    <textarea
                        class="itbkk-status-description p-2 border-solid border-2 border-grey w-full mb-3 break-words"
                        rows="4" placeholder="Description here" v-model="status.description" />
                    <span :class="{ 'text-red-500': countOptionalCharacters(status.description) > 200 }"
                        class="text-gray-500 text-sm">{{ countOptionalCharacters(status.description) }} / 200
                        characters
                    </span>
                </div>
                <hr class="col-start-1 col-span-3" />
                <div class="flex justify-end mt-4 col-start-3">
                    <router-link :to="{ name: 'status' }">
                        <button class='itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3'
                            @click="EditStatus" :disabled="!isFormModified || checkWhiteSpace(status.name)">
                            Save
                        </button>
                    </router-link>
                    <router-link :to="{ name: 'status' }">
                        <button class="itbkk-button-cancel btn bg-red-500 hover:bg-red-700 text-white"
                            @click="$emit('close')">
                            Cancel
                        </button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped></style>