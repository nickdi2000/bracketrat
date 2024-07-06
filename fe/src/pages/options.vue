<template>
  <div class="pt-0 text-white min-h-screen- max-w-4xl">
    <Tabs v-model="activeTab" class="p-5">
      <Tab name="info" title="Setup">
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
        </div>
      </Tab>
      <Tab name="options" title="Advanced">
        <h4 class="font-bold text-lg mb-2">Bracket Options</h4>

        <table class="w-full">
          <tr v-for="(opt, optIndex) in options" class="p-3">
            <td class="p-3 bg-gray-800">
              <Toggle v-model="opt.value" :label="opt.label" />
            </td>
          </tr>
        </table>

        <div class="py-2">
          <button class="btn btn-success">Save</button>
        </div>
      </Tab>
    </Tabs>
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
      options: [
        {
          label: "Force users to register via Email",
          key: "auth",
          value: false,
        },
        {
          label: "Require a password to join",
          key: "password",
          value: false,
        },
        {
          label:
            "Automatically throw user into Tournament bracket upon registration",
          key: "auto",
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
