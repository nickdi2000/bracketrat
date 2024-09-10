<template>
  <div>
    <div class="flex flex-col md:flex-row  justify-between w-full items-center">
      <div class="header text-center md:text-end w-full md:w-[60%]">{{ bracket?.name }}</div>
      <div class="mt-4 md:mt-0 text-center md:text-end w-full md:w-[40%]">
        <button class="btn btn-primary bg-gray-900 hover:bg-blue-800" @click="toggleStats">
          See Stats
        </button>
      </div>
    </div>
    <div class="my-5 text-white">
      <div v-if="!bracket.rounds">
        <h1>Round Robin</h1>
        <div class="subheader">Every {{ $teamPlayer }} plays once.</div>
        <button class="btn btn-primary my-2" @click="generateRobin()">
          <BoltIcon class="w-6 h-6 mr-1 inline-block" />
          Generate
        </button>
      </div>
    </div>
    <div v-if="showStats" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="text-white rounded-lg shadow-lg max-w-4xl  w-full relative">
        <div class="p-8">
          <StatsTable :participants="getParticipants()" @close="toggleStats" />
        </div>
      </div>
    </div>
    <div v-if="bracket?.rounds" class="my-8">
      <div class="m-auto grid md:grid-cols-1 lg:grid-cols-2">
        <div
          v-for="(round, index) in bracket.rounds"
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
      <LimboPlayers :bracket="bracket" />
    </div>
  </div>
</template>

<script>
import LimboPlayers from "./LimboPlayers.vue";
import GameCard from "./GameCard.vue";
import StatsTable from "./StatsTable.vue";

export default {
  name: "RoundRobin",
  data() {
    return {
      isFlipped: false,
      showStats: false,
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
    StatsTable,
  },
  computed: {},
  methods: {
    toggleStats() {
      this.showStats = !this.showStats;
    },
    getParticipants() {
      let participants = [];
      if (this.bracket?.robinRounds) {
        this.bracket.robinRounds.forEach((round) => {
          round.games.forEach((game) => {
            participants = participants.concat(game.participants || []);
          });
        });
      }
      return participants;
    },
    async generateRobin() {
      const rec = await this.$store.generateRobinBracket();
    },
  },
};
</script>
<style scoped>

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bg-black.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.z-50 {
  z-index: 50;
}

.absolute {
  position: absolute;
}

.custom-close-button {
  top: -15px;
  right: 22px;
  font-size: 2.5rem;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 100;
  padding: 1rem; 
}



.text-2xl {
  font-size: 1.5rem;
}
</style>