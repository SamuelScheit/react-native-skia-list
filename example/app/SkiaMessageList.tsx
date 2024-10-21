import { loadData, Skia } from "@shopify/react-native-skia";
import { getRandomMessage, loadImage } from "../src/MessageList/randomMessage";
import Animated, { runOnUI, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useMessageListState } from "../src/MessageList/State";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MessageListProps } from "../src/MessageList/Render";
import { MessageList } from "../src/MessageList";
import { SharedText } from "../src/Util/SharedText";
import { useLayoutEffect } from "react";
import { LogBox, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useKeyboardHandler } from "react-native-keyboard-controller";

const userAvatarPromise1 = loadData(
	`https://avatar.iran.liara.run/public`,
	Skia.Image.MakeImageFromEncoded.bind(Skia.Image),
	console.log
);
const userAvatarPromise2 = loadData(
	`https://avatar.iran.liara.run/public`,
	Skia.Image.MakeImageFromEncoded.bind(Skia.Image),
	console.log
);
const attachmentImagePromise = loadImage(400, 400);

export default function SkiaMessageList() {
	const my_user_id = "1";
	const safeArea = useSafeAreaInsets();
	const props: MessageListProps = {
		my_user_id,
		is_group: true,
		bubble: true,
		estimatedItemHeight: 300,
		safeArea,
		automaticallyAdjustKeyboardInsets: true,
		initialData: () =>
			new Array(500).fill(0).map((_, i) => {
				return getRandomMessage({
					my_user_id,
					i,
				});
			}),
	};
	const list = useMessageListState(props);
	const { unmountElement, data, redrawItems, renderTime, scrollToIndex } = list;
	const text = useSharedValue<any>("");
	const keyboardHeight = useSharedValue(0);
	const keyboardProgress = useSharedValue(0);

	useKeyboardHandler(
		{
			onStart: () => {
				"worklet";
				// console.log("onStart", e);
			},
			onMove: (e) => {
				"worklet";
				// console.log("onMove", e);
				keyboardHeight.value = -e.height;

				keyboardProgress.value = e.progress;
			},
			onInteractive: (e) => {
				"worklet";
				// console.log("onInteractive", e);
				keyboardHeight.value = -e.height;
				keyboardProgress.value = e.progress;
			},
			onEnd: (e) => {
				"worklet";
				console.log("onEnd", e);
			},
		},
		[]
	);
	const inputStyle = useAnimatedStyle(() => {
		const paddingBottom = keyboardProgress.value * safeArea.bottom;
		return {
			// paddingBottom,
			transform: [
				{
					translateY: keyboardHeight.value + paddingBottom,
				},
			],
		};
	});

	userAvatarPromise2.then((img) => {
		runOnUI(() => {
			data.value.forEach((item) => {
				if (item.user_id === "2") {
					item.avatar = img;
					list.unmountElement(undefined, item);
				}
			});
			redrawItems();
		})();
	});

	attachmentImagePromise.then((img) => {
		runOnUI(() => {
			data.value.forEach((item) => {
				item.attachments = item.attachments.map(() => img);
				unmountElement(undefined, item);
			});
			redrawItems();
		})();
	});

	userAvatarPromise1.then((img) => {
		runOnUI(() => {
			data.value.forEach((item) => {
				if (item.user_id === "3") {
					item.avatar = img;
					unmountElement(undefined, item);
				}
			});
			redrawItems();
		})();
	});

	async function scrollToEnd(index = 0) {
		"worklet";

		if (index >= data.value.length) return;

		scrollToIndex(index, false);

		return requestAnimationFrame(() => scrollToEnd(index + 1));
	}

	useLayoutEffect(() => {
		runOnUI(() => {
			renderTime.addListener(1, (value) => {
				text.value = `Render time: ${value.toFixed(2)}ms`;
			});
		})();

		return runOnUI(() => {
			renderTime.removeListener(1);
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar hidden={true} />
			<MessageList {...props} list={list} inverted style={{ flex: 1 }} />

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
					onPress={() => runOnUI(scrollToEnd)()}
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
					top: 40,
					left: 0,
					width: "100%",
					justifyContent: "center",
					alignItems: "flex-start",
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

			<Animated.View
				style={[{ zIndex: 10, backgroundColor: "white", paddingBottom: safeArea.bottom }, inputStyle]}
			>
				<TextInput
					multiline
					placeholder="Message"
					style={[
						{
							paddingLeft: 62,
							padding: 10,
							fontSize: 20,
						},
					]}
					inputAccessoryViewID="1"
				/>
			</Animated.View>
		</View>
	);
}

LogBox.ignoreAllLogs(true);
