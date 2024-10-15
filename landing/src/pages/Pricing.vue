<script setup>
import Header from "./../partials/Header.vue";
import PageIllustration from "./../partials/PageIllustration.vue";
import HeroPricing from "./../partials/HeroPricing.vue";
import Faqs from "./../partials/Faqs.vue";
import Testimonials from "./../partials/Testimonials.vue";
import Cta from "./../partials/Cta.vue";
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
      <PageIllustration />

      <!-- Page sections -->
      <HeroPricing />
      <Faqs />
      <Testimonials />
      <Cta />
    </main>

    <!-- Site footer -->
    <Footer />
  </div>
</template>
