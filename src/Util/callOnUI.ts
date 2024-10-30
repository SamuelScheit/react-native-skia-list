const { runOnUIImmediately } =
	require("react-native-reanimated/src/threads") as typeof import("react-native-reanimated/lib/typescript/threads");

export function callOnUI<Args extends unknown[], ReturnValue>(
	worklet: (...args: Args) => ReturnValue
): (...args: Args) => ReturnValue {
	return (...args) => {
		"worklet";

		if (_WORKLET) return worklet(...args);

		return runOnUIImmediately(worklet)(...args);
	};
}
