<template>
  <section class="middle bg-image h-full lg:pt-0 md:pt-0 sm:pt-10">
    <div
      class="flex flex-col items-center justify-center px-6 pb-1 mx-auto md:h-screen lg:py-0"
    >
      <!-- <span
        @click="test()"
        class="flex items-center lg:mt-0 sm:mt-5 fade fadeinUp text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          src="/images/logo-light.png"
          class="logo-image"
          :class="[animate ? 'altered' : '', bounce ? 'animate-bounce' : '']"
        />
      </span> -->
      <div
        @click="$router.push('/landing')"
        class="text-2xl my-2 fadein font-bold uppercase text-gray-400 hover:text-gray-300 cursor-pointer"
      >
        {{ $appName }}
      </div>

      <div
        class="w-full md:w-96 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700 backdrop-blur-md"
      >
        <div v-if="error" class="pb-2 m-3">
          <Alert type="danger" class="w-full">{{ error }}</Alert>
        </div>
        <div class="p-6 space-y-4 md:space-y-1 sm:p-8">
          <h1
            v-on:dblclick="copyDummy()"
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-4"
          >
            {{ registering ? "Register" : "Sign In" }}
          </h1>

          <div class="space-y-4 md:space-y-6" action="#">
            <!-- <div v-if="registering">
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Name</label
              >
              <input
                type="text"
                name="name"
                v-model="form.name"
                id="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="John Doe"
              />
            </div> -->
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
                href="#"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Forgot password?</a
              >
            </div>

            <button
              type="submit"
              @click="submit()"
              :disabled="loading"
              :class="loading ? 'bg-gray-500 ' : 'bg-blue-700'"
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
            <div
              class="flex flex-column align-items-center justify-center"
              v-if="loading"
            >
              <Spinner size="10" />
            </div>
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

          <div class="flex items-center justify-center space-x-4">
            <SocialLogin />
          </div>
        </div>
      </div>

      <div>
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
          <br />
          <router-link to="/landing" class="underline hover:text-gray-200"
            >Home Page</router-link
          >
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import SocialLogin from "@/components/SocialLogin.vue";
import { apiHandler } from "@/mixins/apiHandler";

export default {
  name: "Login",
  mixins: [apiHandler],
  components: {
    SocialLogin,
  },
  data() {
    return {
      registering: this.$route.name == "register",
      animate: false,
      loading: false,
      bounce: false,
      error: "",
      dummy_form: {
        email: "admin@example.com",
        password: "password123",
      },
      form: {
        email: "",
        password: "",
      },
    };
  },
  mounted() {
    this.$store.setUTMSource();
    setTimeout(() => {
      this.animate = true;
    }, 300);
    if (this.registering) {
      this.getGeo();
    }
  },
  methods: {
    copyDummy() {
      this.form = this.dummy_form;
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
        console.log("ERROR", error);
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

        const rec = await this.$api.register(this.form);
        this.$store.setUser(rec);
        this.$router.push("/admin/dashboard");
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
        console.log("ERROR", error);
        //this.$toast.error("Error registering");
        this._handleResponse(error);
        if (error.message) {
          this.error = error.message;
        }
      }
      this.loading = false;
    },
    async getGeo() {
      const API_KEY = import.meta.env.VITE_GEO_API_KEY;
      const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`;
      try {
        const rec = await fetch(url);
        const data = await rec.json();
        this.form.location = {
          city: data.city,
          country: data.country_name,
          state: data.state_prov,
          lat: data.latitude,
          long: data.longitude,
          state: data.state_prov,
          zip: data.zipcode,
        };
      } catch (error) {
        console.log("error getting geo", error);
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
}

.altered {
  filter: brightness(50%) sepia(100%) saturate(400%);
  transform: scale(1.1) rotate(5deg);
}

.fixed-footer {
  position: relative;
  width: 100vw;
  top: 200px;
  left: 0;
  right: 0;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.8);
  text-align: center;
}
</style>
