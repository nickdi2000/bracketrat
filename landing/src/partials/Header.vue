<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Dropdown from "./Dropdown.vue";

const mobileNavOpen = ref(false);
const mobileNav = ref(null);
const hamburger = ref(null);

const clickOutside = (e) => {
  if (
    !mobileNavOpen.value ||
    mobileNav.value.contains(e.target) ||
    hamburger.value.contains(e.target)
  )
    return;
  mobileNavOpen.value = false;
};

const keyPress = ({ keyCode }) => {
  if (!mobileNavOpen.value || keyCode !== 27) return;
  mobileNavOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", clickOutside);
  document.addEventListener("keydown", keyPress);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", clickOutside);
  document.removeEventListener("keydown", keyPress);
});
</script>

<template>
  <header class="z-30 mt-2 w-full md:mt-5">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div
        class="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-gray-900/90 px-3 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm"
      >
        <!-- Site branding -->
        <div class="flex flex-1 items-center">
          <!-- Logo -->
          <router-link class="inline-flex shrink-0" to="/" aria-label="Cruip">
            <img
              src="../images/logo.svg"
              width="32"
              height="32"
              alt="Open Pro"
            />
          </router-link>
        </div>

        <!-- Desktop navigation -->
        <nav class="hidden md:flex md:grow">
          <!-- Desktop menu links -->
          <ul
            class="flex grow flex-wrap items-center justify-center gap-4 text-sm lg:gap-8"
          >
            <li>
              <router-link
                class="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                to="/pricing"
                >Pricing</router-link
              >
            </li>
            <li>
              <router-link
                class="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                to="/about"
                >About Us</router-link
              >
            </li>
            <li>
              <router-link
                class="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                to="/blog"
                >Blog</router-link
              >
            </li>
            <li>
              <router-link
                class="flex items-center px-2 py-1 text-gray-200 transition hover:text-indigo-500 lg:px-3"
                to="/help"
                >Help Centre</router-link
              >
            </li>
            <!-- 1st level: hover -->
            <Dropdown title="Resources">
              <li>
                <router-link
                  class="flex rounded-lg px-2 py-1.5 text-sm text-white hover:text-indigo-500"
                  to="/newsletter"
                  >Newsletter</router-link
                >
              </li>
              <li>
                <router-link
                  class="flex rounded-lg px-2 py-1.5 text-sm text-white hover:text-indigo-500"
                  to="/contact"
                  >Contact</router-link
                >
              </li>
              <li>
                <router-link
                  class="flex rounded-lg px-2 py-1.5 text-sm text-white hover:text-indigo-500"
                  to="/404"
                  >404</router-link
                >
              </li>
            </Dropdown>
          </ul>
        </nav>

        <!-- Desktop sign in links -->
        <ul class="flex flex-1 items-center justify-end gap-3">
          <li>
            <router-link
              class="btn-sm relative bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
              to="/signin"
              >Sign In</router-link
            >
          </li>
          <li>
            <router-link
              class="btn-sm bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
              to="/signup"
              >Register</router-link
            >
          </li>
        </ul>

        <!-- Mobile menu -->
        <div class="flex md:hidden">
          <!-- Hamburger button -->
          <button
            class="group inline-flex h-8 w-8 items-center justify-center text-center text-gray-200 transition"
            ref="hamburger"
            :class="{ active: mobileNavOpen }"
            aria-controls="mobile-nav"
            :aria-expanded="mobileNavOpen"
            @click="mobileNavOpen = !mobileNavOpen"
          >
            <span class="sr-only">Menu</span>
            <svg
              class="pointer-events-none fill-current"
              viewBox="0 0 16 16"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                class="origin-center -translate-y-[5px] translate-x-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-[[aria-expanded=true]]:translate-x-0 group-[[aria-expanded=true]]:translate-y-0 group-[[aria-expanded=true]]:rotate-[315deg]"
                y="7"
                width="9"
                height="2"
                rx="1"
              ></rect>
              <rect
                class="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-[[aria-expanded=true]]:rotate-45"
                y="7"
                width="16"
                height="2"
                rx="1"
              ></rect>
              <rect
                class="origin-center translate-y-[5px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-[[aria-expanded=true]]:translate-y-0 group-[[aria-expanded=true]]:rotate-[135deg]"
                y="7"
                width="9"
                height="2"
                rx="1"
              ></rect>
            </svg>
          </button>

          <!-- Mobile navigation -->
          <Transition
            enter-active-class="transition ease-out duration-200 transform"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-out duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <nav
              id="mobile-nav"
              ref="mobileNav"
              v-show="mobileNavOpen"
              class="absolute left-0 top-full z-20 mt-2 w-full rounded-xl bg-gray-900/90 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
            >
              <ul class="p-2 text-sm">
                <li>
                  <router-link
                    class="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                    to="/pricing"
                    >Pricing</router-link
                  >
                </li>
                <li>
                  <router-link
                    class="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                    to="/about"
                    >About Us</router-link
                  >
                </li>
                <li>
                  <router-link
                    class="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                    to="/blog"
                    >Blog</router-link
                  >
                </li>
                <li>
                  <router-link
                    class="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                    to="/help"
                    >Help Centre</router-link
                  >
                </li>
                <li>
                  <router-link
                    class="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                    to="/newsletter"
                    >Newsletter</router-link
                  >
                </li>
                <li>
                  <router-link
                    class="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                    to="/contact"
                    >Contact Us</router-link
                  >
                </li>
                <li>
                  <router-link
                    class="flex rounded-lg px-2 py-1.5 text-white hover:text-indigo-500"
                    to="/404"
                    >404</router-link
                  >
                </li>
              </ul>
            </nav>
          </Transition>
        </div>
      </div>
    </div>
  </header>
</template>
