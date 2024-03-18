<template>
  <TournamentBracket :rounds="rounds" @onMatchClick="onMatchClick" />
</template>

<script>
//import { Component, Vue } from "vue-property-decorator";
import TournamentBracket from "./TournamentBracket.vue";

export default {
  components: {
    TournamentBracket,
  },
  props: {
    rounds: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onMatchClick(match) {
      console.log("match", match);
    },
  },
};
</script>
