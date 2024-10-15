import { Rect, Skia, RoundedRect, Group } from "@shopify/react-native-skia";
import type { ScrollGestureState } from "./ScrollGesture";
import { useDerivedValue, withTiming, runOnUI, runOnJS, makeMutable } from "react-native-reanimated";
import { interpolate, interpolateBackoff, interpolateClamp, interpolateOutside } from "./Interpolate";
import { Gesture } from "react-native-gesture-handler";
import { trigger as vibrate } from "react-native-haptic-feedback";
import { debounce, throttle } from "../Util/timing";

const primary = Skia.Paint();
primary.setColor(Skia.Color("rgb(91, 128, 218)"));

const grey = Skia.Paint();
grey.setColor(Skia.Color("rgb(226, 226, 226)"));

export function getScrollbar(state: ScrollGestureState & { redraw: Function }) {
	const { layout, scrollY, maxHeight, redraw, startMomentumScroll } = state;
	const visible = makeMutable(0);
	const dragging = makeMutable(0);
	const beginY = makeMutable(0);

	const onScroll = throttle(function onScroll() {
		console.log("scroll");
		visible.value = withTiming(1, { duration: 200 });
	}, 500);

	const onScrollEnd = debounce(function onScrollEnd() {
		console.log("scroll end");
		if (dragging.value !== 1) {
			visible.value = withTiming(0, { duration: 200 });
		}
	}, 1000);

	runOnUI(() => {
		dragging.addListener(1, () => redraw());
		visible.addListener(1, () => redraw());
		scrollY.addListener(3, () => {
			if (visible.value === 0) runOnJS(onScroll)();
			runOnJS(onScrollEnd)();
		});
	})();

	const gesture = Gesture.Pan()
		.onTouchesDown((e, state) => {
			const [touch] = e.allTouches;
			if (!touch) return;

			if (touch.x < layout.value.width - 30) {
				state.fail();
			} else {
				state.activate();
				state.begin();

				visible.value = withTiming(1, { duration: 200 });
				dragging.value = withTiming(1, { duration: 200 });
				runOnJS(vibrate)("impactHeavy");
				beginY.value = scrollY.value / maxHeight.value;
			}
		})
		.onTouchesUp((_, state) => {
			state.end();
			dragging.value = withTiming(0, { duration: 200 });
			runOnJS(onScrollEnd)();
		})
		.manualActivation(true)
		.onStart(() => {})
		.onChange((e) => {
			const dragPercentage = e.translationY / layout.value.height;
			const newPercentage = beginY.value + dragPercentage;
			const yValue = newPercentage * maxHeight.value;
			scrollY.value = yValue;
		})
		.onEnd((e) => {
			const percentage = Math.max(maxHeight.value / layout.value.height, 1);
			startMomentumScroll(e.velocityY * percentage);
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

			return Math.min(Math.max(percentage * end, 0), end);
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
