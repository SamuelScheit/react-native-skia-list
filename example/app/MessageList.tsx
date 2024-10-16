import { getRandomMessage } from "../src/MessageList/randomMessage";
import { MessageList } from "../src/MessageList/Render";

export default function SkiaMessageList() {
	const my_user_id = "1";

	return (
		<MessageList
			my_user_id={my_user_id}
			bubble
			is_group
			inverted
			style={{ flex: 1 }}
			keyExtractor={(item) => {
				"worklet";
				return item.id;
			}}
			initialData={() =>
				new Array(500).fill(0).map((x, i) => {
					return getRandomMessage({
						my_user_id,
						i,
					});
				})
			}
		/>
	);
}
