import { PixelRatio, View, Text, TouchableOpacity, Platform } from "react-native";
import { Canvas, useCanvasEffect } from "react-native-wgpu";
import { type SkCanvas, Skia, type SkiaContext } from "@shopify/react-native-skia";
import { cancelAnimation, clamp, runOnUI, useFrameCallback, useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getRandomMessage } from "../src/MessageList/randomMessage";
import { withDecay } from "../../src/Util/Decay";
import type { MessageItem } from "../src/MessageList/State";
import { Canvas as SkiaCanvas } from "@shopify/react-native-skia";

const black = Skia.Color("#000");
const blackPaint = Skia.Paint();
blackPaint.setColor(black);

export default function WGPU() {
	const i = useSharedValue(0);
	const y = useSharedValue(0);
	const offsetY = useSharedValue(0);
	const maxHeight = useSharedValue(-100000);
	const invertedFactor = useSharedValue(1);
	const firstRenderIndex = useSharedValue(0);
	const firstRenderHeight = useSharedValue(0);
	const x = useSharedValue(0);
	const touchX = useSharedValue(0);
	const touchY = useSharedValue(0);
	const took = useSharedValue(0);
	const maxTook = useSharedValue(0);
	const heights = useSharedValue({} as Record<string, number>);
	const dpi = PixelRatio.get();
	const safeArea = useSharedValue(useSafeAreaInsets());

	const data = useSharedValue(
		new Array(1000).fill(0).map((x, i) => {
			return getRandomMessage({ my_user_id: "0", i });
		})
	);

	const context = useSharedValue<SkiaContext | null>(null);
	const ref = useCanvasEffect(() => {
		const nativeSurface = ref.current!.getNativeSurface();

		if (Platform.OS === "android") {
			var ctx = Skia.Context(nativeSurface.surface, nativeSurface.width * dpi, nativeSurface.height * dpi);
		} else {
			var ctx = Skia.Context(nativeSurface.surface, nativeSurface.width, nativeSurface.height);
		}
		context.value = ctx;

		runOnUI(() => {
			"worklet";

			let previous = 0;

			y.addListener(1, () => {
				const now = performance.now();

				draw();

				previous = now;
			});

			draw();
		})();

		return () => {
			runOnUI(() => {
				y.removeListener(1);
			})();
		};
	});

	const paragraph = Skia.ParagraphBuilder.Make({
		textStyle: {
			fontSize: 24,
			fontFamilies: ["Arial"],
		},
	})
		.addText("Hello, World!")
		.build();

	const windowSize = 0;

	function drawItem(canvas: SkCanvas | undefined, item: MessageItem, rowY: number) {
		"worklet";
		let height = 20;

		if (item.text) {
			item.text.layout(300);
			if (canvas) {
				item.text.paint(canvas, 50, rowY);
			}
			height += item.text.getHeight();
		}

		return 100;
	}

	// useFrameCallback(() => {
	function draw() {
		"worklet";

		const ctx = context.value;
		if (!ctx) return;

		i.value++;

		const surface = ctx.getSurface();
		let start = performance.now();

		const width = surface.width() / dpi;
		const height = surface.height() / dpi;

		// const info = {
		// 	width: surface.width() / dpi,
		// 	height: surface.height() / dpi,
		// };

		const canvas = surface.getCanvas();

		canvas.clear(Skia.Color("#fff"));
		canvas.save();

		canvas.scale(dpi, dpi);

		canvas.drawCircle(touchX.value, touchY.value, 10, blackPaint);

		canvas.translate(x.value, y.value);

		let rowY = 0;

		for (let index = firstRenderIndex.value - 1; index > 0; index--) {
			const item = data.value[index];
			if (!item) continue;

			let itemHeight = drawItem(undefined, item, rowY);

			rowY -= itemHeight;

			firstRenderIndex.value = index;
			firstRenderHeight.value = rowY;

			if (rowY - windowSize + itemHeight > -y.value) break; // out of upper view
		}

		rowY = firstRenderHeight.value;

		for (let index = firstRenderIndex.value; index < data.value.length; index++) {
			const item = data.value[index];
			if (!item) continue;

			let itemHeight = drawItem(canvas, item, rowY);

			rowY += itemHeight;

			console.log("index", index, rowY, height, -y.value);

			if (rowY - height + windowSize >= -y.value) break; // out of lower view
			if (rowY - windowSize + itemHeight < -y.value) {
				// out of upper view
				firstRenderIndex.value = index - 1;
				firstRenderHeight.value = rowY - itemHeight;
				continue;
			}
		}

		const diff = performance.now() - start;

		canvas.restore();
		surface.dispose();

		ctx.present();

		took.value += diff;

		maxTook.value = Math.max(maxTook.value, diff);
		if (diff > 8) {
		}
		console.log("diff", diff);
	}

	// 	draw();
	// }, true);

	const decelerationRate = 0.998;
	const bounces = true;

	function onEndClamp() {
		"worklet";

		const val = clamp(y.value, maxHeight.value - offsetY.value, 0);

		if (!bounces && (y.value === maxHeight.value - offsetY.value || y.value === 0)) return true;

		if (y.value === val || maxHeight.value - offsetY.value === 0) {
			return false;
		}

		y.value = withSpring(val, { stiffness: 80, damping: 10, mass: 0.2 });
		return true;
	}

	const previous = useSharedValue(0);

	const gesture = Gesture.Pan()
		.onBegin((e) => {
			cancelAnimation(y);
		})
		.onStart((e) => {})
		.onChange((e) => {
			y.value += e.changeY;
			touchX.value = e.x;
			touchY.value = e.y;

			previous.value = performance.now();

			// draw();
		})
		.onEnd((e) => {
			if (onEndClamp()) return;

			y.value = withDecay(
				{
					velocity: e.velocityY * invertedFactor.value,
					deceleration: decelerationRate,
					clamp: [maxHeight.value - offsetY.value, 0],
				},
				(finished, animation: any) => {
					"worklet";

					if (((finished && y.value === maxHeight.value - offsetY.value) || y.value === 0) && bounces) {
						const newValue = y.value + animation.initialVelocity * animation.velocity * 0.03;
						y.value = withSpring(newValue, { dampingRatio: 2, duration: 100 }, () => {
							onEndClamp();
						});
					} else {
						onEndClamp();
					}
				}
			);
		})
		.onFinalize((success) => {
			if (!success) {
				onEndClamp();
			}
		});

	return (
		<View style={{ flex: 1, paddingLeft: 10 }}>
			<SkiaCanvas children={<></>} style={{ flex: 0 }} />
			<GestureDetector gesture={gesture}>
				<Canvas ref={ref} style={{ flex: 1 }} />
			</GestureDetector>
		</View>
	);
}
