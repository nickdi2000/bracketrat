<template>
  <div class="h-full">
    <fwb-navbar solid>
      <template #logo>
        <fwb-navbar-logo
          @click="$router.push('/')"
          alt="Ratbracket logo"
          image-url="/images/logo.png"
          class="fadeinUp"
        >
          {{ $route.name }}
        </fwb-navbar-logo>
      </template>
      <template #default="{ isShowMenu }">
        <fwb-navbar-collapse :is-show-menu="isShowMenu">
          <fwb-navbar-link
            :is-active="$route.path === icon.route"
            :link="icon.route"
            v-for="icon in icons"
          >
            <component :is="icon.icon" class="h-3 w-3 inline" />
            {{ icon.name }}
          </fwb-navbar-link>
        </fwb-navbar-collapse>
      </template>
    </fwb-navbar>

    <!-- Main Content  bg-gradient-to-bl from-gray-600 to-gray-900 -->
    <div class="pt-8 px-4 w-full bg-gradient-to-bl from-gray-600 to-gray-900">
      <transition name="fade">
        <router-view :key="$route.fullPath"></router-view>
      </transition>
    </div>
    <!-- This is where child routes/components will be rendered -->
  </div>
</template>

<script>
import axios from "axios";
import {
  Cog6ToothIcon,
  UsersIcon,
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
    Cog6ToothIcon,
    FwbNavbar,
    FwbNavbarCollapse,
    FwbNavbarLink,
    FwbNavbarLogo,
  },
  data() {
    return {
      events: [],
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      icons: [
        { name: "Bracket", route: "/", icon: PlayCircleIcon },
        { name: this.$teamPlayer + "s", route: "/players", icon: UsersIcon },
        { name: "Options", route: "/options", icon: Cog6ToothIcon },
      ],
    };
  },
  methods: {},
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
