// import "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { Skia, type GroupProps, type RenderNode } from "@shopify/react-native-skia";
import { SkiaViewNativeId } from "@shopify/react-native-skia/lib/module/views/SkiaViewNativeId";
import { makeMutable, useSharedValue } from "react-native-reanimated";
import { getScrollGesture, type ScrollGestureProps, type ScrollGestureState } from "./ScrollGesture";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { runOnUI, type SharedValue } from "react-native-reanimated";
import { useLayoutEffect, useMemo } from "react";
import type { ReanimatedContext } from "react-native-keyboard-controller";
import { Gesture } from "react-native-gesture-handler";
import { getScrollbar } from "./Scrollbar";
import type { ComposedGesture } from "react-native-gesture-handler";
import type { EdgeInsets } from "react-native-safe-area-context";

export type InitialScrollViewState = {
	_nativeId: number;
	mode: SharedValue<"continuous" | "default">;
	root: SharedValue<RenderNode<GroupProps>>;
	content: SharedValue<RenderNode<GroupProps>>;
	layout: SharedValue<{ width: number; height: number }>;
	matrix: SharedValue<number[]>;
	redraw: () => void;
	safeArea: SharedValue<EdgeInsets>;
	invertedFactor: number;
	startedAnimation: () => void;
	finishedAnimation: () => void;
};

export type SkiaScrollViewProps<Additional = {}> = Additional &
	ScrollGestureProps & {
		customScrollGesture?: typeof getScrollGesture;
		customGesture?: (
			props: ScrollGestureState &
				InitialScrollViewState & {
					scrollbar: ReturnType<typeof getScrollbar>;
				}
		) => ComposedGesture;
		safeArea?: {
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
		let animations = makeMutable(0);
		const mode = makeMutable("default" as "continuous" | "default");

		const state = {
			_nativeId,
			mode,
			root: makeMutable(SkiaDomApi.GroupNode({})),
			content: makeMutable(SkiaDomApi.GroupNode({})),
			matrix: makeMutable(Skia.Matrix().translate(0, 0).get()),
			redraw() {
				"worklet";

				// SkiaViewApi.requestRedraw(_nativeId);
			},
			...props,
			layout,
			safeArea: makeMutable({
				top: props.safeArea?.top || 0,
				bottom: props.safeArea?.bottom || 0,
				left: props.safeArea?.left || 0,
				right: props.safeArea?.right || 0,
			}),
			invertedFactor,
			startedAnimation() {
				"worklet";

				animations.value++;
				mode.value = "continuous";
			},
			finishedAnimation() {
				"worklet";

				animations.value--;
				if (animations.value <= 0) {
					mode.value = "default";
					animations.value = 0;
				}
			},
		};

		const scrollState = (props.customScrollGesture || getScrollGesture)({
			...props,
			startedAnimation: state.startedAnimation,
			finishedAnimation: state.finishedAnimation,
			content: state.content,
			layout,
			offsetY: props.automaticallyAdjustKeyboardInsets !== false ? keyboard.height : makeMutable(0),
		});
		const { scrollY } = scrollState;
		const { matrix, content, root, redraw, safeArea } = state;
		const scrollbar = getScrollbar({ ...scrollState, ...state });

		const customGesture =
			props.customGesture || (({ scrollbar, gesture }) => Gesture.Exclusive(scrollbar.gesture, gesture));

		const gesture = customGesture({ scrollbar, ...scrollState, ...state });

		root.value.addChild(content.value);

		runOnUI(() => {
			"worklet";
			let height = invertedFactor === -1 ? layout.value.height - safeArea.value.bottom : safeArea.value.top;

			layout.addListener(1, (value) => {
				height = invertedFactor === -1 ? value.height - safeArea.value.bottom : safeArea.value.top;
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
			...(scrollState as Omit<typeof scrollState, "gesture">),
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
		const { safeArea, maxHeight, layout } = list;
		maxHeight.value = Math.max(props.height - layout.value.height + safeArea.value.top + safeArea.value.bottom, 1);
	}

	return list;
}

export type SkiaScrollViewState = ReturnType<typeof useSkiaScrollView>;
