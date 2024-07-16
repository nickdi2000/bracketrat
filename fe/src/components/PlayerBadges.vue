<template>
  <span>
    <div class="subheader mb-2">
      Stragglers:
      <QuestionMarkCircleIcon
        class="w-4 h-4 inline"
        @click="
          $bottomAlert(
            `These ${$teamPlayer}'s are in your master list but are not currently in the bracket.  You may add them in individually, or re-generate the bracket to include them. `
          )
        "
      />
    </div>
    <span
      :style="{ '--delay': index * 0.1 + 's' }"
      style="z-index: 1000"
      class="badge opacity-9 mr-2 fade-in cursor-pointer hover:bg:blue-400 dark:hover:bg-blue-400 hover:text-blue-800 dark:hover:text-blue-800"
      v-for="(player, index) in players"
      :key="player.id"
      @click="add(player)"
    >
      {{ player.name }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async add(player) {
      await this.$store.addPlayerToBracket(player);
      this.$emit("update");
    },
  },
};
</script>
