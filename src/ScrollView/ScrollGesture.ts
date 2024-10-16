import { cancelAnimation, clamp, makeMutable, withSpring, type SharedValue } from "react-native-reanimated";
import { withDecay } from "./Decay";
import { Gesture } from "react-native-gesture-handler";
import type {
	GestureUpdateEvent,
	PanGestureChangeEventPayload,
	PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { interpolateOutside } from "./Interpolate";
import type { Animation, DecayAnimation } from "react-native-reanimated";

const getDefaultState = () => ({
	layout: makeMutable({ width: 0, height: 0 }) as SharedValue<{ width: number; height: number }>,
	scrollY: makeMutable(0) as SharedValue<number>,
	startY: makeMutable(0) as SharedValue<number>,
	offsetY: makeMutable(0) as SharedValue<number>,
	maxHeight: makeMutable(1) as SharedValue<number>,
	scrolling: makeMutable(false) as SharedValue<boolean>,
	pressing: makeMutable(false) as SharedValue<boolean>,
	bounces: true,
	decelerationRate: 0.998,
});

type ScrollGestureInitalState = ReturnType<typeof getDefaultState>;

export interface ScrollGestureProps extends Partial<ScrollGestureInitalState> {
	height?: number;
	inverted?: boolean;
	onScroll?: (
		value: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload> & {
			scrollY: number;
		}
	) => void;
	onScrollBeginDrag?: () => void;
	onScrollEndDrag?: () => void;
	onMomentumScrollEnd?: () => void;
	onMomentumScrollBegin?: () => void;
}

export function getScrollGestureState(props: ScrollGestureProps = {}) {
	return {
		...getDefaultState(),
		...props,
	};
}

export type ScrollGestureState = ReturnType<typeof getScrollGesture>;

export function getScrollGesture(props: ScrollGestureProps) {
	const state = getScrollGestureState(props);

	const {
		onScroll,
		onScrollBeginDrag,
		onScrollEndDrag,
		onMomentumScrollBegin,
		onMomentumScrollEnd,
		bounces,
		decelerationRate,
		scrolling,
		scrollY: y,
		startY,
		offsetY,
		maxHeight,
		pressing,
	} = state;
	const inverted = props.inverted ? -1 : 1;

	function onEndClamp() {
		"worklet";

		const val = clamp(y.value, 0, maxHeight.value - offsetY.value);

		if (!bounces && y.value !== val) {
			onMomentumScrollEnd?.();
			return true;
		}

		if (y.value === val || maxHeight.value - offsetY.value === 0) {
			return false;
		}

		y.value = withSpring(val, { stiffness: 80, damping: 12, mass: 0.2 }, () => {
			onMomentumScrollEnd?.();
		});

		return true;
	}

	function onEnd(velocityY: number) {
		"worklet";

		onMomentumScrollBegin?.();

		const animation = withDecay(
			{
				velocity: velocityY,
				deceleration: decelerationRate,
				clamp: [0, maxHeight.value - offsetY.value],
			},
			(finished) => {
				"worklet";

				if (bounces && finished && animation.clamped) {
					const newValue = y.value + animation.initialVelocity * 0.03;

					y.value = withSpring(newValue, { duration: 100, dampingRatio: 2 }, () => {
						onEndClamp();
					});
				} else {
					onEndClamp();
				}
			}
		) as any as Animation<DecayAnimation>;
		y.value = animation as any;
	}

	function scrollTo(opts: { x: number; y: number; animated?: boolean }) {
		"worklet";

		if (opts.animated) {
			y.value = withSpring(opts.y, { stiffness: 80, damping: 10, mass: 0.2 });
		} else {
			y.value = opts.y;
		}
	}

	function scrollToEnd(opts: { animated?: boolean }) {
		"worklet";

		if (opts.animated) {
			y.value = withSpring(maxHeight.value, { stiffness: 80, damping: 10, mass: 0.2 });
		} else {
			y.value = maxHeight.value;
		}
	}

	const gesture = Gesture.Pan()
		.minDistance(10)
		.onTouchesDown((e, manager) => {
			const [touch] = e.allTouches;
			if (!touch) return manager.fail();
			pressing.value = true;
			if (touch.x <= 20) return manager.fail();
		})
		.onTouchesUp(() => {
			pressing.value = false;
		})
		.onBegin(() => {
			// begin touch down
			cancelAnimation(y); // hold down finger to stop scrolling
		})
		.onStart(() => {
			// begin scroll
			startY.value = y.value;
			scrolling.value = true;
			onScrollBeginDrag?.();
		})
		.onChange((e) => {
			let newY = startY.value + e.translationY * -1 * inverted;

			if (bounces) {
				newY = interpolateOutside(newY, 0, maxHeight.value - offsetY.value, 0.82);
			} else {
				newY = clamp(newY, 0, maxHeight.value - offsetY.value);
			}

			y.value = newY;

			if (onScroll) {
				const event = e as typeof e & { scrollY: number };
				event.scrollY = y.value;

				onScroll?.(event);
			}
		})
		.onEnd((e) => {
			// end scroll
			onEnd(e.velocityY * -1 * inverted);
			onScrollEndDrag?.();
		})
		.onFinalize((_, success) => {
			// end touch up
			scrolling.value = false;
			if (!success) {
				onEndClamp();
			}
		});

	return {
		gesture,
		...state,
		invertedFactor: inverted,
		scrollTo,
		scrollToEnd,
		startMomentumScroll: onEnd,
	};
}
