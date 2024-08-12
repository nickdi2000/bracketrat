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
          <div class="uppercase text-2xl font-bold text-gray-400 mb-2">
            {{ player.name }}
          </div>
          <h2
            class="text-2xl font-semibold uppercase mb-4 cursor-pointer hover:text-blue-200"
            @click="$router.push(`/admin/player/${player._id}`)"
          >
            {{ player?.player?.name }}
          </h2>
          <div class="py-2 w-full min-w-3xl">
            <div v-if="player.hasBye">
              <p class="px-3 uppercase text-gray-300 italic">
                {{ player?.player.name }} gets a BYE for this round.
              </p>

              <button
                class="btn btn-secondary mt-0 mt-3 px-4"
                @click="removePlayerFromGame()"
              >
                <div>
                  <ArrowLongLeftIcon class="w-6 h-6 mr-1 inline" /> Remove
                </div>
              </button>
            </div>

            <div v-else-if="player.winner == null">
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
                  class="btn btn-secondary btn-block mt-3"
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
                class="btn hover:bg-gray-500 p-2 mb-5"
                v-if="!hasFutureRounds && !opponentHasFutureRounds"
              >
                <ArrowUturnDownIcon class="w-5 h-5 mr-2 inline" />
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

        <div v-if="!player.name" class="text-center">
          <p class="p-3" v-if="player.roundIndex">
            Nothing to see here. Waiting on previous round...
          </p>
          <span v-else>
            <div v-if="showAllPlayersToSelect">
              <PlayerButtonList
                @select="addPlayer"
                @close="showAllPlayersToSelect = false"
                @fullClose="$emit('update', false)"
              />
            </div>

            <div v-else>
              <p class="px-3 text-lg uppercase font-bold mt-2 mb-0 py-0">
                Blank Spot.
              </p>
              <p class="px-3 mb-4 text-sm text-gray-400 uppercase mt-0 py-0">
                Add a {{ $teamPlayer }}, or leave it blank to act as a BYE.
              </p>
              <button @click="addPlayer" class="btn btn-primary btn-block mb-2">
                + Create New {{ $teamPlayer }} Here
              </button>

              <button
                v-if="$store.players.length"
                @click="showAllPlayersToSelect = true"
                class="btn bg-slate-900 btn-block mb-6 text-gray-300 hover:bg-slate-800"
              >
                <UsersIcon class="h-6 mr-2 inline" /> Add Existing
                {{ $teamPlayer }}
              </button>
            </div>
          </span>
          <button @click="$emit('update', false)" class="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bracketMixin } from "@/mixins/bracketMixin";
import PlayerButtonList from "@/components/PlayerButtonList.vue";

export default {
  data() {
    return {
      dev: false,
      showAllPlayersToSelect: false,
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
  components: {
    PlayerButtonList,
  },
  emits: ["update", "addNew", "generate"],
  computed: {
    rounds() {
      return this.bracket?.rounds;
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
      const opponent = this.getOpponent(this.player);

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
    addPlayer() {
      this.$emit("update", false);
      const participantIndex = this.player?.participantIndex;
      const gameId = this.game._id;
      this.$showAddPlayerModal({ participantIndex, gameId });
    },
    getParams() {
      return {
        playerId: this.player._id,
        gameId: this.game._id,
        bracketId: this.$store.getBracket?._id,
        roundIndex: this.player.roundIndex,
      };
    },
    handleClose() {
      this.$emit("update", false);
    },
    getOpponent(player) {
      return this.rounds[player.roundIndex].games.find(
        (game) =>
          game.player1._id === player._id || game.player2._id === player._id
      ).player1._id === player._id
        ? this.game.player2
        : this.game.player1;
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
        this.$store.setSelectedBracket(rec.data.bracket);
        this.$toast.success("Player marked as winner");
        this.$emit("update", false);
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
      /*
      const rec = await this.$api.post(
        `/brackets/${params.bracketId}/remove-player-from-game`,
        params
      );
      */
      await this.$store.removePlayerFromGame(params);
      //this.$store.setRounds(rec.data.bracket.rounds);

      this.closeModal();
    },

    async undoOutcomes() {
      const params = this.getParams();
      const rec = await this.$api.post(
        `/brackets/${params.bracketId}/undo-outcomes`,
        params
      );
      if( rec.status === 200 ) {
        const req = await this.$api.get(
          `/brackets/${params.bracketId}`,
        )
        this.$store.setSelectedBracket(req.data);
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
