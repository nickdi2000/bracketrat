<template>
  <span>
    <div class="subheader">Stragglers:</div>
    <span
      :style="{ '--delay': index * 0.1 + 's' }"
      class="badge mr-2 fade-in opacity-0"
      v-for="(player, index) in players"
      :key="player.id"
      @click="
        $bottomAlert(
          `These ${$teamPlayer}'s are in your master list but are not currently in the bracket.  You may re-generate the bracket to include them. `
        )
      "
    >
      {{ player.name }}
    </span>
  </span>
</template>

<script>
export default {
  props: {
    players: {
      type: Array,
      required: true,
    },
  },
};
</script>
