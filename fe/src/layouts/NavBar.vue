<template>
  <span>
    <nav
      class="bg-gray-800 mainNav z-50 no-print"
      :class="extended ? 'extended' : ''"
      style=""
    >
      <div class="mx-auto max-w-7xl- px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <button
              type="button"
              @click="showMobile = !showMobile"
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          -->
              <svg
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          -->
              <svg
                class="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            class="flex flex-1 items-center justify-center sm:justify-between"
          >
            <div class="flex flex-shrink-0 items-center">
              <div
                class="flex flex-row cursor-pointer"
                @click="$router.push({ name: 'Bracket' })"
              >
                <!-- <img
                  src="/images/logo-light.png"
                  class="w-14 h-auto logo-image"
                /> -->

                <span
                  v-if="isBracketRoute"
                  class="text-white rounded-md md:hidden py-2 px-3 bg-blue-900 font-bold mt-2 hover:text-blue-200 truncate sm:max-w-50 md:max-w-80"
                >
                  <HomeIcon class="h-6 w-6 inline" />
                </span>

                <span
                  :class="isBracketRoute ? 'hidden md:inline-block' : ''"
                  class="text-slate-400 m-1 p-2 rounded md:mt-3 uppercase font-bold hover:bg-slate-600"
                >
                  {{ getName }}
                </span>
              </div>
            </div>
            <!-- LARGE screens -->
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex flex-row h-10 space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <button
                  v-for="item in items"
                  :key="item.name"
                  @click="handleClick(item.route)"
                  :class="
                    $route.name === item.route ? 'bg-blue-900' : 'bg-gray-900'
                  "
                  class="text-white hover:bg-blue-800 rounded-md px-3 py-2 text-sm font-medium"
                  aria-current="page"
                >
                  <component :is="item.icon" class="h-4 w-4 inline" />
                  {{ item.name }}
                </button>

                <div>
                  <ProfileDropdown />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div
        class="sm:hidden fadein z-50 border border-gray-700"
        id="mobile-menu"
        v-if="showMobile"
      >
        <div class="space-y-1 px-2 pb-3 pt-3 z-50">
          <div class="header md:hidden sm:block pt-2">This Tournament</div>
          <button
            v-for="item in items"
            class="w-full text-left text-white block rounded-md px-3 py-4 text-lg font-medium hover:bg-blue-800"
            aria-current="page"
            @click="handleClick(item.route)"
            :class="$route.path === item.route ? 'bg-blue-900' : 'bg-gray-900'"
            :key="item.name + '-mobile'"
          >
            <component :is="item.icon" class="h-4 w-4 inline mr-2" />

            {{ item.name }}
          </button>

          <div class="mobile-dropdown py-10">
            <div class="header md:hidden sm:block pt-2">Profile</div>

            <ProfileDropdown
              :mobile="true"
              @close="handleClose()"
              @select="handleClick"
            />
          </div>
        </div>

        <button
          class="w-full bg-gray-900 text-left my-3 text-white block rounded-md px-3 py-4 text-lg font-medium hover:bg-blue-800"
          aria-current="page"
          @click="handleClick('AdminHelp')"
        >
          <QuestionMarkCircleIcon class="h-4 w-4 inline mr-2" />
          Help
        </button>
      </div>
    </nav>
    <div
      v-if="showMobile"
      style="z-index: 39"
      class="fixed top-0 left-0 w-screen h-dvh backdrop-blur-md"
    ></div>
  </span>
</template>

<script>
import { FwbNavbarLogo } from "flowbite-vue";
import BracketIcon from "@/components/icons/BracketIcon.vue";
import ProfileDropdown from "@/components/ProfileDropdown.vue";

import {
  Cog6ToothIcon,
  UsersIcon,
  UserIcon,
  PlayCircleIcon,
} from "@heroicons/vue/24/solid";

export default {
  components: {
    FwbNavbarLogo,
    Cog6ToothIcon,
    UsersIcon,
    UserIcon,
    PlayCircleIcon,
    BracketIcon,
    ProfileDropdown,
  },
  emits: ["close"],
  methods: {
    handleClick(route) {
      this.$emit("close");
      this.$router.push({ name: route });
      this.showMobile = false;
    },
    handleClose() {
      this.$emit("close");
      this.showMobile = false;
    },
    async logout() {
      await this.$store.destroy();
      this.$router.push("/login");
    },
  },
  computed: {
    teamPlayer() {
      return this.$store.selected_bracket?.unit == "team" ? "Team" : "Player";
    },
    selectedBracket() {
      return this.$store.getBracket ?? null;
    },
    isBracketRoute() {
      return this.$route.name !== "Bracket" && this.$route.name !== "Dashboard";
    },
    getName() {
      if (!this.selectedBracket?.name) {
        return this.$route.name;
      } else {
        return this.selectedBracket.name.length > 40
          ? this.selectedBracket.name.substring(0, 40) + "..."
          : this.selectedBracket.name;
      }
    },
    items() {
      return [
        { name: "Bracket", route: "Dashboard", icon: BracketIcon },
        {
          name: this.teamPlayer + "s",
          route: "Players",
          icon: UsersIcon,
        },
        { name: "Setup", route: "Settings", icon: Cog6ToothIcon },
      ];
    },
  },
  data() {
    return {
      showMobile: false,
      extended: true,
      items_: [
        { name: "Bracket", route: "/", icon: BracketIcon },
        { name: this.teamPlayer + "s", route: "/players", icon: UsersIcon },
        { name: "Options", route: "/options", icon: Cog6ToothIcon },
      ],
    };
  },
};
</script>

<style scoped>
.mainNav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.3s;
}

.extended {
}
</style>
