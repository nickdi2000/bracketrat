<template>
  <div class="text-white min-h-screen">
    <PlayerForm v-if="$store.getBracket" />
  </div>
</template>

<script>
import PlayerForm from "@/components/forms/PlayerForm.vue";

export default {
  components: {
    PlayerForm,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
