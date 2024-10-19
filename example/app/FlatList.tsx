import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { getRandomMessageRaw } from "../src/MessageList/randomMessage";
import { Profiler, useRef } from "react";
import { SharedText } from "../src/Util/SharedText";
import { useSharedValue } from "react-native-reanimated";
import { Message } from "../src/Message";

export default function FlatListTest() {
	const ref = useRef<FlatList>();
	const time = useRef(0);
	const text = useSharedValue("");
	const data = Array.from({ length: 500 }, (_, i) => getRandomMessageRaw(i));

	async function scrollToEnd(index = 0) {
		"worklet";

		if (index >= data.length) return;

		ref.current?.scrollToIndex({ index, animated: false });

		setTimeout(() => scrollToEnd(index + 1), 10);
	}

	return (
		<>
			<Profiler
				id={"list"}
				onRender={(id, phase, actualDuration) => {
					time.current += actualDuration;
					text.value = `Total Render time: ${time.current.toFixed(2)}ms`;
				}}
			>
				<FlatList
					ref={ref}
					data={data}
					inverted
					contentInsetAdjustmentBehavior="automatic"
					estimatedItemSize={100}
					renderItem={({ item }) => {
						return <Message key={item.id} item={item} />;
					}}
				/>
			</Profiler>
			<View
				style={{
					position: "absolute",
					top: 40,
					left: 0,
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<TouchableOpacity
					onPress={() => scrollToEnd()}
					style={{
						padding: 5,
						borderRadius: 10,
						backgroundColor: "white",
						zIndex: 1000,
					}}
				>
					<Text>Scroll to End</Text>
				</TouchableOpacity>
			</View>

			<View
				style={{
					position: "absolute",
					bottom: 20,
					left: 0,
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<View
					style={{
						backgroundColor: "white",
						padding: 5,
						borderRadius: 10,
					}}
				>
					<SharedText shared={text} />
				</View>
			</View>
		</>
	);
}
