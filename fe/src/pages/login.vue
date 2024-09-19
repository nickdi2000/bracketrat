<template>
  <section class="middle bg-image h-full lg:pt-0 md:pt-0 sm:pt-10">
    <div
      class="flex flex-col items-center justify-center px-0 pb-1 md:h-screen lg:py-0 mx-4"
    >
      <div class="my-8">
        <Logo2 @click="$router.push('/landing')" />
      </div>
      <div
        class="mx-5 md:w-96 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700 backdrop-blur-md"
      >
        <div v-if="error" class="pb-2 m-3">
          <Alert type="danger" class="w-full">{{ error }}</Alert>

          <div v-if="invalidCredentials" class="my-1 text-center fadein">
            <!-- <div class="text-gray-200 mb-4">
              Did you mean to register a new account with this email?
            </div> -->
            <button @click="goToCreateNew" class="btn btn-sm">
              Create New Account instead
            </button>
          </div>
        </div>
        <div class="p-6 space-y-4 md:space-y-1 sm:p-8">
          <h1
            v-on:dblclick="copyDummy()"
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-4"
          >
            {{ registering ? "Register" : "Sign In" }}
          </h1>

          <div v-if="disableRegistration" class="text-left">
            <div class="flex flex-col justify-center align-center mx-auto">
              <label
                for="invitation_code"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Invitation Code *</label
              >
              <input
                type="text"
                v-on:keydown.enter="submitInvitationCode()"
                name="invitation_code"
                v-model="invitation_code"
                id="invitation_code"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="12345"
                required
              />

              <button
                class="text-lg btn btn-success mt-5"
                @click="submitInvitationCode"
              >
                Continue
                <ArrowLongRightIcon class="inline w-6 h-6 ml" />
              </button>
            </div>

            <div class="text-gray-500 dark:text-gray-400 mt-8">
              Note: Self-service registration is not yet enabled. If you have
              lost your invitation code, please
              <router-link class="router-link" to="/pages/contact"
                >Contact Us</router-link
              >.
            </div>
          </div>
          <div v-else class="space-y-4 md:space-y-6" action="#">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email *</label
              >
              <input
                type="email"
                name="email"
                v-model="form.email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password *</label
              >
              <input
                type="password"
                name="password"
                id="password"
                v-model="form.password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required=""
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300"
                    >Remember me</label
                  >
                </div>
              </div>
              <a
                href="/forgot-password"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Forgot password?</a
              >
            </div>

            <button
              type="submit"
              @click="submit()"
              :disabled="loading || !form.email"
              :class="loading || !form.email ? 'bg-gray-500 ' : 'bg-blue-700'"
              class="w-full text-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <span>{{ registering ? "Register" : "Login" }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6 inline ml-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
            <!-- <div
              class="flex flex-column align-items-center justify-center"
              v-if="loading"
            >
              <Spinner size="10" />
            </div> -->
          </div>

          <p
            class="text-sm font-light text-gray-500 dark:text-gray-400"
            v-if="!registering"
          >
            Don’t have an account yet?
            <button
              @click="$router.push('/register')"
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Sign Up!
            </button>
          </p>

          <p v-else>
            <span class="text-gray">Already have an account? &nbsp;</span>
            <button
              @click="$router.push('/login')"
              class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Login
            </button>
          </p>

          <div
            class="flex items-center justify-center space-x-4"
            v-if="!disableRegistration"
          >
            <SocialLogin />
          </div>
        </div>
      </div>

      <div class="mt-8">
        <router-link
          :to="'/find'"
          class="btn hover:text-blue-100 hover:bg-slate-800"
          >Join Existing Bracket
          <ArrowLongRightIcon class="w-6 h-6 ml-2 inline" />
        </router-link>
      </div>
      <div class="fixed-footer">
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
          &copy; {{ new Date().getFullYear() }} All rights reserved.
          {{ $store.locale }}
          <br />
          <router-link to="/landing" class="underline hover:text-gray-200"
            >Home Page</router-link
          >
        </p>
      </div>
    </div>
    <Loader2 v-if="loading" />
  </section>
</template>

<script>
import SocialLogin from "@/components/SocialLogin.vue";
import { apiHandler } from "@/mixins/apiHandler";
import Logo2 from "@/components/Logo2.vue";
import Loader2 from "@/components/Loader2.vue";
import locationMixin from "@/mixins/locationMixin";

export default {
  name: "Login",
  mixins: [apiHandler, locationMixin],
  components: {
    SocialLogin,
    Logo2,
    Loader2,
  },
  data() {
    return {
      registering: this.$route.name == "register",
      animate: false,
      loading: false,
      bounce: false,
      error: "",
      invitation_code: "",
      invalidCredentials: false,
      disableRegOverride: false,
      dummy_form: {
        email: "admin@example.com",
        password: "password123",
      },
      clicks: 0,
      form: {
        email: "",
        password: "",
      },
    };
  },
  mounted() {
    this._getGeo();

    if (this.$route.query?.email) {
      this.form.email = this.$route.query.email;
    }

    this.$store.setUTMSource();
    setTimeout(() => {
      this.animate = true;
    }, 300);
  },
  computed: {
    /* Disabling for Canada currently */
    disableRegistration() {
      // return false;
      const includesCA = this.$store.locale?.includes("ON");
      return includesCA && this.registering && !this.disableRegOverride;
    },
  },
  methods: {
    submitInvitationCode() {
      const match = this.invitation_code.includes("24");

      if (!this.invitation_code || !match) {
        this.$toast.error("Invitation Code not valid or expired.");
        this.invitation_code = "";
        return;
      }

      this.$toast.success(
        "Invitation Code Accepted! Please Continue Registration !"
      );

      this.disableRegOverride = true;
    },
    async copyDummy() {
      this.clicks++;
      if (this.clicks > 1) {
        this.form = this.dummy_form;
      } else {
        //test api
        try {
          const rec = await this.$api.test();
          console.log("Success", rec);
          this.$toast.success("System is operational");
        } catch (error) {
          this.$toast.error("Error Testing System");
        }
      }
    },

    goToCreateNew() {
      //this.$router.push("/register?email=" + this.form.email);
      this.registering = true;
      this.error = "";
      this.invalidCredentials = false;
    },
    async test() {
      try {
        const rec = await this.$api.test();
        console.log("Success", rec);
        this.bounce = true;
        setTimeout(() => {
          this.bounce = false;
        }, 5000);
      } catch (error) {
        this.$toast.error("Error Testing System");
      }
    },
    submit() {
      this.loading = true;
      if (this.$store.utm_source) {
        this.form.utm_source = this.$store.utm_source;
      }

      if (this.registering) {
        this.register();
      } else {
        this.login();
      }
    },
    async register() {
      try {
        if (!this.$isLocal) {
          gtag_report_conversion();
        }
        if (this._location) {
          this.form.location = this._location;
        }

        const rec = await this.$api.register(this.form);
        const packet = await this.$store.setUser(rec);
        // console.log("got packet", packet);
        this.$router.push("/admin/dashboard?welcome=true");
      } catch (error) {
        this._handleResponse(error);
      }
      this.loading = false;
    },
    async login() {
      try {
        //gtag_report_conversion();
        const rec = await this.$api.login(this.form);
        this.$store.setUser(rec);
        this.$router.push("/admin/dashboard");
      } catch (error) {
        console.log("ERROR", error?.response?.status);
        const err = this._handleResponse(error);
        if (err) {
          this.error = err;
        }

        if (error?.response?.status == 401) {
          this.invalidCredentials = true;
        }
      }
      this.loading = false;
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
