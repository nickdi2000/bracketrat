<script setup>
import { ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

const modalOpen = ref(false);
const videoRef = ref(null);

watch(videoRef, () => {
  videoRef.value?.play();
});

const props = defineProps({
  thumb: String,
  thumbWidth: Number,
  thumbHeight: Number,
  thumbAlt: String,
  video: String,
  videoWidth: Number,
  videoHeight: Number,
});
</script>

<template>
  <div class="relative">
    <!-- Secondary illustration -->
    <div
      class="pointer-events-none absolute bottom-8 left-1/2 -z-10 -ml-28 -translate-x-1/2 translate-y-1/2"
      aria-hidden="true"
    >
      <img
        class="md:max-w-none"
        src="../images/secondary-illustration.svg"
        width="1165"
        height="1012"
        alt="Secondary illustration"
      />
    </div>

    <!-- Video thumbnail -->
    <button
      class="group relative flex items-center justify-center rounded-2xl focus:outline-none focus-visible:ring focus-visible:ring-indigo-200"
      @click="modalOpen = true"
      aria-label="Watch the video"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <figure
        class="relative overflow-hidden rounded-2xl before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-gray-900 before:via-indigo-500/20 before:to-gray-900"
      >
        <img
          class="opacity-50 grayscale"
          :src="props.thumb"
          :width="props.thumbWidth"
          :height="props.thumbHeight"
          :alt="props.thumbAlt"
        />
      </figure>
      <!-- Play icon -->
      <span
        class="pointer-events-none absolute p-2.5 before:absolute before:inset-0 before:rounded-full before:bg-gray-950 before:duration-300 group-hover:before:scale-110"
      >
        <span class="relative flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
          >
            <path
              fill="url(#pla)"
              fill-rule="evenodd"
              d="M10 20c5.523 0 10-4.477 10-10S15.523 0 10 0 0 4.477 0 10s4.477 10 10 10Zm3.5-10-5-3.5v7l5-3.5Z"
              clip-rule="evenodd"
            />
            <defs>
              <linearGradient
                id="pla"
                x1="10"
                x2="10"
                y1="0"
                y2="20"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#6366F1" />
                <stop offset="1" stop-color="#6366F1" stop-opacity=".72" />
              </linearGradient>
            </defs>
          </svg>
          <span class="text-sm font-medium leading-tight text-gray-300"
            >Watch Demo
            <span class="text-gray-600"> - </span>
            3:47</span
          >
        </span>
      </span>
    </button>
    <!-- End: Video thumbnail -->

    <TransitionRoot :show="modalOpen" as="template">
      <Dialog :initialFocus="videoRef" @close="modalOpen = false">
        <!-- Modal backdrop -->
        <TransitionChild
          className="fixed inset-0 z-[99999] bg-black/70 transition-opacity"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          aria-hidden="true"
        />
        <!-- End: Modal backdrop -->

        <!-- Modal dialog -->
        <TransitionChild
          className="fixed inset-0 z-[99999] flex px-4 py-6 sm:px-6"
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-75"
          enterTo="opacity-100 scale-100"
          leave="transition ease-out duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <div class="mx-auto flex h-full max-w-6xl items-center">
            <DialogPanel
              class="aspect-video max-h-full w-full overflow-hidden rounded-2xl bg-black shadow-2xl"
            >
              <video ref="videoRef" width="1920" height="1080" loop controls>
                <source
                  :src="props.video"
                  :width="props.videoWidth"
                  :height="props.videoHeight"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </DialogPanel>
          </div>
        </TransitionChild>
        <!-- End: Modal dialog -->
      </Dialog>
    </TransitionRoot>
  </div>
</template>
