<template>
  <div class="min-h-screen shine-effect">
    <div v-if="showQr" class="mid mx-auto">
      <div>
        <QRCode :link="link" :viewOnly="true" />
        <div class="mt-3 mx-auto flex flex-row justify-center">
          <button
            @click="showQr = false"
            class="btn btn-primary hover:bg-slate-600"
            title="Back to Bracket"
          >
            <ArrowLongLeftIcon class="h-4 w-4 inline" />
            Back to Bracket
          </button>
        </div>
      </div>
    </div>

    <div class="fullscreen-wrapper" v-else>
      <Loader v-if="loading" />

      <div v-if="tournament" class="mx-auto w-full p-5 top-banner">
        <div class="header">{{ tournament?.name }}</div>
      </div>
      <BracketComponent
        :class="fullscreen ? 'ml-16' : 'ml-0'"
        :rounds="bracket?.rounds"
      />

      <div
        class="trans-footer flex flex-row justify-end fadein"
        v-if="!fullscreen"
      >
        <div
          class="text-slate-500 font-bold text-sm uppercase mr-3 mt-4"
          @click="showQr = !showQr"
        >
          <span class="hidden md:block">{{ link }}</span>
          <QrCodeIcon class="sm:block md:hidden h-4 w-4 inline" />
        </div>

        <button
          @click="toggle"
          class="btn hover:bg-slate-600 hidden md:block"
          title="Toggle Fullscreen"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "@/components/Loader2.vue";
import BracketComponent from "@/components/BracketComponent.vue";
import { api as fullscreen } from "vue-fullscreen";
import QRCode from "@/components/ui/QRCode.vue";

export default {
  name: "BracketViewOnly",
  data() {
    return {
      fullscreen: false,
      teleport: true,
      loading: true,
      showQr: false,
      tournament: {},
      bracket: {},
    };
  },
  computed: {
    code() {
      return this.$route.params.code;
    },
    link() {
      return this.$baseUrl + "/view/" + this.code;
    },
  },
  async mounted() {
    const code = this.code;
    await this.fetchTournament(code);
  },
  methods: {
    async fetchTournament(code = null) {
      if (!code) {
        this.$toast.error("No code provided");
        this.loading = false;
        return;
      }
      //for now (mvp) we are pretending there is only one tournament per player
      const tourn = await this.$api.get("tournaments/code/" + code);
      this.tournament = tourn.data?.tournament;
      this.bracket = tourn.data?.bracket;
      this.loading = false;
    },
    async toggle() {
      await fullscreen.toggle(this.$el.querySelector(".fullscreen-wrapper"), {
        teleport: this.teleport,
        callback: (isFullscreen) => {
          this.fullscreen = isFullscreen;
        },
      });
      this.fullscreen = fullscreen.isFullscreen;
    },
  },
  components: {
    Loader,
    BracketComponent,
    QRCode,
  },
};
</script>

<style scoped>
.top-banner {
  position: absolute;
  width: 100%;
  top: 0;
  padding: 4rem;
  z-index: 999;
  text-align: center;
}

.trans-footer {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 1rem;
  z-index: 999;
}
</style>
