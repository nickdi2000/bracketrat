<template>
  <div class="flex h-screen w-screen">
    <div class="m-auto text-white mt-4 bg-slate-800 min-w-xl p-4">
      <h1>SuperAdmin</h1>
      <!-- <div>
        <Button @click="fetch" class="btn btn-primary p-2 mt-4">Fetch</Button>
      </div> -->
      <div v-if="!authorized">
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="p-2 mt-4 text-black"
        />
        <br />
        <button @click="authenticate" class="btn btn-dark p-2 mt-4">
          Authenticate
        </button>
      </div>

      <table class="p-3 tr-table" v-if="records && records?.length">
        <tr>
          <th>Email</th>
          <th>Created</th>
          <th>SSO?</th>
          <th>Location</th>
          <th>Send</th>
        </tr>
        <tr v-for="rec in records" class="m-2 w-full">
          <td>
            <div>{{ rec.email }}</div>
            <div class="mt-2 text-gray-300 text-xs" v-if="rec.name">
              {{ rec.name }}
            </div>
            <div v-else>
              <Button class="text-xs bg-slate-800 p-2" @click="addName(rec)"
                >+</Button
              >
            </div>
          </td>
          <td>{{ $formatDate(rec.createdAt) }}</td>
          <td>{{ rec.sso_info?.name ?? "-" }}</td>
          <td>
            <span v-if="rec.location">
              {{ rec.location?.country }}, {{ rec.location?.city }},
              {{ rec.location?.state }}
            </span>
          </td>
          <td>
            <Button
              :disabled="rec.emailsSent"
              @click="send(rec)"
              :class="
                rec.emailsSent ? 'btn btn-secondary' : 'btn btn-primary p-2'
              "
              >Send</Button
            >
          </td>
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
    this.fetch();
  },

  computed: {
    authorized() {
      //const user = this.$store?.getUser;
      //return user.email == "admin@example.com";
      const isAdmin = localStorage.getItem("isAdmin");
      return isAdmin;
    },
  },

  methods: {
    async authenticate() {
      if (this.password == "ratboy") {
        await localStorage.setItem("isAdmin", true);
        this.fetch();
      }
    },
    async addName(rec) {
      const name = prompt("Enter name");
      if (name) {
        rec.name = name;
      }
    },
    async send(rec) {
      const res = await this.$api.post("super/send-followup", rec);
      rec.emailsSent = true;
      console.log("Send", res);
    },
    async fetch() {
      if (!this.authorized) {
        console.log("Not authorized");
        return;
      }
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
