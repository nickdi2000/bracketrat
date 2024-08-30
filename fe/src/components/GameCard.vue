<template>
  <div :class="['card', { flipped: isFlipped }]">
    <div class="card-front- hover:bg-blue-900" @click="isFlipped = !isFlipped">
      <div
        class="flex flex-row justify-between font-bold uppercase text-gray-400 md:text-1xl lg:text-3xl mb-2 bg-slate-800/50 rounded-lg p-4 mb-2"
        v-if="game.hasBye"
      >
        <div>
          {{
            game.participants[0]?.player?.name ||
            game.participants[1]?.player?.name ||
            "TBA"
          }}
          <ArrowUturnRightIcon class="ml-2 mb-1 w-5 h-5 inline-block" />
        </div>
        <div>
          <i>BYE</i>
        </div>
      </div>
      <div
        v-else
        class="grid grid-cols-3 items-center font-bold uppercase text-lg md:text-xl lg:text-2xl mb-2 bg-slate-800/50 rounded-lg p-4 mb-2"
      >
        <div
          class="text-left"
          :class="game.participants[0]?.winner ? 'text-green-400' : ''"
        >
          {{ game.participants[0]?.player?.name || "TBA" }}
        </div>
        <div class="text-center text-gray-400">vs</div>
        <div
          class="text-right"
          :class="game.participants[1]?.winner ? 'text-green-400' : ''"
        >
          {{ game.participants[1]?.player?.name || "TBA" }}
        </div>
      </div>
    </div>

    <!-- BACK CARD -->
    <div class="card-back matrix-grid p-2 text-white mb-8">
      <div class="">
        <button class="btn" @click="isFlipped = false">
          <ArrowUturnLeftIcon class="h-4 w-4 inline" />
        </button>
      </div>

      <div
        v-if="hasBye"
        class="p-3 m-auto text-center"
        @click="isFlipped = !isFlipped"
      >
        No actions available.
      </div>
      <!-- PARTICIPANTS LOOP -->

      <div v-else>
        <div
          class="px-3 mt-2 grid grid-cols-2 backdrop-opacity-10 backdrop-invert bg-slate-800/30 rounded-md"
          v-for="(p, i) in [0, 1]"  
          :key="i"
        >
          <div
            class="p-3 font-bold uppercase text-lg md:text-xl lg:text-2xl"
            :class="game.participants[i]?.winner ? 'text-green-400' : ''"
          >
            {{ game.participants[i]?.player?.name || "TBA" }}
          </div>
          <div class="px-1 py-2">
            <button
              class="btn btn-secondary"
              v-if="winnerIsSet && game.participants[i]?.winner"
              @click="undoWinner(game.participants[i]?.player)"
            >
              Undo
            </button>
            <button
              v-else
              class="btn btn-success fadein"
              :disabled="loading"
              @click="markAsWinner(game.participants[i]?.player)"
            >
              Mark Winner
            </button>
          </div>
        </div>
        <!-- END PARTICIPANTS -->
      </div>
    </div>
    <Loader2 v-if="loading" />
  </div>
</template>

<script>
import Loader2 from "./Loader2.vue";

export default {
  props: {
    game: {
      type: Object,
      required: true,
    },
  },
  components: {
    Loader2,
  },
  computed: {
    winnerIsSet() {
      return (
        this.game.participants[0]?.winner || this.game.participants[1]?.winner
      );
    },
    hasBye() {
      return this.game.hasBye;
    },
  },
  methods: {
    async markAsWinner(player) {
      this.loading = true;
      console.log("marking winner", player);
      console.log("Game", this.game);
      try {
        await this.$store.markWinner({
          playerId: player._id,
          gameId: this.game._id,
          bracketId: this.game.bracketId,
        });
        this.toggleFlip();
      } catch (e) {
        console.log("error marking winner", e);
        this.$toast.error("Error marking winner");
      }
      this.loading = false;
    },
    async undoWinner(player) {
      this.loading = true;
      console.log("undoing winner", player);
      console.log("Game", this.game);
      try {
        await this.$store.undoWinner({
          playerId: player._id,
          gameId: this.game._id,
          bracketId: this.game.bracketId,
        });
        this.toggleFlip();
      } catch (e) {
        console.log("error undoing winner", e);
        this.$toast.error("Error undoing winner");
      }
      this.loading = false;
    },
    toggleFlip() {
      setTimeout(() => {
        this.isFlipped = false;
      }, 300);
    },
  },
  data() {
    return {
      isFlipped: false,
      loading: false,
    };
  },
};
</script>

<style scoped>
.glowing-green-dot {
  width: 10px;
  height: 10px;
  background-color: rgb(84, 195, 0);
  border-radius: 50%;
  display: inline-block;
  animation: glowing-green-dot 1.3s infinite;
}

@keyframes glowing-green-dot {
  0% {
    box-shadow: 0 0 0 0px rgba(98, 210, 98, 0.9);
  }

  50% {
    box-shadow: 0 0 0 10px rgba(0, 255, 0, 0);
  }

  100% {
    box-shadow: 0 0 0 0px rgba(0, 255, 0, 0);
  }
}

.card-container {
  perspective: 1000px;
  /* width: 200px; */
  min-height: 110px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.card {
  width: 100%;

  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped {
  transform: rotateX(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  min-height: 100%; /* Ensure the back and front are the same height */
  backface-visibility: hidden; /* Hide the backface when flipped */
  top: 0;
  left: 0;
}

.matrix-grid {
  background: conic-gradient(
      from 90deg at 1px 1px,
      #0000 90deg,
      rgba(24, 132, 12, 0.209) 0
    )
    0 0/30px 30px;
}

.card-front {
  background-color: #fff;
  color: #000;
}

.card-back {
  transform: rotateX(180deg);
  min-height: 100%;
  background: rgba(11, 12, 33, 0.6);
  border-radius: 12%;
  backdrop-filter: blur(10px);
}
</style>
