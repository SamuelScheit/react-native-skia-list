import { useMessageListState } from "./State";
import { memo } from "react";
import type { ViewStyle } from "react-native";
import type { MessageListProps } from "./Render";
import { SkiaFlatList, type SkiaFlatListElementProps } from "react-native-skia-list";

const RenderMessageList = function RenderMessageList({
	style,
	list,
	...props
}: MessageListProps & {
	style?: ViewStyle;
	list: ReturnType<typeof useMessageListState>;
}) {
	return <SkiaFlatList {...(props as SkiaFlatListElementProps)} debug style={style || { flex: 1 }} list={list} />;
};

export const MessageList = RenderMessageList;
// export const MessageList = memo(RenderMessageList, () => true);

export type MessageListState = ReturnType<typeof useMessageListState>;
