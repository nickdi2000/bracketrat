<template>
  <div class="py-3 flex flex-col items-center">
    <div class="w-full pb-4">
      <RoundsDetails :bracket="bracket" />
    </div>

    <div class="flex flex-start my-4">
      <!-- view bracket router push bracket -->
      <button class="btn btn-secondary" @click="$router.push(`/admin/`)">
        <ArrowLeftCircleIcon class="w-6 h-6 mr-2 inline" />
        Bracket View
      </button>
    </div>
  </div>
</template>

<script>
import RoundsDetails from "@/components/RoundsDetails.vue";

export default {
  components: {
    RoundsDetails,
  },
  data() {
    return {};
  },
  computed: {
    bracket() {
      return this.$store.getBracket;
    },
  },
};
</script>
