<script setup>
import Header from "./../partials/Header.vue";
import PageIllustration from "./../partials/PageIllustration.vue";
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

      <section>
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="py-12 md:py-20">
            <div class="text-center">
              <img
                class="mx-auto rotate-2 rounded-2xl"
                src="../images/404.jpg"
                width="196"
                height="196"
                alt="404"
              />
              <div class="relative -mt-8">
                <h1
                  class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-8 text-3xl font-semibold text-transparent md:text-4xl"
                >
                  Uh oh. That page doesn't exist.
                </h1>
                <router-link
                  class="btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                  to="/"
                  >Back Home</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Site footer -->
    <Footer border />
  </div>
</template>
