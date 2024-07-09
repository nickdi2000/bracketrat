<template>
  <div class="bracket-list-div">
    <div
      v-for="(round, index) in rounds"
      :key="index + '-round-list-item'"
      class="p-6 w-full mb-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <h4>ROUND {{ index + 1 }}</h4>
      <div>
        <div v-for="game in round.games" :key="game.id">
          <div class="flex justify-between">
            <div
              class="badge-lg m-4"
              v-if="game.player1.name && game.player2.name"
            >
              <span
                :class="
                  !game.player1?.winner === true ? 'not-winner' : 'winner'
                "
              >
                {{ game.player1.name }}</span
              >
              vs.
              <span :class="!game.player2?.winner ? 'not-winner' : 'winner'">{{
                game.player2.name
              }}</span>
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

<style scoped>
.bracket-list-div {
  margin-top: 100px;
  max-width: 90vw;
  padding-bottom: 100px;
}

.winner {
  color: rgb(76, 182, 76);
  font-weight: bolder;
  font-size: 1.7rem;
}
</style>
