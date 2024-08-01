<template>
  <div class="mid- text-white main-public">
    <nav class="bg-gray-800 mainNav z-50" style="">
      <div class="flex flex-row justify-between">
        <div class="p-3 font-bold text-lg uppercase text-gray-400">
          <UserCircleIcon class="inline w-6 h-6" />
          {{ player.name }}
        </div>
        <div class="p-3">
          <button
            @click="logout"
            class="bg-gray-600 p-1 uppercase rounded-md font-bold text-sm text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <div v-if="view == 'game'" class="fadein middle flex flex-col">
      <div v-if="currentGame">
        <div
          class="mx-auto bg-gray-800 text-white rounded-lg drop-shadow-2xl overflow-hidden"
        >
          <div class="p-4">
            <h2 class="text-xl font-bold mb-2">
              Game Status:
              <span :class="statusClass">{{ currentGame.status }}</span>
            </h2>
            <div class="flex flex-col justify-between items-center mb-2">
              <div
                class="p-2 text-center w-full"
                :class="{
                  'bg-blue-600 font-bold':
                    currentGame.player1.name === currentPlayerName,
                  'bg-gray-700': currentGame.player1.name !== currentPlayerName,
                  'player-winner': currentGame.player1.winner,
                }"
              >
                <div class="px-2 rounded w-full">
                  <p class="player-name">{{ currentGame.player1.name }}</p>
                  <p class="text-sm text-gray-300 mt-0 p-1">
                    Score: {{ currentGame.player1.score }}
                  </p>
                </div>
              </div>
              <div class="text-center mx-2 text-gray-400 my-2">vs.</div>
              <div
                class="p-2 text-center w-full"
                :class="{
                  'bg-blue-600 font-bold':
                    currentGame.player2.name === currentPlayerName,
                  'bg-gray-700': currentGame.player2.name !== currentPlayerName,
                  'player-winner': currentGame.player2.winner,
                }"
              >
                <div class="px-2 rounded w-full">
                  <p class="player-name">{{ currentGame.player2.name }}</p>
                  <p class="text-sm text-gray-300 mt-0 p-1">
                    Score: {{ currentGame.player2.score }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex flex-row justify-center">
              <div v-if="!showResultButtons">
                <button
                  class="btn bg-blue-900 mt-4"
                  @click="showResultButtons = true"
                >
                  Set Results
                </button>
              </div>

              <div v-else>
                <div
                  class="flex flex-col justify-center p-3 shadow-lg fadeInUp rounded-md bg-gray-950"
                >
                  <button
                    class="btn bg-green-900 mt-4 btn-block w-full"
                    @click="iWon()"
                  >
                    I WON
                  </button>

                  <button
                    class="btn bg-orange-900 mt-4 btn-block w-full"
                    @click="theyWon()"
                  >
                    {{ otherPlayerName }} WON
                  </button>

                  <button
                    class="btn bg-gray-900 mt-4 opacity-8"
                    @click="showResultButtons = false"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center mt-4 fadein">
        <h2 class="text-teal-700">
          <BoltIcon class="w-7 h-7 mb-2 inline" />
        </h2>
        <h2 class="text-xl font-bold">Welcome!</h2>
        <p class="text-gray-300 text-sm">
          <i>No games found.</i><br />You are either not in the bracket or do
          not have any matches lined up yet.
        </p>
      </div>

      <div class="flex justify-between w-1/3 fadein" v-if="myGames.length > 1">
        <button
          @click="gameIndex--"
          class="btn bg-gray-900 mt-4"
          v-if="gameIndex > 0"
        >
          <ArrowLeftCircleIcon class="w-6 h-6 inline" />
        </button>
        <div v-else></div>

        <button
          v-if="gameIndex < myGames.length - 1"
          @click="gameIndex++"
          class="btn bg-gray-900 mt-4"
        >
          <ArrowRightCircleIcon class="w-6 h-6 inline" />
        </button>
        <div v-else></div>
      </div>
    </div>

    <div v-else class="mx-4 scrollable fadein">
      <div>
        <bracket
          :rounds="bracket.rounds"
          class="bracket z-40-"
          :key="'player-bracket-' + compKey"
        >
          <template #player="{ player }">
            <div
              @click="selectPlayer(player)"
              class="player-box text-lg"
              :class="[
                !player?.name ? 'un-played' : 'swift-in-left',
                player?.name === this.player?.name ? 'is-me' : '',
              ]"
            >
              {{ player.name }}
              <div class="text-xs" v-if="false">F:{{ player.name }}</div>
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
      </div>
    </div>

    <PlayerBottomNav />
  </div>
