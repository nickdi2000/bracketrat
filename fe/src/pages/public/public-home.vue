<template>
  <div class="mid text-white main-public">
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

    <div class="mx-4 scrollable">
      <div>
        <bracket
          :rounds="bracket.rounds"
          class="bracket z-40-"
          :key="'bracket-' + compKey"
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
      </div>
    </div>
  </div>
</template>

<script>
import { playerAuthStore } from "@/store/playerAuth";
import { UserIcon } from "@heroicons/vue/24/solid";
import Bracket from "vue-tournament-bracket";

//const store = playerAuthStore();

export default {
  name: "PublicHome",
  data() {
    return {
      bracket: {},
    };
  },
  components: {
    Bracket,
  },
  mounted() {
    console.log("PublicHome mounted");
    this.getBracket();
  },
  computed: {
    player() {
      return playerAuthStore().getplayer;
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
    async logout() {
      const store = playerAuthStore();
      await store.destroy();
      this.$router.push("/find");
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

.main-public {
  /* gradient dark */
  background: linear-gradient(
    180deg,
    rgba(21, 15, 63, 0.8) 0%,
    rgba(15, 22, 37, 0.8) 100%
  );
  height: 100vh;
}
</style>
