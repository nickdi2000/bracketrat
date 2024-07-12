<template>
  <span>
    <div class="mid text-white">
      <div class="">
        <div class="card @apply sm:w-full md:w-full lg:w-1/2 xl:w-1/2;">
          <div class="subheader">{{ $teamPlayer }}</div>
          <div class="text-3xl font-bold uppercase">{{ record.name }}</div>
          <hr />
          <div class="mt-4 pt-4 subheader">Stats</div>

          <div class="mt-1 p-2 bg-gray-700">
            <div
              class="flex justify-between mb-2 border-bottom"
              v-for="stat in stats"
            >
              <div>{{ stat.label }}</div>
              <div>{{ record[stat.key] }}</div>
            </div>
          </div>

          <div class="mt-4 subheader">Current Bracket(s)</div>
          <div class="mt-1 p-2 bg-gray-700 m-auto">
            <div v-for="b in brackets" :key="b._id" class="mb-4">
              <div class="font-bold uppercase">{{ b.name }}</div>
              <div class="text-xs text-gray-300 uppercase">{{ b.status }}</div>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <button
            type="button"
            @click="$router.go(-1)"
            class="bg-gray-800 text-white hover:bg-gray-700 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
          >
            <ArrowLongLeftIcon class="h-6 text-white" />
            &nbsp; Back
          </button>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  data() {
    return {
      record: {},
      brackets: [],
      record_id: this.$route.params.id,
      stats: [
        {
          label: "Status",
          key: "status",
        },
        {
          label: "Wins",
          key: "wins",
        },
      ],
    };
  },
  async mounted() {
    await this.fetchRecord();
  },
  methods: {
    async fetchRecord() {
      const rec = await this.$api.get(`players/show/${this.record_id}`);
      this.record = rec.data?.player;
      this.brackets = rec.data?.brackets;
    },
  },
};
</script>
