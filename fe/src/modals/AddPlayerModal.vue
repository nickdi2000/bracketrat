<template>
  <div class="text-white mt-5 center-vertical">
    <!-- <fwb-modal v-show="isVisible" @close="closeModal" class="mid-center"> -->
    <div
      id="static-modal"
      data-modal-backdrop="static"
      tabindex="-1"
      v-if="isVisible"
      class="backdrop-blur-xl center-vertical overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div
          class="relative bg-white rounded-lg shadow dark:bg-gray-700 fadein"
        >
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Add {{ $teamPlayer }}
            </h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="static-modal"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-4 md:p-5 space-y-4">
            <div class="tiny">
              Remember you may also invite players to join via your unique link
              or
              <router-link
                class="underline text-blue-300 font-bold"
                :to="'/admin/players/invite'"
                >QR code.</router-link
              >
            </div>
            <div class="mt-1 shadow-lg flex flex-col space-y-4">
              <input
                type="text"
                ref="inputField"
                class="big-input text-2xl uppercase font-bold bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Player Name"
                v-model="form.name"
                v-on:keydown.enter="save()"
                required
              />
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600"
          >
            <FwbButton
              data-modal-hide="static-modal"
              type="button"
              @click="save"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Save
            </FwbButton>
            <FwbButton
              data-modal-hide="static-modal"
              type="button"
              @click="closeModal"
              class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Cancel
            </FwbButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import eventBus from "@/plugins/eventBus";
import { FwbButton, FwbModal } from "flowbite-vue";

export default {
  data() {
    return {
      isVisible: false,
      form: {
        name: "",
        slotId: "",
      },
      loading: false,
      teamPlayer: "Player",
    };
  },
  components: {
    FwbButton,
    FwbModal,
  },
  methods: {
    showModal(data) {
      this.isVisible = true;
      console.log("showModal recieve", data);
      this.form.slotId = data?.slotId;
    },
    closeModal() {
      this.isVisible = false;
      this.form.name = "";
    },
    save() {
      this.loading = true;
      this.$store.createPlayerToSlot(this.form).then(() => {
        this.loading = false;
        this.closeModal();
      });
    },
  },
  mounted() {
    // Listen to the global event to show the modal
    eventBus.on("show-add-player-modal", this.showModal);
  },
  beforeUnmount() {
    // Clean up the event listener
    eventBus.off("show-add-player-modal", this.showModal);
  },
};
</script>

<style>
.center-vertical {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
