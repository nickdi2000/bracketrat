<template>
  <div class="flex h-screen">
    <div class="m-auto text-white">
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
    async fetch() {
      const rec = await this.$api.get("users/all");
      this.records = rec.data;
    },
  },
};
</script>
