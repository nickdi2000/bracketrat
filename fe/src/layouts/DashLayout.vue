<template>
  <div class="">
    <NavBar />
    <div class="h-16 mb-0"></div>
    <!-- Main Content  bg-gradient-to-bl from-gray-600 to-gray-900 -->
    <main class="pt-4 px-4 w-full bg-gradient-to-bl from-gray-600 to-gray-900">
      <router-view v-slot="{ Component }" :key="$route.fullPath">
        <transition><component :is="Component" /> </transition>
      </router-view>
    </main>
    <!-- This is where child routes/components will be rendered -->
  </div>
</template>

<script>
import NavBar from "./NavBar.vue";

import axios from "axios";
import {
  Cog6ToothIcon,
  UsersIcon,
  UserIcon,
  PlayCircleIcon,
} from "@heroicons/vue/24/solid";
import {
  FwbNavbar,
  FwbNavbarCollapse,
  FwbNavbarLink,
  FwbNavbarLogo,
} from "flowbite-vue";

export default {
  name: "AuthLayout",
  mounted() {},
  components: {
    UserIcon,
    Cog6ToothIcon,
    FwbNavbar,
    FwbNavbarCollapse,
    FwbNavbarLink,
    FwbNavbarLogo,
    NavBar,
  },
  data() {
    return {
      events: [],
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      icons: [
        { name: "Bracket", route: "/", icon: PlayCircleIcon },
        { name: this.$teamPlayer + "s", route: "/players", icon: UsersIcon },
        { name: "Options", route: "/options", icon: Cog6ToothIcon },
        { name: "Logout", route: "/login", icon: UserIcon },
      ],
    };
  },
};
</script>

<style>
/* Fade enter and leave animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
