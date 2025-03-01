import Animated, { clamp, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector, State } from "react-native-gesture-handler";
import { Image } from "expo-image";
import * as ContextMenu from "zeego/context-menu";
import { Text, TouchableOpacity, View } from "react-native";
import { memo } from "react";

function RenderMessage({ item }: { item: any }) {
	const swipePosition = useSharedValue(0);
	const startY = useSharedValue(0);
	const startX = useSharedValue(0);
	const gesture = Gesture.Pan()
		.manualActivation(true)
		.onTouchesDown((event, state) => {
			const [touch] = event.changedTouches;
			if (!touch) return;

			startX.value = touch.x;
			startY.value = touch.y;
		})
		.onTouchesMove((event, state) => {
			if (event.state === State.FAILED) return;
			if (event.state === State.ACTIVE) return;

			const [touch] = event.changedTouches;
			if (!touch) return console.error("No touch");

			const diffX = Math.abs(touch.x - startX.value);
			const diffY = Math.abs(touch.y - startY.value);

			console.log({ diffX, diffY });

			if (diffY > 10) {
				state.fail();
			} else if (diffX > 10) {
				state.activate();
			}
		})
		.onChange((event) => {
			swipePosition.value = clamp(event.translationX, -100, 0);
		})
		.onEnd(() => {
			swipePosition.value = withTiming(0);
		});

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
									{item.attachments.map((_attachment: any, i: any) => (
										<TouchableOpacity key={i}>
											<Image
												source={{ uri: "https://picsum.photos/600/600" }}
												style={{ width: 300, height: 300, borderRadius: 10 }}
											/>
										</TouchableOpacity>
									))}
								</View>
								<View style={{ flexDirection: "row", marginTop: 5, gap: 5 }}>
									{item.reactions.map((reaction: any, i: any) => (
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
				{/* @ts-ignore */}
				<ContextMenu.Item key="test" textValue="Test" />
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
}

export const Message = memo(RenderMessage, ({ item: a }, { item: b }) => a.id === b.id);
