<script setup>
	import Header from "./../partials/Header.vue";
	import PageIllustration from "./../partials/PageIllustration.vue";
	import HeroHome from "./../partials/HeroHome.vue";
	import Workflows from "./../partials/Workflows.vue";
	import Features from "./../partials/Features.vue";
	import SplitCarousel from "./../partials/SplitCarousel.vue";
	import PricingHome from "./../partials/PricingHome.vue";
	import Cta from "./../partials/Cta.vue";
	import Footer from "./../partials/Footer.vue";
</script>

<template>
	<div
		class="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip"
	>
		<!-- Site header -->
		<!-- <Header /> -->

		<!-- Page content -->
		<main class="relative grow">
			<!-- Page illustration -->
			<PageIllustration />

			<!-- Page sections -->
			<HeroHome />
			<Workflows />
			<!-- <Features />
			<SplitCarousel />
			<PricingHome /> -->
			<Cta />
		</main>

		<!-- Site footer -->
		<Footer />
	</div>
</template>
