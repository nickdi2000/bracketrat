<template>
  <span>
    <div v-if="!show" class="botton-nav-btn p-3 mb-2">
      <span v-if="isBroken">
        <QuestionMarkCircleIcon
          class="w-4 h-4 inline mr-2 text-orange-200 opacity-50"
          @click="helpMustBuildBracket"
        />

        <button class="btn btn-warning mr-2 fadeIn" @click="reset()">
          <!-- <BoltIcon class="h-6 w-6 inline-block" /> -->

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-4 inline-block mr-1 mb-1"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
            />
          </svg>

          Fix Bracket
        </button>
      </span>

      <button @click="newPlayer()" class="btn btn-secondary mr-2">
        <PlusCircleIcon class="h-6 w-6 inline-block" />
        <span class="ml-2 hidden md:inline">Add {{ $teamPlayer }}</span>
      </button>
      <button class="btn btn-primary" @click="showNav">
        <span class="ml-2 hidden md:inline">Bracket Functions</span>
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

    <div
      class="bottom-warning w-full text-center p-fluid pb-3 backdrop-blur-xl opacity-4"
      v-if="isBroken"
    >
      <div
        class="text-orange-400 opacity-60 w-full text-center uppercase text-xs"
      >
        Bracket is incomplete. Add players or rebuild.
      </div>
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
              class="p-2 bg-slate-900 text-gray-500 rounded-full hover:bg-slate-800"
              @click="$router.push('/admin/settings')"
            >
              <Cog6ToothIcon class="w-4 h-4" />
            </button>
            <button
              @click="showHelp = !showHelp"
              class="ml-2 p-2 bg-slate-900 text-gray-500 rounded-full hover:bg-slate-800"
            >
              <QuestionMarkCircleIcon class="w-4 h-4" />
            </button>
          </div>
          <h3 class="text-gray-300 my-2 text-center m-auto uppercase font-bold">
            {{ titlize(bracket?.type) }}
          </h3>
          <div
            class="flex flex-col space-y-4"
            v-if="!displaySizeOptions && filteredButtons"
          >
            <button
              v-for="(button, index) in filteredButtons"
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
                class="ml-10 text-left text-gray-400 text-xs fadein"
                v-if="showHelp"
              >
                {{ button.desc }}
              </div>
            </button>
          </div>

          <div class="flex flex-col space-y-4" v-else-if="displaySizeOptions">
            <button
              class="wide-button fadeInUp"
              v-for="(size, index) in [4, 8, 16, 32]"
              :key="index"
              @click="generatedFixed(size)"
            >
              <span class="text-gray-400 text-4xl font-bold">{{ size }}</span>
            </button>

            <button
              class="btn btn-block mt-5 bg-slate-900 hover:bg-blue-900"
              @click="displaySizeOptions = false"
            >
              <ArrowLeftCircleIcon class="w-6 h-6 mr-3 mt-1 inline-block" />
              Back
            </button>
          </div>

          <button
            @click="show = false"
            class="p-4 text-2xl font-bold uppercase text-gray-500 bg-slate-900 hover:bg-blue-900 w-full rounded-md mt-8"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
