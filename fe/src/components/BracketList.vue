<template>
  <div>
    <div
      v-for="(round, index) in rounds"
      :key="index + '-round-list-item'"
      class="p-6 min-w-96 mb-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <h4>ROUND {{ index + 1 }}</h4>
      <div>
        <div v-for="game in round.games" :key="game.id">
          <div class="flex justify-between">
            <div
              class="badge-lg m-4"
              v-if="game.player1.name && game.player2.name"
            >
              {{ game.player1.name }} vs. {{ game.player2.name }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="!gameCount(round)">
        <p class="text-blue-300 opacity-40">No wins from previous games yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rounds: {
      type: Array,
      required: true,
    },
  },
  methods: {
    gameCount(round) {
      //return round.games.length, where the players hav names:
      return round.games.filter(
        (game) => game.player1.name && game.player2.name
      ).length;
    },
  },

  data() {
    return {
      show: false,
    };
  },
};
</script>
