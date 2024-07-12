<template>
  <section class="mt-5 mx-4 px-5">
    <div class="my-3 text-white text-4xl font-bold">Pricing</div>

    <div class="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2 lg:max-w-none">
      <!-- Tier 1 -->
      <div
        class="flex flex-col rounded-lg shadow-lg overflow-hidden"
        v-for="(block, index) in blocks"
        :key="index"
      >
        <div class="px-6 py-8 bg-white sm:p-10 sm:pb-6">
          <div class="flex items-center">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ block.name }}
            </h3>
          </div>
          <div
            class="mt-4 flex items-baseline text-3xl leading-none font-extrabold text-gray-900"
          >
            {{ block.price }}
            <span class="ml-1 text-2xl leading-8 font-medium text-gray-500">
              /mo
            </span>
          </div>
        </div>
        <div
          class="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 sm:p-10 sm:pt-6"
        >
          <ul>
            <li class="flex items-center" v-for="opt in block.options">
              <span class="text-base font-medium text-gray-500">
                {{ opt.name }}
              </span>
            </li>
          </ul>
          <div class="mt-6">
            <a
              v-if="!index"
              href="#"
              disabled
              class="block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium text-white bg-gray-600 hover:bg-gray-700"
            >
              Currently Selected</a
            >

            <a
              v-else
              href="#"
              @click="select(block)"
              class="block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Choose {{ block.name }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 text-white">
      *Also Free?! Yes. For this plan you also don't have to pay any money, but
      you
      <i>do</i> have to pay us in feedback. Let us know how you like the app,
      and what features you'd like to see in the next upgrade!
    </div>
  </section>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {
      blocks: [
        {
          name: "Basic",
          price: "Free",
          options: [
            {
              name: "Up to 5 players/teams",
            },
            {
              name: "Single, basic tournament type",
            },
          ],
        },
        {
          name: "Pro",
          price: "Also Free*",
          options: [
            {
              name: "No Player/Team Limit!",
            },
            {
              name: "Multiple tournaments",
            },
            {
              name: "All tournament types",
            },
            {
              name: "Priority support",
            },
          ],
        },
      ],
    };
  },
  computed: {},

  methods: {
    select(block) {
      this.$toast.success("You've selected the " + block.name + " plan!");
    },
  },
};
</script>
