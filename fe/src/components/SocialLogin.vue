<template>
  <div class="flex justify-content-center mt-4" v-if="clientId">
    <GoogleLogin
      :callback="googleCallback"
      :clientId="clientId"
      :buttonConfig="googleConfig"
    />
  </div>
</template>

<script>
export default {
  name: "SocialLogin",
  data() {
    return {
      clientId: import.meta.env.VITE_GOOGLE_SSO_CLIENT_ID,
      googleConfig: {
        text: "signin_with",
        size: "large",
        // theme: "filled_blue",
      },
    };
  },
  components: {},
  emits: ["loading", "success"],
  mounted() {},
  props: {
    action: {
      type: String,
      default: "signin",
    },
  },
  methods: {
    async onSuccess(userData) {
      if (this.action == "register") {
        // gtag("event", "register", {
        //   user_id: userData.data?.user?.id,
        // });
      }
      window.gtag_report_conversion;
      await this.$store.setUser(userData);
      this.$toast.success("Logged in successfully");
      this.$router.push("/admin/dashboard");
      //this.$router.push('/register/complete');
    },
    async googleCallback(event) {
      //console.log('E', event);
      this.$emit("loading", true);
      const jwtCredentials = event.credential;

      let params = {
        id_token: jwtCredentials,
      };
      const profileData = JSON.parse(atob(jwtCredentials.split(".")[1]));
      //console.log('profileData', profileData);

      const data = {
        email: profileData.email,
        name: profileData.name,
        password: "skeletongoogle123",
        isEmailVerified: true,
        sso_info: profileData,
      };
      try {
        const rec = await this.$api.post("auth/sso-login-register", data);
        const userData = { data: rec.data };
        this.onSuccess(userData);
      } catch (e) {
        console.log("e", e);
        this.$toast.add({
          severity: "error",
          summary: "Error",
          detail: "Error logging in with Google",
          life: 3000,
        });
      }
    },
  },
};
</script>
