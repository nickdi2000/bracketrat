<template>
  <div class="floating-middle backdrop">
    <div class="loader3">
      <div class="orbe" style="--index: 0"></div>
      <div class="orbe" style="--index: 1"></div>
      <div class="orbe" style="--index: 2"></div>
      <div class="orbe" style="--index: 3"></div>
      <div class="orbe" style="--index: 4"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    loading: false,
  },
  data() {
    return {};
  },
  mounted() {},
};
</script>
<style>
.floating-middle {
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  margin: 0 auto;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(17, 42, 68, 0.5);
}
.loader3 {
  --size-loader: 50px;
  --size-orbe: 10px;
  width: var(--size-loader);
  height: var(--size-loader);
  position: fixed;
  transform: rotate(45deg);
}

.orbe {
  position: absolute;
  width: 100%;
  height: 100%;
  --delay: calc(var(--index) * 0.1s);
  animation: orbit7456 ease-in-out 1.5s var(--delay) infinite;
  opacity: calc(1 - calc(0.2 * var(--index)));
}

.orbe::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: var(--size-orbe);
  height: var(--size-orbe);
  background-color: #3ae374;
  box-shadow: 0px 0px 20px 2px #3ae374;
  border-radius: 50%;
}

@keyframes orbit7456 {
  0% {
  }

  80% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