</template>

<script>
import { playerAuthStore } from "@/store/playerAuth";
import { ArrowLeftCircleIcon, UserIcon } from "@heroicons/vue/24/solid";
import Bracket from "vue-tournament-bracket";
import { nextTick } from "vue";
import { findCurrentGame, findAllMyGames } from "./playerComposite";
import PlayerBottomNav from "./playerBottomNav.vue";

//const store = playerAuthStore();

export default {
  name: "PublicHome",
  data() {
    return {
      bracket: {},
      dev: false,
      compKey: 0,
      //currentGame: null,
      myGames: [],
      gameIndex: 0,
      showResultButtons: false,
    };
  },
  components: {
    Bracket,
    PlayerBottomNav,
  },
  async mounted() {
    console.log("PublicHome mounted");
    if (!this.player) {
      this.$router.push("/find");
    }
    await this.getBracket();
    //this.currentGame = findCurrentGame(this.bracket, this.player.name);
    this.myGames = findAllMyGames(this.bracket, this.player.name);
    this.currentGame = this.myGames[this.gameIndex];
  },
  computed: {
    player() {
      return playerAuthStore().getplayer;
    },
    view() {
      return this.$route?.params?.view || "game";
    },
    otherPlayerName() {
      return this.currentGame.player1.name === this.player.name
        ? this.currentGame.player2.name
        : this.currentGame.player1.name;
    },
    currentGame() {
      return this.myGames[this.gameIndex];
    },
  },
  methods: {
    async getBracket() {
      const bracketId = this.player?.brackets[0];
      if (!bracketId) {
        console.error("no bracketid");
        return;
      }
      try {
        const res = await this.$api.get("brackets/" + bracketId);
        console.log("res", res.data);
        this.bracket = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    async markWinner(name) {
      const bracketId = this.bracket._id;
      if (!bracketId) {
        console.error("No bracket found");
        this.$toast.error("No bracket found. Please call for help.");
        return;
      }

      //find player based on name
      const player = this.bracket.players.find((p) => p.name === name);
      const roundIndex = this.currentGame.roundIndex;

      const params = {
        playerId: player._id,
        gameId: this.currentGame._id,
        bracketId: bracketId,
        roundIndex: roundIndex,
        winner: name,
      };

      try {
        const rec = await this.$api.post(
          `/brackets/${bracketId}/set-winner`,
          params
        );
        this.bracket = rec.data.bracket;
        this.currentGame = findCurrentGame(this.bracket, this.player.name);
      } catch (e) {
        console.error(e);
      }
    },
    async iWon() {
      await this.markWinner(this.player.name);
    },
    async theyWon() {
      await this.markWinner(this.otherPlayerName);
    },
    async logout() {
      const store = playerAuthStore();
      await store.destroy();
      await nextTick();
      //reload window
      window.location = "/";
      //this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.mainNav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.3s;
  min-height: 3rem;
}

.scrollable {
  margin-top: 8rem;
  overflow-y: auto;
  height: calc(100vh - 3rem);
}

.player-winner {
  border: 2px solid #26f4b6e9;
  box-shadow: 0 0 10px #26f4b6e9;
}

.main-public {
  /* gradient dark */
  background-color: #14161a;
  opacity: 1;
  background-image: linear-gradient(#1c2632 2px, transparent 2px),
    linear-gradient(90deg, #1c2632 2px, transparent 2px),
    linear-gradient(#1c2632 1px, transparent 1px),
    linear-gradient(90deg, #1c2632 1px, #14161a 1px);
  background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
  background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
  height: 100vh;
}

.player-name {
  @apply font-bold text-2xl uppercase my-0 py-0;
}

.player-box {
  padding: 3px;
  font-weight: bolder;
  text-transform: uppercase;
  font-size: 1rem;
  max-height: 2rem;
}

.vtb-item-players .is-me {
  color: #26f4b6e9;
}

.is-me:after {
  content: "👤";
  font-size: 1rem;
}

.vtb-player {
  padding: 3rem;
  width: 2rem;
  border: 0.5px solid #262626;
  box-shadow: 10px 5px 5px rgb(48, 50, 51);
  border-radius: 10px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background-color 1.4s;
  background-color: rgb(55, 71, 103);
}

.bracket {
  margin-left: 0 !important;
}
</style>
