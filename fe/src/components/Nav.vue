<template>
  <span>
    <nav class="bg-gray-800 navBar">
      <div class="mx-auto px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div
            class="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start"
          >
            <div class="sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <a
                  href="#"
                  class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium"
                  aria-current="page"
                  @click="$emit('search')"
                  >Search Again</a
                >
                <a
                  href="https://bracketforce.com/?utm_source=map"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >Home</a
                >
              </div>
            </div>
          </div>
          <div class="flex justify-between">
            <div class="mt-2 mr-2">
              <p
                class="uppercase text-white bg-orange-900 rounded-md py-1 px-2 font-bold text-sm"
              >
                In Beta
              </p>
            </div>
            <button
              @click="show = !show"
              class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
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
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <Modal v-model:show="show">
      <div class="fade fadeinUp">
        <img src="/images/bracket-force-logo.png" class="logo-image" />
      </div>
      <div>
        Welcome to the <i>BracketForce</i> Network -- a place for connecting
        athletes with eachother to play games and compete in tournaments. Things
        are still in beta, so please be patient as we work out the kinks. Feel
        free to reach out with suggestions and feedback. Thanks for your
        support!
      </div>

      <div class="mt-4">
        Contact:
        <a
          class="font-bold text-gray-300 underline hover:text-gray-100"
          href="mailto:map@bracketforce.com"
        >
          map@bracketforce.com</a
        ><br />
        Home:
        <a
          href="https://bracketforce.com/?utm_source=map"
          class="font-bold text-gray-300 underline hover:text-gray-100"
          >BracketForce.com</a
        >
      </div>
    </Modal>
  </span>
</template>

<script>
import Modal from "@/components/Modal.vue";
export default {
  components: {
    Modal,
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>

<style scoped>
.navBar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.newline {
  display: block;
  margin-top: 1rem;
}
</style>
