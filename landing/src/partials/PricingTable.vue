<script setup>
import { ref } from "vue";

const isAnnual = ref(true);
</script>

<template>
  <div>
    <!-- Pricing toggle -->
    <label
      class="mb-16 flex cursor-pointer items-center justify-center gap-4 text-indigo-200/65"
    >
      <span class="flex-1 text-right" aria-hidden="true">Billed Annually</span>
      <span class="sr-only">Billed Annually</span>
      <input
        role="switch"
        type="checkbox"
        class="peer sr-only"
        v-model="isAnnual"
        :checked="isAnnual"
      />
      <div
        class="peer relative h-6 w-11 rounded-full bg-gray-800 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-gray-200 after:transition-all peer-checked:bg-indigo-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-200"
        aria-hidden="true"
      ></div>
      <span class="flex-1 text-left" aria-hidden="true">Billed Monthly</span>
    </label>

    <div
      class="mx-auto grid max-w-xs items-start gap-8 md:max-w-2xl md:grid-cols-2 xl:max-w-none xl:grid-cols-4 xl:gap-6"
    >
      <!-- Pricing table 1 -->
      <div
        class="relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
      >
        <div
          class="relative mb-4 border-b pb-5 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1]"
        >
          <div class="font-nacelle mb-2 text-[1rem] text-gray-200">
            Freelancer
          </div>
          <div class="font-nacelle mb-1.5 flex items-baseline">
            <span class="text-2xl text-indigo-200/65">$</span>
            <span class="text-4xl font-semibold tabular-nums text-gray-200">{{
              isAnnual ? 7 : 9
            }}</span>
          </div>
          <div class="mb-4 grow text-xs text-indigo-200/65">
            Per user/month, billed annually.
          </div>
          <a
            class="btn-sm relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
            href="#0"
            >Start free trial</a
          >
        </div>
        <p class="mb-4 text-sm italic text-gray-200">Freelancer includes:</p>
        <ul class="grow space-y-2 text-sm text-indigo-200/65">
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>50 users per month</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Email, Live Chat, WhatsApp</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Unlimited dashboards</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Custom integrations</span>
          </li>
        </ul>
      </div>

      <!-- Pricing table 2 -->
      <div
        class="relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
      >
        <div
          class="relative mb-4 border-b pb-5 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1]"
        >
          <div class="font-nacelle mb-2 text-[1rem] text-gray-200">
            Small Team
          </div>
          <div class="font-nacelle mb-1.5 flex items-baseline">
            <span class="text-2xl text-indigo-200/65">$</span>
            <span class="text-4xl font-semibold tabular-nums text-gray-200">{{
              isAnnual ? 27 : 29
            }}</span>
          </div>
          <div class="mb-4 grow text-xs text-indigo-200/65">
            Per user/month, billed annually.
          </div>
          <a
            class="btn-sm relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
            href="#0"
            >Start free trial</a
          >
        </div>
        <p class="mb-4 text-sm italic text-gray-200">
          Everything in Freelancer, plus:
        </p>
        <ul class="grow space-y-2 text-sm text-indigo-200/65">
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>No seat limits</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Real-time space syncing</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Automatic data enrichment</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Custom billing</span>
          </li>
        </ul>
      </div>

      <!-- Pricing table 3 -->
      <div
        class="relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.indigo.500/.5),theme(colors.indigo.500),theme(colors.indigo.500/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
      >
        <div
          class="relative mb-4 border-b pb-5 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1]"
        >
          <div
            class="absolute right-0 top-0 inline-flex items-center rounded-full bg-indigo-500/[.15] px-2 py-0.5 text-xs font-medium text-indigo-500 shadow-sm"
          >
            Popular
          </div>
          <div class="font-nacelle mb-2 text-[1rem] text-gray-200">
            Business
          </div>
          <div class="font-nacelle mb-1.5 flex items-baseline">
            <span class="text-2xl text-indigo-200/65">$</span>
            <span class="text-4xl font-semibold tabular-nums text-gray-200">{{
              isAnnual ? 47 : 49
            }}</span>
          </div>
          <div class="mb-4 grow text-xs text-indigo-200/65">
            Per user/month, billed annually.
          </div>
          <a
            class="btn-sm w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
            href="#0"
            >Start free trial</a
          >
        </div>
        <p class="mb-4 text-sm italic text-gray-200">
          Everything in Small Team, plus:
        </p>
        <ul class="grow space-y-2 text-sm text-indigo-200/65">
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Adjustable permissions</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Unlimited reporting</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Bulk email sending</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Priority support</span>
          </li>
        </ul>
      </div>

      <!-- Pricing table 4 -->
      <div
        class="relative flex h-full flex-col rounded-2xl bg-gradient-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-sm before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
      >
        <div
          class="relative mb-4 border-b pb-5 [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1]"
        >
          <div class="font-nacelle mb-2 text-[1rem] text-gray-200">
            Enterprise Team
          </div>
          <div class="font-nacelle mb-1.5 flex items-baseline">
            <span class="text-2xl text-indigo-200/65">$</span>
            <span class="text-4xl font-semibold tabular-nums text-gray-200">{{
              isAnnual ? 87 : 89
            }}</span>
          </div>
          <div class="mb-4 grow text-xs text-indigo-200/65">
            Per user/month, billed annually.
          </div>
          <a
            class="btn-sm relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]"
            href="#0"
            >Start free trial</a
          >
        </div>
        <p class="mb-4 text-sm italic text-gray-200">
          Everything in Business, plus:
        </p>
        <ul class="grow space-y-2 text-sm text-indigo-200/65">
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Strongest connection</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>First calendar interaction</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Historical attributes</span>
          </li>
          <li class="flex items-center">
            <svg
              class="mr-2 h-3 w-3 shrink-0 fill-current text-indigo-500"
              viewBox="0 0 12 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z"
              />
            </svg>
            <span>Time comparisons</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
