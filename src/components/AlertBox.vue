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
  addedCollabName: String,
});
</script>

<template>
  <div class="toast toast-end">
    <!-- Unvalid login alert -->
    <div v-if="showLoginAlert" class="alert alert-error bg-red-500">
      <span>Username or Password is incorrect</span>
      <button @click="showLoginAlert = false" class="btn btn-sm btn-circle btn-outline">✖</button>
    </div>

    <!-- Added Collaborator alert -->
    <div v-if="showAddedCollab" class="alert alert-success bg-green-500">
      <span>{{ addedCollabName }} is added successfully</span>
      <button @click="showAddedCollab = false" class="btn btn-sm btn-circle btn-outline">✖</button>
    </div>

    <!-- Add Alert -->
    <div v-if="showAdded" class="alert alert-success bg-green-500">
      <span>
        The {{ tableType }} "{{ addedTitle }}" is added successfully
      </span>
      <button @click="showAdded = false" class="btn btn-sm btn-circle bg-green-400 btn-outline">✖</button>
    </div>

    <!-- Add Error Alert -->
    <div v-if="showAddedError" class="alert alert-error bg-red-500">
      <span>
        An error occurred adding the new {{ tableType }}
      </span>
      <button @click="showAddedError = false" class="btn btn-sm btn-circle btn-outline">✖</button>
    </div>

    <!-- Delete Alert -->
    <div v-if="showDeleted" class="alert alert-success bg-green-500">
      <span v-if="tableType === 'boardCollab'">
        Leave the collab board successfully
      </span>
      <span v-else>
        The {{ tableType }} has been deleted
      </span>
      <button @click="showDeleted = false" class="btn btn-sm btn-circle btn-outline">✖</button>
    </div>

    <!-- Delete Error Alert -->
    <div v-if="showDeletedError" class="alert alert-error bg-red-500">
      <span>
        An error occurred, the {{ tableType }} does not exist
      </span>
      <button @click="showDeletedError = false" class="btn btn-sm btn-circle btn-outline">✖</button>
    </div>

    <!-- Edit Alert -->
    <div v-if="showUpdated" class="alert alert-success bg-green-500">
      <span>
        The {{ tableType }} "{{ updatedTitle }}" is updated successfully
      </span>
      <button @click="showUpdated = false" class="btn btn-sm btn-circle btn-outline">✖</button>
    </div>

    <!-- Edit Error Alert -->
    <div v-if="showUpdatedError" class="alert alert-error bg-red-500">
      <span>
        An error has occurred, the {{ tableType }} does not exist
      </span>
      <button @click="showUpdatedError = false" class="btn btn-sm btn-circle btn-outline">✖</button>
    </div>
  </div>
</template>

<style scoped></style>
