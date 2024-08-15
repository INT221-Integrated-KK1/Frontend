<script setup>
import { ref, onMounted } from "vue";
import { getItems } from "../libs/fetchUtils.js";

const statuses = ref([]);
const selectedStatuses = ref([]);
const showFilterDropdown = ref(false);
const emit = defineEmits(['filter','reset']);

onMounted(async () => {
    statuses.value = await getItems(import.meta.env.VITE_BASE_STATUS_URL);
});

const toggleFilterDropdown = () => {
    showFilterDropdown.value = !showFilterDropdown.value;
};

const applyFilter = () => {
    emit('filter', selectedStatuses.value);
    console.log(selectedStatuses.value);
};

const clearSelectedStatues = async () => {
    selectedStatuses.value = [];
    emit('reset');
};
</script>

<template>
    <div class="flex items-center">
        <div>
            <details class="dropdown mx-5">
                <summary class="btn font-bold flex" @click="toggleFilterDropdown">
                    <div v-if="selectedStatuses.length > 0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                            <path fill="#de5b23"
                                d="M11 18q-.425 0-.712-.288T10 17t.288-.712T11 16h2q.425 0 .713.288T14 17t-.288.713T13 18zm-4-5q-.425 0-.712-.288T6 12t.288-.712T7 11h10q.425 0 .713.288T18 12t-.288.713T17 13zM4 8q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z" />
                        </svg>
                    </div>
                    <div v-if="selectedStatuses.length === 0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
                            <path fill="#888888"
                                d="M11 18q-.425 0-.712-.288T10 17t.288-.712T11 16h2q.425 0 .713.288T14 17t-.288.713T13 18zm-4-5q-.425 0-.712-.288T6 12t.288-.712T7 11h10q.425 0 .713.288T18 12t-.288.713T17 13zM4 8q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z" />
                        </svg>
                    </div>
                    Filter
                </summary>

                <ul v-if="showFilterDropdown"
                    class="p-2 shadow menu dropdown-content z-10 bg-white rounded-lg mt-2 ring-1 ring-black ring-opacity-5 w-[220px]">
                    <template v-for="status in statuses" :key="status.id">
                        <li>
                            <label :for="status.id"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer checked:bg-orange-500  w-[200px] break-words">
                                <input type="checkbox" :id="status.id" :value="status.name" class="mr-2"
                                    v-model="selectedStatuses" @change="applyFilter">
                                {{ status.name }} 
                            </label>
                        </li>
                    </template>
                </ul>
            </details>


        </div>

        <div class="btn btn-ghost flex font-bold text-sm cursor-pointer" v-if="selectedStatuses.length > 0"
            @click="clearSelectedStatues">
            Reset<span class="px-2">✖</span>
        </div>
    </div>

</template>

<style scoped></style>