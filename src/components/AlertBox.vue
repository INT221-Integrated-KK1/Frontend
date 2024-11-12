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
    showLoginAlert: Boolean,
    showAddedCollab: Boolean,
    addedCollabName: String
});

</script>

<template>



    <!-- unvalid login alert -->
    <div v-if="showLoginAlert" class="bg-red-100 rounded-md border-2 border-red-500 fixed top-5">
        <div class="p-4">
            <div class="flex justify-between">
                <h1 class="text-xl font-bold mr-3 itbkk-message">Username or Password is incorrect</h1>
                <button class="px-4 py-2rounded" @click="showLoginAlert = false">✖</button>
            </div>
        </div>
    </div>

    <div  v-if="showAddedCollab" class="flex justify-center items-center">
        <div class="absolute bottom-0 z-40 bg-green-100 rounded-md my-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showAddedCollab = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p class="itbkk-message text-lg font-bold break-words">
                    {{ addedCollabName }} is added successfully
                </p>
            </div>
        </div>
    </div>

    <!-- add alert -->
    <div v-if="showAdded" class="flex justify-center items-center">
        <div class="absolute bottom-0 z-40 bg-green-100 rounded-md my-10 w-[1000px] border-2 border-green-500">
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

    <div v-if="showAddedError" class="flex justify-center items-center">
        <div class="absolute bottom-0 z-40 bg-red-100 rounded-md my-10 w-[1000px] border-2 border-red-500">
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
    <div v-if="showDeleted" class="flex justify-center items-center">
        <div class="absolute bottom-0 z-40 bg-green-100 rounded-md my-10 w-[1000px] border-2 border-green-500">
            <div class="p-4">
                <div class="flex justify-between mb-3">
                    <h1 class="text-2xl font-bold">Success</h1>
                    <button @click="showDeleted = false" class="px-4 py-2rounded">✖</button>
                </div>
                <p v-if="tableType === 'boardCollab'" class="itbkk-message text-lg font-bold">
                    Leave the collab board successfully
                </p>
                <p v-else class="itbkk-message text-lg font-bold">The {{ tableType }}
                    has been deleted</p>
            </div>
        </div>
    </div>

    <div v-if="showDeletedError" class="flex justify-center items-center">
        <div class="absolute bottom-0 z-40 bg-red-100 rounded-md my-10 w-[1000px] border-2 border-red-500">
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
        <div class="absolute bottom-0 z-40 bg-green-100 rounded-md my-10 w-[1000px] border-2 border-green-500">
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
        <div class="absolute bottom-0 z-40 bg-red-100 rounded-md my-10 w-[1000px] border-2 border-red-500">
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