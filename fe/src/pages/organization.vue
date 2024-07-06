<template>
  <div>
    <header class="flex items-center justify-center">
      <h1
        class="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100"
      >
        My Organization
      </h1>
    </header>

    <div class="text-white mt-10 px-10">
      <div>
        <Input label="Name" v-model="org.name" placeholder="My Organization" />
      </div>

      <div class="mt-5 subheader">My Brackets:</div>
      <Alert type="info"
        >No brackets found. Head over to the
        <router-link class="font-bold underline" to="/brackets"
          >Brackets Page</router-link
        >
        to create one.</Alert
      >

      <div class="mt-5 subheader">My Players/Teams:</div>
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
    },
  },
};
</script>
