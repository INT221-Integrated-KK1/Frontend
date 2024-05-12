<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { getItemById } from "../libs/fetchUtils.js";
import { useRoute } from "vue-router";
import { StatusManagement } from "@/libs/StatusManagement.js";

const { params } = useRoute();
const id = Number(params.id);
const emit = defineEmits(['saveChanges', 'close'])

const status = ref(null);
const isLoaded = ref(false);
const statusmanager = ref(new StatusManagement());
const receivedProps = defineProps({
    taskDetailsProp: Object
});
const props = reactive(receivedProps.taskDetailsProp);
console.log(props.statusName);

// const statusProp = reactive({
//     statusId: props.statusId,
//     statusName: props.statusName,
//     statusDescription: props.statusDescription
// });

// const initialTask = ref(JSON.stringify(statusProp));
// console.log("initialTask", initialTask);
// const isFormModified = computed(() => JSON.stringify(statusProp) !== initialTask);
// console.log("isFormModified", isFormModified.value);

onMounted(async () => {
    try {
        const items = await getItemById(import.meta.env.VITE_BASE_STATUS_URL, id);
        console.log(id);
        status.value = items;
        isLoaded.value = true;
    } catch (error) {
        console.error("Error fetching task details:", error)
    }
});

const EditStatus = () => {
    // if (isFormModified.value == true) {
    isLoaded.value == false;
    emit('saveChanges', props, id);
    // }

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
                        placeholder="Name here" v-model="props.statusName" />
                    <h1 class="font-bold mt-2">Description : </h1>
                    <textarea
                        class="itbkk-status-description p-2 border-solid border-2 border-grey w-full mb-3 break-words"
                        rows="4" placeholder="Description here" v-model="props.statusDescription" />
                </div>
               

                <hr class="col-start-1 col-span-3" />

                <div class="flex justify-end mt-4 col-start-3">
                    <router-link :to="{ name: 'status' }">
                        <button class='itbkk-button-confirm btn bg-green-500 hover:bg-green-700 text-white mx-3'
                            @click="EditStatus">
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