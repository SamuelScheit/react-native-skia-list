import { loadData, Skia, type SkImage } from "@shopify/react-native-skia";
import { getRandomMessage, loadImage } from "../src/MessageList/randomMessage";
import { runOnUI, useSharedValue } from "react-native-reanimated";
import { useMessageListState, type MessageItem } from "../src/MessageList/State";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MessageListProps } from "../src/MessageList/Render";
import { MessageList } from "../src/MessageList";
import { SharedText } from "../src/Util/SharedText";
import { useLayoutEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { sleep } from "../src/Util/time";

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

let attachment: SkImage | null = null;
let avatar1: SkImage | null = null;
let avatar2: SkImage | null = null;

export default function SkiaMessageList() {
	const my_user_id = "1";
	const safeArea = useSafeAreaInsets();
	const props: MessageListProps = {
		my_user_id,
		is_group: true,
		bubble: true,
		estimatedItemHeight: 200,
		safeArea,
		initialData: () =>
			new Array(500).fill(0).map((x, i) => {
				return getRandomMessage({
					my_user_id,
					i,
				});
			}),
	};
	const list = useMessageListState(props);
	const { unmountElement, data, redrawItems, renderTime, scrollToIndex } = list;
	const text = useSharedValue("");

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
		avatar2 = img;
	});

	attachmentImagePromise.then((img) => {
		runOnUI(() => {
			data.value.forEach((item) => {
				item.attachments = item.attachments.map((x: any) => img);
				unmountElement(undefined, item);
			});
			redrawItems();
		})();
		attachment = img;
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
		avatar1 = img;
	});

	async function scrollToEnd(index = 0, time = 0) {
		"worklet";

		const diff = performance.now() - time;
		// if (diff < 10) return requestAnimationFrame(() => scrollToEnd(index, time));
		if (index >= data.value.length) return;

		scrollToIndex(index, false);

		return requestAnimationFrame(() => scrollToEnd(index + 1, performance.now()));
	}

	useLayoutEffect(() => {
		runOnUI(() => {
			renderTime.addListener(1, (value) => {
				text.value = `Total Render time: ${value.toFixed(2)}ms`;
			});
		})();

		return runOnUI(() => {
			renderTime.removeListener(1);
		});
	}, []);

	return (
		<>
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
