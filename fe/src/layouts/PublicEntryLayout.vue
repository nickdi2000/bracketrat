<template>
  <div class="bg-gradient-to-bl from-gray-800 to-sky-950 text-white">
    <PublicWelcome :key="$route.fullPath + '-publicwelcome'" />
  </div>
</template>

<script>
import PublicWelcome from "@/components/PublicWelcome.vue";

export default {
  name: "PublicEntryLayout",
  mounted() {
    //get code from url
    //
  },
  components: {
    PublicWelcome,
  },
  methods: {
    // get code from url

    navToNewCode() {
      this.$router.push({
        name: "FallBack",
        params: { path: this.newCode.toLowerCase() },
      });
      this.code = this.newCode;
      this.newCode = "";
      this.getData();
    },
  },
  data() {
    return {
      code: null,
      loading: false,
      bracket: null,

      error: "",
      showNewCodeInput: false,
      newCode: "",
    };
  },
};
</script>

<style></style>
