<template>
  <div class="flex flex-col items-center p-3 print-padding">
    <div class="subheader">Bracket Player-Link</div>
    <Link :darkMode="darkMode" :code="bracket?.code" @update="handleUpdate" />
    <div
      v-for="instance in [0, 1]"
      :key="instance + '-qr-div' + darkMode"
      class="trans"
      :class="[
        instance == 1 ? ' print-only  ' : ' no-print',
        learnMore ? 'shrink' : '',
      ]"
    >
      <QRCodeVue3
        :key="instance + '-qr' + darkMode"
        :width="400"
        :height="400"
        :value="link"
        :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
        :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
        :dotsOptions="{
          type: 'dots',
          color: colors[instance][1],
          gradient: {
            type: 'linear',
            rotation: 0,
            colorStops: [
              { offset: 0, color: colors[instance][0] },
              { offset: 1, color: colors[instance][1] },
            ],
          },
        }"
        :backgroundOptions="{ color: colors[instance][2] }"
        :cornersSquareOptions="{ type: 'square', color: colors[instance][1] }"
        :cornersDotOptions="{ type: undefined, color: colors[instance][3] }"
        fileExt="png"
        :download="false"
        myclass="my-qur p-4 slow-animate transition-colors duration-500 ease-in-out print-size"
        imgclass="img-qr"
      />
    </div>

    <div class="py-4 text-sm px-2 trans">
      <div class="bg-gray-800 p-3 mx-2 fadein learnMore" v-if="learnMore">
        Provide this QRcode or link to your players to join the bracket. After
        scanning this and entering their name, you should see them on the
        {{ $teamPlayer }}
        list. You may adjust how this works in the settings menu -- such as
        whether or not they should be able to invite others, and if they should
        be pushed directly into the bracket.
        <div class="my-4">
          <button
            class="btn btn-secondary btn-sm"
            @click="learnMore = !learnMore"
          >
            Close
          </button>
        </div>
      </div>
      <div v-else>
        <button
          class="btn btn-secondary btn-sm"
          @click="learnMore = !learnMore"
        >
          Learn More
        </button>
      </div>
    </div>
    <!-- :downloadOptions="{ name: 'vqr', extension: 'png' }" -->

    <div class="py-5 no-print">
      <!-- <button
        class="p-3 hover:bg-gray-700 rounded-full"
        :class="darkMode ? 'bg-blue-900' : ''"
        @click="darkMode = !darkMode"
      >
        <SunIcon class="text-white h-6 w-6" />
      </button> -->

      <button class="p-3 hover:bg-gray-700 rounded-full" @click="print()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import QRCodeVue3 from "qrcode-vue3";
import { SunIcon } from "@heroicons/vue/24/solid";
import Link from "@/components/ui/Link.vue";

export default {
  name: "QRCodeVue3Example",
  components: {
    QRCodeVue3,
    SunIcon,
    Link,
  },
  computed: {
    color() {
      return this.darkMode ? this.dark : this.light;
    },
    bracket() {
      return this.$store.getBracket;
    },
    link() {
      return "BracketRat.com/" + this.bracket?.code;
    },
  },
  methods: {
    print() {
      window.print();
    },
  },
  data() {
    return {
      learnMore: false,
      darkMode: true,
      dark: ["#e4f1fe", "#8dc6ff", "#22313f", "#34495e"],
      light: ["#000000", "#000000", "#ffffff", "#000000"],
      colors: [
        ["#e4f1fe", "#8dc6ff", "#22313f", "#34495e"],
        ["#000000", "#000000", "#ffffff", "#000000"],
      ],
    };
  },
};
</script>

<style scoped>
.slow-animate {
  transition: all 1s ease;
  animation: fadeIn 2s;
}

.learnMore {
  margin-top: -140px;
  z-index: 99;
}
</style>
