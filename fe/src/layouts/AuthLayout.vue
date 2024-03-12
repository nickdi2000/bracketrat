<template>
  <div class="dark dark:bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex items-center justify-between">
        <a class="text-white py-2 px-4" href="/">Home</a>
        <div class="flex">
          <!-- Add more navigation links here -->
          <router-link class="text-white py-2 px-4" to="/login"
            >Login</router-link
          >
          <router-link class="text-white py-2 px-4" to="/contact"
            >Support</router-link
          >
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="bg-gray-700 text-white">
      <transition name="fade">
        <router-view></router-view>
      </transition>
      <!-- This is where child routes/components will be rendered -->
    </main>
  </div>
</template>

<script>
export default {
  name: "AuthLayout",
};
</script>

<style>
/* Fade enter and leave animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
