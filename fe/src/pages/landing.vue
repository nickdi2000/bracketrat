<template>
  <div
    class="flex flex-col justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <!-- Navigation -->
    <nav class="py-4 bg-white dark:bg-gray-800">
      <div class="container mx-auto flex justify-between items-center px-6">
        <a
          href="#"
          class="text-xl font-semibold text-gray-900 dark:text-white"
          >{{ $appName }}</a
        >
        <div class="flex items-center space-x-4">
          <a
            href="#"
            class="text-gray-600 dark:hover:text-gray-300 dark:text-gray-400"
            >Home</a
          >
          <router-link
            to="/contact"
            class="text-gray-600 dark:hover:text-gray-300 dark:text-gray-400"
            >Contact</router-link
          >
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div
      class="flex-grow flex items-center justify-center text-center py-16 px-4 bg-gray-50 dark:bg-blue-900"
    >
      <div>
        <div
          class="flex flex-col items-center lg:mt-0 sm:mt-5 fade fadeinUp text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img src="/images/logo-light.png" class="logo-image fadeInUp" />
        </div>
        <h1 class="text-5xl font-bold mb-1 text-gray-900 dark:text-white">
          Welcome to {{ $appName }}
        </h1>
        <p class="text-lg mb-8 text-gray-600 dark:text-gray-300">
          Simplified Tournament Brackets.
        </p>
        <router-link
          :to="'/home'"
          class="fadein bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try it now
        </router-link>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white dark:bg-gray-800 py-16">
      <div class="container mx-auto px-6">
        <!-- <h2
          class="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
        >
          Features..
        </h2> -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <h3
              class="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
            >
              Simple.
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              It's the simplist one. If you can find a smoother more intuitive
              bracket system, send us the link and we'll give you 6 months of
              our platform on the house. coupon.
            </p>
          </div>
          <div class="text-center">
            <h3
              class="text-xl font-semibold mb-2 text-gray-900 dark:text-white"
            >
              Flex.
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
              build itself by havingg the players enter their own details. Watch
              the magic happen.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-6 bg-gray-200 dark:bg-gray-700">
      <div class="container mx-auto text-center">
        <p class="text-gray-900 dark:text-white">
          &copy; {{ getYear }} {{ $appName }}. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
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
  width: 150px;
  height: auto;
  opacity: 0.6;
  transition: all 0.6s ease;
}

.logo-image:hover {
  opacity: 1;
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
</style>
