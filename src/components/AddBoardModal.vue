<script setup>
import { ref, computed, onMounted } from 'vue';

// Emit events to parent component
const emit = defineEmits(['close', 'save-board']);

const name = localStorage.getItem('username');

// Set default board name
const boardName = ref(`${name} personal board`);
const errorMessage = ref('');

// Validate the input to ensure it meets the criteria
const isValid = computed(() => {
  if (boardName.value.trim() === '') {
    errorMessage.value = 'Board name cannot be empty';
    return false;
  } else if (boardName.value.length > 120) {
    errorMessage.value = 'Board name must not exceed 120 characters';
    return false;
  }
  errorMessage.value = '';
  return true;
});

// Save the board and emit the board name to the parent component
const saveBoard = () => {
  if (isValid.value) {
    emit('save-board', boardName.value); // Emit the board name to parent
    closeModal();
  }
};

// Close the modal and reset form fields
const closeModal = () => {
  boardName.value = 'itkkk.olarn personal board'; // Reset to default value
  errorMessage.value = '';
  emit('close');
};

// Calculate the character count
const characterCount = computed(() => boardName.value.length);

// Check if Save button should be enabled or disabled
const isSaveButtonDisabled = computed(() => boardName.value.trim() === '');
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <h2 class="text-2xl font-bold mb-5 text-green-800">New Board</h2>

      <label for="boardName" class="block text-lg mb-2">Name</label>
      <input
        v-model="boardName"
        id="boardName"
        type="text"
        class="w-full p-2 border rounded mb-2"
        placeholder="Enter board name"
      />

      <!-- Show character count in format x/120 -->
      <p class="text-gray-600 mb-2">{{ characterCount }}/120</p>

      <!-- Display error message if there's an issue -->
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

      <div class="flex justify-end space-x-4">
        <!-- Disable Save button if board name is empty -->
        <button 
          @click="saveBoard" 
          :disabled="isSaveButtonDisabled"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
          Save
        </button>
        <button @click="closeModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
