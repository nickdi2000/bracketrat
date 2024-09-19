<template>
  <div class="bottom-div fadeinUp" v-if="isVisible">
    <div
      class="p-4 mb-4 text-sm md:text-lg lg:text-2xl text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
      role="alert"
    >
      <span class="font-medium">Tip:</span> {{ message }}
      <div class="my-3">
        <button
          @click="close"
          class="text-blue-800 dark:text-blue-400 p-3 bg-blue-900 hover:bg-blue-700"
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from "vue";

const props = defineProps({
  message: String,
});

const isVisible = ref(true);

function open() {
  isVisible.value = true;
}

function close() {
  isVisible.value = false;
}

// Expose the open function to parent components
defineExpose({ open, close });
</script>

<style>
.bottom-div {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition-duration: 1s !important;
}

.fadeinUp-enter-active,
.fadeinUp-leave-active {
  transition: opacity 1.5s;
}
</style>
