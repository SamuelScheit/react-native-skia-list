import { Platform } from "react-native";
const { runOnUIImmediately } =
	require("react-native-reanimated/src/threads") as typeof import("react-native-reanimated/lib/typescript/threads");

const isWeb = Platform.OS === "web";

export function callOnUI<Args extends unknown[], ReturnValue>(
	worklet: (...args: Args) => ReturnValue
): (...args: Args) => ReturnValue {
	"worklet";

	if (isWeb) return worklet;

	return (...args) => {
		"worklet";

		if (_WORKLET) return worklet(...args);

		return runOnUIImmediately(worklet)(...args) as any;
	};
}
