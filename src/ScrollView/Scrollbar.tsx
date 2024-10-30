const { Skia, RoundedRect } =
	require("@shopify/react-native-skia/src/") as typeof import("@shopify/react-native-skia/lib/typescript/src/");

import type { ScrollGestureState } from "./ScrollGesture";
import { useDerivedValue, withTiming, runOnUI, runOnJS, makeMutable } from "react-native-reanimated";
import * as Interpolate from "../Util/Interpolate";
import { Gesture, type GestureType } from "react-native-gesture-handler";
import { clearAnimatedTimeout, setAnimatedTimeout } from "../Util/timeout";
const { interpolateClamp } = Interpolate;

function getHapticsModule() {
	try {
		const Haptics = require("expo-haptics");
		return () => Haptics.impactAsync("heavy");
	} catch (error) {}
	try {
		const Haptics = require("react-native-haptic-feedback");

		return () => Haptics.trigger("impactHeavy", { ignoreAndroidSystemSettings: true });
	} catch (error) {}
	console.warn("[SkiaList] No haptics module found, please install `expo-haptics` or `react-native-haptic-feedback`");
	return () => {};
}

const vibrate = getHapticsModule();

const primary = Skia.Paint();
primary.setColor(Skia.Color("rgb(91, 128, 218)"));

const grey = Skia.Paint();
grey.setColor(Skia.Color("rgb(226, 226, 226)"));

/** */
export type ScrollbarProps = ScrollGestureState & {
	redraw: () => void;
	startedAnimation: () => void;
	finishedAnimation: () => void;
};

/** */
export type ScrollbarState = {
	gesture: GestureType;
	Scrollbar: () => JSX.Element;
};

export function getScrollbar(state: ScrollbarProps): ScrollbarState {
	const {
		layout,
		scrollY,
		maxHeight,
		redraw,
		startMomentumScroll,
		inverted,
		invertedFactor,
		startedAnimation,
		finishedAnimation,
	} = state;
	const visible = makeMutable(0);
	const dragging = makeMutable(0);
	const beginY = makeMutable(0);
	const timeout = makeMutable<number | undefined>(undefined);

	runOnUI(() => {
		dragging.addListener(1, () => redraw());
		visible.addListener(1, () => redraw());
		scrollY.addListener(3, () => {
			requestAnimationFrame(() => {
				if (visible.value === 0) {
					startedAnimation();
					visible.value = withTiming(1, { duration: 200 }, finishedAnimation as any);
				}
				if (timeout.value) {
					clearAnimatedTimeout(timeout.value);
					timeout.value = undefined;
				}
				timeout.value = setAnimatedTimeout(() => {
					if (dragging.value === 1) return;
					startedAnimation();
					visible.value = withTiming(0, { duration: 200 }, finishedAnimation as any);
				}, 1000);
			});
		});
	})();

	const gesture = Gesture.Pan()
		.onTouchesDown((e, state) => {
			startedAnimation();

			const [touch] = e.allTouches;
			if (!touch) return;

			if (touch.x < layout.value.width - 30) {
				state.fail();
			} else {
				state.activate();
				state.begin();

				visible.value = withTiming(1, { duration: 200 });
				dragging.value = withTiming(1, { duration: 200 });
				runOnJS(vibrate)();
				beginY.value = scrollY.value / maxHeight.value;
			}
		})
		.onTouchesUp((_, state) => {
			state.end();

			startedAnimation();
			dragging.value = withTiming(0, { duration: 200 }, finishedAnimation as any);

			if (timeout.value) {
				clearAnimatedTimeout(timeout.value);
				timeout.value = undefined;
			}

			timeout.value = setAnimatedTimeout(() => {
				if (dragging.value === 1) return;
				startedAnimation();
				visible.value = withTiming(0, { duration: 200 }, finishedAnimation as any);
			}, 1000);
		})
		.manualActivation(true)
		.onChange((e) => {
			const dragPercentage = (e.translationY * invertedFactor) / layout.value.height;
			const newPercentage = beginY.value + dragPercentage;
			const yValue = newPercentage * maxHeight.value;
			scrollY.value = yValue;
		})
		.onEnd((e) => {
			const percentage = Math.max(maxHeight.value / layout.value.height, 1);
			startMomentumScroll(e.velocityY * percentage * invertedFactor);
		})
		.onFinalize(() => {
			finishedAnimation();
		});

	function Scrollbar() {
		const trackWidth = useDerivedValue(() => {
			return interpolateClamp(dragging.value, 0, 1, 5, 10);
		});
		const trackX = useDerivedValue(() => layout.value.width - trackWidth.value - 1);
		const baseScrollHeight = 70;
		const minScrollHeight = 10;
		const scrollBarHeight = useDerivedValue(() => {
			const scroll = scrollY.value;
			const max = maxHeight.value;
			const percentage = Math.max(maxHeight.value / layout.value.height, 1);
			const base = Math.max((baseScrollHeight / percentage) * 8, minScrollHeight * 4);
			if (scroll <= 0) {
				return base - Math.min(Math.pow(-scroll, 0.8), base - minScrollHeight);
			} else if (scroll >= max) {
				return base - Math.min(Math.pow(scroll - max, 0.8), base - minScrollHeight);
			}
			return base;
		});
		const y = useDerivedValue(() => {
			const percentage = scrollY.value / maxHeight.value;
			const end = layout.value.height - scrollBarHeight.value;

			const result = Math.min(Math.max(percentage * end, 0), end);
			return inverted ? layout.value.height - result - scrollBarHeight.value : result;
		});

		return (
			<RoundedRect
				opacity={visible}
				r={20}
				x={trackX}
				y={y}
				width={trackWidth}
				height={scrollBarHeight}
				color="grey"
			/>
		);
	}

	return {
		gesture,
		Scrollbar: Scrollbar,
	};
}
