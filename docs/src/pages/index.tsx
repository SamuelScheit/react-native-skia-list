import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import styles from "./index.module.css";

export default function Home(): JSX.Element {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout wrapperClassName="main">
			<div className="bg-white dark:bg-black">
				<div className="min-h-[100vh] flex flex-col justify-center items-center px-8 py-20">
					<div
						className={
							"grid justify-center gap-8 text-center text-xl font-semibold leading-4 " + styles.grid
						}
					>
						<div id={styles.bidirectional} className={styles.card}>
							<div>Maintain scroll position during</div>
							<div
								style={{
									backgroundImage: `linear-gradient(30deg, #00c5ff, #00cfb7)`,
								}}
								className={styles.big}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<defs>
										<linearGradient id="green-gradient" x2="2" y2="1">
											<stop offset="0%" stop-color="#00c5ff" />
											<stop offset="100%" stop-color="#00cfb7" />
										</linearGradient>
									</defs>
									<g fill="none">
										<path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
										<path
											fill="url(#green-gradient)"
											d="M13 2a6 6 0 0 1 5.996 5.775L19 8v8a6 6 0 0 1-5.775 5.996L13 22h-2a6 6 0 0 1-5.996-5.775L5 16V8a6 6 0 0 1 5.775-5.996L11 2zm0 2h-2a4 4 0 0 0-3.995 3.8L7 8v8a4 4 0 0 0 3.8 3.995L11 20h2a4 4 0 0 0 3.995-3.8L17 16V8a4 4 0 0 0-3.8-3.995zm-1 2a1 1 0 0 1 .993.883L13 7v4a1 1 0 0 1-1.993.117L11 11V7a1 1 0 0 1 1-1"
										/>
									</g>
								</svg>
								Bidirectional
							</div>
							<div>scrolling and updating</div>
						</div>

						<div id={styles.keyboard} className={styles.card}>
							<div>Automatic</div>
							<div
								style={{
									backgroundImage: `linear-gradient(30deg, #342dff, #00c5ff)`,
								}}
								className={styles.big}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<defs>
										<linearGradient id="blue-gradient" x2="2" y2="1">
											<stop offset="0%" stop-color="#342dff" />
											<stop offset="100%" stop-color="#00c5ff" />
										</linearGradient>
									</defs>
									<path
										fill="url(#blue-gradient)"
										d="M4.616 18q-.691 0-1.153-.462T3 16.384V7.616q0-.691.463-1.153T4.615 6h14.77q.69 0 1.152.463T21 7.616v8.769q0 .69-.463 1.153T19.385 18zm3.615-2.23h7.538v-1.54H8.231zm-3-3h1.538v-1.54H5.231zm3 0h1.538v-1.54H8.231zm3 0h1.538v-1.54h-1.538zm3 0h1.538v-1.54h-1.538zm3 0h1.538v-1.54h-1.538zm-12-3h1.538V8.23H5.231zm3 0h1.538V8.23H8.231zm3 0h1.538V8.23h-1.538zm3 0h1.538V8.23h-1.538zm3 0h1.538V8.23h-1.538z"
									/>
								</svg>
								Keyboard
							</div>
							<div>adjustment</div>
						</div>
						<div id={styles.hero} className={" justify-center !py-14 !px-24 gap-3 " + styles.card}>
							<h1
								style={{
									backgroundImage: `linear-gradient(45deg, #ff00ad 0%, #c109ff 5%, #5d00ff 20%, #342dff 30%, #0079ff 40%, #00c5ff 70%, #00cfb7 80%)`,
								}}
								className="text-6xl text-center gap-2 flex flex-col items-center text-transparent bg-clip-text"
							>
								<div className="inline-block text-transparent bg-clip-text">Skia List</div>
								<div className="text-3xl text-black dark:text-white bg-transparent">for</div>
								<div className="inline-block text-transparent bg-clip-text">React Native</div>
							</h1>

							<div className="font-bold">The fastest react-native list renderer</div>
						</div>
						<div id={styles.gesture} className={styles.card}>
							<div>Customizable</div>
							<div
								style={{
									backgroundImage: `linear-gradient(30deg, #342dff, #00c5ff)`,
								}}
								className={styles.big}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<defs>
										<linearGradient id="green-gradient" x2="2" y2="1">
											<stop offset="0%" stop-color="#00c5ff" />
											<stop offset="100%" stop-color="#00cfb7" />
										</linearGradient>
									</defs>
									<path
										fill="url(#blue-gradient)"
										d="M11 2.5a5 5 0 0 1 3.985 8.02h-1.23V7.566a2.756 2.756 0 1 0-5.511 0v4.107A5 5 0 0 1 11 2.5m5.911 8.75a7 7 0 1 0-8.667 2.686v1.168l-2.145-.477a1.88 1.88 0 0 0-1.971.792l-.941 1.412l4.298 5.592a2.76 2.76 0 0 0 2.185 1.076h7.086c1.187 0 2.24-.76 2.615-1.885l1.783-5.35a2.76 2.76 0 0 0-1.226-3.253zM11 6.81c.417 0 .755.338.755.756v4.954h3.159a.76.76 0 0 1 .381.103l3.625 2.115c.309.18.45.553.336.893l-1.782 5.35a.76.76 0 0 1-.718.518H9.67a.76.76 0 0 1-.6-.295l-3.425-4.456l.1-.15l4.499 1V7.565c0-.418.338-.756.756-.756"
									/>
								</svg>
								Gesture
							</div>
							<div>handling</div>
						</div>

						<div id={styles.performance} className={styles.card}>
							<div>Up to</div>
							<div
								style={{
									backgroundImage: `linear-gradient(30deg, #ff00ad, #c109ff)`,
								}}
								className={styles.big}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
									<defs>
										<linearGradient id="pink-gradient" x2="0.35" y2="1">
											<stop offset="0%" stop-color="#ff00ad" />
											<stop offset="100%" stop-color="#c109ff" />
										</linearGradient>
									</defs>
									<path
										fill="url(#pink-gradient)"
										d="M10.45 15.5q.6.6 1.55.588t1.4-.688L19 7l-8.4 5.6q-.675.45-.712 1.375t.562 1.525M12 4q1.475 0 2.838.412T17.4 5.65l-1.9 1.2q-.825-.425-1.712-.637T12 6Q8.675 6 6.337 8.338T4 14q0 1.05.288 2.075T5.1 18h13.8q.575-.95.838-1.975T20 13.9q0-.9-.213-1.75t-.637-1.65l1.2-1.9q.75 1.175 1.188 2.5T22 13.85t-.325 2.725t-1.025 2.475q-.275.45-.75.7t-1 .25H5.1q-.525 0-1-.25t-.75-.7q-.65-1.125-1-2.387T2 14q0-2.075.788-3.887t2.15-3.175t3.187-2.15T12 4m.175 7.825"
									/>
								</svg>
								10x
							</div>
							<div>faster then FlatList</div>
						</div>

						<div id={styles.rendering} className={styles.card}>
							<div>Customizable</div>
							<div
								style={{
									backgroundImage: `linear-gradient(30deg, #c109ff, #342dff)`,
								}}
								className={styles.big}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32">
									<defs>
										<linearGradient id="purple-gradient" x2="2" y2="1">
											<stop offset="0%" stop-color="#c109ff" />
											<stop offset="100%" stop-color="#342dff" />
										</linearGradient>
									</defs>
									<path
										fill="url(#purple-gradient)"
										d="m20.152 16l4.9-8.461L27.42 16l-2.368 8.46zm-2.388 1.374l4.9 8.46l-8.534-2.186l-6.166-6.273Zm4.9-11.21l-4.9 8.461h-9.8l6.166-6.273zm7 6.957L26.669 2L15.511 4.98l-1.652 2.9l-3.351-.02L2.341 16l8.167 8.139l3.35-.025l1.654 2.9L26.669 30l2.989-11.119L27.961 16l1.7-2.879Z"
									/>
								</svg>
								Rendering
							</div>
							<div>pipeline</div>
						</div>

						<div id={styles.animations} className={styles.card}>
							<div>Layout</div>
							<div
								style={{
									backgroundImage: `linear-gradient(30deg, #c109ff, #342dff)`,
								}}
								className={styles.big}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="0.96em" height="1em" viewBox="0 0 24 25">
									<defs>
										<linearGradient id="green-gradient" x2="2" y2="1">
											<stop offset="0%" stop-color="#00c5ff" />
											<stop offset="100%" stop-color="#00cfb7" />
										</linearGradient>
									</defs>
									<path
										fill="url(#purple-gradient)"
										d="m11.41.06l3.716 6.174l7.02 1.626l-4.724 5.44l.623 7.18l-6.635-2.812l-6.634 2.811l.623-7.178L.676 7.86l7.02-1.626zm0 3.88L8.972 7.99L4.365 9.058l3.1 3.572l-.41 4.711l4.355-1.845l4.355 1.845l-.409-4.711l3.1-3.572l-4.607-1.067zm9.453 10.071l2.475 2.475l-1.414 1.414l-2.475-2.474zm-8.296 6.116l2.474 2.475l-1.414 1.414l-2.475-2.475zm6.578 0l2.474 2.475l-1.414 1.414l-2.475-2.475z"
									/>
								</svg>
								Animations
							</div>
							<div>on data changes</div>
						</div>
					</div>
				</div>
				<div className="flex justify-center py-20">
					<Link
						style={{
							backgroundImage: `linear-gradient(50deg, #5d00ff 0%, #342dff 25%, #0079ff 50%, #00c5ff 75%)`,
						}}
						className="bg-gradient-to-l !text-white text-xl font-bold py-3 px-5 rounded-lg !no-underline  bg-pos-0 hover:bg-pos-100 bg-size-200 transition-all duration-300 ease-in-out"
						to="/docs/intro"
					>
						Get Started
					</Link>
				</div>
			</div>
		</Layout>
	);
}
