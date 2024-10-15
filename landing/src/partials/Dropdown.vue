<script setup>
import { ref } from "vue";

const props = defineProps({
  title: String,
});

const dropdownOpen = ref(false);
</script>

<template>
  <li
    class="group relative flex items-center gap-0.5 rounded-full px-3 py-1"
    @mouseenter="dropdownOpen = true"
    @mouseleave="dropdownOpen = false"
    @focusin="dropdownOpen = true"
    @focusout="dropdownOpen = false"
  >
    <span
      class="flex cursor-pointer items-center text-gray-200 transition group-hover:text-indigo-500"
      >{{ title }}</span
    >
    <button
      class="shrink-0 p-1"
      :aria-expanded="dropdownOpen"
      @click.prevent="dropdownOpen = !dropdownOpen"
    >
      <span class="sr-only">Show submenu for "{{ title }}"</span>
      <svg
        class="fill-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="6"
      >
        <path
          d="m1.06.19 3.5 3.5 3.5-3.5 1.061 1.06-4.56 4.56L0 1.25 1.06.19Z"
        />
      </svg>
    </button>

    <span class="absolute right-0 top-full origin-top-left">
      <Transition
        enter-active-class="transition ease-out transform"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-out"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ul
          v-show="dropdownOpen"
          class="relative mt-5 w-36 rounded-xl bg-gray-900/90 p-2 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
        >
          <slot />
        </ul>
      </Transition>
    </span>
  </li>
</template>
