import { runOnUI } from "react-native-reanimated";

export function callOnUI<Args extends unknown[], ReturnValue>(
  worklet: (...args: Args) => ReturnValue
): (...args: Args) => void {
	return (...args) => {
		"worklet";

		if (_WORKLET) return worklet(...args);

		return runOnUI(worklet)(...args);
	};
}
