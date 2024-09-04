<template>
  <div v-if="players.length > 2" class="flex flex-col items-center">
    <p
      class="mb-3 font-normal text-gray-700 dark:text-gray-400 max-w-xl"
      v-if="!showOptions"
    >
      You have {{ players.length }} players in this bracket. Click below to
      generate the bracket with these {{ $teamPlayer }}s. The size of the
      bracket will be determined by the number of players you have, inserting
      byes where necessary.
    </p>

    <button
      @click="generateBracket"
      v-if="!showOptions"
      class="inline-flex self-center align-self-center bg-blue-500 px-3 py-2 text-lg font-medium text-center text-white rounded-lg hover:bg-teal-800 focus:ring-4 hover:scale-105 duration-100 focus:outline-none focus:ring-blue-300 dark:hover:bg-teal-700 dark:focus:ring-blue-800"
    >
      Generate Bracket
      <PlayCircleIcon class="h-6 w-6 inline ml-1 animate-pulse" />
    </button>
    <div class="mt-3" v-if="!showOptions">
      <button
        @click="showOptions = true"
        class="group subheader hover:text-blue-400 ml-2"
      >
        {{ options.find((opt) => opt.value === selection).info }}
        <span
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          ><PencilSquareIcon class="w-4 h-4 inline" />
        </span>
      </button>
    </div>

    <div v-else class="mt-4 fadein">
      <p class="subheader">How should we seed the bracket?</p>
      <button
        @click="selection = opt.value"
        :key="opt.value + '-option'"
        :class="
          selection === opt.value ? 'bg-blue-500 text-white' : 'bg-gray-600'
        "
        class="btn btn-block mb-2"
        v-for="opt in options"
      >
        {{ opt.name }}
      </button>
      <div class="mt-0 mx-auto" style="max-width: 300px">
        <Alert type="info" style="min-height: 90px">
          {{ options.find((opt) => opt.value === selection).tip }}
        </Alert>

        <div>
          <button class="btn btn-success mr-2" @click="showOptions = false">
            OKAY
          </button>

          <button class="btn btn-secondary" @click="showOptions = false">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- if several players but no bracket built yet (no rounds) -->
  <div v-else-if="players.length <= 2 && !rounds?.length">
    <BracketWarnings :players="players" :bracket="bracket" />
  </div>
</template>

<script>
import BracketWarnings from "./BracketWarnings.vue";

export default {
  components: {
    BracketWarnings,
  },
  props: {
    players: {
      type: Array,
      required: true,
    },
    bracket: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showOptions: false,
      selection: "random",
      options: [
        {
          name: "Random",
          value: "random",
          tip: "Opponents are randomly assigned to eachother",
          info: "Seeding randomly",
        },
        {
          name: "Strength",
          value: "strength",
          tip: "Standard 'seeding' technique where the strongest players are matched against the weakest players in the first round to avoid early eliminations of strong players.  Strength can be determined by the players game history, or manually by re-arranging the players in order of strength",
          info: "Seeding based on strength",
        },
        // {
        //   name: "Manual",
        //   value: "manual",
        //   tip: "You can manually assign opponents to eachother",
        //   info: "Opponents will be manually assigned to eachother",
        // },
      ],
    };
  },
  computed: {
    rounds() {
      return this.bracket?.rounds;
    },
  },
  methods: {
    generateBracket() {
      this.$emit("generateBracket");
    },
  },
};
</script>
