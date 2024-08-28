<template>
  <svg
    class="bracket-image"
    viewBox="0 0 76 76"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    baseProfile="full"
    enable-background="new 0 0 76.00 76.00"
    xml:space="preserve"
    fill="#000000"
  >
    <defs>
      <filter id="glow">
        <feGaussianBlur
          stdDeviation="3.5"
          result="coloredBlur"
        ></feGaussianBlur>
        <feMerge>
          <feMergeNode in="coloredBlur"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier" filter="url(#glow)">
      <path
        fill="#ffffff"
        fill-opacity="1"
        stroke-width="0.2"
        stroke-linejoin="round"
        d="M 52.25,60.1667L 52.25,53.8333L 44.3333,53.8333L 44.3333,47.5L 52.25,47.5L 52.25,41.1667L 38,41.1667L 38,47.5L 31.6667,47.5L 31.6667,28.5L 38,28.5L 38,34.8333L 52.25,34.8333L 52.25,28.5L 44.3333,28.5L 44.3333,22.1667L 52.25,22.1667L 52.25,15.8333L 38,15.8333L 38,22.1667L 25.3333,22.1667L 25.3333,34.8333L 17.4167,34.8333L 17.4167,41.1667L 25.3333,41.1667L 25.3333,53.8333L 38,53.8333L 38,60.1667L 52.25,60.1667 Z "
      ></path>
    </g>
  </svg>
</template>

<script>
export default {
  name: "BracketSvg",
};
</script>

<style>
.bracket-image {
  width: 98px;
  height: 98px;

  /* Ensure the SVG is visible on a dark background */
  filter: drop-shadow(0 0 20px rgba(0, 81, 255, 0.9));
  animation: glow-animation 2s infinite alternate,
    hue-rotate 5s infinite alternate, sparkle-animation 3s infinite ease-in-out;
}

.bracket-image:hover {
  filter: drop-shadow(0 0 20px rgba(40, 255, 205, 0.9));
  fill: rgba(0, 255, 255, 1);
}

@keyframes glow-animation {
  0% {
    filter: drop-shadow(0 0 20px rgba(0, 81, 255, 0.9));
  }
  100% {
    filter: drop-shadow(0 0 40px rgba(0, 255, 255, 1));
  }
}

@keyframes sparkle-animation {
  0%,
  100% {
    filter: brightness(1) contrast(1);
  }
  50% {
    filter: brightness(1.5) contrast(1.2);
  }
}
</style>
