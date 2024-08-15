<template>
  <div class="scroll-box fadein my-4">
    <div
      v-for="(player, playerIndex) in players"
      :key="playerIndex"
      class="mb-1"
    >
      <button
        class="btn btn-block bg-gray-700 hover:bg-gray-600 text-left"
        @click="addPlayerToBracket(player)"
      >
        <UserCircleIcon size="3" class="h-6 inline-block mr-2" />
        {{ player.name }}
      </button>
    </div>
    <div class="py-3">
      <button
        class="btn btn-block bg-gray-900 hover:bg-gray-700"
        @click="$emit('close')"
      >
        <ArrowLongLeftIcon class="h-6 inline mr-2" />
        Back
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //players: [],
    };
  },
  methods: {
    async addPlayerToBracket(player) {
      //this.$emit("addPlayerToBracket", player);
      console.log("player", player);
      await this.$store.addPlayerToBracket(player);
      this.$emit("fullClose");
    },
  },
  computed: {
    players() {
      const allPlayers = this.$store.players;
      const filteredPlayers = allPlayers.filter(e => e.stateLabel === "Limbo");
      return filteredPlayers; 
    },
  },
};
</script>

<style scoped>
.scroll-box {
  max-height: 60vh;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-bottom: 40px;
  min-width: 300px;
  /* blurred edge at top and bottom */
}
</style>
