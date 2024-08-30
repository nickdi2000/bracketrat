<template>
  <section class="middle bg-image h-full lg:pt-0 md:pt-0 sm:pt-10">
    <div
      class="flex flex-col items-center justify-center px-0 pb-1 md:h-screen lg:py-0 mx-4"
    >
      <div
        @click="$router.push('/landing')"
        class="text-2xl my-2 fadein font-bold uppercase text-gray-400 hover:text-gray-300 cursor-pointer"
      >
        {{ $appName }}
      </div>

      <div class="bg-slate-900 p-8 shadow-lg rounded-lg">
        <div class="text-center text-white text-2xl font-bold uppercase">
          Reset your Password
        </div>
        <div class="text-center text-white text-sm">
          Enter a new password a couple times.
        </div>
        <div class="flex flex-col items-center justify-center p-4">
          <div v-if="!sent" class="flex flex-col">
            <input
              type="password"
              v-model="form.password"
              class="w-64 p-2 my-2 text-black rounded-lg"
              placeholder="Password"
            />
            <input
              type="password"
              v-model="form.password_confirmation"
              class="w-64 p-2 my-2 text-black rounded-lg"
              v-on:keydown.enter="submit"
              placeholder="Confirm Password"
            />
          </div>
          <div v-else class="fadein my-5 p-4 bg-green-300 text-green-700">
            Password reset!
          </div>
          <FButton
            class="w-64 p-2 my-2 bg-blue-500 text-white rounded-lg"
            :disabled="sent || !form.password || !form.password_confirmation"
            @click="submit()"
          >
            Reset
          </FButton>
        </div>
      </div>

      <div class="my-4">
        <!-- back -->
        <router-link
          to="/login"
          class="text-white text-sm mt-2 bg-blue-900 p-3 rounded-md"
        >
          Back to Login
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
import { apiHandler } from "@/mixins/apiHandler";

export default {
  name: "ResetPassword",
  data() {
    return {
      form: {
        password: "",
        password_confirmation: "",
      },
      sent: false,
    };
  },
  mixins: [apiHandler],
  methods: {
    async submit() {
      try {
        if (this.form.password !== this.form.password_confirmation) {
          this.$toast.error("Passwords do not match");
          return;
        }

        delete this.form.password_confirmation;

        let token = this.$route.query.token;

        if (!token) {
          this.$toast.error("Invalid, expired or missing token");
          return;
        }
        const response = await this.$api.post(
          `auth/reset-password?token=${token}`,
          this.form
        );
        console.log(response);
        this.sent = true;
        this.$toast.success("Password Reset!");
      } catch (error) {
        console.error(error);
        this._handleResponse(error);
      }
    },
  },
};
</script>

<style scoped>
.logo-image {
  width: 150px;
  height: auto;
  opacity: 0.6;
  transition: all 0.6s ease;
}

.logo-image:hover {
  opacity: 1;
}

.bg-image {
  /* background-image: url("/images/soccer-fire.jpg");
    background-color: rgba(0, 0, 0, 0.8);

    */
  background: linear-gradient(
    109.6deg,
    rgb(19, 26, 36) 11.2%,
    rgb(16, 37, 60) 51.2%,
    rgb(0, 0, 0) 98.6%
  );
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;

  min-height: 100vh;
  max-width: 100vw;
}

.altered {
  filter: brightness(50%) sepia(100%) saturate(400%);
  transform: scale(1.1) rotate(5deg);
}

.fixed-footer {
  position: relative;
  width: 100vw;
  top: 160px;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  text-align: center;
}
</style>
