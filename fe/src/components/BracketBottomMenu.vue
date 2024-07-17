<template>
  <span>
    <div v-if="!show" class="botton-nav-btn p-3 mb-2">
      <button
        class="btn btn-warning mr-2 fadeIn"
        v-if="!bracket.isReady"
        @click="reset()"
      >
        <BoltIcon class="h-6 w-6 inline-block" />
        Rebuild Bracket
      </button>

      <button @click="newPlayer()" class="btn btn-secondary mr-2">
        <PlusCircleIcon class="h-6 w-6 inline-block" />
      </button>
      <button class="btn btn-primary" @click="showNav">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 inline-block"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
          />
        </svg>
      </button>
    </div>
    <div>
      <!-- Overlay -->
      <div
        v-if="show"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="show = false"
      ></div>

      <!-- Drawer -->
      <div class="fixed inset-x-0 bottom-0 flex justify-center z-50">
        <div
          v-show="show"
          class="fadeInUp bg-slate-800 shadow-lg rounded-t-lg w-full max-w-lg p-4 md:max-w-sm md:w-1/2"
        >
          <div class="floating-action-button">
            <button
              @click="showHelp = !showHelp"
              class="p-2 bg-slate-900 text-gray-500 rounded-full hover:bg-slate-800"
            >
              <QuestionMarkCircleIcon class="w-4 h-4" />
            </button>
          </div>
          <div class="flex flex-col space-y-4">
            <button
              v-for="(button, index) in buttons"
              :key="index"
              class="wide-button trans"
              @click="execute(button.action)"
            >
              <div class="flex flex-row">
                <component
                  v-if="button.icon"
                  :is="button.icon"
                  class="w-6 h-6 mr-3 mt-1"
                />
                <div>{{ button.text }}</div>
              </div>
              <div
                class="text-left text-gray-400 text-xs fadein"
                v-if="showHelp"
              >
                {{ button.desc }}
              </div>
            </button>
          </div>
          <button
            @click="show = false"
            class="p-4 text-2xl font-bold uppercase text-gray-500 bg-slate-900 w-full rounded-md mt-8"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  props: {
    bracket: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: false,
      showHelp: false,
    };
  },
  emits: ["generate"],
  computed: {
    buttons() {
      return [
        {
          icon: "BoltIcon",
          text: "Generate Bracket",
          action: "generate",
          desc: "Generate a new bracket with all players, including new players (stragglers added since the last generation.)",
        },
        {
          text: "Rebuild",
          action: "reset",
          icon: "ArrowPathIcon",
          desc: "Reset current bracket with the same players",
        },
        {
          icon: "TrashIcon",
          text: "Clear",
          action: "clearBracket",
          desc: `Destroy bracket and clear out all ${this.$teamPlayer}'s.`,
        },
        {
          text: this.bracket?.locked ? "Lock" : "Unlock",
          action: "lock",
          icon: !this.bracket?.locked ? "LockClosedIcon" : "LockOpenIcon",
          desc: !this.bracket?.locked
            ? `Unlock the bracket to allow ${this.$teamPlayer}'s to enter the bracket`
            : `Lock the bracket to prevent more ${this.$teamPlayer}'s from being added.`,
        },
        {
          icon: "eye",
          text: "Toggle View",
          action: "toggleView",
          icon: "TableCellsIcon",
          desc: "Toggle between bracket view and table view.",
        },
      ];
    },
  },
  methods: {
    async generate() {
      const ask = await this.$openDialog(
        "Build Bracket?",
        `This will build a fresh new bracket with any new ${this.$teamPlayer}s added since the last generation.`
      );
      this.$emit("generate");
    },
    async execute(action) {
      this.show = false;
      await this[action]();
    },
    toggleView() {
      this.$emit("toggleView");
    },
    toggle() {
      this.show = !this.show;
    },
    async reset() {
      const ask = await this.$openDialog(
        "Reset Bracket?",
        `This will overwrite the existing bracket and rebuild it with the only the ${this.$teamPlayer}s already in the bracket. Any existing info on matche results will be lost.`
      );
      this.$store.resetBracket(this.bracket._id);
    },
    showNav() {
      this.show = true;
    },
    lock() {
      const shouldLock = !this.bracket.locked;
      this.$store.patchBracket({ locked: shouldLock });
      let msg = shouldLock ? "Bracket Unlocked" : "Bracket Locked";
      this.$toast.success(msg);
    },
    newPlayer() {
      this.$emit("new-player");
    },
    async clearBracket() {
      let message = "Clear Bracket?";
      let details = `This will clear all ${this.$teamPlayer}'s from the bracket. This will not delete the  ${this.$teamPlayer}'s themselves, just reset the bracket structure.`;

      const ask = await this.$openDialog(message, details);

      if (!ask) {
        return;
      }

      try {
        const bracketId = this.$store.getBracket?._id;
        const rec = await this.$store.clearBracket(bracketId);
      } catch (error) {
        console.log("error", error);
        this.$toast.error("Failed to clear bracket. Contact Support");
      }
    },
  },
};
</script>

<style>
.botton-nav-btn {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 999;
  margin-bottom: 24px;
}

.fadeInUp {
  animation: fadeInUp 0.3s ease-in-out;
}

@keyframes fadeInUp {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 940px) {
  .botton-bar {
    height: 290px;
    margin-bottom: 150px;
  }
}

.floating-action-button {
  margin-bottom: 14px;
}

@media (max-width: 640px) {
  .floating-action-button {
    position: absolute;
    top: -20px;
    right: 0;
    z-index: 999;
  }
}

.wide-button {
  @apply w-full bg-slate-700 text-gray-300 py-4 px-8 rounded-md text-2xl font-bold hover:bg-slate-600;
}
</style>
