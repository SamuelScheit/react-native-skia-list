import { cancelAnimation, clamp, makeMutable, withSpring, type SharedValue } from "react-native-reanimated";
import { withDecay } from "../Util/Decay";
import { Gesture, State } from "react-native-gesture-handler";
import type {
	GestureType,
	GestureUpdateEvent,
	PanGestureChangeEventPayload,
	PanGestureHandlerEventPayload,
	TouchData,
} from "react-native-gesture-handler";
import { interpolateOutside } from "../Util/Interpolate";

/**
 */
export type ScrollGestureInitalState = {
	/**
	 * Contains the width and height of the scroll view.
	 * Will automatically update when the layout changes.
	 */
	layout: SharedValue<{ width: number; height: number }>;
	/**
	 * The current scroll Y position.
	 */
	scrollY: SharedValue<number>;
	/**
	 * Used internally to keep track of the start Y position when dragging.
	 */
	startY: SharedValue<number>;
	/**
	 * Used to indepentently control the scroll position without affecting the scrollY value (which is used by the gesture handler) e.g. used for keyboard handling.
	 */
	offsetY: SharedValue<number>;
	/**
	 * The maximum height the scroll view can scroll to.
	 * Automatically updated when the layout/data changes.
	 */
	maxHeight: SharedValue<number>;
	/**
	 * Shared value that indicates if the view is currently being scrolled.
	 */
	scrolling: SharedValue<boolean>;
	/**
	 * Shared value to disable scrolling.
	 */
	scrollingDisabled: SharedValue<boolean>;
	/**
	 * If the scroll view should bounce when reaching the top or bottom.
	 */
	bounces: boolean;
	/**
	 * The deceleration rate for momentum scrolling. Default is 0.998.
	 */
	decelerationRate: number;
};

const getDefaultState = (): ScrollGestureInitalState => ({
	layout: makeMutable({ width: 0, height: 0 }) as SharedValue<{ width: number; height: number }>,
	scrollY: makeMutable(0) as SharedValue<number>,
	startY: makeMutable(0) as SharedValue<number>,
	offsetY: makeMutable(0) as SharedValue<number>,
	maxHeight: makeMutable(1) as SharedValue<number>,
	scrolling: makeMutable(false) as SharedValue<boolean>,
	scrollingDisabled: makeMutable(false) as SharedValue<boolean>,
	bounces: true,
	decelerationRate: 0.998,
});

// export type ScrollGestureInitalState = ReturnType<typeof getDefaultState>;

export type ScrollEvent = GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload> & {
	scrollY: number;
};

/**
 *
 */
export type ScrollGestureProps = {
	/**
	 * Sets the initial value for `maxHeight` while taking the layout height into consideration.
	 * :::warning
	 * You need to set this value for SkiaScrollView to be able to scroll.
	 * :::
	 */
	height?: number;
	/**
	 * Inverts the scroll direction of the Gesture Handler. Used in conjunction with `inverted` of [SkiaScrollViewProps](#skiascrollviewprops).
	 */
	inverted?: boolean;
	/**
	 * Callback that is invoked every time the scroll position changes.
	 * Needs to be a worklet function.
	 * You need to implement throttling yourself:
	 *
	 * ```tsx
	 * function onScroll(event: ScrollEvent) {
	 * 	"worklet";
	 * 	const { scrollY } = event;
	 * 	// do something with scrollY, e.g. update the position of a sticky header
	 * }
	 *
	 * <SkiaScrollView onScroll={onScroll} />
	 * ```
	 */
	onScroll?: (value: ScrollEvent) => void;
	/**
	 * Callback that is invoked when the user starts dragging the scroll view.
	 * Needs to be a worklet function.
	 */
	onScrollBeginDrag?: () => void;
	/**
	 * Callback that is invoked when the user stops dragging the scroll view.
	 * Needs to be a worklet function.
	 */
	onScrollEndDrag?: () => void;
	/**
	 * Callback that is invoked when the momentum scroll begins.
	 * Needs to be a worklet function.
	 */
	onMomentumScrollEnd?: () => void;
	/**
	 * Callback that is invoked when the momentum scroll ends.
	 * Needs to be a worklet function.
	 */
	onMomentumScrollBegin?: () => void;
	/**
	 * Call this function when you start animating an SharedValue to enable continous rendering mode.
	 */
	startedAnimation?: () => void;
	/**
	 * Call this function when you finish animating an SharedValue to return to default rendering mode.
	 *
	 * :::warning
	 * Ensure that you have the equal amount of `startedAnimation` and `finishedAnimation` calls to avoid unecessary re-renders when idling.
	 * :::
	 */
	finishedAnimation?: () => void;
} & Partial<ScrollGestureInitalState>;

export function getScrollGestureState(props: ScrollGestureProps) {
	return {
		...getDefaultState(),
		...props,
	};
}

/**
 *
 */
