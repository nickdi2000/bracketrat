<template>
  <div class="py-3 flex flex-col items-center">
    <div class="max-w-xl">
      <BracketForm />
    </div>
  </div>
</template>

<script>
import BracketForm from "@/components/forms/BracketForm.vue";

export default {
  components: {
    BracketForm,
  },
  data() {
    return {};
  },
};
</script>
