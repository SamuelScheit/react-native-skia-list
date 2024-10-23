// import "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { GestureDetector, ScrollView } from "react-native-gesture-handler";
import { useSkiaScrollView, type SkiaScrollViewProps, type SkiaScrollViewState } from "./State";
import { Skia } from "@shopify/react-native-skia";
import SkiaDomViewNativeComponent, {
	type NativeProps,
} from "@shopify/react-native-skia/src/specs/SkiaDomViewNativeComponent";
import { runOnUI, runOnJS } from "react-native-reanimated";
import { type LayoutRectangle, type NativeMethods, type ScrollViewProps, type ViewStyle } from "react-native";
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { SkiaRoot } from "@shopify/react-native-skia/lib/module/renderer/Reconciler";
import type { BaseGestureHandlerProps } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon";

/** */
export type SkiaScrollViewElementProps = {
	/**
	 * Create your self managed list state using `useSkiaScrollView`:
	 *
	 * ```tsx
	 * const state = useSkiaScrollView({ height: 1000 });
	 *
	 * // do something with the state, e.g. skew the list content:
	 * state.matrix.value[1] = 0.1;
	 *
	 * <SkiaScrollView list={state} />
	 * ```
	 */
	list?: SkiaScrollViewState;
	/**
	 * The [view style](https://reactnative.dev/docs/view-style-props) of the canvas style.
	 * You should specify `flex: 1` to ensure the canvas fills the screen.
	 *
	 * ```tsx
	 * <SkiaScrollView style={{ flex: 1 }} />
	 * ```
	 */
	style?: ViewStyle;
	/**
	 * Use children to render skia elements.
	 * :::info
	 * You must manually specify the `height` prop of [ScrollGestureProps](#scrollgestureprops) to make the list scrollable.
	 * :::
	 *
	 * ```tsx
	 * <SkiaScrollView height={100} style={{ flex: 1 }}>
	 *	<Circle cx={50} cy={50 + 100} r={50} color="blue" />
	 * </SkiaScrollView>
	 * ```
	 *
	 * :::info
	 * If you are updating the children very fequently, you should consider using `useSkiaScrollView`
	 * to improve performance by imperatively updating the list content and therefore avoiding the React reconciler.
	 *
	 * ```tsx
	 * const state = useSkiaScrollView({ height: 1000 });
	 * const content = content.value;
	 *
	 * let previous = null;
	 * // do something with the list content, e.g. add a new rect every 10ms
	 * setInterval(() => {
	 * 	if (previous) content.removeChild(previous);
	 *
	 * 	previous = SkiaDomApi.RectNode({
	 * 		width: 100, height: 100,
	 * 		x: Math.random() * 1000,
	 * 		y: Math.random() * 1000
	 * 	});
	 *
	 * 	content.addChild(previous);
	 * }, 10);
	 * ```
	 * :::
	 */
	children?: ReactNode;
	/**
	 * Use `fixedChildren` to render skia elements that are displayed fixed on top of the list content and are not scrollable.
	 *
	 * ```tsx
	 * <SkiaScrollView fixedChildren={<Fill color="blue" />} />
	 * ```
	 */
	fixedChildren?: ReactNode;
	/**
	 * Enable debug mode to show the FPS count and render time.
	 */
	debug?: boolean;
	/**
	 * Determines whether the keyboard gets dismissed in response to a drag.
	 *   - `none` (the default) drags do not dismiss the keyboard.
	 *   - `onDrag` the keyboard is dismissed when a drag begins.
	 *   - `interactive` the keyboard is dismissed interactively with the drag
	 *     and moves in synchrony with the touch; dragging upwards cancels the
	 *     dismissal.
	 */
	keyboardDismissMode?: "none" | "interactive" | "on-drag" | undefined;

	/**
	 * Determines when the keyboard should stay visible after a tap.
	 * - `never` (the default), tapping outside of the focused text input when the keyboard is up dismisses the keyboard. When this happens, children won`t receive the tap.
	 * - `always`, the keyboard will not dismiss automatically, and the scroll view will not catch taps, but children of the scroll view can catch taps.
	 * - false, deprecated, use `never` instead
	 * - true, deprecated, use `always` instead
	 */
	keyboardShouldPersistTaps?: boolean | "always" | "never" | undefined;
} & SkiaScrollViewProps;

