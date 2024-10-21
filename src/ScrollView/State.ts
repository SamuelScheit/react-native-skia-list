// import "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { Skia, type GroupProps, type RenderNode } from "@shopify/react-native-skia";
import { SkiaViewNativeId } from "@shopify/react-native-skia/lib/module/views/SkiaViewNativeId";
import { makeMutable, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { getScrollGesture, type ScrollGestureProps, type ScrollGestureState } from "./ScrollGesture";
import { useKeyboardHandler, useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { runOnUI, type SharedValue } from "react-native-reanimated";
import { useLayoutEffect, useMemo } from "react";
import type { ReanimatedContext } from "react-native-keyboard-controller";
import { Gesture } from "react-native-gesture-handler";
import { getScrollbar } from "./Scrollbar";
import type { ComposedGesture, GestureType } from "react-native-gesture-handler";
import { Keyboard } from "react-native";

interface EdgeInsets {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

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

/**
 */
export type SkiaScrollViewProps<A = {}> = A &
	Partial<Omit<SkiaScrollViewState, "safeArea">> &
	ScrollGestureProps & {
		/**
		 * Specify a custom scroll gesture.
		 */
		customScrollGesture?: typeof getScrollGesture;
		/**
		 * Specify a custom gesture handler.
		 * E.g. to implement scrolling and swiping list items horizontally.
		 */
		customGesture?: (
			props: ScrollGestureState &
				InitialScrollViewState & {
					scrollbar: ReturnType<typeof getScrollbar>;
				}
		) => ComposedGesture;
		/**
		 * Specify offsets for the content of the scroll view.
		 *
		 * e.g. `{ top: 30, bottom: 20, left: 15, right: 15 }`
		 */
		safeArea?: EdgeInsets;
		/**
		 * Set to `false` to disable the automatic keyboard adjustment.
		 */
		automaticallyAdjustKeyboardInsets?: boolean;
		/**
		 * Specify a custom keyboard handler
		 */
		keyboard?: ReanimatedContext;
		/**
		 * SkiaScrollView so that the elements start rendering from the bottom screen to the top.
		 */
		inverted?: boolean;
	};

export type SkiaScrollViewState = InitialScrollViewState &
	Omit<ScrollGestureState, "gesture"> & {
		scrollGesture: GestureType | ComposedGesture;
		scrollbarGesture: GestureType | ComposedGesture;
		Scrollbar: () => JSX.Element;
		gesture: ComposedGesture;
		simultaneousHandlers: React.RefObject<GestureType>[];
	};

/**
 *
 */
export function useSkiaScrollView<A>(props: SkiaScrollViewProps<A> = {} as any): SkiaScrollViewState {
	const keyboardHeight = useSharedValue(0);
	const keyboardWillHide = useSharedValue(false);

	useKeyboardHandler(
		{
			onStart: (e) => {
				"worklet";
				// console.log("onStart", e);
			},
			onMove: (e) => {
				"worklet";
				// console.log("onMove", e);
				keyboardHeight.value = -e.height;
			},
			onInteractive: (e) => {
				"worklet";
				// console.log("onInteractive", e);
				// keyboardHeight.value = -e.height;
			},
			onEnd: (e) => {
				"worklet";
				// console.log("onEnd", e);
			},
		},
		[]
	);
	const layout = useSharedValue({ width: 0, height: 0 });
	const offsetY = props.automaticallyAdjustKeyboardInsets !== false ? keyboardHeight : makeMutable(0);

	const list = useMemo(() => {
		const _nativeId = SkiaViewNativeId.current++;
		const invertedFactor = props.inverted ? -1 : 1;
		let animations = makeMutable(0);
		const mode = makeMutable("default" as "continuous" | "default");
		const root = props.root?.value || SkiaDomApi.GroupNode({});

		const state = {
			_nativeId,
			mode,
			root: props.root || makeMutable(root),
			content: makeMutable(SkiaDomApi.GroupNode({})),
			matrix: makeMutable(Skia.Matrix().translate(0, 0).get()),
			redraw() {
				"worklet";

				SkiaViewApi.requestRedraw(_nativeId);
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

		SkiaViewApi.setJsiProperty(_nativeId, "root", root);

		const scrollState = (props.customScrollGesture || getScrollGesture)({
			...props,
			startedAnimation: state.startedAnimation,
			finishedAnimation: state.finishedAnimation,
			content: state.content,
			layout,
			offsetY,
		});
		const scrollGestureRef = { current: scrollState.gesture };
		scrollState.gesture.withRef(scrollGestureRef);

		const { scrollY } = scrollState;
		const { matrix, content, redraw, safeArea } = state;
		const scrollbar = getScrollbar({ ...scrollState, ...state });
		const scrollbarRef = { current: scrollbar.gesture };
		scrollbar.gesture.withRef(scrollbarRef);

		const customGesture =
			props.customGesture || (({ scrollbar, gesture }) => Gesture.Exclusive(scrollbar.gesture, gesture));

		const gesture = customGesture({ scrollbar, ...scrollState, ...state } as any);

		root.addChild(content.value);

		runOnUI(() => {
			"worklet";
			let height = invertedFactor === -1 ? layout.value.height - safeArea.value.bottom : safeArea.value.top;

			layout.addListener(1, (value) => {
				height = invertedFactor === -1 ? value.height - safeArea.value.bottom : safeArea.value.top;
				onScroll(scrollY.value);
			});

			function onScroll(value: number) {
				const matrixValue = matrix.value;
				matrixValue[5] = value * -1 * invertedFactor + height + offsetY.value;
				content.value.setProp("matrix", matrixValue);

				redraw();
			}

			scrollY.addListener(1, onScroll);
			offsetY.addListener(1, () => onScroll(scrollY.value));
		})();

		return {
			...(scrollState as Omit<typeof scrollState, "gesture">),
			...state,
			Scrollbar: scrollbar.Scrollbar,
			gesture,
			scrollGesture: scrollState.gesture,
			scrollbarGesture: scrollbar.gesture,
			simultaneousHandlers: [scrollGestureRef, scrollbarRef],
		};
	}, []);

	useLayoutEffect(() => {
		const { scrollY, offsetY } = list;
		return runOnUI(() => {
			"worklet";

			scrollY.removeListener(1);
			layout.removeListener(1);
			offsetY.removeListener(1);
		});
	}, []);

	if (props.height) {
		const { safeArea, maxHeight, layout } = list;
		maxHeight.value = Math.max(props.height - layout.value.height + safeArea.value.top + safeArea.value.bottom, 1);
	}

	return list;
}
