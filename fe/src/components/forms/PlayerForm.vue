<template>
  <div>
    <button
      type="button"
      @click="showModal"
      class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>

      &nbsp; Add
    </button>

    <button
      type="button"
      class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
        />
      </svg>

      &nbsp; Invite
    </button>

    <div class="mt-5">
      <Alert type="info" class="fadeinUp"
        >No {{ $store.teamPlayer }}'s exist yet. Invite them with your unique
        bracket link or add them manually.</Alert
      >
    </div>

    <div v-if="!$store.selected_brackett" class="mt-4">
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
          QR code.
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
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Player Name"
            v-model="name"
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
          <fwb-button @click="closeModal" color="green" :loading="loading">
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
      form: {
        name: "",
        bracket: this.$store.getBracket._id,
      },
    };
  },
  components: {
    FwbButton,
    FwbModal,
    PlusIcon,
  },
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
      console.log(this.form);
      this.loading = true;
      try {
        const rec = await this.$api.post("players", this.form);
        console.log("rec", rec);
        this.loading = false;
        this.form.name = "";
        this.$toast.success("Player added successfully");
        this.closeModal();
      } catch (error) {
        this.loading = false;
        this.$toast.error("Error adding player");
        this.closeModal();
      }
    },
  },
};
</script>

<style scoped></style>
