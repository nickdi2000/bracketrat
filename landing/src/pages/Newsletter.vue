<script setup>
import Header from "./../partials/Header.vue";
import PageIllustration from "./../partials/PageIllustration.vue";
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
      <PageIllustration multiple />

      <!-- Page sections -->
      <section>
        <div class="mx-auto max-w-6xl px-4 sm:px-6">
          <div class="py-12 md:py-20">
            <!-- Section header -->
            <div class="pb-12 text-center">
              <div class="mb-3 inline-flex">
                <div
                  class="relative flex items-center gap-2 rounded-full bg-gray-900/90 p-1 pr-3 text-sm text-indigo-200/65 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm"
                >
                  <div class="-ml-0.5 flex -space-x-2">
                    <img
                      class="box-content rounded-full border-2 border-gray-900"
                      src="../images/avatar-group-01.jpg"
                      width="20"
                      height="20"
                      alt="Avatar 01"
                    />
                    <img
                      class="box-content rounded-full border-2 border-gray-900"
                      src="../images/avatar-group-02.jpg"
                      width="20"
                      height="20"
                      alt="Avatar 02"
                    />
                    <img
                      class="box-content rounded-full border-2 border-gray-900"
                      src="../images/avatar-group-03.jpg"
                      width="20"
                      height="20"
                      alt="Avatar 03"
                    />
                    <img
                      class="box-content rounded-full border-2 border-gray-900"
                      src="../images/avatar-group-04.jpg"
                      width="20"
                      height="20"
                      alt="Avatar 04"
                    />
                  </div>
                  <span
                    ><strong class="font-normal text-gray-200">20K</strong> have
                    already subscribed.</span
                  >
                </div>
              </div>
              <h1
                class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 text-4xl font-semibold text-transparent md:text-5xl"
              >
                Join our newsletter
              </h1>
              <div class="mx-auto max-w-3xl">
                <p class="text-xl text-indigo-200/65">
                  Sign up to get early access to product launches, promotions,
                  and exclusive offers. Join our newsletter today!
                </p>
              </div>
            </div>

            <!-- Contact form -->
            <form class="mx-auto max-w-[440px]">
              <div class="flex gap-3">
                <input
                  id="email"
                  type="email"
                  class="form-input w-full"
                  placeholder="Your email address"
                  aria-label="Email"
                />
                <button
                  class="btn group w-full flex-1 bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                >
                  <span class="relative inline-flex items-center">
                    Subscribe
                    <span
                      class="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5"
                      >-&gt;</span
                    >
                  </span>
                </button>
              </div>
            </form>
            <p class="mt-5 text-center text-sm text-gray-600">
              No spam, only helpful content.
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Site footer -->
    <Footer border />
  </div>
</template>
