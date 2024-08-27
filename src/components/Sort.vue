<script setup>
import { ref } from "vue";
const sortType = ref("default");

function handleSortIcon() {
    const currentSortType = sortType.value;
    switch (currentSortType) {
        case "asc":
            sortType.value = "desc";
            break;
        case "desc":
            sortType.value = "default";
            break;
        default:
            sortType.value = "asc";
            break;
    }
}
</script>

<template>
    <div>
        <div class="cursor-pointer flex items-center" @click="handleSortIcon">
            <span class="font-bold mr-2">Status</span>
            <div v-if="sortType === 'default'">
                <svg xmlns=" http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#9c9995"
                        d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm12.9 8V3h-2v13h-3l4 5l4-5zm-8-3H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
                </svg>
            </div>
            <div v-if="sortType === 'asc'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#de5b23"
                        d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm12.9 8V3h-2v13h-3l4 5l4-5zm-8-3H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
                </svg>
            </div>
            <div v-if="sortType === 'desc'">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#de5b23"
                        d="M4.869 11H2.667L6 3h2l3.333 8H9.131l-.41-1H5.28zm1.23-3h1.803L7 5.8zm15.9 0l-4-5l-4 5h3v13h2V8zm-11 5H3v2h4.855L3 19v2h8v-2H6.146L11 15z" />
                </svg>
            </div>
        </div>
    </div>
</template>

<style scoped></style>