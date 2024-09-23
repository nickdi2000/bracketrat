<template>
  <div class="py-15 mt-12 text-center mid">
    <div class="flex flex-row justify-center mx-auto">
      <div
        class="bg-gradient-to-b from-slate-900 to-slate-800 px-0 md:px-3 text-center"
      >
        <div class="header">
          <h1 class="header font-bold uppercase">Verify Email</h1>
        </div>

        <div>
          <GreenCheck />
        </div>

        <div class="header text-white">Your email has been verified!</div>

        <div>
          <div class="my-8">
            <router-link to="/landing" class="router-link"
              >Back to Homepage</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GreenCheck from "@/components/GreenCheck.vue";

export default {
  data() {
    return {};
  },
  components: {
    GreenCheck,
  },
  created() {
    this.verify();
  },
  methods: {
    async verify() {
      const token = this.$route.query.token;
      if (!token) {
        alert("no token");
        this.$router.push({ name: "Landing" });
      }
      try {
        await this.$api.post("/auth/verify-email?token=" + token);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
