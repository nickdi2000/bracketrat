<template>
  <div>
    <div class="header text-center">{{ bracket?.name }}</div>
    <div class="my-5 text-white">
      <div v-if="!bracket.robinRounds">
        <h1>Round Robin</h1>
        <div class="subheader">Every {{ $teamPlayer }} plays once.</div>
        <button class="btn btn-primary my-2" @click="generateRobin()">
          <BoltIcon class="w-6 h-6 mr-1 inline-block" />
          Generate
        </button>
      </div>
    </div>

    <div v-if="bracket?.robinRounds" class="my-8">
      <div class="m-auto grid md:grid-cols-1 lg:grid-cols-2">
        <div
          v-for="(round, index) in bracket.robinRounds"
          :key="index"
          class="w-full backdrop-saturate-100 bg-slate-600/30 rounded-lg p-3 lg:p-4"
        >
          <div class="my-2 py-3 drop-shadow-lg w-full px-3">
            <h3 class="uppercase font-bold my-2 text-gray-200">
              Round {{ round?.roundNumber }}
            </h3>
            <div
              v-for="(game, gameIndex) in round.games"
              :key="`game-${gameIndex}`"
              class="card-container mb-2"
            >
              <GameCard :game="game" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      style_="
          position: relative;
          width: 100%;
          text-align: center;
          top: 40px;
          z-index: 98;
        "
    >
      <LimboPlayers />
    </div>
  </div>
</template>

<script>
import LimboPlayers from "./LimboPlayers.vue";
import GameCard from "./GameCard.vue";

export default {
  name: "RoundRobin",
  data() {
    return {
      isFlipped: false,
    };
  },
  props: {
    bracket: Object,
  },
  mounted() {
    console.log("RoundRobin mounted...");
    //this.$store.fetchRobinBracket(this.bracket._id);
  },

  components: {
    LimboPlayers,
    GameCard,
  },
  computed: {},
  methods: {
    async generateRobin() {
      console.log("generateRobinBracket...");
      const rec = await this.$store.generateRobinBracket(this.bracket._id);
      console.log("generateRobin rec", rec);
    },
  },
};
</script>
