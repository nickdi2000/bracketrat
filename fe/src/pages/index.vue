<template>
  <span class="dark:text-white">
    <Loader v-if="loading" />
    <div v-if="playersNotInBracket?.length">
      <PlayerBadges :players="playersNotInBracket" v-if="!showingDummy" />
    </div>
    <div class="bracket-container fadein" v-if="rounds.length">
      <bracket
        :rounds="rounds"
        class="bracket z-40-"
        :key="'bracket-' + compKey"
        v-if="view == 'bracket'"
      >
        <template #player="{ player }">
          <div
            @click="selectPlayer(player)"
            class="player-box text-lg"
            :class="!player?.name ? 'un-played' : 'swift-in-left'"
          >
            {{ player.name }}
            <div class="text-xs" v-if="false">F:{{ player.filled }}</div>
          </div>
        </template>
        <template #player-extension-bottom="{ match }">
          <div
            class="text-muted uppercase font-bold text-xs text-gray-500"
            v-if="dev"
          >
            {{ match?._id }}
          </div>
        </template>
      </bracket>
      <div v-else>
        <BracketList :rounds="rounds" />
      </div>

      <BracketBottomMenu
        :bracket="currentBracket"
        @generate="generateBracket"
        @toggleView="toggleView"
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

          <BracketGenerator
            :players="players"
            v-if="players.length > 2"
            @generateBracket="generateBracket"
          />
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

      <div class="m-8 fixed bottom-0 left-0" v-if="!showingDummy">
        <button
          class="p-2 bg-teal-900 text-white rounded-md hover:bg-teal-600"
          @click="viewDummyData"
        >
          Load Sample Data <users-icon class="inline h-6 w-6" />
        </button>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 m-8 z-50" v-if="showingDummy">
      <button class="btn btn-primary" @click="showingDummy = !showingDummy">
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
import BracketList from "@/components/BracketList.vue";
import PlayerBadges from "@/components/PlayerBadges.vue";
import BracketWarnings from "@/components/BracketWarnings.vue";
import BracketGenerator from "@/components/BracketGenerator.vue";

export default {
  components: {
    Bracket,
    UsersIcon,
    PlayerCard,
    BracketBottomMenu,
    BracketList,
    PlayerBadges,
    BracketWarnings,
    BracketGenerator,
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
      view: "bracket", // bracket, json
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
    toggleView() {
      this.view = this.view === "bracket" ? "list" : "bracket";
    },
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
        this.$store.setRounds(rec.data.bracket.rounds);

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
      const game = this._findGameByPlayer(player._id);
      this.selectedGame = game;
      console.log("game", player.gameId, "roundIndex", player.roundIndex);
    },
    refresh() {
      this.selectedPlayer = {};
      //this.compKey++;
    },
  },
  computed: {
    players() {
      return this.$store.players;
    },
    playersNotInBracket() {
      if (!this.rounds?.length) {
        return [];
      }
      const playersArray = JSON.parse(JSON.stringify(this.players));
      return playersArray.filter(
        (p) =>
          !this.rounds.some((r) =>
            r.games.some(
              (g) => g.player1.id === p._id || g.player2.id === p._id
            )
          )
      );
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
  font-size: 1.4rem;

  animation: fadeInLeft 0.5s ease-out forwards;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.swift-in-left {
  animation: swiftInLeft 0.5s ease-out forwards;
}

@keyframes swiftInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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

.vtb-player {
  padding: 20px;
  width: 200px;
  border: 0.5px solid #262626;
  box-shadow: 10px 5px 5px rgb(48, 50, 51);
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background-color 1.4s;
  background-color: rgb(44, 60, 91);
}

.vtb-player:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.5);
}

.vtb-item-players {
  padding: 2px;
  transition: filter 2s ease-in-out !important;
}

.vtb-item-players .winner {
  // filter: hue-rotate(342deg);
  background-color: rgb(46, 113, 78) !important;
}

.winner {
  // background-color: rgb(90, 116, 75) !important;
  // filter: hue-rotate(342deg) !important;
}

.vtb-item-players .defeated {
  background-color: rgb(99, 59, 59) !important;
  text-decoration: line-through;
}

.vtb-item-players .winner.highlight {
  background-color: rgb(58, 138, 54);
}

.vtb-item-players .defeated.highlight {
  background-color: rgb(119, 71, 71);
}

.vtb-item-players {
  //background-color: rgb(160, 103, 4);
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

.bracket-winner {
  background-color: rgb(9, 178, 91) !important;
  transform: scale(1.3);
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
