import { Link } from "expo-router";
import type { ComponentProps } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
	return (
		<View style={{ flex: 1 }}>
			<Button href="/ScrollView">SkiaScrollView</Button>
			<Button href="/FlatList">SkiaFlatList</Button>
			<Button href="/MessageList">SkiaMessageList</Button>
			<Button href="/FlashList">FlashList</Button>
		</View>
	);
}
