import { useMemo, useState } from "react";
import { Text, View } from "react-native";

declare global {
	var index: number;
}

globalThis.index ||= 0;

export default function Test() {
	const [state] = useState(() => globalThis.index++);
	const index = useMemo(() => globalThis.index++, []);

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>
				{index} - {state}
			</Text>
		</View>
	);
}