/**
 * Use `SkiaScrollView` as a replacement for the React Native `ScrollView` component.
 *
 * :::note
 * It uses the Skia renderer to render the content so you can't use React Native components inside it.
 * :::
 *
 * :::info
 * You must specify the `height` prop of [ScrollGestureProps](#scrollgestureprops) to make the list scrollable.
 * :::
 *
 * #### Example
 * ```tsx
 * const paint = Skia.Paint();
 * paint.setColor(Skia.Color("rgb(91, 128, 218)"));
 *
 * const circleCount = 100;
 *
 * <SkiaScrollView height={circleCount * 100} style={{ flex: 1 }}>
 *	{Array.from({ length: circleCount }, (_, i) => (
 *		<Circle key={i} cx={50} cy={50 + i * 100} r={50} paint={paint} />
 *	))}
 * </SkiaScrollView>
 * ```
 *
 * You can manage the list state yourself by using `useSkiaScrollView`: \
 * This is useful when you need to build custom behavior on top of the list, e.g. a sticky header, custom gestures/renderer.
 *
 * #### Example with `useSkiaScrollView`
 * ```tsx
 * const state = useSkiaScrollView({ height: 1000 });
 * const content = content.value;
 *
 * content.addChild(SkiaDomApi.RectNode({ width: 100, height: 100, x: 0, y: 0 }));
 *
 * <SkiaScrollView list={state} style={{ flex: 1 }} />
 * ```
 */
export function SkiaScrollView(props: SkiaScrollViewElementProps) {
	var { list, style, children, debug, fixedChildren, keyboardDismissMode, keyboardShouldPersistTaps, ...p } = props;
	const ref = useRef<(React.Component<NativeProps, {}, any> & Readonly<NativeMethods>) | null>(null);
	const scrollViewRef = useRef<InteractiveScrollViewRef>(null);
	var state = list;
	if (!state) {
		state = useSkiaScrollView(p) as any;
	}
	const { _nativeId, gesture, layout, safeArea, maxHeight, content, root, Scrollbar, mode } = state;

	useLayoutEffect(() => {
		function setMode(value: string) {
			ref.current?.setNativeProps({ mode: value });
		}

		runOnUI(() => {
			mode.addListener(1, (value) => {
				runOnJS(setMode)(value);
			});
		})();

		return runOnUI(() => {
			mode.removeListener(1);
		});
	}, []);

	const [fixedReconciler] = useState(() => {
		const reconciler = new SkiaRoot(Skia, !!global.SkiaDomApi, state.redraw);

		root.value.insertChildBefore(reconciler.dom, content.value);

		return reconciler;
	});
	const [contentReconciler] = useState(() => {
		const reconciler = new SkiaRoot(Skia, !!global.SkiaDomApi, state.redraw);

		content.value.addChild(reconciler.dom);

		return reconciler;
	});

	contentReconciler.render(children);
	fixedReconciler.render(
		<>
			{fixedChildren}
			<Scrollbar />
		</>
	);

	return (
		<>
			<SkiaDomViewNativeComponent
				ref={(x) => (ref.current = x)}
				onLayout={(e) => {
					scrollViewRef.current?.setLayout(e.nativeEvent.layout);
					runOnUI((rect: LayoutRectangle) => {
						"worklet";

						layout.value = rect;

						if (p.height) {
							maxHeight.value = Math.max(
								p.height - rect.height + safeArea.value.top + safeArea.value.bottom,
								1
							);
						}
					})(e.nativeEvent.layout);
				}}
				nativeID={`${_nativeId}`}
				// mode={"continuous"}
				mode={"default"}
				debug={debug}
				style={style || { flex: 1 }}
			/>
			<GestureDetector gesture={gesture}>
				<InteractiveScrollView
					keyboardDismissMode={keyboardDismissMode || "interactive"}
					keyboardShouldPersistTaps={keyboardShouldPersistTaps || "handled"}
					ref={scrollViewRef}
					simultaneousHandlers={state.simultaneousHandlers}
				/>
			</GestureDetector>
		</>
	);
}

type InteractiveScrollViewProps = {
	simultaneousHandlers: BaseGestureHandlerProps["simultaneousHandlers"];
	keyboardDismissMode?: ScrollViewProps["keyboardDismissMode"];
	keyboardShouldPersistTaps?: ScrollViewProps["keyboardShouldPersistTaps"];
};

type InteractiveScrollViewRef = {
	setLayout: (layout: LayoutRectangle) => void;
};

const InteractiveScrollView = forwardRef<InteractiveScrollViewRef, InteractiveScrollViewProps>(
	function InteractiveScrollView(props, ref) {
		const [layout, setLayout] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });

		useImperativeHandle(ref, () => {
			return {
				setLayout,
			};
		});

		return (
			<ScrollView
				{...props}
				style={{
					zIndex: 1,
					position: "absolute",
					width: layout.width,
					height: layout.height,
					top: layout.y,
					left: layout.x,
				}}
			/>
		);
	}
);
