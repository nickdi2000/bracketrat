<template>
  <div
    v-if="!code && !loading"
    class="bg-gradient-to-bl from-gray-800 to-sky-950 text-white"
  >
    <PublicWelcome :key="$route.fullPath + '-publicwelcome'" />
  </div>

  <div v-else class="bg-gradient-to-bl from-gray-800 to-sky-950">
    <main class="px-4 w-full" v-if="bracket">
      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <transition
          ><component :is="Component" :code="code" :bracket="bracket" />
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
        <div v-else class="flex flex-col items-center">
          <ExclamationTriangleIcon
            class="w-16 h-16 text-white fadein animate-pulse"
          />
          <p class="alert alert-warning text-3xl text-white font-bold">
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
            <Input
              v-model="newCode"
              class="mt-4 text-2xl font-bold w-full"
              size="lg"
              placeholder="Enter new code"
            />
            <button
              @click="navToNewCode"
              class="btn btn-primary"
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
        this.bracket = rec.data;
        this.loading = false;
      } catch (error) {
        this.error = error.message ?? "Error fetching Bracket data"; //error;
        this.$toast.error(this.error);
        this.loading = false;
      }
    },
    navToNewCode() {
      this.$router.push({
        name: "FallBack",
        params: { path: this.newCode.toLowerCase() },
      });
      this.code = this.newCode;
      this.newCode = "";
      this.getData();
    },
  },
  data() {
    return {
      code: null,
      loading: false,
      bracket: null,

      error: "",
      showNewCodeInput: false,
      newCode: "",
    };
  },
};
</script>

<style></style>
