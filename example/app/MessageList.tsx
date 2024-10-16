import { loadData, Skia, type SkImage } from "@shopify/react-native-skia";
import { getRandomMessage, loadImage } from "../src/MessageList/randomMessage";
import { runOnUI } from "react-native-reanimated";
import { useMessageListState, type MessageItem } from "../src/MessageList/State";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MessageListProps } from "../src/MessageList/Render";
import { MessageList } from "../src/MessageList";

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
	const { unmountElement, data, redrawItems } = list;

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

	return <MessageList {...props} list={list} inverted style={{ flex: 1 }} />;
}
