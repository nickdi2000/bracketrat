<template>
  <div v-if="rounds && rounds.length">
    <bracket
      :rounds="rounds"
      class="bracket z-40-"
      :key="'player-bracket-' + compKey"
    >
      <template #player="{ player }">
        <div
          class="player-box text-lg"
          :class="[
            !player?.name ? 'un-played' : 'swift-in-left',
            player?.name === this.player?.name ? 'is-me' : '',
          ]"
        >
          {{ player.name }}
          <div class="text-xs" v-if="false">F:{{ player.name }}</div>
        </div>
      </template>
      <template #player-extension-bottom="{ match }">
        <div
          class="text-muted uppercase font-bold text-xs text-gray-500"
          v-if="dev"
        >
          {{ match?._id }}
        </div>
      </template>
    </bracket>
  </div>
  <div v-else>
    <div class="text-center text-gray-500 mx-auto p-5">No rounds</div>
  </div>
</template>

<script>
import Bracket from "vue-tournament-bracket";

export default {
  components: {
    Bracket,
  },
  props: {
    rounds: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      player: null,
      compKey: 1,
      dev: false,
    };
  },
  methods: {},
};
</script>
