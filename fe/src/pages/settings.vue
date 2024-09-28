<template>
  <div
    class="pt-0 text-white min-h-screen- m-auto flex flex-row justify-center"
  >
    <div style="width: 800px;">
      <div class="header mb-4">Tournament Settings</div>
      <!-- BRacketFOrm is more like a Tournament Form with "brackets" inside it -->
      <BracketForm :selectedBracket="selectedBracket" v-if="selectedBracket" />
      <div v-else>
        <Alert type="warning"
          >No bracket selected. Please
          <router-link :to="'/brackets'" class="underline font-bold"
            >Select a Bracket</router-link
          >
          first
        </Alert>
      </div>
    </div>
  </div>
</template>

<script>
import BracketForm from "@/components/forms/BracketForm.vue";

export default {
  components: {
    BracketForm,
  },
  computed: {
    selectedBracket() {
      return this.$store.getBracket ?? null;
    },
  },
  methods: {

  },
  data() {
    return {
      form: {
        options: {
          require_auth: false,
        },
      },
    };
  },
};
</script>

<style>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(10px);
  z-index: 100;
}
</style>
