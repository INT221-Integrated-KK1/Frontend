<script setup>
import { computed } from "vue";

const props = defineProps({
    isOff: {
        type: Boolean,
        default: false,
    },
});

const iconPath = computed(() => {
    if (props.isOff) {
        return `<path fill='#888888'
                    d='M3.94 5L2.22 3.28a.75.75 0 1 1 1.06-1.06l18.5 18.5a.75.75 0 0 1-1.06 1.06l-2.19-2.19A3.75 3.75 0 0 1 15.025 22H8.974a3.75 3.75 0 0 1-3.733-3.389L4.07 6.5H2.75a.75.75 0 0 1 0-1.5zm13.338 13.34L15 16.06v1.19a.75.75 0 0 1-1.5 0v-2.69l-3-3v5.69a.75.75 0 0 1-1.5 0v-7.19L5.59 6.652l1.144 11.816a2.25 2.25 0 0 0 2.24 2.033h6.052a2.25 2.25 0 0 0 2.24-2.033zM13.5 10.318l1.5 1.5V9.75a.75.75 0 0 0-1.5 0zM18.424 6.5l-.771 7.971l1.374 1.374l.904-9.345h1.319a.75.75 0 0 0 0-1.5H15.5a3.5 3.5 0 1 0-7 0h-.318l1.5 1.5zM14 5h-4a2 2 0 1 1 4 0'/>`
    } else {
        return `<path fill='#111111' 
                    d='M14.28 2a2 2 0 0 1 1.897 1.368L16.72 5H20a1 1 0 1 1 0 2l-.003.071l-.867 12.143A3 3 0 0 1 16.138 22H7.862a3 3 0 0 1-2.992-2.786L4.003 7.07A1.01 1.01 0 0 1 4 7a1 1 0 0 1 0-2h3.28l.543-1.632A2 2 0 0 1 9.721 2zm3.717 5H6.003l.862 12.071a1 1 0 0 0 .997.929h8.276a1 1 0 0 0 .997-.929zM10 10a1 1 0 0 1 .993.883L11 11v5a1 1 0 0 1-1.993.117L9 16v-5a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0v-5a1 1 0 0 1 1-1m.28-6H9.72l-.333 1h5.226z'/>`
    }
});
</script>

<template>
    <div>
        <span class="block p-2 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" v-html="iconPath">
            </svg>
        </span>
    </div>
</template>

<style scoped></style>
