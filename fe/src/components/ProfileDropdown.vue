<template>
  <div class="relative inline-block md:py-0">
    <div class="subheader md:hidden sm:block" v-if="mobile">Organization</div>
    <button
      id="dropdownDefaultButton"
      data-dropdown-toggle="dropdown"
      @click="show = !show"
      class="bg-gray-900 text-white hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-3 py-3 text-center inline-flex items-center"
      type="button"
    >
      <UserIcon class="h-4 w-4 inline" />
      <span v-if="mobile" class="ml-2 text-lg mr-10">Account</span>
      <svg
        class="w-2.5 h-2.5 ms-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 4 4 4-4"
        />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="show"
      class="z-10 sm:left-[-90px] bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-1"
    >
      <div class="text-gray-400 p-2 text-sm">
        {{ $store.user?.email }}
      </div>
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <li>
          <button
            @click="navTo('/admin/brackets')"
            class="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            My Brackets
          </button>
        </li>
        <li>
          <button
            @click="navTo('/admin/profile')"
            class="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            My Profile
          </button>
        </li>
        <li>
          <button
            @click="navTo('/admin/contact')"
            class="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Contact Support
          </button>
        </li>
        <li>
          <button
            @click="navTo('/admin/pricing')"
            class="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Account & Pricing
          </button>
        </li>
        <li>
          <button
            @click="logout"
            class="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { UserIcon } from "@heroicons/vue/24/solid";

export default {
  components: {
    UserIcon,
  },
  data() {
    return {
      show: false,
    };
  },
  props: {
    mobile: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    document.addEventListener("click", this.closeDropdown);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.closeDropdown);
  },
  emits: ["close"],
  methods: {
    closeDropdown(event) {
      if (!this.$el.contains(event.target)) {
        this.show = false;
      }
    },
    logout() {
      this.$store.destroy();
      this.$router.push("/login");
    },
    navTo(route) {
      this.show = false;
      this.$emit("close");
      this.$router.push(route);
    },
  },
};
</script>

<style scoped>
li {
  width: 100%;
}
</style>
