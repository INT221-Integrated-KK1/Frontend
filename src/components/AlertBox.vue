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
    <!-- Login Error Alert -->
    <div v-if="showLoginAlert" class="alert alert-error">
      <span>Username or Password is incorrect</span>
      <button class="text-lg font-bold" @click="$emit('close', 'showLoginAlert')">
        ✖
      </button>
    </div>

    <!-- Collaborator Added Success Alert -->
    <div v-if="showAddedCollab" class="alert alert-success">
      <span>{{ addedCollabName }} is added successfully</span>
      <button class="text-lg font-bold" @click="$emit('close', 'showAddedCollab')">
        ✖
      </button>
    </div>

    <!-- Add Alerts -->
    <div v-if="showAdded" class="alert alert-success">
      <span>The {{ tableType }} "{{ addedTitle }}" is added successfully</span>
      <button class="text-lg font-bold" @click="$emit('close', 'showAdded')">✖</button>
    </div>
    <div v-if="showAddedError" class="alert alert-error">
      <span>An error occurred adding the new {{ tableType }}</span>
      <button class="text-lg font-bold" @click="$emit('close', 'showAddedError')">
        ✖
      </button>
    </div>

    <!-- Delete Alerts -->
    <div v-if="showDeleted" class="alert alert-success">
      <span>
        {{
          tableType === "boardCollab"
            ? "Leave the collab board successfully"
            : `The ${tableType} has been deleted`
        }}
      </span>
      <button class="text-lg font-bold" @click="$emit('close', 'showDeleted')">✖</button>
    </div>
    <div v-if="showDeletedError" class="alert alert-error">
      <span>An error occurred, the {{ tableType }} does not exist</span>
      <button class="text-lg font-bold" @click="$emit('close', 'showDeletedError')">
        ✖
      </button>
    </div>

    <!-- Update Alerts -->
    <div v-if="showUpdated" class="alert alert-success">
      <span>The {{ tableType }} "{{ updatedTitle }}" is updated successfully</span>
      <button class="text-lg font-bold" @click="$emit('close', 'showUpdated')">✖</button>
    </div>
    <div v-if="showUpdatedError" class="alert alert-error">
      <span>An error has occurred, the {{ tableType }} does not exist</span>
      <button class="text-lg font-bold" @click="$emit('close', 'showUpdatedError')">
        ✖
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.alert-success {
  background-color: #d1fae5;
  border: 1px solid #10b981;
  color: #10b981;
}

.alert-error {
  background-color: #ffe4e6;
  border: 1px solid #e11d48;
  color: #e11d48;
}

.alert-info {
  background-color: #bfdbfe;
  border: 1px solid #3b82f6;
  color: #3b82f6;
}

button {
  background: none;
  border: none;
  color: inherit;
  font-size: inherit;
  cursor: pointer;
}
</style>
