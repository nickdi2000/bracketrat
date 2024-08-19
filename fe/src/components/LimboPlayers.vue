<template>
  <div class="p-4 flex flex-col m-auto text-center" style="z-index: 99999">
    <div class="subheader mb-2" v-if="players.length">
      Stragglers
      <button
        class="hover:bg-gray-800 p-1 rounded-full"
        @click="
          $bottomAlert(
            `These ${$teamPlayer}'s are in your master list but are not currently in the bracket.  You may add them in individually, or re-generate the bracket to include them. `
          )
        "
      >
        <QuestionMarkCircleIcon class="w-4 h-4 inline" />
      </button>
    </div>
    <div>
      <span
        :style="{ '--delay': index * 0.1 + 's' }"
        class="mb-2 badge badge-warning mr-2 fade-in cursor-pointer hover:bg-gray-800"
        v-for="(player, index) in players"
        :key="player.id"
        @click="add(player)"
      >
        {{ player.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {},
  methods: {
    async add(player) {
      console.log("adding player to bracket", player);
      //bottom alert
      this.$bottomAlert(
        `${player.name} is not currently in the tournament.  You can't add them directly because the bracket is already locked and ready to go.  To include this and other players, you must re-generate the bracket.`
      );
      //await this.$store.addPlayerToBracket(player);
      //this.$emit("update");
    },
  },
  computed: {
    players() {
      return this.$store.limboPlayers;
    },
  },
};
</script>
