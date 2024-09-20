<template>
  <div class="fadein">
    <div class="flex flex-col min-h-screen items-center justify-center">
      <div
        class="fadeinUpSlow flex flex-col items-center justify-center bg-gray-800 rounded-md p-12 border border-gray-900 dark:border-gray-700 dark:bg-gray-900 shadow-lg"
      >
        <div class="subheader">Welcome to</div>
        <h1
          class="fadein text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100"
        >
          {{ tournament.name }}
        </h1>
        <p class="fadein mt-0 pt-0 text-lg text-gray-900 dark:text-gray-500">
          {{ tournament.description }}
        </p>
        <div class="flex flex-col text-center">
          <label class="text-gray-700 mb-2"
            >Enter your name to login or create a new account.</label
          >
          <input
            type="text"
            id="large-input"
            placeholder="Enter Name.."
            v-model="name"
            style="font-size: 2rem"
            :class="
              foundMatch
                ? 'text-green-300 dark:bg-gray-800'
                : 'text-gray-900 dark:text-gray-100'
            "
            class="block w-full p-4 uppercase text-3xl font-bold border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />

          <button
            v-if="!foundMatch"
            @click="joinBracket"
            :disabled="shouldDisable"
            :class="
              shouldDisable
                ? 'opacity-50 bg-gray-800'
                : 'bg-blue-500 hover:bg-blue-600'
            "
            class="mt-4 text-3xl px-6 py-3 font-bold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            JOIN!
          </button>

          <div v-else>
            <div class="text-green-500">Welcome back, {{ name }}</div>
            <button
              @click="joinBracket"
              class="mt-4 text-3xl px-6 py-3 font-bold text-white bg-green-900 rounded-lg hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Login <ArrowLongRightIcon class="inline w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      <svg
        width="150px"
        height="150px"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        class="opacity-20 iconify iconify--emojione-monotone"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M32.001 27.927l-3.246 9.989H18.251l8.498 6.174l-3.248 9.988l8.5-6.172l8.498 6.172l-3.248-9.988l8.498-6.174H35.245l-3.244-9.989m2.838 15.12l1.752 5.396l-4.59-3.336l-4.594 3.336l1.756-5.396l-4.592-3.336h5.676l1.754-5.396l1.754 5.396h5.674l-4.59 3.336"
          fill="#000000"
        ></path>
        <path
          d="M44.657 26.519v-8.698c0-.364-.199-.67-.481-.86L54 2H35.165l-3.164 4.746L28.837 2H10l9.823 14.96a1.04 1.04 0 0 0-.48.861v8.698C14.862 30.187 12 35.758 12 42c0 11.045 8.955 20 20 20h.001c.681 0 1.354-.035 2.017-.102C44.115 60.887 52 52.365 52 42c0-6.242-2.862-11.813-7.343-15.481M40.826 3h6.328l-8.825 13.239l-3.164-4.746L40.826 3m.667 17.985l.973-1.458c.052.125.082.261.082.404v4.219a.994.994 0 0 1-.297.7C39.251 23.052 35.752 22 32 22a19.87 19.87 0 0 0-10.251 2.851a.996.996 0 0 1-.297-.701v-4.219c0-.143.03-.28.082-.404l.973 1.459h18.986zM16.846 3h6.328l11.324 16.985H28.17L16.846 3M32 59c-9.388 0-17-7.611-17-17s7.612-17 17-17s17 7.611 17 17s-7.612 17-17 17"
          fill="#000000"
        ></path>
      </svg>
    </div>
    <Loader v-if="loading" />
  </div>
</template>

<script>
import Loader from "@/components/Loader2.vue";
import { playerAuthStore } from "@/store/playerAuth";
import { nextTick } from "vue";

export default {
  name: "PublicIndex",
  props: {
    code: {
      type: String,
      required: true,
    },
    bracket: {
      type: Object,
      required: true,
    },
    tournament: {
      type: Object,
      required: true,
    },
    players: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      name: "",
      foundMatch: false,
      loading: false,
    };
  },
  mounted() {
    console.log("PublicIndex mounted");
  },
  computed: {
    shouldDisable() {
      return !this.name || this.loading;
    },
  },
  methods: {
    async joinBracket() {
      this.loading = true;
      if (this.foundMatch) {
        this.login();
      } else {
        this.register();
      }
    },
    async login() {
      const store = playerAuthStore();
      try {
        const res = await this.$api.post("players/login", {
          bracketId: this.tournament.currentBracket,
          name: this.name,
        });
        //toast
        if (res.data.player) {
          this.$toast.success("Added to bracket");

          await store.setPlayer(res.data.player);
          await nextTick();
          window.location = "/player";
        } else {
          this.$toast.error("Error adding player to bracket");
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async register() {
      const store = playerAuthStore();
      try {
        const res = await this.$api.post("players/register", {
          // bracketId: this.tournament._id,
          tournamentId: this.tournament._id,
          name: this.name,
        });
        console.log("res", res.data?.player);
        //return;

        if (!res.data.player) {
          this.$toast.error("Error adding player to bracket");
          return;
        }
        await store.setPlayer(res.data.player);
        await nextTick();
        window.location = "/player";
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    name: {
      handler(v) {
        //check if name matches a 'name' from the tournament.players array
        this.foundMatch = this.players.some((p) => p === v);
      },
    },
  },
  components: {
    Loader,
  },
};
</script>