export type ScrollGestureState = {
	gesture: GestureType;
	/**
	 * Scroll to a certain Y position.
	 */
	scrollTo: (opts: { x: number; y: number; animated?: boolean }) => void;
	/**
	 * Scroll to the end of the scroll view (inferred by maxHeight).
	 */
	scrollToEnd: (opts: { animated?: boolean }) => void;
	/**
	 * Scroll to start of the scroll view.
	 */
	scrollToStart: (opts: { animated?: boolean }) => void;
	/**
	 * If you manually handle scrolling, e.g. with a custom ScrollBar, you can call this function to start momentum scrolling.
	 */
	startMomentumScroll: (velocityY: number) => void;
	/**
	 * @hidden
	 */
	invertedFactor: number;
} & ScrollGestureInitalState &
	ScrollGestureProps;

export function getScrollGesture(props: ScrollGestureProps): ScrollGestureState {
	const state = getScrollGestureState(props);

	const { startedAnimation, finishedAnimation } = props;
	const {
		onScroll,
		onScrollBeginDrag,
		onScrollEndDrag,
		onMomentumScrollBegin,
		bounces,
		decelerationRate,
		scrolling,
		scrollY: y,
		startY,
		offsetY,
		maxHeight,
		scrollingDisabled,
		layout,
	} = state;
	const inverted = props.inverted ? -1 : 1;
	const touchStart = makeMutable({ x: 0, y: 0, absoluteX: 0, absoluteY: 0, id: 0 } as TouchData);

	const onMomentumScrollEndProps = props.onMomentumScrollEnd;

	function onMomentumScrollEnd() {
		"worklet";

		finishedAnimation?.();
		onMomentumScrollEndProps?.();
	}

	function onEndClamp() {
		"worklet";

		const val = clamp(y.value, 0, maxHeight.value - offsetY.value);

		if (!bounces) {
			y.value = val;

			onMomentumScrollEnd();
			return;
		}

		y.value = withSpring(val, { stiffness: 80, damping: 12, mass: 0.2 }, onMomentumScrollEnd);
	}

	function onEnd(velocityY: number) {
		"worklet";

		onMomentumScrollBegin?.();

		startedAnimation?.();

		const animation = { current: null } as any;

		animation.current = withDecay(
			{
				velocity: velocityY,
				deceleration: decelerationRate,
				clamp: [0, maxHeight.value - offsetY.value],
			},
			(finished) => {
				"worklet";

				if (bounces && finished && animation.current.clamped) {
					const newValue = y.value + animation.current.initialVelocity * 0.03;

					y.value = withSpring(newValue, { duration: 100, dampingRatio: 2 }, onEndClamp);
				} else {
					onEndClamp();
				}
			}
		) as any;
		y.value = animation.current as any;
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

	function scrollToStart(opts: { animated?: boolean }) {
		"worklet";

		if (opts.animated) {
			y.value = withSpring(0, { stiffness: 80, damping: 10, mass: 0.2 });
		} else {
			y.value = 0;
		}
	}

	const gesture = Gesture.Pan()
		.onTouchesDown((e, manager) => {
			startedAnimation?.();
			const [touch] = e.allTouches;
			if (!touch) return manager.fail();

			touchStart.value = touch;

			if (touch.x <= 20) return manager.fail();
		})
		.onTouchesMove((e, manager) => {
			const [touch] = e.allTouches;
			if (!touch) return;
			if (e.state === State.FAILED) return;
			if (e.state === State.ACTIVE) return;

			const { x, y } = touchStart.value;

			const diffX = Math.abs(touch.x - x);
			const diffY = Math.abs(touch.y - y);

			if (diffX > 8 || diffY > 8) {
				if (diffY > diffX) {
					manager.activate();
				} else {
					manager.fail();
				}
			}
		})
		.onBegin(() => {
			// begin touch down
			cancelAnimation(y); // hold down finger to stop scrolling
		})
		.onStart(() => {
			if (scrollingDisabled.value) return;

			// begin scroll
			startY.value = y.value;
			scrolling.value = true;
			onScrollBeginDrag?.();
		})
		.onChange((e) => {
			// if (scrollingDisabled.value) return;

			let newY = startY.value + e.translationY * -1 * inverted;

			if (bounces) {
				newY = interpolateOutside(newY, 0, maxHeight.value, 0.82);
			} else {
				newY = clamp(newY, 0, maxHeight.value);
			}

			const isOverEdge = e.y - offsetY.value > layout.value.height;
			if (isOverEdge) {
				return;
			}

			y.value = newY;

			if (onScroll) {
				const event = e as ScrollEvent;
				event.scrollY = y.value;

				onScroll?.(event);
			}
		})
		.onEnd((e) => {
			if (scrollingDisabled.value) return;

			// end scroll
			onEnd(e.velocityY * -1 * inverted);
			onScrollEndDrag?.();
		})
		.onFinalize((_, success) => {
			// end touch up

			scrolling.value = false;
			if (!success) {
			}

			finishedAnimation?.();
		})
		.manualActivation(true)
		.enableTrackpadTwoFingerGesture(true);

	return {
		gesture,
		...state,
		invertedFactor: inverted,
		scrollTo,
		scrollToEnd,
		scrollToStart,
		startMomentumScroll: onEnd,
	};
}
