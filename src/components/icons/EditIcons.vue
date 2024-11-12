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
        return `<path fill="#888888"
                    d="M15.748 2.947a2 2 0 0 1 2.829 0l2.474 2.475a2 2 0 0 1 0 2.829l-2.35 2.35l-2.202 2.202l-1.415-1.414l1.496-1.496l-2.475-2.474l-1.495 1.495L11.195 7.5l2.203-2.203zm-.228 3.057l2.474 2.475l1.643-1.643l-2.475-2.474zM4 2.586L21.414 20L20 21.414l-6.056-6.056l-4.786 4.786l-6.38 1.076l1.077-6.38l4.785-4.785L2.586 4zm6.055 8.883L5.72 15.803l-.503 2.977l2.977-.502l4.335-4.334z" />`
    } else {
        return `<path fill="#111111"
                    d="M13.896 3.03a2 2 0 0 1 2.701-.117l.127.117l4.243 4.243a2 2 0 0 1 .117 2.7l-.117.128l-10.314 10.314a2 2 0 0 1-1.238.578L9.239 21H4.006a1.01 1.01 0 0 1-1.004-.9l-.006-.11v-5.233a2 2 0 0 1 .467-1.284l.12-.13L13.895 3.03ZM12.17 7.584l-7.174 7.174V19H9.24l7.174-7.174l-4.243-4.243Zm3.14-3.14L13.584 6.17l4.243 4.243l1.726-1.726z" />`
    }
});
</script>

<template>
    <div>
        <span class=" block p-2 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" v-html="iconPath">
            </svg>
        </span>
    </div>
</template>

<style scoped></style>