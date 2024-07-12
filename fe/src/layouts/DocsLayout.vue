<template>
  <main class="text-white">
    <transition name="fade">
      <router-view :key="$route.name"></router-view>
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
</style>
