<template>
  <div class="bottom-div fadeIn">
    <div
      class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
      role="alert"
    >
      <span class="font-medium">Tip:</span> {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  message: String,
});

const isVisible = ref(false);

function open() {
  isVisible.value = true;
}

function close() {
  isVisible.value = false;
}

// Expose the open function to parent components
defineExpose({ open });
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
</style>
