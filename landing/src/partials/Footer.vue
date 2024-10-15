<script setup>
	const props = defineProps({
		border: Boolean,
	});
</script>

<template>
	<footer>
		<div class="relative mx-auto max-w-6xl px-4 sm:px-6">
			<!-- Footer illustration -->
			<div
				class="pointer-events-none absolute bottom-0 left-1/2 -z-10 -translate-x-1/2"
				aria-hidden="true"
			>
				<img
					class="max-w-none"
					src="../images/footer-illustration.svg"
					width="1076"
					height="378"
					alt="Footer illustration"
				/>
			</div>

			<div
				class="grid grid-cols-2 justify-between gap-12 py-8 sm:grid-rows-[auto_auto] md:grid-cols-4 md:grid-rows-[auto_auto] md:py-12 lg:grid-cols-[repeat(4,minmax(0,140px))_1fr] lg:grid-rows-1 xl:gap-20"
				:class="
					props.border
						? 'border-t [border-image:linear-gradient(to_right,transparent,theme(colors.slate.400/.25),transparent)1]'
						: ''
				"
			>
				<!-- 1st block -->
				<div class="space-y-2">
					<h3 class="text-sm font-medium text-gray-200">Product</h3>
					<ul class="space-y-2 text-sm">
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Features</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Integrations</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Pricing &amp; Plans</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Changelog</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Our method</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>User policy</a
							>
						</li>
					</ul>
				</div>

				<!-- 2nd block -->
				<div class="space-y-2">
					<h3 class="text-sm font-medium text-gray-200">Company</h3>
					<ul class="space-y-2 text-sm">
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>About us</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Diversity &amp; Inclusion</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Blog</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Careers</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Financial statements</a
							>
						</li>
					</ul>
				</div>

				<!-- 3rd block -->
				<div class="space-y-2">
					<h3 class="text-sm font-medium text-gray-200">Resources</h3>
					<ul class="space-y-2 text-sm">
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Community</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Terms of service</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Report a vulnerability</a
							>
						</li>
					</ul>
				</div>

				<!-- 4th block -->
				<div class="space-y-2">
					<h3 class="text-sm font-medium text-gray-200">Content Library</h3>
					<ul class="space-y-2 text-sm">
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Templates</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Tutorials</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Knowledge base</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Learn</a
							>
						</li>
						<li>
							<a
								class="text-indigo-200/65 transition hover:text-indigo-500"
								href="#0"
								>Cookie manager</a
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</footer>
</template>
