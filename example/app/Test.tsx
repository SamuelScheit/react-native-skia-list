import { Canvas as SkiaCanvas } from "@shopify/react-native-skia";
import { useLayoutEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { makeMutable, runOnUI, useSharedValue } from "react-native-reanimated";
import type { Mutable } from "react-native-reanimated/lib/typescript/commonTypes";
import { Canvas } from "react-native-wgpu";

declare global {
	var index: number;
}

globalThis.index ||= 0;

globalThis.gcUI = () => {
	console.log("run gcUI");
	runOnUI(() => {
		"worklet";

		console.log("gcUI");
		// globalThis.gc?.();
	})();
};

export default function Test() {
	const [state] = useState(() => {
		const state = [] as Mutable<any>[];
		for (let i = 0; i < 100_000; i++) {
			state.push(makeMutable(0));
		}

		runOnUI(() => {
			state.forEach((value) => {
				value.addListener(1, () => {});
			});
		})();

		return state;
	});

	useLayoutEffect(() => {
		return runOnUI(() => {
			const start = Date.now();
			state.forEach((value) => {
				value.removeListener(1);
			});
			console.log(Date.now() - start);
		});
	}, []);

	return <View style={{ flex: 1, paddingLeft: 10 }}></View>;
}
