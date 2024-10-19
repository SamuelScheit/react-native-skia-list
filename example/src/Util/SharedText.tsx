import { useState, useLayoutEffect } from "react";
import { Text, type TextProps } from "react-native";
import { type SharedValue, runOnUI, runOnJS } from "react-native-reanimated";

export function SharedText(props: { shared: SharedValue<string | number> } & TextProps) {
	const { shared } = props;
	const [text, setText] = useState(shared.value);

	useLayoutEffect(() => {
		runOnUI(() => {
			shared.addListener(1, (value) => {
				runOnJS(setText)(value);
			});
		})();
		return runOnUI(() => {
			shared.removeListener(1);
		});
	}, []);

	return <Text {...props}>{text}</Text>;
}
