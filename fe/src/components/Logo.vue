<template>
  <div
    class="flex flex-col items-center justify-center px-6 pb-1 mx-auto lg:py-0"
  >
    <span
      @click="test()"
      class="flex items-center lg:mt-0 sm:mt-5 fade fadeinUp text-2xl font-semibold text-gray-900 dark:text-white"
    >
      <img
        src="/images/logo-light.png"
        class="logo-image"
        :class="[animate ? 'altered' : '', bounce ? 'animate-spin' : '']"
      />
    </span>
  </div>
</template>

<script>
export default {
  name: "Logo",
  data() {
    return {
      animate: false,
      bounce: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.animate = true;
    }, 300);
  },
  methods: {
    test() {
      //this.animate = !this.animate;
      this.bounce = !this.bounce;
    },
  },
};
</script>
<style scoped>
.logo-image {
  width: 150px;
  height: auto;
  opacity: 0.6;
  transition: all 0.6s ease;
}

.logo-image:hover {
  opacity: 1;
}

.altered {
  filter: brightness(50%) sepia(100%) saturate(400%);
  transform: scale(1.1) rotate(5deg);
}
</style>
