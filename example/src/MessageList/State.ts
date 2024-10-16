import type { SkImage, SkParagraph } from "@shopify/react-native-skia";

export type MessageItem = {
	text: SkParagraph | undefined;
	author: SkParagraph;
	user_id: string;
	reactions: {
		emoji: string;
		width: number;
		paragraph: SkParagraph;
		count: string;
	}[];
	attachments: (SkImage | null)[];
	avatar: SkImage | null;
	id: string;
};

export interface useMessageListProps {
	my_user_id?: string;
	bubble?: boolean;
	is_group?: boolean;
	initialData?: () => MessageItem[];
}
