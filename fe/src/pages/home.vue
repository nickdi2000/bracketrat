<template>
  <div class="flex h-screen">
    <div class="m-auto sm:w-full md:w-2/3 lg:w-1/2">
      <BracketForm :newUser="true" />
    </div>
  </div>
</template>

<script>
import BracketForm from "@/components/forms/BracketForm.vue";

export default {
  name: "Home",
  components: {
    BracketForm,
  },
};
</script>
