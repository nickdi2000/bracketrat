<template>
  <div class="flex flex-col items-center p-3">
    <div class="subheader">Bracket Player Link</div>
    <div class="text-white text-2xl font-bold py-4">{{ link }}</div>
    <QRCodeVue3
      :key="darkMode"
      :width="400"
      :height="400"
      :value="link"
      :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
      :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
      :dotsOptions="{
        type: 'dots',
        color: color[1],
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: color[0] },
            { offset: 1, color: color[1] },
          ],
        },
      }"
      :backgroundOptions="{ color: color[2] }"
      :cornersSquareOptions="{ type: 'square', color: color[1] }"
      :cornersDotOptions="{ type: undefined, color: color[3] }"
      fileExt="png"
      :download="false"
      myclass="my-qur p-4 slow-animate transition-colors duration-500 ease-in-out"
      imgclass="img-qr"
    />
    <!-- :downloadOptions="{ name: 'vqr', extension: 'png' }" -->

    <div class="py-5">
      <button
        class="p-3 hover:bg-gray-700 rounded-full"
        :class="darkMode ? 'bg-blue-900' : ''"
        @click="darkMode = !darkMode"
      >
        <SunIcon class="text-white h-6 w-6" />
      </button>
    </div>
  </div>
</template>

<script>
import QRCodeVue3 from "qrcode-vue3";
import { SunIcon } from "@heroicons/vue/24/solid";

export default {
  name: "QRCodeVue3Example",
  components: {
    QRCodeVue3,
    SunIcon,
  },
  computed: {
    color() {
      return this.darkMode ? this.dark : this.light;
    },
    link() {
      return "https://bracketrat.com/code";
    },
  },
  data() {
    return {
      darkMode: true,
      dark: ["#e4f1fe", "#8dc6ff", "#22313f", "#34495e"],
      light: ["#000000", "#000000", "#ffffff", "#000000"],
    };
  },
};
</script>

<style scoped>
.slow-animate {
  transition: all 1s ease;
  animation: fadeIn 2s;
}
</style>
