<script setup>
import { ref } from 'vue';
import { computed } from 'vue';


const emit = defineEmits(['close']);

const boardName = ref('');
const errorMessage = ref('');


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


const saveBoard = () => {
  if (isValid.value) {
    console.log('Board saved:', boardName.value); 
    closeModal();
  }
};


const closeModal = () => {
  boardName.value = '';
  errorMessage.value = '';
  emit('close');
};


const characterCount = computed(() => boardName.value.length);
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

    
      <p class="text-gray-600 mb-2">{{ characterCount }}/120</p>

      
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>

      <div class="flex justify-end space-x-4">
        <button @click="saveBoard" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 itbkk-button-ok">Save</button>
        <button @click="closeModal" class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 itbkk-button-cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
