export function interpolateOutside(value: number, min: number, max: number, backoff: number = 2) {
	"worklet";

	if (value >= min && value <= max) {
		return value;
	}

	if (value < min) {
		const distance = min - value;
		return min - Math.pow(distance, backoff);
	} else {
		const distance = value - max;
		return max + Math.pow(distance, backoff);
	}
}

export function interpolate(
	value: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number,
	backoff: number = 2
) {
	"worklet";

	if (value >= inMin && value <= inMax) {
		if (inMin === outMin && inMax === outMax) {
			return value;
		}

		return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
	}

	if (value < inMin) {
		const distance = inMin - value;
		return outMin - Math.pow(distance, backoff);
	} else {
		const distance = value - inMax;
		return outMax + Math.pow(distance, backoff);
	}
}

export function interpolateClamp(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
	"worklet";

	if (value >= inMin && value <= inMax) {
		if (inMin === outMin && inMax === outMax) {
			return value;
		}

		return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
	}

	if (value < inMin) {
		return outMin;
	} else {
		return outMax;
	}
}

export function interpolateBackoff(value: number, inputRange: number[], outputRange: number[], backoff = 2) {
	"worklet";
	if (inputRange.length < 2 || outputRange.length < 2) {
		throw new Error("Input and output ranges must have at least 2 elements.");
	}
	if (inputRange.length !== outputRange.length) {
		throw new Error("Input and output ranges must be of the same length.");
	}

	for (let i = 0; i < inputRange.length - 1; i++) {
		const inMin = inputRange[i]!;
		const inMax = inputRange[i + 1]!;
		const outMin = outputRange[i]!;
		const outMax = outputRange[i + 1]!;

		if (value >= inMin && value <= inMax) {
			return interpolate(value, inMin, inMax, outMin, outMax, backoff);
		}
	}

	if (value < inputRange[0]!) {
		var inMin = inputRange[0]!;
		var inMax = inputRange[1]!;
		var outMin = outputRange[0]!;
		var outMax = outputRange[1]!;
	} else {
		var inMin = inputRange[inputRange.length - 2]!;
		var inMax = inputRange[inputRange.length - 1]!;
		var outMin = outputRange[outputRange.length - 2]!;
		var outMax = outputRange[outputRange.length - 1]!;
	}

	return interpolate(value, inMin, inMax, outMin, outMax, backoff);
}
