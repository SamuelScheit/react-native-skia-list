import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { makeMutable, useSharedValue } from "react-native-reanimated";

export default function Test() {
	const state: any[] = new Array(500).fill(0).map((_, i) => {
		return useSharedValue(0);
	});
	const state2 = useSharedValue([
		...new Array(500).fill(0).map((_, i) => {
			return makeMutable(0);
		}),
		test,
	]);
	state.push(test);

	function test(props: any[]) {
		"worklet";
		for (const prop of props) {
			prop?.value;
		}
	}

	const gesture = Gesture.Pan().onChange((e) => {
		let start = performance.now();

		test([...state]);
		console.log("Time", performance.now() - start);
	});

	return (
		<GestureDetector gesture={gesture}>
			<View style={{ flex: 1 }}></View>
		</GestureDetector>
	);
}
