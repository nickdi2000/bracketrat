<template>
  <div class="text-white min-h-screen- pb-4">
    <div>
      <button
        type="button"
        v-if="!showShareLink"
        @click="$showAddPlayerModal()"
        class="no-print text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-blue-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2"
      >
        <PlusCircleIcon class="h-6 text-white mr-2" /> Add Manually
      </button>

      <button
        type="button"
        v-if="players.length"
        @click="toggleShareLink"
        :class="showShareLink ? 'bg-slate-700' : 'bg-gray-800'"
        class="no-print text-gray-800 hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2"
      >
        <QrCodeIcon class="h-6 text-white mr-1" v-if="!showShareLink" />
        <ArrowLongLeftIcon v-else="showShareLink" class="h-6 text-whit mr-1" />
        {{ showShareLink ? "Back to Player list" : $teamPlayer + " Link" }}
      </button>
    </div>

    <div
      class="mt-5 no-print text-center text-gray-300"
      v-if="!$store.players.length"
    >
      ⚠ No {{ $store.teamPlayer }}'s exist yet.
      <span class="hidden md:inline"
        ><br />Share this link/QR code with your players so they can add
        themselves
        <br />
        (and update their scores). Or click "Add Manually" to do it
        yourself!</span
      >
    </div>

    <div class="fadein py-4" v-if="!$store.players.length || showShareLink">
      <QRCode />
    </div>

    <UnitsTable
      v-if="$store.players.length && !showShareLink"
      :records="players"
      :key="playerKey"
      @updated="handleUpdated"
      class="pt-4"
    />

    <button
      type="button"
      v-if="!showShareLink && !$store.players.length"
      @click="$showAddPlayerModal()"
      class="fab-btn no-print"
    >
      <span class="hidden md:inline mx-2">Add {{ $teamPlayer }}</span>
      <PlusCircleIcon class="h-8 text-white inline" />
    </button>

    <div
      class="players-footer text-center flex flex-row justify-center mt-8 pt-8"
    >
      <router-link
        to="/admin/dashboard"
        class="text-sm text-gray-100 bg-gray-800 hover:bg-blue-800 rounded-md p-2"
      >
        <ArrowLongLeftIcon class="h-6 text-white inline-block mr-2" />
        Back to Bracket
      </router-link>
    </div>
  </div>
</template>

<script>
import UnitsTable from "@/components/UnitsTable.vue";
import QRCode from "@/components/ui/QRCode.vue";

import {
  PlusCircleIcon,
  LinkIcon,
  ArrowLongLeftIcon,
  QrCodeIcon,
} from "@heroicons/vue/24/solid";

export default {
  components: {
    UnitsTable,
    QRCode,
    PlusCircleIcon,
    LinkIcon,
    ArrowLongLeftIcon,
  },
  data() {
    return {
      playerKey: 0,
      showShareLink: false,
      linkType:  "player", //or spectator
    };
  },
  computed: {
    players() {
      return this.$store.players;
    },
  },

  mounted() {
    this.$store.fetchPlayers();
  },
  created() {
    const bracket = this.$store?.getBracket;
    if (!bracket || bracket === "undefined" || !bracket._id) {
      console.warn("No Bracket selected, redirecting to Organization");
      this.$router.push({ name: "Organization" });
    }
  },
  methods: {
    async getRecords() {
      await this.$store.fetchPlayers();
    },
    handleUpdated() {
      this.playerKey++;

      //close sharelink after adding
      this.$router.push({
        name: "Players",
        params: { page: "" },
      });
    },
    toggleShareLink() {
      this.$router.push({
        name: "Players",
        params: { page: this.showShareLink ? "" : "invite" },
      });
    },
  },
  watch: {
    "$route.params.page": {
      handler(v) {
        this.showShareLink = v === "invite";
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
.fab-btn {
  position: fixed;
  bottom: 60px;
  right: 20px;
  filter: drop-shadow(10px 10px 3px #171c2a);
  border: 1px solid #566789;
  /*glow effect*/
  box-shadow: 0 0 10px #7b8394;

  z-index: 1000;
  @apply bg-blue-800 p-4 md:p-2 rounded-full md:rounded-lg;
}
</style>
