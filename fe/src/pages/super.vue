<template>
  <div class="flex h-screen">
    <div class="m-auto text-white mt-4">
      <h1>SuperAdmin</h1>
      <div v-if="!authorized">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="p-2 mt-4 text-black"
        />
        <button @click="authenticate" class="p-2 mt-4">Authenticate</button>
      </div>

      <div v-for="rec in records" class="card mb-4 w-full">
        <div class="flex justify-between">
          <div>
            {{ rec.name }}
            <br />
            {{ rec.email }}
          </div>
          <div>{{ rec.location }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Super",
  data() {
    return {
      records: [],
      password: "",
    };
  },
  mounted() {
    if (!this.authorized) {
      return;
    }
    this.fetch();
  },

  computed: {
    authorized() {
      const user = this.$store.getUser;
      return user.email == "admin@example.com";
    },
  },

  methods: {
    async authenticate() {
      if (this.password == "ratboy") {
        this.fetch();
      }
    },
    async fetch() {
      const rec = await this.$api.get("users/all");
      this.records = rec.data;
    },
  },
};
</script>
