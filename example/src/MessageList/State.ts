import { runOnJS, runOnUI, useSharedValue } from "react-native-reanimated";
import { useLayoutEffect, useMemo } from "react";
import { interpolateClamp, useSkiaFlatList, type TapResult } from "react-native-skia-list";
import { Gesture } from "react-native-gesture-handler";
import { getContextMenu } from "./ContextMenu";
import { getSwipeGesture } from "./Swipe";
import { trigger } from "react-native-haptic-feedback";
import { replyIconFactory } from "./Assets";
import { Skia, type ImageProps, type RenderNode, type SkImage, type SkParagraph } from "@shopify/react-native-skia";
import { getRenderMessageItem, type MessageListProps } from "./Render";
import { SkiaViewApi } from "@shopify/react-native-skia/lib/module/views/api";

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

const replyIcon = replyIconFactory("#6b6c6f");

export function useMessageListState(props: MessageListProps) {
	const avatars = useSharedValue({} as Record<string, RenderNode<ImageProps> | undefined>);
	const contextMenuMessage = useSharedValue<TapResult<MessageItem> | undefined>(undefined);
	const renderItem: any = getRenderMessageItem(props);
	const root = useSharedValue(SkiaDomApi.GroupNode({}));
	const swipePosition = useSharedValue(0);
	const swipeItem = useSharedValue(undefined as string | undefined | number);

	useMemo(() => {
		root.value.addChild(
			SkiaDomApi.FillNode({
				color: "white",
			})
		);
	}, []);

	const list = useSkiaFlatList({
		root,
		...props,
		inverted: true,
		contextMenuMessage,
		renderItem,
		avatars,
		keyExtractor: (item: any) => {
			"worklet";
			return item.id;
		},
	});

	const replyIconElement = useMemo(() => {
		const replyIconElement = SkiaDomApi.ImageSVGNode({
			svg: replyIcon,
			width: 30,
			height: 30,
			x: 0,
			y: 0,
		});
		replyIconElement.setProp("matrix", Skia.Matrix().scale(0, 0).get());
		list.content.value.addChild(replyIconElement);

		return replyIconElement;
	}, []);

	const { getItemFromTouch, scrollY, _nativeId, elements, rowOffsets, heights, layout, safeArea } = list;
	const swipeTreshold = 30;

	const swipeGesture = getSwipeGesture({
		onEndSwipe() {
			"worklet";
			// console.log("onEndSwipe");
		},
		onOverSwipe() {
			"worklet";
			runOnJS(trigger)("impactMedium");
		},
		onStartSwipe(e) {
			"worklet";
			const item = getItemFromTouch(e);
			console.log("onStartSwipe", item?.id);
			swipeItem.value = item?.id;
		},
		onSwipe() {
			"worklet";
			console.log("onSwipe");
		},
		swipePosition,
		threshold: swipeTreshold,
	});

	useLayoutEffect(() => {
		runOnUI(() => {
			"worklet";

			swipePosition.addListener(_nativeId, (value) => {
				if (!swipeItem.value) return;
				const element = elements.value[swipeItem.value];
				if (!element) return;

				const x = value;
				const y = rowOffsets.value[swipeItem.value];
				if (y === undefined) return;

				const itemHeight = heights.value[swipeItem.value] || 0;

				element.setProp("matrix", Skia.Matrix().translate(x, y).get());
				SkiaViewApi.requestRedraw(_nativeId);

				const replyIconSize = interpolateClamp(value, -swipeTreshold, 0, 1, 0);

				const spacingRight = layout.value.width - replyIconSize - safeArea.value.right - 5;

				const replyX = spacingRight + value;
				const replyY = y + itemHeight / 2 - replyIconSize * 15;

				replyIconElement.setProp("origin", {
					x: replyX,
					y: replyY,
				});
				replyIconElement.setProp(
					"matrix",
					Skia.Matrix().scale(replyIconSize, replyIconSize).translate(replyX, replyY).get()
				);
			});
		})();

		return runOnUI(() => {
			"worklet";

			scrollY.removeListener(_nativeId);
			swipePosition.removeListener(_nativeId);
		});
	}, []);

	const contextMenu = getContextMenu(list);
	list.gesture = Gesture.Exclusive(list.scrollbarGesture, swipeGesture, contextMenu.gesture, list.scrollGesture);

	return list;
}
