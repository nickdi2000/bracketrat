<template>
  <main class="text-white">
    <transition name="fade">
      <div class="mx-auto p-3 mt-5 bg-slate-800 rounded-lg max-w-5xl">
        <router-view :key="$route.name"></router-view>

        <div class="ml-12">
          <div class="contact-us">
            <h2>Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may
              <router-link class="router-link" to="/pages/contact"
                >contact us</router-link
              >
              any time.
            </p>
          </div>

          <div>
            <div class="my-4">
              <router-link to="/landing" class="btn btn-dark"
                >Back to Homepage</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- This is where child routes/components will be rendered -->
  </main>
</template>

<script>
export default {
  name: "DocsLayout",
};
</script>

<style>
/* Fade enter and leave animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

h2 {
  margin-top: 2rem;
  @apply text-2xl font-bold uppercase;
}
</style>
