<template>
  <div class="pt-0 text-white min-h-screen- max-w-4xl">
    <div class="">
      <BracketForm
        @save="save"
        :selectedBracket="selectedBracket"
        v-if="selectedBracket"
      />
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
    async save(e) {
      console.log("saving data", "brackets");
      let data = JSON.parse(JSON.stringify(e));
      delete data.players;
      delete data.rounds;

      try {
        const rec = await this.$api.post("brackets", data);
        this.$store.fetchBracket(e._id);
        this.$toast.success("Bracket saved successfully");
      } catch (e) {
        console.log("error saving bracket", e);
      }
    },
  },
  data() {
    return {
      activeTab: "info",
      form: {
        options: {
          require_auth: false,
        },
      },
      options: [
        {
          label: "Force users to register via Email",
          key: "require_auth",
          value: false,
        },
        {
          label: "Require a password to join",
          key: "require_password",
          value: false,
        },
        {
          label:
            "Automatically throw user into Tournament bracket upon registration",
          key: "auto_bracket",
          value: true,
        },
      ],
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
