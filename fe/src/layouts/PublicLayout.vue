<template>
  <div
    v-if="(!code && !loading) || $route.params.path == 'find'"
    class="bg-gradient-to-bl from-gray-800 to-sky-950 text-white"
  >
    <PublicWelcome
      v-if="code"
      :path="code"
      :key="$route.fullPath + '-publicwelcome'"
    />
  </div>

  <div v-else class="bg-gradient-to-bl from-gray-800 to-sky-950">
    <main class="px-4 w-full" v-if="bracket">
      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <transition
          ><component :is="Component" :code="code" :bracket="bracket" :players="players" />
        </transition>
      </router-view>
    </main>

    <main class="px-4 w-full" v-else>
      <div class="flex h-screen items-center justify-center">
        <h1
          v-if="loading"
          class="text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100"
        >
          Loading Bracket...
        </h1>
        <div v-else class="flex flex-col items-center p-7 shadow-lg">
          <ExclamationTriangleIcon
            class="w-16 h-16 text-white fadein animate-pulse"
          />
          <p class="alert alert-warning text-1xl text-orange-400 font-bold">
            Bracket not found for code: {{ code }}
          </p>
          <p v-if="!showNewCodeInput">
            <button
              class="btn btn-secondary"
              @click="showNewCodeInput = !showNewCodeInput"
            >
              Try a new code
            </button>
          </p>
          <div v-if="showNewCodeInput" class="centered">
            <input
              v-model="newCode"
              class="mt-4 text-4xl font-bold uppercase p-3 bg-gray-900 text-gray-200 w-full"
              size="lg"
              placeholder="Enter new code"
            />
            <button
              @click="navToNewCode"
              class="btn btn-block mt-4"
              :class="newCode ? 'btn-primary' : 'btn-secondary'"
              :disabled="!newCode"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import PublicWelcome from "@/components/PublicWelcome.vue";

export default {
  name: "PublicLayout",
  mounted() {
    //get code from url
    this.code = this.$route.params.path;
    console.log("publicLayout code", this.code);
    if (this.code == "find" || this.code == "play") return;
    this.getData();
  },
  components: {
    PublicWelcome,
  },
  methods: {
    // get code from url
    async getData() {
      if (!this.code) return;
      this.loading = true;
      try {
        const rec = await this.$api.get(`/brackets/code/${this.code}`);
        this.bracket = rec.data?.bracket;
        this.players = rec.data?.players;
        this.loading = false;
      } catch (error) {
        this.error = error.message ?? "Error fetching Bracket data"; //error;
        this.$toast.error(this.error);
        this.loading = false;
      }
    },
    navToNewCode() {
      window.location = `/${this.newCode}`;
    },
  },
  data() {
    return {
      code: null,
      loading: false,
      bracket: null,
      players: [],
      error: "",
      showNewCodeInput: false,
      newCode: "",
    };
  },
};
</script>

<style></style>
