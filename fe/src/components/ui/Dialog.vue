<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-800 text-white bg-opacity-75 transition-opacity"
    @click.self="close"
  >
    <div class="flex items-center justify-center min-h-screen backdrop-blur-sm">
      <div
        class="bg-gray-900 rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full p-4 border border-gray-500"
      >
        <div class="text-center p-4">
          <p class="text-lg text-gray-200">{{ message }}</p>
        </div>
        <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            @click="confirm"
          >
            Confirm
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-400 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="close"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  message: String,
});

const isVisible = ref(false);
const confirmPromise = ref(null);

function open() {
  isVisible.value = true;
  return new Promise((resolve, reject) => {
    confirmPromise.value = { resolve, reject };
  });
}

function confirm() {
  if (confirmPromise.value) {
    confirmPromise.value.resolve(true);
  }
  close();
}

function close() {
  if (confirmPromise.value) {
    confirmPromise.value.reject(new Error("Dialog closed by user"));
  }
  isVisible.value = false;
}

// Expose the open function to parent components
defineExpose({ open });
</script>
