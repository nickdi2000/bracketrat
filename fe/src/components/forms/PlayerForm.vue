<template>
  <div>
    <div v-if="!selectedBracket.name" class="mt-4">
      <Alert type="warning"
        >No Bracket Selected. Please
        <router-link :to="'/brackets'" class="underline font-bold"
          >Create a Bracket</router-link
        >
        first</Alert
      >
    </div>

    <fwb-modal v-show="isShowModal" @close="closeModal">
      <template #header>
        <div class="flex items-center text-lg">
          Add a {{ $teamPlayer }} manually
        </div>
      </template>
      <template #body>
        <div class="tiny">
          Remember you may also invite players to join via your unique link or
          <router-link
            class="underline text-blue-300 font-bold"
            :to="'/admin/players/invite'"
            >QR code.</router-link
          >
        </div>
        <div class="mt-1 shadow-lg flex flex-col space-y-4">
          <!-- <Input
            label="Name"
            v-model="name"
            v-on:keydown.enter="save()"
            ref="inputField"
          /> -->
          <input
            type="text"
            ref="inputField"
            class="big-input text-2xl uppercase font-bold bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Player Name"
            v-model="form.name"
            v-on:keydown.enter="save()"
            required
          />

          <!-- <Input label="Email" /> -->
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <fwb-button @click="closeModal" color="alternative">
            Cancel
          </fwb-button>
          <fwb-button @click="save" color="green" :loading="loading">
            Save
          </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </div>
</template>

<script>
import { FwbButton, FwbModal } from "flowbite-vue";
import { PlusIcon } from "@heroicons/vue/24/solid";

export default {
  data() {
    return {
      isShowModal: false,
      loading: false,
      form: {
        name: "",
        bracket: null,
      },
    };
  },
  components: {
    FwbButton,
    FwbModal,
    PlusIcon,
  },
  computed: {
    // Create a computed property that depends on the Vuex getter
    selectedBracket() {
      return this.$store.getBracket;
    },
  },
  emits: ["update", "invite"],
  methods: {
    showModal() {
      this.isShowModal = true;
      setTimeout(() => {
        this.$refs.inputField.focus();
      }, 500);
    },
    closeModal() {
      this.isShowModal = false;
      this.form.name = "";
    },
    async save() {
      console.log("saving");
      this.loading = true;
      this.form.bracketId = this.selectedBracket._id;
      try {
        const rec = await this.$api.post("players", this.form);
        if (rec.data.bracket?.players) {
          this.$store.setPlayers(rec.data.bracket?.players);
        }
        this.loading = false;
        this.form.name = "";
        this.$toast.success("Player added successfully");
        this.closeModal();
        this.$emit("update");
      } catch (error) {
        this.loading = false;
        console.log("save() error", error.response.data?.data?.message);
        let msg = error.response.data?.data?.message || "Error adding player";
        this.$toast.error(msg);
        this.closeModal();
      }
    },
  },
  watch: {
    // Watch the computed property for changes
    selectedBracket: {
      immediate: true,
      handler(newVal, oldVal) {
        // Whenever the selectedBracket updates, update the form's bracket value
        if (!newVal || !newVal._id) return;
        this.form.bracket = newVal._id;
      },
    },
  },
};
</script>

<style scoped></style>
