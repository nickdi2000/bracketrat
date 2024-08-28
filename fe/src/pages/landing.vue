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
              to="/login"
            >
              Generate Bracket <ArrowLongRightIcon class="h-4 w-4 inline" />
            </router-link>

            <router-link
              class="fadeInUpSlow block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              to="/pages/contact"
            >
              Contact
            </router-link>
          </div>
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
            <h3
              class="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
            >
              Simple.
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              It's the simplist one. If you can find a smoother more intuitive
              tournament bracket system, send us the link and we'll give you a
              free membership to our platform.
            </p>
          </div>
          <div class="text-center">
            <h3
              class="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
            >
              Flexible.
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              Move things around. Add, remove, edit teams/players on the fly and
              the system will adjust accordingly.
            </p>
          </div>
          <div class="text-center">
            <h3
              class="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
            >
              Multi-user.
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              The first genuinly mult-user bracket system. Have the bracket
              build itself by having the players join the bracket themselves via
              a QR code or custom link.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- PRICING -->

    <PricingTable />

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

export default {
  components: {
    landingWallpaper,
    PricingTable,
    landingNav,
    BracketSvg,
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
.bg-wallpaper- {
  background-image: url("/images/stadium.png");
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  background-color: rgba(0, 0, 0, 0.7);
}

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

.bg-image {
  background-image: url("https://p2.piqsels.com/preview/130/86/477/earth-planet-space-cosmos.jpg");
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  min-height: 100vh;

  background-color: rgba(0, 0, 0, 0.5);
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
