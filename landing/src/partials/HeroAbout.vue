<template>
  <section>
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <!-- Hero content -->
      <div class="py-12 md:py-20">
        <!-- Section header -->
        <div class="pb-12 text-center md:pb-20">
          <h1
            class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 text-4xl font-semibold text-transparent md:text-5xl"
          >
            The story behind the project
          </h1>
          <div class="mx-auto max-w-3xl">
            <p class="text-xl text-indigo-200/65">
              Developers are trusted to create an engaging experience for their
              companies, so we build tools to help them.
            </p>
          </div>
        </div>

        <div class="mx-auto max-w-3xl">
          <div class="relative aspect-[4/3] w-full">
            <figure
              class="absolute h-auto"
              style="top: 45%; width: 41.67%; max-width: 320px"
              data-aos="fade-right"
            >
              <div
                class="relative -rotate-2 overflow-hidden rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-900 before:via-indigo-500 before:to-gray-900"
              >
                <img
                  class="opacity-80 grayscale"
                  src="../images/team-mosaic-02.jpg"
                  width="320"
                  height="240"
                  alt="Team mosaic 02"
                />
              </div>
            </figure>
            <figure
              class="relative mx-auto"
              style="width: 78.13%; max-width: 600px"
              data-aos="fade-down"
              data-aos-delay="100"
            >
              <div
                class="relative -rotate-2 overflow-hidden rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-900 before:via-indigo-500 before:to-gray-900"
              >
                <img
                  class="opacity-90 grayscale"
                  src="../images/team-mosaic-01.jpg"
                  width="600"
                  height="338"
                  alt="Team mosaic 01"
                />
              </div>
            </figure>
            <figure
              class="absolute h-auto"
              style="top: 8.5%; right: 0; width: 32.56%; max-width: 250px"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div
                class="relative rotate-2 overflow-hidden rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-900 before:via-indigo-500 before:to-gray-900"
              >
                <img
                  class="opacity-90 grayscale"
                  src="../images/team-mosaic-03.jpg"
                  width="250"
                  height="188"
                  alt="Team mosaic 03"
                />
              </div>
            </figure>
            <figure
              class="absolute h-auto"
              style="bottom: 0; right: 20%; width: 25.53%; max-width: 196px"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div
                class="relative rotate-2 overflow-hidden rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-900 before:via-indigo-500 before:to-gray-900 before:opacity-10"
              >
                <img
                  class="opacity-20 grayscale"
                  src="../images/team-mosaic-04.jpg"
                  width="196"
                  height="196"
                  alt="Team mosaic 04"
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
