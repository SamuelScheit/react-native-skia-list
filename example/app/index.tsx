import { Link } from "expo-router";
import type { ComponentProps } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
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

export default function App() {
	runOnUI(() => {
		console.log("reanimated", !!globalThis.gc);
		globalThis.gc?.();
	})();

	globalThis.gc?.();

	return (
		<ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1 }}>
			<Button href="/SkiaScrollView">SkiaScrollView</Button>
			<Button href="/SkiaFlatList">SkiaFlatList</Button>
			<Button href="/SkiaMessageList">SkiaMessageList</Button>
			<Button href="/FlashList">FlashList</Button>
			<Button href="/FlatList">FlatList</Button>
			<Button href="/WGPU">WebGPU</Button>
			<Button href="/Test">Test</Button>
		</ScrollView>
	);
}
