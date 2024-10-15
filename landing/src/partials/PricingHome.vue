<script setup>
import PricingTable from "./../partials/PricingTable.vue";
</script>

<template>
  <section class="relative">
    <div
      class="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-20 -translate-x-1/3"
      aria-hidden="true"
    >
      <img
        class="max-w-none"
        src="../images/blurred-shape.svg"
        width="760"
        height="668"
        alt="Blurred shape"
      />
    </div>

    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        class="border-t py-12 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1] md:py-20"
      >
        <!-- Section header -->
        <div class="mx-auto max-w-3xl text-center">
          <div
            class="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50"
          >
            <span
              class="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent"
              >Simple Pricing</span
            >
          </div>
          <h2
            class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-10 text-3xl font-semibold text-transparent md:text-4xl"
          >
            Pick the right plan for your business
          </h2>
        </div>

        <PricingTable />

        <!-- Single testimonial -->
        <div class="mx-auto max-w-3xl">
          <div class="pt-12 md:pt-20">
            <div class="text-center">
              <img
                class="mb-3 inline-flex rounded-full"
                src="../images/large-testimonial-01.jpg"
                width="40"
                height="40"
                alt="Large testimonial"
              />
              <p
                class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-3 text-xl font-semibold text-gray-200 text-transparent"
              >
                “Open PRO lives up to its name. It's incredibly easy to use yet
                powerful enough to handle all my content needs effortlessly.
                It's become an essential part of our work routine.”
              </p>
              <div class="text-sm font-medium text-gray-200">
                <span>Chris Pick</span>
                <span class="text-gray-700"> - </span>
                <a
                  class="text-indigo-200/65 transition-colors hover:text-indigo-500"
                  href="#0"
                  >VP of Product, Disney</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
