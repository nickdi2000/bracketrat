<template>
  <div class="mid text-white">
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

    <div class="card mx-4">
      <div class="py-4">Welcome Home player</div>
      <div>{{ player }}</div>
    </div>
  </div>
</template>

<script>
import { playerAuthStore } from "@/store/playerAuth";
import { UserIcon } from "@heroicons/vue/24/solid";
//const store = playerAuthStore();

export default {
  name: "PublicHome",
  data() {
    return {
      bracket: {},
    };
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
      this.$router.push("/landing");
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
</style>
