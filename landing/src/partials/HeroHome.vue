<script setup>
	import ModalVideo from "./ModalVideo.vue";
	import VideoThumb from "../images/hero-image-01.jpg";
	import VideoSrc from "../videos/video.mp4";
	import Bracket from "./Bracket.vue";
</script>

<template>
	<section>
		<div class="mx-auto max-w-6xl px-4 sm:px-6">
			<!-- Hero content -->
			<div class="py-12 md:py-20">
				<!-- Section header -->
				<div class="pb-12 text-center md:pb-20">
					<h1
						class="font-nacelle animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text pb-5 text-4xl font-semibold text-transparent md:text-5xl"
						data-aos="fade-up"
					>
						Simplified Tournament Brackets
					</h1>
					<div class="mx-auto max-w-3xl">
						<p
							class="mb-8 text-xl text-indigo-200/65"
							data-aos="fade-up"
							data-aos-delay="200"
						>
							With a single click, build single, double-elimination brackets or
							round-robin. Have your players join themselves via QR code!
						</p>
						<div
							class="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
						>
							<div data-aos="fade-up" data-aos-delay="400">
								<a
									class="btn group mb-4 w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
									:href="$registerLink()"
								>
									<span class="relative inline-flex items-center">
										Generate Bracket
										<span
											class="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5"
											>-&gt;</span
										>
									</span>
								</a>
							</div>
							<div data-aos="fade-up" data-aos-delay="600">
								<a
									class="btn relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%] sm:ml-4 sm:w-auto"
									:href="$contactUsLink()"
									>Contact Us</a
								>
							</div>
						</div>
					</div>
				</div>

				<!-- <ModalVideo
          :thumb="VideoThumb"
          :thumbWidth="1104"
          :thumbHeight="576"
          thumbAlt="Modal video thumbnail"
          :video="VideoSrc"
          :videoWidth="1920"
          :videoHeight="1080"
        /> -->
				<div class="bg-slate-950 rounded-lg">
					<Bracket />
				</div>
			</div>
		</div>
	</section>
</template>
