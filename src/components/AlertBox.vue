<script setup>

const props = defineProps({
    tableType: String,
    showAdded: Boolean,
    showAddedError: Boolean,
    showDeleted: Boolean,
    showDeletedError: Boolean,
    showUpdated: Boolean,
    showUpdatedError: Boolean,
    addedTitle: String,
    updatedTitle: String,
});

</script>

<template>


    <!-- add alert -->
    <div v-if="showAdded" class="flex justify-center items-center">
        <div class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showAdded = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold break-words">
                    The {{ tableType }} "{{ addedTitle }}" is added successfully
                </p>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center">
        <div v-if="showAddedError" class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Error</h1>
                    <button @click="showAddedError = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">
                    An error occurred adding the new {{ tableType }}
                </p>
            </div>
        </div>
    </div>

    <!-- delete alert -->
    <div class="flex justify-center items-center">
        <div v-if="showDeleted" class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showDeleted = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">The {{ tableType }}
                    has been deleted</p>
            </div>
        </div>
    </div>

    <div class="flex justify-center items-center">
        <div v-if="showDeletedError" class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Error</h1>
                    <button @click="showDeletedError = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">
                    An error occurred, the {{ tableType }} does not exist
                </p>
            </div>
        </div>
    </div>


    <!-- edit alert -->
    <div v-if="showUpdated" class="flex justify-center items-center">
        <div class="bg-green-100 rounded-md mt-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showUpdated = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold break-words">The {{ tableType }} "{{ updatedTitle }}" is
                    updated
                    successfully
                </p>
            </div>
        </div>
    </div>

    <div v-if="showUpdatedError" class="flex justify-center items-center">
        <div class="bg-red-100 rounded-md mt-10 w-[1000px] border-2 border-red-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Error</h1>
                    <button @click="showUpdatedError = false" class="px-4 py-2 rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold">
                    An error has occurred, the {{ tableType }} does not exist
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>