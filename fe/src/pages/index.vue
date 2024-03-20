<template>
  <span class="dark:text-white">
    <Loader v-if="loading" />
    <div class="bracket-container fadein" v-if="rounds.length">
      <bracket
        :rounds="rounds"
        class="bracket z-40"
        :key="'bracket-' + compKey"
      >
        <template #player="{ player }">
          <div
            @click="selectPlayer(player)"
            class="player-box text-lg"
            :class="!player.name ? 'un-played' : ''"
          >
            {{ player.name }}
            <!-- <div class="text-xs">{{ player.id }}</div> -->
          </div>
        </template>
        <template #player-extension-bottom="{ match }">
          <div class="text-muted uppercase font-bold text-xs text-gray-500">
            {{ match._id }}
          </div>
        </template>
      </bracket>

      <BracketBottomMenu
        :bracket="currentBracket"
        @generate="generateBracket"
      />

      <pre v-if="dev" class="text-xs z-50" style="">{{ rounds }}</pre>
    </div>

    <div
      v-else
      class="min-h-96 mt-20 flex flex-col items-center justify-center"
    >
      <div
        class="fadein max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="flex flex-col align-center">
          <a href="#">
            <h5
              class="mb-2 ml-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              {{ !players.length ? "No Participants" : currentBracket?.name }}
            </h5>
          </a>

          <div v-if="players.length > 2" class="flex flex-col items-center">
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              You have {{ players.length }} players in this bracket. Click below
              to generate the bracket with these players.
            </p>

            <button
              @click="generateBracket"
              class="inline-flex self-center align-self-center bg-blue-500 px-3 py-2 text-lg font-medium text-center text-white rounded-lg hover:bg-teal-800 focus:ring-4 hover:scale-105 duration-100 focus:outline-none focus:ring-blue-300 dark:hover:bg-teal-700 dark:focus:ring-blue-800"
            >
              Generate Bracket
              <PlayCircleIcon class="h-6 w-6 inline ml-1 animate-pulse" />
            </button>
          </div>

          <div v-else>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              <span v-if="players.length === 0">
                You have no
                <span class="lowercase">{{ $teamPlayer }}'s</span> in this
                bracket. Add players to generate a bracket.
              </span>
              <span v-else-if="players.length == 1">
                You have only one player in this bracket. You can't even play a
                game, let-alone generate a tournament bracket.
              </span>
              <span v-else>
                You have only two {{ $teamPlayer }}'s in this bracket. I don't
                think you need a tournament bracket for that. Just play a game
                and see who wins.
              </span>
              <br /><br />
              <span
                >Please
                <router-link
                  class="text-teal-500 underline font-bold"
                  :to="'/players'"
                  >add more {{ $teamPlayer }}'s</router-link
                ></span
              >
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="players.length >= 3"
        class="text-white py-5 text-center max-w-96 flex flex-wrap justify-center gap-4"
      >
        <span
          v-for="(p, index) in players"
          :key="p._id"
          @click="
            $bottomAlert(
              `This ${$teamPlayer} will be included in the bracket. `
            )
          "
          :style="{ '--delay': index * 0.1 + 's' }"
          class="badge badge-primary opacity-0 fade-in"
        >
          {{ p.name }}
        </span>
      </div>

      <div class="py-5 fixed bottom-10" v-if="!showingDummy">
        <button
          class="p-2 bg-teal-900 text-white rounded-md"
          @click="viewDummyData"
        >
          Load Sample Data <users-icon class="inline h-6 w-6" />
        </button>
      </div>
    </div>
    <div class="fixed bottom-0 right-0 m-8 z-50" v-if="showingDummy">
      <button class="btn btn-secondary" @click="showingDummy = !showingDummy">
        <TrashIcon class="h-6 w-6 inline" />
        Clear Dummy Data
      </button>
    </div>

    <PlayerCard
      :player="selectedPlayer"
      :game="selectedGame"
      @update="refresh"
    />
  </span>
</template>

<script>
import Bracket from "vue-tournament-bracket";
import { UsersIcon } from "@heroicons/vue/24/solid";
import { dummyRounds } from "@/constants/dummyData";
import { bracketMixin } from "@/mixins/bracketMixin";
import PlayerCard from "@/components/PlayerCard.vue";
import BracketBottomMenu from "@/components/BracketBottomMenu.vue";

