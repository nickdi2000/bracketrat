<template>
	<div class="fadeInUp wrapper shrink-on-mobile">
		<div class="item">
			<div class="item-parent">
				<p>Jordan</p>
			</div>
			<div class="item-childrens">
				<div class="item-child">
					<div class="item">
						<div class="item-parent">
							<p>Alex</p>
						</div>
						<div class="item-childrens">
							<div class="item-child">
								<div class="item">
									<div class="item-parent">
										<p>Casey</p>
									</div>
									<div class="item-childrens">
										<div class="item-child">
											<p>Casey</p>
										</div>
										<div class="item-child">
											<p>Cameron</p>
										</div>
									</div>
								</div>
							</div>
							<div class="item-child">
								<p>Alex</p>
							</div>
						</div>
					</div>
				</div>
				<div class="item-child">
					<div class="item">
						<div class="item-parent">
							<p>Jordan</p>
						</div>
						<div class="item-childrens">
							<div class="item-child">
								<div class="item">
									<div class="item-parent">
										<p>Jordan</p>
									</div>
									<div class="item-childrens">
										<div class="item-child">
											<p>Jordan</p>
										</div>
										<div class="item-child">
											<p>Dylan</p>
										</div>
									</div>
								</div>
							</div>
							<div class="item-child">
								<p>April</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	$side-margin: 50px;
	$vertical-margin: 10px;

	.wrapper {
		display: flex;
		height: 600px;
		justify-content: center;
	}

	.item {
		display: flex;
		flex-direction: row-reverse;
		p {
			padding: 20px;
			margin: 0;
			background-color: Beige;
			@apply bg-gradient-to-r from-blue-500 to-purple-500 py-3 px-6 rounded-lg shadow-lg text-lg font-semibold cursor-pointer text-white hover:from-blue-600 hover:to-purple-600;
		}

		&-parent {
			position: relative;
			margin-left: $side-margin;
			display: flex;
			align-items: center;
			&:after {
				position: absolute;
				content: "";
				width: $side-margin/2;
				height: 2px;
				left: 0;
				top: 50%;
				background-color: #fff;
				transform: translateX(-100%);
			}
		}
		&-childrens {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		&-child {
			display: flex;
			align-items: flex-start;
			justify-content: flex-end;
			margin-top: $vertical-margin;
			margin-bottom: $vertical-margin;
			position: relative;

			&:before {
				content: "";
				position: absolute;
				background-color: #fff;
				right: 0;
				top: 50%;
				transform: translateX(100%);
				width: 25px;
				height: 2px;
			}
			&:after {
				content: "";
				position: absolute;
				background-color: #fff;
				right: -$side-margin / 2;
				height: calc(50% + 22px);
				width: 2px;
				top: 50%;
			}
			&:last-child {
				&:after {
					transform: translateY(-100%);
				}
			}
			&:only-child:after {
				display: none;
			}
		}
	}

	/*smaller screens */

	@media (max-width: 568px) {
		.shrink-on-mobile {
			transform: scale(0.6);
		}
	}
</style>
