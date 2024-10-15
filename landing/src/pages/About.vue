<script setup>
import Header from "./../partials/Header.vue";
import PageIllustration from "./../partials/PageIllustration.vue";
import HeroAbout from "../partials/HeroAbout.vue";
import Timeline from "../partials/Timeline.vue";
import Team from "../partials/Team.vue";
import Benefits from "../partials/Benefits.vue";
import Career from "../partials/Career.vue";
import Clients from "../partials/Clients.vue";
import Cta from "../partials/Cta.vue";
import Footer from "./../partials/Footer.vue";
</script>

<template>
  <div
    class="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip"
  >
    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="relative grow">
      <!-- Page illustration -->
      <PageIllustration multiple />

      <!-- Page sections -->
      <HeroAbout />
      <Timeline />
      <Team />
      <Benefits />
      <Career />
      <Clients />
      <Cta />
    </main>

    <!-- Site footer -->
    <Footer />
  </div>
</template>
