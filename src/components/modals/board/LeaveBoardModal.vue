<script setup>
const props = defineProps({
    boardId: String,
    boardName: String,
    showRemoveModal: Boolean,
    showEditModal: Boolean,
    boardType: String
});

const emit = defineEmits(["leaveBoardCollab", "deleteBoard", "closeModal"]);

async function confirmChange() {
    if (props.boardType === 'personal') {
        emit("deleteBoard", props.boardId);
        emit("closeModal");
    } else if (props.boardType === 'collab') {
        emit("leaveBoardCollab", props.boardId);
        emit("closeModal");
    }
};

const cancelChange = () => {
    emit("closeModal")
};

</script>

<template>
    <div v-if="showRemoveModal" class="modal modal-open itbkk-modal-alert">
        <div class="modal-box space-y-4">
            <div class="p-3" v-if="boardType === 'collab'">
                <h3 class="font-bold text-xl text-gray-800 ml-2">Do you want to leave "{{ props.boardName }}"</h3>
            </div>
            <div class="p-3" v-if="boardType === 'personal'">
                <h3 class="font-bold text-xl text-gray-800 ml-2">Do you want to delete "{{ props.boardName }}"</h3>
            </div>

            <div class="modal-action space-x-2">
                <button class="btn bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md px-4 py-2"
                    @click="confirmChange()">
                    Confirm
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