import type { Animation, AnimationCallback, DecayAnimation } from "react-native-reanimated";
import { ReduceMotion } from "react-native-reanimated";

type InnerDecayMatrixAnimation = Omit<DecayAnimation, "current"> & {
	current: number;
};

export type DecayConfig = {
	deceleration?: number;
	velocity?: number;
	clamp?: [number, number];
};

type withDecayType = (userConfig: DecayConfig, callback?: AnimationCallback) => number;

export function rigidDecay(animation: InnerDecayMatrixAnimation, now: number, config: Required<DecayConfig>) {
	"worklet";

	const { startTimestamp, initialVelocity, initialPosition, dCoeff, decelerationRate } = animation;
	const timeSinceStart = now - startTimestamp;

	let v = Math.pow(decelerationRate, timeSinceStart);
	let addedY = ((v - 1) / dCoeff) * initialVelocity;
	let y = initialPosition + addedY;

	if (config.clamp) {
		if (y < config.clamp[0] || y > config.clamp[1]) {
			// animation.current = toValue;
			return true;
		}
	}

	animation.current = y;
	animation.velocity = v;

	animation.lastTimestamp = now;

	return Math.abs(v) < 0.005;
}

export const withDecay = function (userConfig: DecayConfig, callback?: AnimationCallback): Animation<DecayAnimation> {
	"worklet";

	const config: DecayConfig = {
		deceleration: 0.998,
		velocity: 0,
		...userConfig,
	};
	const decay = (animation: any, now: number) => {
		"worklet";

		return rigidDecay(animation, now, config as any);
	};
	function onStart(animation: InnerDecayMatrixAnimation, value: any, now: number) {
		"worklet";

		animation.current = value;
		animation.initialPosition = value;
		animation.lastTimestamp = now;
		animation.startTimestamp = now;
	}

	const decelerationRate = config.deceleration!;
	const initialVelocity = config.velocity || 0;
	const dCoeff = 1000 * Math.log(decelerationRate);

	return {
		onFrame: decay,
		onStart,
		callback,
		initialVelocity,
		decelerationRate,
		dCoeff,
		initialPosition: 0,
		current: 0,
		lastTimestamp: 0,
		startTimestamp: 0,
		reduceMotion: ReduceMotion.Never,
		clamp: config.clamp,
		velocity: initialVelocity,
	} as any;
} as unknown as withDecayType;
