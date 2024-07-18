<template>
  <div class="relative w-full h-full">
    <div class="absolute hidden w-full bg-gray-50 lg:block h-96"></div>
    <div
      class="relative px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20"
    >
      <div
        class="max-w-xl mb-10 mx-auto md:mx-auto text-center lg:max-w-2xl md:mb-12"
      >
        <h2
          class="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto"
        >
          <span class="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              class="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-gray-400 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="2c67e949-4a23-49f7-bf27-ca140852cf21"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7"></circle>
                </pattern>
              </defs>
              <rect
                fill="url(#2c67e949-4a23-49f7-bf27-ca140852cf21)"
                width="52"
                height="24"
              ></rect>
            </svg>
            <div
              class="relative text-white md:text-gray-200 flex flex-row justify-center lg:text-gray-800"
            >
              Pricing
            </div>
          </span>
        </h2>
        <div class="text-orange-500 text-lg uppercase font-bold">
          *Free Until 2025
        </div>

        <p
          class="text-base sm:text-gray-300 md:text-gray-300 lg:text-gray-800 lg:text-lg"
        >
          <span class="text-orange-500 text-lg uppercase font-bold">*</span
          >&nbsp;While we collect feedback from our active users and build the
          thing up -- we are not charging anything for full access to the
          platform. Users that signup and provide feedback early on will be
          awarded life-time free access to the platform.
        </p>
      </div>
      <div class="grid max-w-screen-md gap-10 md:grid-cols-2 sm:mx-auto">
        <div>
          <div class="p-8 bg-gray-900 rounded border border-1 border-teal-800">
            <div class="mb-4 text-center">
              <p class="text-xl font-medium tracking-wide text-white">
                Basic Plan
              </p>
              <div class="flex items-center justify-center">
                <p class="mr-2 text-5xl font-semibold text-white lg:text-6xl">
                  $0
                </p>
                <p class="text-lg text-gray-500">/ month</p>
              </div>
            </div>
            <ul class="mb-8 space-y-2">
              <li class="flex items-center">
                <div class="mr-3">
                  <svg
                    class="w-4 h-4 text-teal-accent-400"
                    viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-width="2"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      points="6,12 10,16 18,8"
                    ></polyline>
                    <circle
                      cx="12"
                      cy="12"
                      fill="none"
                      r="11"
                      stroke="currentColor"
                    ></circle>
                  </svg>
                </div>
                <p class="font-medium text-gray-300">5-Player Limit</p>
              </li>
              <li class="flex items-center">
                <div class="mr-3">
                  <svg
                    class="w-4 h-4 text-teal-accent-400"
                    viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-width="2"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      points="6,12 10,16 18,8"
                    ></polyline>
                    <circle
                      cx="12"
                      cy="12"
                      fill="none"
                      r="11"
                      stroke="currentColor"
                    ></circle>
                  </svg>
                </div>
                <p class="font-medium text-gray-300">1 bracket</p>
              </li>
              <li>
                <div><p>&nbsp;</p></div>
              </li>
              <li><div>&nbsp;</div></li>
            </ul>
            <button
              type="submit"
              @click="$router.push('/register')"
              class="inline-flex items-center justify-center w-full h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-teal-500 hover:bg-teal-900 focus:shadow-outline focus:outline-none"
            >
              Get Now
            </button>
          </div>
          <div
            class="w-11/12 h-2 mx-auto bg-gray-900 rounded-b opacity-75"
          ></div>
          <div
            class="w-10/12 h-2 mx-auto bg-gray-900 rounded-b opacity-50"
          ></div>
          <div
            class="w-9/12 h-2 mx-auto bg-gray-900 rounded-b opacity-25"
          ></div>
        </div>
        <div>
          <div class="p-8 bg-gray-900 rounded border border-1 border-teal-800">
            <div class="mb-4 text-center">
              <p class="text-xl font-medium tracking-wide text-white">
                Pro Plan
              </p>
              <div class="flex items-center justify-center">
                <p class="mr-2 font-semibold text-white lg:text-6xl">
                  <span class="line-through text-red-500 inline text-5xl mr-2"
                    >$29</span
                  >
                  <span class="text-3xl">$0</span>
                </p>
                <p class="text-lg text-gray-500">/ month</p>
              </div>
            </div>
            <ul class="mb-8 space-y-2">
              <li class="flex items-center">
                <div class="mr-3">
                  <svg
                    class="w-4 h-4 text-teal-accent-400"
                    viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-width="2"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      points="6,12 10,16 18,8"
                    ></polyline>
                    <circle
                      cx="12"
                      cy="12"
                      fill="none"
                      r="11"
                      stroke="currentColor"
                    ></circle>
                  </svg>
                </div>
                <p class="font-medium text-gray-300">
                  Unlimited Players & Teams
                </p>
              </li>
              <li class="flex items-center">
                <div class="mr-3">
                  <svg
                    class="w-4 h-4 text-teal-accent-400"
                    viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-width="2"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      points="6,12 10,16 18,8"
                    ></polyline>
                    <circle
                      cx="12"
                      cy="12"
                      fill="none"
                      r="11"
                      stroke="currentColor"
                    ></circle>
                  </svg>
                </div>
                <p class="font-medium text-gray-300">Unlimited Brackets</p>
              </li>
              <li class="flex items-center">
                <div class="mr-3">
                  <svg
                    class="w-4 h-4 text-teal-accent-400"
                    viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-width="2"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      points="6,12 10,16 18,8"
                    ></polyline>
                    <circle
                      cx="12"
                      cy="12"
                      fill="none"
                      r="11"
                      stroke="currentColor"
                    ></circle>
                  </svg>
                </div>
                <p class="font-medium text-gray-300">All Features</p>
              </li>
              <li class="flex items-center">
                <div class="mr-3">
                  <svg
                    class="w-4 h-4 text-teal-accent-400"
                    viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-width="2"
                  >
                    <polyline
                      fill="none"
                      stroke="currentColor"
                      points="6,12 10,16 18,8"
                    ></polyline>
                    <circle
                      cx="12"
                      cy="12"
                      fill="none"
                      r="11"
                      stroke="currentColor"
                    ></circle>
                  </svg>
                </div>
                <p class="font-medium text-gray-300">Premium Support</p>
              </li>
            </ul>
            <button
              @click="$router.push('/register')"
              type="submit"
              class="inline-flex items-center justify-center w-full h-12 px-6 font-semibold tracking-wide text-white transition duration-200 rounded shadow-md bg-teal-400 hover:bg-teal-700 focus:shadow-outline focus:outline-none"
            >
              Get Now
            </button>
          </div>
          <div
            class="w-11/12 h-2 mx-auto bg-gray-900 rounded-b opacity-75"
          ></div>
          <div
            class="w-10/12 h-2 mx-auto bg-gray-900 rounded-b opacity-50"
          ></div>
          <div
            class="w-9/12 h-2 mx-auto bg-gray-900 rounded-b opacity-25"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
