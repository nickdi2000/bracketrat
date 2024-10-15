<script setup>
import Header from "./../partials/Header.vue";
import PageIllustration from "./../partials/PageIllustration.vue";
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
            <!-- Section header -->
            <div class="pb-12 text-center">
              <h1
                class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text text-3xl font-semibold text-transparent md:text-4xl"
              >
                Reset your password
              </h1>
            </div>

            <!-- Contact form -->
            <form class="mx-auto max-w-[400px]">
              <div>
                <label
                  class="mb-1 block text-sm font-medium text-indigo-200/65"
                  for="email"
                  >Email</label
                >
                <input
                  id="email"
                  type="email"
                  class="form-input w-full"
                  placeholder="Your email"
                />
              </div>
              <div class="mt-6">
                <button
                  class="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
