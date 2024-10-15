<script setup>
import PricingTable from "./../partials/PricingTable.vue";
</script>

<template>
  <section>
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <!-- Hero content -->
      <div class="py-12 md:py-20">
        <!-- Section header -->
        <div class="text-center">
          <h1
            class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-12 text-4xl font-semibold text-transparent md:text-5xl"
          >
            Pick the right plan for your business
          </h1>
        </div>

        <div class="relative">
          <!-- Secondary illustration -->
          <div
            class="pointer-events-none absolute bottom-28 left-1/2 -z-10 -ml-28 -translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          >
            <img
              class="md:max-w-none"
              src="../images/secondary-illustration.svg"
              width="1165"
              height="1012"
              alt="Secondary illustration"
            />
          </div>

          <PricingTable />

          <!-- Team CTA -->
          <div class="mx-auto mt-8 max-w-2xl xl:max-w-none">
            <a
              class="group flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 bg-[length:100%_100%] bg-[center] px-4 py-3 backdrop-blur-sm transition-all duration-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:400%_100%]"
              href="#0"
            >
              <span class="text-indigo-200/65"
                ><span class="font-medium text-gray-200">Large team?</span>
                Schedule a Business demo with a member of our team.</span
              >
              <span class="flex shrink-0 items-center gap-3" aria-hidden="true">
                <!-- Avatars -->
                <span class="-ml-0.5 flex -space-x-3">
                  <img
                    class="box-content rounded-full border-2 border-gray-900"
                    src="../images/avatar-01.jpg"
                    width="24"
                    height="24"
                    alt="Avatar 01"
                  />
                  <img
                    class="box-content rounded-full border-2 border-gray-900"
                    src="../images/avatar-02.jpg"
                    width="24"
                    height="24"
                    alt="Avatar 02"
                  />
                  <img
                    class="box-content rounded-full border-2 border-gray-900"
                    src="../images/avatar-03.jpg"
                    width="24"
                    height="24"
                    alt="Avatar 03"
                  />
                  <img
                    class="box-content rounded-full border-2 border-gray-900"
                    src="../images/avatar-04.jpg"
                    width="24"
                    height="24"
                    alt="Avatar 04"
                  />
                </span>
                <!-- Arrow -->
                <span
                  class="tracking-normal text-indigo-500 transition-transform group-hover:translate-x-0.5"
                  >-&gt;</span
                >
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
