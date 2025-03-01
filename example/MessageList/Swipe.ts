import {
	Gesture,
	type GestureStateChangeEvent,
	type PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
const { Extrapolate, interpolate } =
	require("@shopify/react-native-skia/src/") as typeof import("@shopify/react-native-skia/lib/typescript/src/");
import { makeMutable, type SharedValue, withSpring, type WithSpringConfig } from "react-native-reanimated";

export function getSwipeGesture(props: {
	swipePosition: SharedValue<number>;
	threshold: number;
	onEndSwipe: () => void;
	onOverSwipe: () => void;
	onSwipe: () => void;
	onStartSwipe: (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => void;
}) {
	const { swipePosition, threshold, onEndSwipe, onOverSwipe, onSwipe, onStartSwipe } = props;
	const stiffness = 2;
	const springConfig = {
		damping: 10,
		mass: 0.2,
		stiffness: 100,
	} as WithSpringConfig;
	const startX = makeMutable(0);
	const startY = makeMutable(0);
	const previousX = makeMutable(0);
	const previousY = makeMutable(0);
	const overSwipe = makeMutable(false);
	const isHandled = makeMutable(false);

	return Gesture.Pan()
		.onStart((e) => {
			onStartSwipe(e);
		})
		.onUpdate((e) => {
			if (-e.translationX > threshold) {
				if (onOverSwipe && !overSwipe.value) {
					onOverSwipe();
					overSwipe.value = true;
				}
			} else if (overSwipe.value) overSwipe.value = false;

			swipePosition.value = interpolate(
				e.translationX,
				[-threshold * stiffness * 2, -threshold, 0, threshold * 4],
				[-threshold * stiffness, -threshold, 0, threshold],
				Extrapolate.EXTEND
			);
		})
		.onEnd((e) => {
			if (-e.translationX > threshold && onSwipe) {
				onSwipe();
			}

			swipePosition.value = withSpring(0, springConfig, () => {
				onEndSwipe();
			});
		})
		.onTouchesCancelled(() => {
			onEndSwipe();
		})
		.onTouchesDown((event, stateManager) => {
			const [touch] = event.allTouches;
			if (!touch) return stateManager.fail();

			swipePosition.value = 0;
			startX.value = touch.x;
			startY.value = touch.y;
			previousX.value = touch.x;
			previousY.value = touch.y;
			overSwipe.value = false;
			isHandled.value = false;
		})
		.onTouchesUp((_, stateManager) => {
			stateManager.fail();
		})
		.onTouchesMove((event, stateManager) => {
			if (isHandled.value) return;
			const [touch] = event.allTouches;
			if (!touch) return stateManager.fail();

			const velocityX = touch.x - previousX.value;
			const velocitY = Math.abs(touch.y - previousY.value);

			previousX.value = touch.x;
			previousY.value = touch.y;

			const diffX = touch.x - startX.value;
			const diffY = Math.abs(touch.y - startY.value);
			// console.log("swipe", diffX, diffY, velocityX, velocitY);

			if (diffY > 8 || velocitY > 8) {
				isHandled.value = true;
				return stateManager.fail();
			}

			if (diffX < -5 || velocityX < -5) {
				isHandled.value = true;
				stateManager.activate();
			} else if (diffX > 5 || velocityX > 5) {
				stateManager.fail();
				isHandled.value = true;
			}
		})
		.manualActivation(true);
}
