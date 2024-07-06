<template>
  <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
    <span v-if="players?.length === 0">
      You have no
      <span class="lowercase">{{ $teamPlayer }}'s</span> in this bracket. Add
      players to generate a bracket.
    </span>
    <span v-else-if="players.length == 1">
      You have only one {{ $teamPlayer }} in this bracket. You can't even play a
      game, let-alone generate a tournament bracket.
    </span>
    <span v-else>
      You have only two {{ $teamPlayer }}'s in this bracket. I don't think you
      need a tournament bracket for that. Just play a game and see who wins.
    </span>
    <br /><br />
    <span
      >Please
      <router-link
        class="text-teal-500 underline font-bold"
        :to="'/admin/players'"
        >add more {{ $teamPlayer }}'s</router-link
      ></span
    >
  </p>
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
