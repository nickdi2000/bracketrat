<script setup>
const props = defineProps(["testimonial", "category"]);
</script>

<template>
  <article
    class="relative rounded-2xl bg-gradient-to-br from-gray-900/50 via-gray-800/25 to-gray-900/50 p-5 backdrop-blur-sm transition-opacity before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]"
    :class="
      !props.testimonial.categories.includes(props.category) && 'opacity-30'
    "
    :inert="!props.testimonial.categories.includes(props.category)"
  >
    <div class="flex flex-col gap-4">
      <div>
        <img :src="props.testimonial.clientImg" height="36" alt="Client Logo" />
      </div>
      <p class="text-indigo-200/65 before:content-['“'] after:content-['“']">
        <slot />
      </p>
      <div class="flex items-center gap-3">
        <img
          class="inline-flex shrink-0 rounded-full"
          :src="props.testimonial.img"
          width="36"
          height="36"
          :alt="props.testimonial.name"
        />
        <div class="text-sm font-medium text-gray-200">
          <span>{{ props.testimonial.name }}</span>
          <span class="text-gray-700"> - </span>
          <a
            class="text-indigo-200/65 transition-colors hover:text-indigo-500"
            :href="props.testimonial.company"
            >{{ props.testimonial.company }}</a
          >
        </div>
      </div>
    </div>
  </article>
</template>
