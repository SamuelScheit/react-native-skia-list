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
			<Button href="/ScrollView">ScrollView</Button>
			<Button href="/FlatList">FlatList</Button>
			<Button href="/MessageList">MessageList</Button>
			<Button href="/Test">Test</Button>
		</View>
	);
}
