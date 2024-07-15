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
          class="flex-1 flex flex-col justify-between px-6 pt-0 pb-8 bg-gray-50 sm:p-10 sm:pt-1"
        >
          <ul>
            <li class="flex items-center" v-for="opt in block.options">
              <span class="text-base font-medium text-gray-500">
                ‣ {{ opt.name }}
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

    <div class="flex justify-center pb-12 fadein mx-0">
      <div
        class="mt-5 mx-1 text-blue-200 p-4 bg-blue-900 border border-2 border-blue-800"
      >
        *Don't want to pay? Go ahead -- upgrade for free. All we ask is that you
        <router-link to="/admin/contact?feedback=true" class="underline"
          >contact us</router-link
        >
        and provide any feedback you have for the app. Feature ideas, harsh
        critisisms, or just to say hi. We'd love to hear from you!
      </div>
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
          price: "*$29",
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
              name: "Multi-tier brackets and grouping",
            },
            {
              name: "Scheduling, email and calendar integrations",
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
      if (block.name == "Pro") {
        this.$router.push("/admin/contact?feedback=true");
      }
    },
  },
};
</script>
