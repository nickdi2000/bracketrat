<template>
  <div
    v-if="Object.keys(player)?.length"
    class="fadein fixed inset-0 bg-gray-700 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    id="my-modal"
  >
    <div class="flex items-center justify-center min-h-full mx-2">
      <div
        class="backdrop-blur-2xl bg-gray-800 border border-blue-900 p-5 rounded-lg shadow-lg max-w-md mx-auto my-6 sm:max-w-xl md:min-w-2xl md:max-w-2xl lg:w-1/2"
      >
        <!-- Modal content here -->

        <div class="text-center" v-if="player.name">
          <h2 class="text-2xl font-semibold uppercase mb-4">
            {{ player.name }}
          </h2>
          <div class="py-2 my-5 w-full min-w-3xl">
            <Alert type="info" v-on:dbclick="dev = !dev"
              >Click the button below to mark {{ player.name }} as the winner of
              this bracket and move them onto the next round.
            </Alert>
            <button
              class="btn btn-success btn-lg w-full"
              @click="markPlayerAsWinner()"
            >
              Mark as Winner
            </button>
          </div>
          <div v-if="dev">
            <pre>{{ player }}</pre>
          </div>
          <button @click="$emit('update', false)" class="btn btn-secondary">
            Cancel
          </button>
        </div>

        <div v-else class="text-center">
          <p class="p-3">
            Nothing to see here, pal. Waiting on previous round...
          </p>
          <button @click="$emit('update', false)" class="btn btn-secondary">
            Okay..?
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dev: false,
    };
  },
  props: {
    player: {
      type: Object,
      default: () => ({}),
    },
    game: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update"],
  methods: {
    async markPlayerAsWinner() {
      const bracketId = this.$store.getBracket?._id;
      if (!bracketId) {
        console.error("No bracket found");
        this.$toast.error("No bracket found. Please call for help.");
        return;
      }

      const params = {
        winnerId: this.player._id,
        gameId: this.game._id,
      };
      console.log("params", params);
      try {
        const rec = await this.$api.post(
          `/brackets/${bracketId}/set-winner`,
          params
        );
        this.$store.setRounds(rec.data.bracket.rounds);
        this.$toast.success("Player marked as winner");
        this.$emit("update", false);
        this.closeModal();
      } catch (error) {
        console.error(error);
        this.$toast.error("Error marking player as winner");
      }

      this.closeModal();
    },
    closeModal() {
      this.$emit("update", false);
    },
  },
};
</script>

<style scoped>
.customModal {
  position: fixed;
  top: 20%;

  left: 10%;
  background: rgba(23, 31, 62, 0.638);
  width: 80%;
  padding: 2rem;
  border-radius: 3rem;
  z-index: 55;
}

.card-body {
  max-height: 50vh;
  overflow: scroll;
}

.responseiveModal {
  @apply w-1/2;
}
</style>
