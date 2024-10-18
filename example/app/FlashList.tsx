import { FlashList } from "@shopify/flash-list";
import { Pressable, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { getRandomMessageRaw } from "../src/MessageList/randomMessage";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Image } from "expo-image";
import * as ContextMenu from "zeego/context-menu";
import Hyperlinks from "react-native-hyperlinks";

function RenderMessage({ item }: { item: any }) {
	const gesture = Gesture.LongPress();
	const swipePosition = useSharedValue(0);
	const style = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: swipePosition.value,
				},
			],
		};
	});

	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger>
				<GestureDetector gesture={gesture}>
					<Animated.View
						style={[
							style,
							{
								marginTop: 20,
								marginHorizontal: 15,
								flex: 1,
							},
						]}
					>
						<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
							<TouchableOpacity>
								<Image
									source={{ uri: "https://avatar.iran.liara.run/public" }}
									style={{ width: 35, height: 35, borderRadius: 25 }}
								/>
							</TouchableOpacity>
							<View style={{ flexDirection: "column", flexShrink: 1 }}>
								<View style={{ flexDirection: "column", flexShrink: 1 }}>
									<Text style={{ marginLeft: 15, fontSize: 16, marginBottom: 2 }}>{item.author}</Text>
									{item.text ? (
										<View
											style={{
												flexShrink: 1,
												paddingVertical: 10,
												paddingHorizontal: 15,
												backgroundColor: "white",
												borderRadius: 20,
											}}
										>
											{/* <Hyperlinks text={item.text} style={{ fontSize: 17 }} /> */}
											<Text style={{ fontSize: 17 }}>{item.text}</Text>
										</View>
									) : null}
								</View>
								<View style={{ flexDirection: "row", marginTop: 5, gap: 5 }}>
									{item.attachments.map((reaction: any, i) => (
										<TouchableOpacity key={i}>
											<Image
												source={{ uri: "https://picsum.photos/600/600" }}
												style={{ width: 300, height: 300, borderRadius: 10 }}
											/>
										</TouchableOpacity>
									))}
								</View>
								<View style={{ flexDirection: "row", marginTop: 5, gap: 5 }}>
									{item.reactions.map((reaction: any, i) => (
										<TouchableOpacity
											key={i}
											style={{
												flexDirection: "row",
												gap: 5,
												backgroundColor: "lightgrey",
												borderRadius: 10,
												width: 50,
												padding: 5,
											}}
										>
											<Text>{reaction.emoji}</Text>
											<Text>{reaction.count}</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>
						</View>
					</Animated.View>
				</GestureDetector>
			</ContextMenu.Trigger>

			<ContextMenu.Content>
				<ContextMenu.Item key="test" textValue="Test" />
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
}

export default function FlashListTest() {
	return (
		<FlashList
			inverted
			contentInsetAdjustmentBehavior="automatic"
			estimatedItemSize={100}
			data={Array.from({ length: 1000 }, (_, i) => getRandomMessageRaw(i))}
			renderItem={({ item }) => {
				return <RenderMessage key={item.id} item={item} />;
			}}
		/>
	);
}
