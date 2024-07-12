<template>
  <div
    class="h-screen flex flex-col items-center justify-center sm:px-10 md:px-2"
  >
    <Logo />
    <div
      class="mt-5 mb-0 pb-0 text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100"
    >
      <div class="fadein animation" :key="selection + '-header'">
        {{ headerText }}
      </div>
    </div>
    <p class="fadein mt-0 pt-0 text-lg text-gray-900 dark:text-gray-500">
      {{ subText }}
    </p>

    <div class="pb-20 pt-0 mt-0 mb-10" v-if="!selection">
      <div>
        <div
          v-for="(option, index) in options"
          :key="index"
          class="mt-1 text-lg text-gray-900 dark:text-gray-100"
        >
          <button
            @click="trigger(option.action)"
            :style="`animation-duration: ${(index + 1) / 5 + 0.2}s`"
            :class="[
              selection ? '' : 'bg-blue-500',
              selection && selection != option.action ? 'opacity-0' : '',
            ]"
            class="fadeinUp big-button"
            :key="index"
          >
            <div>{{ option.label }}</div>
            <div
              v-if="option.tip"
              class="text-sm text-gray-900 opacity-50 dark:text-gray-100"
            >
              {{ option.tip }}
            </div>
          </button>
        </div>
        <div class="footnote text-center m-auto mt-12 opacity-30">
          <router-link :to="'/landing'" class="btn btn-secondary fadein mt-12">
            Go Home
          </router-link>
        </div>
      </div>
    </div>

    <div class="pb-20 pt-0 mt-0 mb-10" v-if="selection == 'join'">
      <input
        v-model="code"
        type="text"
        class="w-full uppercase px-3 py-2 bg-slate-800 text-3xl font-bold text-gray-200 dark:text-gray-100"
        placeholder="Enter Room Code"
      />
      <div class="mt-4 mx-auto flex flex-col items-center">
        <button
          @click="go()"
          :disabled="!code"
          class="btn btn-success text-3xl font-bold fadeinUp w-full"
        >
          GO <ArrowLongRightIcon class="w-6 h-6 inline animate-ping" />
        </button>
        <button class="btn btn-secondary fadein mt-4" @click="cancel()">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo.vue";

export default {
  name: "PublicWelcome",
  props: {
    path: {
      type: String,
      default: "",
    },
  },
  mounted() {
    console.log("public wrapper code: ", this.path);
    if (this.path == "find") {
      console.log("code is find");
      this.trigger("join");
    }
  },
  components: {
    Logo,
  },
  methods: {
    trigger(action) {
      if (action == "create") {
        this.$router.push({ name: "register" });
        return;
      }
      this.selection = action;
      this.mutateText("Enter Room Code", "to join a tournament");
    },
    mutateText(newVal, subText = "") {
      this.headerText = newVal;
      this.subText = subText;
    },
    go() {
      window.location = "/" + this.code;
    },
    cancel() {
      this.selection = null;
      this.mutateText(
        "Welcome to " + this.$appName,
        "What do you want to do next?"
      );
      //this.$router.push("/");
    },
  },
  data() {
    return {
      selection: null,
      code: "",
      isMutating: false,
      headerText: "Welcome to " + this.$appName,
      subText: "What do you want to do next?",
      options: [
        {
          label: "Join a Tournament",
          action: "join",
          tip: "With a room code",
        },
        {
          label: "Create Organization",
          action: "create",
          tip: "..then create a tournament.",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.big-button {
  @apply text-center ease-in-out px-8 py-5 mt-3 w-full text-3xl uppercase font-semibold text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50;
}

.text-animation {
  font-size: 24px;
  font-weight: bold;
  transition: all 1.8s ease-out;
}

.mutating {
  opacity: 0;
  letter-spacing: 1px;
}
</style>
