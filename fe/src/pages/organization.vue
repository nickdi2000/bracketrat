<template>
  <div>
    <header class="flex items-center justify-center">
      <h1
        class="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100"
      >
        My Organization
      </h1>
    </header>

    <div class="text-white mt-4">
      <!--OrgForm here -->

      <div class="mt-5 subheader">My Brackets:</div>

      <div v-if="!brackets?.length">
        <Alert type="info"
          >No brackets found. Head over to the
          <router-link class="font-bold underline" to="/brackets"
            >Brackets Page</router-link
          >
          to create one.</Alert
        >
      </div>

      <div v-else>
        <div
          v-for="(brack, brackIndex) in brackets"
          :key="'brack-' + brackIndex"
        >
          <div class="p-3 bg-blue-900 rounded-md mt-3">
            <svg
              class="small-svg"
              viewBox="0 0 76 76"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
              baseProfile="full"
              enable-background="new 0 0 76.00 76.00"
              xml:space="preserve"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  fill="#ffffff"
                  fill-opacity="1"
                  stroke-width="0.2"
                  stroke-linejoin="round"
                  d="M 52.25,60.1667L 52.25,53.8333L 44.3333,53.8333L 44.3333,47.5L 52.25,47.5L 52.25,41.1667L 38,41.1667L 38,47.5L 31.6667,47.5L 31.6667,28.5L 38,28.5L 38,34.8333L 52.25,34.8333L 52.25,28.5L 44.3333,28.5L 44.3333,22.1667L 52.25,22.1667L 52.25,15.8333L 38,15.8333L 38,22.1667L 25.3333,22.1667L 25.3333,34.8333L 17.4167,34.8333L 17.4167,41.1667L 25.3333,41.1667L 25.3333,53.8333L 38,53.8333L 38,60.1667L 52.25,60.1667 Z "
                ></path>
              </g>
            </svg>
            {{ brack.name }}
          </div>
        </div>
      </div>

      <div class="mt-8 subheader">Master Players List:</div>
      <Alert type="info"
        >None found. Head over to the
        <router-link class="font-bold underline" to="/players"
          >Players & Teams Page</router-link
        >
        to create one.</Alert
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      org: {},
      brackets: [],
    };
  },
  mounted() {
    this.getOrg();
  },
  methods: {
    async getOrg() {
      const rec = await this.$store.getOrg();
      console.log("Organization", rec);
      this.org = rec.data;
      this.brackets = rec.data?.brackets;
    },
  },
};
</script>

<style scoped>
.small-svg {
  width: 30px;
  height: 30px;
  display: inline;
}
</style>
