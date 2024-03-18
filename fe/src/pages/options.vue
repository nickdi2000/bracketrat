<template>
  <div class="pt-0 text-white min-h-screen- max-w-4xl">
    <Tabs v-model="activeTab" class="p-5">
      <Tab name="info" title="Info">
        <div class="">
          <BracketForm
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

          <!-- <Alert type="info" class="fadein"
            >The above information will be available to the players when they
            arrive on the registration screen.</Alert
          > -->
        </div>
      </Tab>
      <Tab name="options" title="Settings">
        <h4 class="font-bold text-lg mb-2">Bracket Options</h4>
        <Toggle
          v-model="form.options.auth"
          label="Force users to register via Email"
        />
      </Tab>
    </Tabs>

    <!-- <div class="footer fadeinUp">
      <FButton size="xl" class="font-bold" gradient="green">Save</FButton>
    </div> -->
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
  data() {
    return {
      activeTab: "info",
      form: {
        title: "",
        description: "",
        options: {
          auth: false,
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
