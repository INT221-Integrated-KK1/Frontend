<script setup>
import { ref, computed } from 'vue';
import { addItem, getItemById } from '@/libs/fetchUtils';

const email = ref("");
const accessRight = ref("READ");
const props = defineProps({
    boardId: String,
    readAccess: Boolean,
    actionType: String,
    showModal: Boolean,
    collabItem: Object
});

const url = `${import.meta.env.VITE_BASE_BOARDS_URL}/${props.boardId}/collabs`;
const emit = defineEmits(["addCollab", "editCollab", "removeCollab", "closeModal", "inviteCollab"]);

async function confirmChange() {
    if (props.actionType === 'add') {
        try {
            const inputItem = {
                email: email.value,
                // collaboratorEmail: email.value,
                accessRight: accessRight.value
            };
            
            // emit("inviteCollab", inputItem);
            // console.log("sending inviteCollab: ", inputItem);
            // emit("closeModal")
            

            const addCollab = await addItem(url, inputItem)
            if (addCollab.status === 404) {
                window.alert("The user does not exist.");
            } else if (addCollab.status === 409) {
                if (email.value === localStorage.getItem('email')) {
                    window.alert("Board owner cannot be collaborator of his/her own board.");
                } else {
                    window.alert("The user is already the collaborator or pending collaborator of this board.");
                }
            } else {
                const recentCollab = await getItemById(url, addCollab.collabsId);
                emit("addCollab", recentCollab);
                email.value = "";
                accessRight.value = "READ";
                emit("closeModal")
            }
        } catch (error) {
            console.error(`Error add collab: ${error}`);
        }
    } else if (props.actionType === 'edit') {
        emit("editCollab", props.collabItem.oid, props.collabItem.accessRight === "READ" ? "WRITE" : "READ");
        emit("closeModal")

    } else if (props.actionType === 'remove') {
        emit("removeCollab", props.collabItem.oid);
        emit("closeModal")
    }

};

const cancelChange = () => {
    emit("closeModal")
};

const checkWhiteSpace = (title) => {
    return /^\s*$/.test(title);
};
const isSaveButtonDisabled = computed(() => email.value.trim() === '');

</script>

<template>
    <div v-if="showModal" class="modal modal-open itbkk-modal-alert">
        <div class="modal-box space-y-4">
            <div v-if="props.actionType === 'add'" class="p-3">
                <h3 class="font-bold text-xl text-gray-800 ml-2">Add Collaborator</h3>
                <div class="flex pt-3 p-2">
                    <div class="w-full mr-3">
                        <label class="font-semibold text-gray-700 block">Collaborator e-mail</label>
                        <input type="email" class="input input-bordered w-full" placeholder="Enter Collaborator e-mail"
                            v-model="email" />
                    </div>
                    <div class="w-1/2">
                        <label class="font-semibold text-gray-700 block">Access Right</label>
                        <select class="select select-bordered w-full max-w-xs" v-model="accessRight">
                            <option value="READ">READ</option>
                            <option value="WRITE">WRITE</option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-if="props.actionType === 'edit'">
                <h3 class="font-bold text-xl text-gray-800 ml-2">Change Access Right</h3>
                <div class="w-full mr-3">
                    <p>Do you want to change access right of "{{ props.collabItem.name }}" to "{{
                        props.collabItem.accessRight === "READ" ? "WRITE" : "READ" }}"</p>
                </div>
            </div>
            <div v-if="props.actionType === 'remove'" class="p-3">

                <h3 class="font-bold text-xl text-gray-800">Remove Collaborator</h3>
                <div class="w-full pt-3">
                    <p>Are you sure you want to remove {{ props.collabItem.email }} as a collaborator?</p>
                </div>
            </div>

            <div class="modal-action space-x-2">
                <button class="btn bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md px-4 py-2"
                    @click="confirmChange()"
                    :disabled="actionType === 'add' && (checkWhiteSpace(email) || isSaveButtonDisabled)">
                    {{ actionType === 'add' ? 'Add' : actionType === 'edit' ? 'Change' : 'Remove' }}
                </button>
                <button class="btn bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-md px-4 py-2"
                    @click="cancelChange">
                    Cancel
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped></style>