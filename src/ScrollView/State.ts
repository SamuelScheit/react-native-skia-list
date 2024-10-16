// import "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { Skia } from "@shopify/react-native-skia";
import { SkiaViewNativeId } from "@shopify/react-native-skia/lib/module/views/SkiaViewNativeId";
import { makeMutable, useSharedValue } from "react-native-reanimated";
import { getScrollGesture, type ScrollGestureProps } from "./ScrollGesture";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { runOnUI } from "react-native-reanimated";
import { useLayoutEffect, useMemo } from "react";
import type { ReanimatedContext } from "react-native-keyboard-controller";
import { Gesture } from "react-native-gesture-handler";
import { getScrollbar } from "./Scrollbar";

export type SkiaScrollViewProps<Additional = {}> = Additional &
	ScrollGestureProps & {
		customScrollGesture?: typeof getScrollGesture;
		safeAreaInsets?: {
			top?: number;
			bottom?: number;
			left?: number;
			right?: number;
		};
		automaticallyAdjustKeyboardInsets?: boolean;
		keyboard?: ReanimatedContext;
		inverted?: boolean;
	};

export function useSkiaScrollView<Additional>(props: SkiaScrollViewProps<Additional> = {} as any) {
	const keyboard = useReanimatedKeyboardAnimation();
	const layout = useSharedValue({ width: 0, height: 0 });
	const list = useMemo(() => {
		const _nativeId = SkiaViewNativeId.current++;
		const invertedFactor = props.inverted ? -1 : 1;

		const state = {
			_nativeId,
			root: makeMutable(SkiaDomApi.GroupNode({})),
			content: makeMutable(SkiaDomApi.GroupNode({})),
			matrix: makeMutable(Skia.Matrix().translate(0, 0).get()),
			safeArea: makeMutable({
				top: props.safeAreaInsets?.top || 0,
				bottom: props.safeAreaInsets?.bottom || 0,
				left: props.safeAreaInsets?.left || 0,
				right: props.safeAreaInsets?.right || 0,
			}),
			redraw() {
				"worklet";

				// SkiaViewApi.requestRedraw(_nativeId);
			},
			...props,
			invertedFactor,
		};

		const scrollState = (props.customScrollGesture || getScrollGesture)({
			...props,
			content: state.content,
			layout,
			offsetY: props.automaticallyAdjustKeyboardInsets !== false ? keyboard.height : makeMutable(0),
		});
		const { scrollY } = scrollState;
		const { matrix, content, root, redraw } = state;
		const scrollbar = getScrollbar({ ...scrollState, ...state });

		const gesture = Gesture.Exclusive(scrollbar.gesture, scrollState.gesture);
		// const gesture = scrollbar.gesture;

		root.value.addChild(content.value);

		runOnUI(() => {
			"worklet";
			let height = invertedFactor === -1 ? layout.value.height : 0;

			layout.addListener(1, (value) => {
				height = invertedFactor === -1 ? value.height : 0;
				onScroll(scrollY.value);
			});

			function onScroll(value: number) {
				const matrixValue = matrix.value;
				matrixValue[5] = value * -1 * invertedFactor + height;
				content.value.setProp("matrix", matrixValue);

				redraw();
			}

			scrollY.addListener(1, onScroll);
		})();

		return {
			...scrollState,
			...state,
			Scrollbar: scrollbar.Scrollbar,
			gesture,
		};
	}, []);

	useLayoutEffect(() => {
		const { scrollY } = list;
		return runOnUI(() => {
			"worklet";

			scrollY.removeListener(1);
			layout.removeListener(1);
		});
	}, []);

	if (props.height) {
		list.maxHeight.value = Math.max(props.height - list.layout.value.height, 1);
	}

	return list;
}

export type SkiaScrollViewState = ReturnType<typeof useSkiaScrollView>;
