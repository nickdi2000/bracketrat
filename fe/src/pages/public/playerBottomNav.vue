<template>
  <div
    class="fixed-nav bg-gray-800 shadow-lg flex justify-around items-center py-2"
  >
    <div
      class="svg-div"
      @click="selectView('share')"
      :class="view === 'share' ? 'selected' : ''"
    >
      <!-- <svg
        class="big-svg"
        :class="view === 'game' ? 'selected' : ''"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.5 7.063C16.5 10.258 14.57 13 12 13c-2.572 0-4.5-2.742-4.5-5.938C7.5 3.868 9.16 2 12 2s4.5 1.867 4.5 5.063zM4.102 20.142C4.487 20.6 6.145 22 12 22c5.855 0 7.512-1.4 7.898-1.857a.416.416 0 0 0 .09-.317C19.9 18.944 19.106 15 12 15s-7.9 3.944-7.989 4.826a.416.416 0 0 0 .091.317z"
            fill="#ffffff"
          ></path>
        </g>
      </svg> -->
      <svg
        class="big-svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
        />
      </svg>

      <!-- <span class="text-xs mt-1">My Game</span> -->
      <span class="text-xs mt-1">Share</span>
    </div>
    <div
      class="svg-div"
      @click="selectView('bracket')"
      :class="view === 'bracket' ? 'selected' : ''"
    >
      <svg
        class="big-svg"
        viewBox="0 0 76 76"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        baseProfile="full"
        enable-background="new 0 0 76.00 76.00"
        xml:space="preserve"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fill="#ffffff"
            fill-opacity="1"
            stroke-width="0.2"
            stroke-linejoin="round"
            d="M 52.25,60.1667L 52.25,53.8333L 44.3333,53.8333L 44.3333,47.5L 52.25,47.5L 52.25,41.1667L 38,41.1667L 38,47.5L 31.6667,47.5L 31.6667,28.5L 38,28.5L 38,34.8333L 52.25,34.8333L 52.25,28.5L 44.3333,28.5L 44.3333,22.1667L 52.25,22.1667L 52.25,15.8333L 38,15.8333L 38,22.1667L 25.3333,22.1667L 25.3333,34.8333L 17.4167,34.8333L 17.4167,41.1667L 25.3333,41.1667L 25.3333,53.8333L 38,53.8333L 38,60.1667L 52.25,60.1667 Z "
          ></path>
        </g>
      </svg>
      <span class="text-xs mt-1">Bracket</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerBottomNav",
  computed: {
    view() {
      const path = this.$route?.fullPath;
      //clean up below for sure
      if (path == "/player/share") return "share";
      return this.$route?.params?.view || "game";
    },
  },
  methods: {
    selectView(view) {
      //this.$router.push({ name: "player-home", params: { view } });
      this.$router.push(`/player/${view}`);
    },
  },
};
</script>

<style scoped lang="scss">
.selected {
  filter: invert(42%) sepia(93%) saturate(152%) hue-rotate(177deg)
    brightness(119%) contrast(119%);
  opacity: 1 !important;
  @apply border border-gray-500 rounded-md;
}

.big-svg {
  opacity: 0.6;
  width: 24px;
  height: 24px;
  @apply transition-transform duration-300 rounded-md;
}

.svg-div {
  @apply flex flex-col items-center text-white cursor-pointer hover:bg-gray-300 rounded-md py-1 px-4;
}

.fixed-nav {
  bottom: 0;
  width: 100%;
  z-index: 100;
  position: fixed;
}
</style>
