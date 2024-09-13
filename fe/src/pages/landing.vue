<template>
  <div
    class="flex flex-col justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <landingNav />

    <section class="bg-gray-900 text-white matrix-container">
      <div
        class="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center matrix"
      >
        <div class="mx-auto max-w-3xl text-center">
          <h1
            class="fadein bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl"
          >
            Simplified Tournament

            <span class="sm:block"> Bracket System. </span>
          </h1>

          <div class="flex flex-row justify-center fadeinSlow">
            <BracketSvg />
          </div>

          <p class="mx-auto text-gray-400 py-0 max-w-xl sm:text-xl/relaxed">
            Generate a fixed size, or build it out dynamically as players join.
          </p>

          <div class="mt-8 flex flex-wrap justify-center gap-4">
            <router-link
              class="fadeInUp block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              to="/register"
            >
              Generate Bracket <ArrowLongRightIcon class="h-4 w-4 inline" />
            </router-link>

            <router-link
              class="fadeInUpSlow block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              to="/find"
            >
              Join Existing
            </router-link>
          </div>
          <!-- <div class="mt-12 flex flex-col flex-wrap justify-center mb-6">
            <router-link
              to="/find"
              class="mt-0 bg-slate-800 text-sm text-gray-500 p-2 rounded-lg hover:bg-slate-700 uppercase font-bold"
            >
              Join Existing Bracket
            </router-link>
          </div> -->
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <div class="bg-gray-800 dark:bg-bluegray-800 py-16 z-10">
      <div class="container mx-auto px-6">
        <!-- <h2
          class="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
        >
          Features..
        </h2> -->

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
          <div class="text-center">
            <div class="flex justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            <h3
              class="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
            >
              Simple.
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              It's the simplist one. Go ahead, try to find a simpler bracket
              generator.
            </p>
          </div>
          <div class="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6 inline-block"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
              />
            </svg>
            <h3
              class="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
            >
              Flexible.
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Move things around. Add, remove, edit teams/players on the
              fly...go <i>nuts.</i>
            </p>
          </div>
          <div class="text-center">
            <div class="flex justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
            </div>
            <h3
              class="text-xl font-semibold mb-0 text-gray-900 dark:text-white"
            >
              Multi-user.
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              The feature you didn't <i>know</i> you needed. Share the QR code
              and watch the thing run itself.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- PRICING -->

    <PricingTable />

    <div class="my-8 flex justify-center">
      <Logo2 />
    </div>

    <!-- Footer -->
    <footer class="py-6 bg-gray-200 dark:bg-gray-700 z-10">
      <div class="container mx-auto text-center">
        <p class="text-gray-900 dark:text-white">
          &copy; {{ getYear }} {{ $appName }}. All rights reserved.
        </p>
        <p class="text-gray-600 dark:text-gray-400 mt-0">
          <a href="/docs/privacy-policy" class="hover:underline"
            >Privacy Policy</a
          >
          |
          <a href="/docs/terms-of-service" class="hover:underline"
            >Terms of Service</a
          >
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import landingWallpaper from "./landingWallpaper2.vue";
import PricingTable from "../components/PricingTable.vue";
import landingNav from "./landingNav.vue";
import BracketSvg from "../components/graphics/BracketSvg.vue";
import Logo2 from "../components/Logo2.vue";

export default {
  components: {
    landingWallpaper,
    PricingTable,
    landingNav,
    BracketSvg,
    Logo2,
  },
  data() {
    return {};
  },
  mounted() {
    this.$store.setUTMSource();
  },
  computed: {
    getYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style scoped>
.logo-image {
  width: 4rem;
  height: auto;
  opacity: 0.6;
  transition: all 0.6s ease;
  /*add glowing animation */
  animation: glow 1s infinite alternate;
}

.altered {
  filter: brightness(50%) sepia(100%) saturate(400%);
  transform: scale(1.1) rotate(5deg);
}

.matrix-container {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 60vh;
  /*background-image: linear-gradient(#434343, #282828);*/
  @apply bg-gray-900;
}

/*smaller screens */

@media (max-width: 640px) {
  .matrix-container {
    height: 75vh;
  }
}

.matrix {
  background-color: transparent;
  background-image: linear-gradient(
      0deg,
      transparent 14%,
      rgba(0, 166, 11, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(0, 220, 88, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.05) 26%,
      transparent 27%,
      transparent 74%,
      rgba(255, 255, 255, 0.05) 75%,
      rgba(255, 255, 255, 0.05) 76%,
      transparent 77%,
      transparent
    );
  height: 100%;
  background-size: 50px 50px;
}
</style>
