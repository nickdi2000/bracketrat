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

      <table class="p-3 tr-table">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Created</th>
          <th>SSO?</th>
          <th>Location</th>
        </tr>
        <tr v-for="rec in records" class="m-2 w-full">
          <td>
            {{ rec.name }}
          </td>
          <td>
            {{ rec.email }}
          </td>
          <td>{{ rec.createdAt }}</td>
          <td>{{ rec.sso_info?.name ?? "-" }}</td>
          <td>{{ rec.location }}</td>
        </tr>
      </table>
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

<style scoped>
.tr-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #2d3748;
  page-break-after: auto;
  margin-bottom: 40px;
}

.tr-table tr {
  border: 1px solid #2d3748;
  page-break-inside: avoid;
  page-break-after: auto;
}

/* alternating row colors */

.tr-table tr:nth-child(even) {
  background-color: #2d3748;
}

.tr-table td {
  border: 1px solid #2d3748;
  padding: 0.5rem;
  text-align: left;
  page-break-inside: avoid;
  page-break-after: auto;
}
</style>
