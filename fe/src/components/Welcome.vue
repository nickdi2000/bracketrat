<template>
  <div class="flex justify-center mt-5 fixed-welcome" v-if="show">
    <div
      class="fadeIn p-3 backdrop-blur-lg bg-blue-800/30 rounded-3xl max-w-screen-md shadow-lg mx-4"
    >
      <div class="p-4">
        <div>
          <BracketSvg class="h-20 w-20 text-white m-auto" />
        </div>
        <div class="text-2xl text-white font-bold py-3">
          Welcome to {{ $appName }}!
        </div>
        <div class="text-left mx-2">
          To get started you can either build a fixed size bracket (4, 8, 16,
          etc..), or add {{ $teamPlayer }}'s and watch the bracket grow
          dynamically. You may also chose to share the player-link (or QR code)
          with users so they can add themselves. Good luck!
        </div>
        <div class="mt-4">
          <button
            class="btn btn-primary my-2"
            @click="this.$router.push({ name: 'Bracket' })"
          >
            Get Started!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BracketSvg from "@/components/graphics/BracketSvg.vue";

export default {
  name: "Welcome",
  data() {
    return {};
  },
  props: {
    bracket: Object,
  },
  mounted() {},

  components: {
    BracketSvg,
  },
  computed: {
    show() {
      return this.$route.query.welcome == "true";
    },
  },
  methods: {},
};
</script>

<style scoped>
.fixed-welcome {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  width: 100%;
  text-align: center;
  position: fixed;
  animation: fadeInUpSlow 1s;
}
</style>
