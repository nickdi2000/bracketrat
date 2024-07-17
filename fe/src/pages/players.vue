<template>
  <div class="text-white min-h-screen- pb-4">
    <div>
      <button
        type="button"
        v-if="!showShareLink"
        @click="$refs.playerForm.showModal()"
        class="no-print text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2"
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
    <PlayerForm
      v-if="$store.getBracket"
      @update="handleUpdated"
      @invite="toggleShareLink"
      ref="playerForm"
    />

    <div class="mt-5 no-print text-center" v-if="!$store.players.length">
      <Alert type="info" class="fadeinUp"
        >No {{ $store.teamPlayer }}'s exist yet. Invite them with your unique
        bracket link/QR code... or add them manually.</Alert
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
  </div>
</template>

<script>
import UnitsTable from "@/components/UnitsTable.vue";
import PlayerForm from "@/components/forms/PlayerForm.vue";
import QRCode from "@/components/ui/QRCode.vue";
import {
  PlusCircleIcon,
  LinkIcon,
  ArrowLongLeftIcon,
  QrCodeIcon,
} from "@heroicons/vue/24/solid";
import { handler } from "flowbite/plugin";
import socketMixn from "@/mixins/socketMixin";

export default {
  components: {
    PlayerForm,
    UnitsTable,
    QRCode,
    PlusCircleIcon,
    LinkIcon,
    ArrowLongLeftIcon,
  },
  // mixins: [socketMixn],
  data() {
    return {
      records: [],
      playerKey: 0,
      showShareLink: false,
    };
  },
  computed: {
    players() {
      return this.$store.players;
    },
  },
  mounted() {
    // this.getRecords();
    const bracket_id = this.$store.getBracket?._id;
    this.$store.fetchBracket(bracket_id);
  },
  methods: {
    async getRecords() {
      const bracket_id = this.$store.getBracket._id;
      const rec = await this.$api.get(`players/${bracket_id}`);
      this.records = rec.data.players;
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

<style></style>
