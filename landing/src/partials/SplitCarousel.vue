<script setup>
import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TransitionRoot,
} from "@headlessui/vue";
import CarouselImg01 from "../images/carousel-01.png";
import CarouselImg02 from "../images/carousel-02.png";
import CarouselImg03 from "../images/carousel-03.png";

const tabs = [
  {
    title: "Strategic Sync",
    description:
      "Remove corners from the avatars and transform the way your team work.",
    img: CarouselImg01,
    imgAlt: "Carousel image 01",
  },
  {
    title: "Feedback Loop",
    description:
      "Best-in-class design practices to keep your work safe and secure.",
    img: CarouselImg02,
    imgAlt: "Carousel image 02",
  },
  {
    title: "Enterprise-Ready",
    description:
      "Built for teams of all sizes. From early-stage startups to global enterprises.",
    img: CarouselImg03,
    imgAlt: "Carousel image 03",
  },
];
</script>

<template>
  <section>
    <TabGroup v-slot="{ selectedIndex }" vertical>
      <div class="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          class="border-t py-12 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1] md:py-20"
        >
          <div
            class="flex flex-col items-center justify-between pb-12 md:flex-row md:gap-8 md:pb-20 lg:gap-16"
          >
            <!-- Left content -->
            <div class="shrink-0 md:w-[500px] [&_>*]:pl-7">
              <div
                class="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-gradient-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-gradient-to-l after:from-transparent after:to-indigo-200/50"
              >
                <span
                  class="inline-flex bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent"
                  >Software Standard</span
                >
              </div>
              <div
                class="after:animate-shine relative mb-6 border-l [border-image:linear-gradient(to_bottom,transparent,theme(colors.slate.400/.25),transparent)1] after:absolute after:left-0 after:top-0 after:h-4 after:w-px after:origin-bottom after:-translate-y-full after:bg-[linear-gradient(180deg,_transparent,_theme(colors.indigo.500/.5)_25%,_theme(colors.indigo.500)_50%,_theme(colors.indigo.500/.5)_75%,_transparent)] after:opacity-0"
              >
                <div class="mb-4">
                  <h2
                    class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-4 text-3xl font-semibold text-transparent md:text-4xl"
                  >
                    Improve efficiency & global coverage
                  </h2>
                  <p class="text-indigo-200/65">
                    Open is so simple to use, it's easy to overlook the wealth
                    of complex technologies packed under the hood that keep Open
                    robust, safe, and blazing fast.
                  </p>
                </div>

                <!-- Buttons -->
                <TabList class="space-y-2">
                  <Tab :key="index" v-for="(tab, index) in tabs" as="template">
                    <button
                      class="ui-focus-visible:outline-none ui-focus-visible:ring ui-focus-visible:ring-indigo-300 -mx-2 flex gap-2 p-2 text-left transition-opacity focus-visible:outline-none"
                      :class="
                        selectedIndex !== index
                          ? 'opacity-50 hover:opacity-70'
                          : ''
                      "
                    >
                      <svg
                        class="shrink-0"
                        :class="
                          selectedIndex !== index
                            ? 'fill-gray-600'
                            : 'fill-indigo-500'
                        "
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                      >
                        <path
                          d="m14.092 5.207-8.207 8.207-3.592-3.591 1.414-1.415 2.178 2.178 6.793-6.793 1.414 1.414Z"
                        />
                      </svg>
                      <span>
                        <span class="font-medium text-gray-200">{{
                          tab.title
                        }}</span>
                        <span class="text-gray-700"> - </span>
                        <span class="text-indigo-200/65">{{
                          tab.description
                        }}</span>
                      </span>
                    </button>
                  </Tab>
                </TabList>
              </div>
              <div>
                <p class="font-nacelle mb-4 text-gray-200">
                  “I was blown away by how easy it was to create my content
                  using this tool! Within a few hours, I had a
                  professional-looking flow up and running.”
                </p>
                <div class="flex items-center gap-3">
                  <img
                    class="inline-flex shrink-0 rounded-full"
                    src="../images/small-testimonial.jpg"
                    width="24"
                    height="24"
                    alt="Small testimonial"
                  />
                  <div class="text-sm font-medium text-gray-200">
                    <span>Chris Pick</span>
                    <span class="text-gray-700"> - </span>
                    <a
                      class="text-indigo-200/65 transition-colors hover:text-indigo-500"
                      href="#0"
                      >Notion Circle</a
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Right content -->
            <TabPanels class="shrink-0 md:w-[540px]" data-aos="fade-up">
              <div class="relative flex flex-col">
                <TabPanel
                  :key="index"
                  v-for="(tab, index) in tabs"
                  :static="true"
                  :class="selectedIndex !== index ? 'order-first' : ''"
                >
                  <TransitionRoot
                    :show="selectedIndex === index"
                    enter="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-500 transform"
                    enterFrom="opacity-0 -translate-y-6"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-[cubic-bezier(0.68,-0.3,0.32,1)] duration-300 transform absolute"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-12"
                  >
                    <img
                      width="540"
                      height="520"
                      :src="tab.img"
                      :alt="tab.imgAlt"
                    />
                  </TransitionRoot>
                </TabPanel>
              </div>
            </TabPanels>
          </div>
        </div>
      </div>
    </TabGroup>
  </section>
</template>