import BracketIcon from "./icons/BracketIcon.vue";

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
      showHelp: true,
      displaySizeOptions: false,
    };
  },
  emits: ["generate"],
  components: {
    BracketIcon,
  },
  computed: {
    isBroken() {
      return false;
    },
    hasRounds() {
      return this.bracket?.rounds?.length;
    },
    filteredButtons() {
      return this.buttons.filter((button) => !button.hide);
    },
    buttons() {
      const obj = {
        "single-elimination": [
          {
            icon: "UserGroupIcon",
            text: "Generate Bracket",
            action: "generate",
            desc: `Generate a new dynamic-sized bracket with all ${this.$teamPlayer}s.`,
          },
          {
            text: "Rebuild",
            action: "reset",
            icon: "UsersIcon",
            desc: `Reset current bracket with the same set of ${this.$teamPlayer}s`,
            hide: !this.hasRounds,
          },
          {
            text: "Build Fixed Size",
            action: "showSizes",
            icon: "BracketIcon",
            desc: "Build an empty bracket with 4,8,16,etc... slots.",
            hide: this.hasRounds,
          },

          {
            icon: "TrashIcon",
            text: "Clear",
            action: "clearBracket",
            desc: `Destroy bracket and clear out all ${this.$teamPlayer}'s.`,
            // hide: !this.hasRounds,
          },
          {
            text: this.bracket?.locked ? "Lock" : "Unlock",
            action: "lock",
            icon: !this.bracket?.locked ? "LockClosedIcon" : "LockOpenIcon",
            desc: !this.bracket?.locked
              ? `Unlock the bracket to allow ${this.$teamPlayer}'s to enter the bracket`
              : `Lock the bracket to prevent more ${this.$teamPlayer}'s from being added.`,
            hide: true, // to add computed logic later
          },
          {
            icon: "eye",
            text: "Toggle View",
            action: "toggleView",
            icon: "TableCellsIcon",
            desc: "Toggle between bracket view and table view.",
            hide: true,
          },
        ],
        "round-robin": [
          {
            icon: "UserGroupIcon",
            text: "Generate Round",
            action: "generateRobin",
            desc: `Generate a new round-robin bracket with all ${this.$teamPlayer}s.`,
          },
          {
            icon: "TrashIcon",
            text: "Clear",
            action: "clearBracket",
            desc: `Destroy all rounds in the round-robin.`,
            // hide: !this.hasRounds,
          },
        ],
      };
      const type = this.bracket?.type || "single-elimination";
      return obj[type];
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
    async generateRobin() {
      const ask = await this.$openDialog(
        "Build Round-Robin Tournament?",
        `This will build a fresh new set of rounds with any new ${this.$teamPlayer}s added since the last generation. It will pit each ${this.$teamPlayer} against every other ${this.$teamPlayer} in a round-robin format.`
      );
      await this.$store.generateRobinBracket(this.bracket._id);
    },
    titlize(str) {
      //remove hyphens and capitalize
      return str.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    },
    async generatedFixed(size) {
      this.show = false;
      const ask = await this.$openDialog(
        `Build ${size}-player Bracket?`,
        `This will build a fresh new bracket with ${size} empty slots.`
      );
      const bracketId = this.bracket._id;
      if (!bracketId) {
        this.$toast.error("No bracket found. Please Refresh.");
        return;
      }
      this.$store.generateFixedBracket(bracketId, size);
    },
    async execute(action) {
      const dontClose = ["showSizes"];
      if (!dontClose.includes(action)) {
        this.show = false;
      }
      await this[action]();
    },
    helpMustBuildBracket() {
      this.$bottomAlert(
        `Bracket is incomplete, meaning you have empty slots (that are not byes).  You may auto-build the bracket by clicking 'Fix Bracket', or continue to add ${this.$teamPlayer}s manually.`
      );
    },
    toggleView() {
      this.$emit("toggleView");
    },
    toggle() {
      this.show = !this.show;
    },
    showSizes() {
      this.displaySizeOptions = true;
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
    showNavAndSizes() {
      this.show = true;
      this.displaySizeOptions = true;
    },
    lock() {
      const shouldLock = !this.bracket.locked;
      this.$store.patchBracket({ locked: shouldLock });
      let msg = shouldLock ? "Bracket Unlocked" : "Bracket Locked";
      this.$toast.success(msg);
    },
    newPlayer() {
      this.$showAddPlayerModal();
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
        const players = this.$store.players;
        const rec = await this.$store.clearBracket(bracketId, players);
        localStorage.removeItem("selected_bracket");
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

.bottom-warning {
  position: fixed;
  bottom: 0;
  left: 0;
  text-align: center;
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
