<template>
  <div
    v-if="Object.keys(player)?.length"
    class="fadein fixed inset-0 bg-gray-800 bg-opacity-70 backdrop-blur-md overflow-y-auto h-full w-full z-50"
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
            <div v-if="player.winner == null">
              <button
                class="btn btn-success btn-block"
                @click="markPlayerAsWinner()"
              >
                Mark as Winner
                <ArrowLongRightIcon
                  class="w-6 h-6 mr-2 inline"
                  v-if="!isLastRound"
                /><span v-else> of Bracket! </span>
              </button>

              <div v-if="player.roundIndex">
                <button
                  class="btn btn-secondary btn-block mt-3"
                  @click="removePlayerFromGame()"
                >
                  <div>
                    <ArrowLongLeftIcon class="w-6 h-6 mr-1 inline" /> Remove
                  </div>
                  <div class="subtitle">Undo as Winner in previous game</div>
                </button>
              </div>

              <div v-else-if="!player.roundIndex">
                <button
                  class="btn btn-secondary btn-sm mt-3"
                  @click="removePlayerFromGame()"
                >
                  <TrashIcon class="w-6 h-6 mr-2 inline" />
                  Remove from Bracket
                </button>
              </div>
            </div>
            <div
              v-else-if="player.winner == true"
              class="flex flex-col items-center justify-center"
            >
              <div class="badge-lg badge-success mb-3">
                <CheckCircleIcon class="w-6 h-6 inline" />
                {{ player.name }} WON this Match.
              </div>
            </div>
            <div
              v-else-if="player.winner == false"
              class="flex flex-col items-center justify-center"
            >
              <div
                class="badge-lg badge-danger mb-3"
                @click="markPlayerAsWinner()"
              >
                <HandThumbDownIcon class="w-6 h-6 inline" />
                {{ player.name }} LOST this Match.
              </div>
              <p v-if="opponentHasFutureRounds" class="subtitle">
                This {{ $teamPlayer }}'s opponent exists in future matches. The
                outcome of this round cannot be modified unless the future
                matches are removed first.
              </p>
            </div>
            <div v-if="player.winner != null">
              <div v-if="hasFutureRounds">
                <p class="subtitle" v-if="player.winner == true">
                  The outcome of this round cannot be modified while future
                  rounds still exist.
                </p>
              </div>

              <button
                @click="undoOutcomes()"
                class="btn btn-secondary btn-sm"
                v-if="!hasFutureRounds && !opponentHasFutureRounds"
              >
                <ArrowUturnDownIcon class="w-6 h-6 mr-2 inline" />
                Undo Outcome
              </button>
            </div>
          </div>
          <div v-if="dev">
            <pre>{{ player }}</pre>
          </div>
          <button @click="$emit('update', false)" class="btn btn-secondary">
            Cancel
          </button>
        </div>

        <div v-else class="text-center">
          <p class="p-3" v-if="player.roundIndex">
            Nothing to see here. Waiting on previous round...
          </p>
          <p class="p-3" v-else>Opponent gets a BYE for this round.</p>
          <button @click="$emit('update', false)" class="btn btn-secondary">
            Okay..
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bracketMixin } from "@/mixins/bracketMixin";

export default {
  data() {
    return {
      dev: false,
    };
  },
  mixins: [bracketMixin],
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
  computed: {
    rounds() {
      return this.$store.getRounds;
    },
    bracket() {
      return this.$store.getBracket;
    },
    isFirstRound() {
      return this.player.roundIndex === 0;
    },
    isLastRound() {
      return this.player.roundIndex === this.rounds.length - 1;
    },
    hasFutureRounds() {
      //should check if this player exists in future rounds' games
      if (this.roundIndex === this.rounds.length - 1) {
        return false;
      }
      return this.rounds
        .slice(this.player.roundIndex + 1)
        .some((round) =>
          round.games.some(
            (game) =>
              game.player1._id === this.player._id ||
              game.player2._id === this.player._id
          )
        );
    },
    opponentHasFutureRounds() {
      //get opponent by seeing if player1 or player2 is this player
      if (this.roundIndex === this.rounds.length - 1) {
        return false;
      }
      const opponent =
        this.rounds[this.player.roundIndex].games.find(
          (game) =>
            game.player1._id === this.player._id ||
            game.player2._id === this.player._id
        ).player1._id === this.player._id
          ? this.game.player2
          : this.game.player1;

      return this.rounds
        .slice(this.player.roundIndex + 1)
        .some((round) =>
          round.games.some(
            (game) =>
              game.player1._id === opponent._id ||
              game.player2._id === opponent._id
          )
        );
    },
  },
  methods: {
    getParams() {
      return {
        playerId: this.player._id,
        gameId: this.game._id,
        bracketId: this.$store.getBracket?._id,
        roundIndex: this.player.roundIndex,
      };
    },
    async markPlayerAsWinner() {
      const bracketId = this.$store.getBracket?._id;
      if (!bracketId) {
        console.error("No bracket found");
        this.$toast.error("No bracket found. Please call for help.");
        return;
      }

      const params = this.getParams();

      try {
        const rec = await this.$api.post(
          `/brackets/${bracketId}/set-winner`,
          params
        );
        this.$store.setRounds(rec.data.bracket.rounds);
        // this.$toast.success("Player marked as winner");
        //this.$emit("update", false);
        this.closeModal();
      } catch (error) {
        console.error(error);
        this.$toast.error("Error marking player as winner");
      }

      this.closeModal();
    },
    async removePlayerFromGame() {
      const params = this.getParams();
      console.log("removing...", params);
      const rec = await this.$api.post(
        `/brackets/${params.bracketId}/remove-player-from-game`,
        params
      );
      //console.log("rec", rec);
      this.$store.setRounds(rec.data.bracket.rounds);
      // this.$emit("update", false);
      this.closeModal();
    },

    async undoOutcomes() {
      const params = this.getParams();
      console.log("undoing...", params);
      const rec = await this.$api.post(
        `/brackets/${params.bracketId}/undo-outcomes`,
        params
      );
      this.$store.setRounds(rec.data.bracket.rounds);
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
