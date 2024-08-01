<template>
  <div class="mx-2 text-white">
    <h1
      v-on:dblclick="dev = !dev"
      class="text-center my-4 text-2xl font-bold uppercase text-gray-400"
    >
      {{ bracket.name }}
    </h1>
    <div v-if="bracket?.rounds">
      <div
        v-for="(round, rIndex) in bracket.rounds"
        :key="rIndex"
        class="rounded-lg p-4 shadow-2xl bg-gray-800 mb-4"
      >
        <h2 class="text-2xl font-bold pt-3 mt-1">Round {{ rIndex + 1 }}</h2>

        <div
          class="mt-3 bg-slate-800 p-3 shadow-2xl rounded-md"
          v-for="(game, gIndex) in round.games"
        >
          <div class="col-12 uppercase text-md text-gray-200 py-2">
            Game {{ gIndex + 1 }}
          </div>

          <table class="w-100 ml-3">
            <tr class="text-sm font-normal text-gray-400">
              <th class="text-left min-w-36 pr-8 mr-3">Players</th>
              <th>Score</th>
            </tr>
            <tr v-for="(player, pIndex) in [game.player1, game.player2]">
              <td>
                <!-- <span class="uppercase text-gray-400 text-sm mr-3"
                  >Player {{ pIndex + 1 }}:
                </span> -->
                <span v-if="player?.name" class="text-lg font-bold uppercase">{{
                  player?.name
                }}</span>
                <span class="text-gray-400" v-else><i>N/A</i></span>
              </td>
              <td>
                {{ player?.score }}
              </td>
            </tr>
          </table>
          <pre class="text-sm" v-if="dev">{{ game }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bracketMixin } from "@/mixins/bracketMixin";

export default {
  data() {
    return {
      dev: false,
    };
  },
  mixins: [bracketMixin],
  props: {
    bracket: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {},
};
</script>
