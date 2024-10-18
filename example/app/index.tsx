import { Link } from "expo-router";
import type { ComponentProps } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { runOnUI } from "react-native-reanimated";

type LinkProps = ComponentProps<typeof Link>;

function Button(props: LinkProps) {
	return (
		<Link {...props} asChild>
			<TouchableOpacity
				style={{
					padding: 20,
					borderBottomWidth: 1,
					borderColor: "#a6a6a6",
					backgroundColor: "#fff",
				}}
			>
				<Text>{props.children}</Text>
			</TouchableOpacity>
		</Link>
	);
}

runOnUI(() => {
	console.log("runOnUIImmediately");
})();

export default function App() {
	return (
		<ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
			<Button href="/ScrollView">SkiaScrollView</Button>
			<Button href="/FlatList">SkiaFlatList</Button>
			<Button href="/MessageList">SkiaMessageList</Button>
			<Button href="/FlashList">FlashList</Button>
		</ScrollView>
	);
}