export default {
  components: {
    Bracket,
    UsersIcon,
    PlayerCard,
    BracketBottomMenu,
  },
  mixins: [bracketMixin],
  data() {
    return {
      dummyRounds: dummyRounds,
      showingDummy: false,
      selectedPlayer: {},
      dev: false,
      selectedGame: {},
      compKey: 0,
      bracket: {
        rounds: {},
      },
      loading: false,
    };
  },
  created() {
    if (
      !this.players.length &&
      !this.rounds.length &&
      this.$store.getBracket._id
    ) {
      this.$store.fetchBracket(this.$store.getBracket._id);
    }
  },
  methods: {
    viewDummyData() {
      this.showingDummy = !this.showingDummy;
    },
    async generateBracket() {
      this.loading = true;
      try {
        const rec = await this.$api.post(
          `brackets/${this.currentBracket._id}/generate`,
          {}
        );
        this.bracket = rec.data.bracket;

        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log("error", error);
        this.$toast.error("Failed to generate bracket. Contact Support");
      }
    },
    selectPlayer(player) {
      //console.log("selected player", player);
      this.selectedPlayer = player;
      console.log("player", player._id);
      const game = this._findGameByPlayer(player._id);
      this.selectedGame = game;
    },
    refresh() {
      this.selectedPlayer = {};
      this.compKey++;
    },
  },
  computed: {
    players() {
      return this.$store.players;
    },
    currentBracket() {
      return this.$store.getBracket;
    },
    rounds() {
      if (this.showingDummy) {
        return this.dummyRounds;
      }
      if (this.$store?.rounds?.length) {
        return this.$store.rounds;
      }

      return this.bracket?.rounds || {};
    },
    formattedJSON() {
      if (!this.bracket?.rounds) return {};
      return JSON.stringify(this.rounds, null, 2);
    },
  },
};
</script>

<style lang="scss">
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  animation-delay: var(--delay, 0s);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    //transform: translateY(10px);
  }
  to {
    opacity: 1;
    //transform: translateY(0);
  }
}

.bracket-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.vtb-wrapper {
  background: inherit;
  padding: 0px;
}

.player-box {
  padding: 10px;
  font-weight: bolder;
  text-transform: uppercase;
}

.vtb-item {
  display: flex;
  flex-direction: row-reverse;
  margin: 0;
  padding: 0;
  margin: 0;
  background: inherit;
}

p {
  margin: 0;
  border-radius: 10%;
  padding: 20px;
}

.vtb-item-parent {
  position: relative;
  margin-left: 50px;
  display: flex;
  align-items: center;
}

.vtb-item-players {
  flex-direction: column;
  margin: 6px;
  color: white;
  padding: 4px;
  background-color: transparent !important;
}

.vtb-item-players {
  padding: 2px;
}

.vtb-player {
  padding: 20px;
  width: 200px;
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: rgb(44, 60, 91);
}

.vtb-player:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.5);
}

.vtb-item-players .winner {
  background-color: rgb(85, 95, 54);
}

.winner {
  background-color: rgb(90, 116, 75) !important;
}

.vtb-item-players .defeated {
  background-color: rgb(99, 59, 59) !important;
}

.vtb-item-players .winner.highlight {
  background-color: darkseagreen;
}

.vtb-item-players .defeated.highlight {
  background-color: rgb(119, 71, 71);
}

.vtb-item-players {
  background-color: rgb(160, 103, 4);
}

.vtb-item-parent:after {
  position: absolute;
  content: "";
  width: 25px;
  height: 2px;
  left: 0;
  top: 50%;

  transform: translateX(-100%);
}

.vtb-item-children {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.vtb-item-child {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
}

.vtb-item-child:before {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateX(100%);
  width: 25px;
  height: 2px;
}

.vtb-item-child:after {
  content: "";
  position: absolute;
  right: -25px;
  height: calc(50% + 22px);
  width: 2px;
  top: 50%;
}

.vtb-item-child:last-child:after {
  transform: translateY(-100%);
}

.vtb-item-child:only-child:after {
  display: none;
}

.un-played {
  background-color: rgb(113, 113, 113) !important;
  height: 60px;
  border-radius: 10px;
  background-color: #e5e5f7;
  opacity: 0.8;
  background-size: 10px 10px;
  background-image: repeating-linear-gradient(
    45deg,
    #36488e 0,
    #2f51ab 1px,
    #32324b 0,
    #4f598d 50%
  );
}

/* smaller screens @ media */

@media only screen and (max-width: 800px) {
  .bracket-container {
    position: fixed;
    width: 100vw;
    height: 100dvh;
    top: 10px;
    left: 0;
    padding-top: 90px;
    padding-left: 20px;
    padding-right: 0px;
    padding-bottom: 0px;
    overflow: scroll;
    justify-content: start;
  }

  .bracket {
    padding-bottom: 100px;
    padding-top: 100px;
    min-height: 100vh;
    z-index: 0;
  }

  .vtp-wrapper {
    padding-bottom: 0px;
  }

  .vtb-item-players:last-of-type {
    padding-right: 10px;
  }
}
</style>
