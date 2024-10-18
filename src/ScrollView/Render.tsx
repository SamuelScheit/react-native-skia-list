// import "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { GestureDetector } from "react-native-gesture-handler";
import { useSkiaScrollView, type SkiaScrollViewProps, type SkiaScrollViewState } from "./State";
import { Skia } from "@shopify/react-native-skia";
import SkiaDomViewNativeComponent, {
	type NativeProps,
} from "@shopify/react-native-skia/src/specs/SkiaDomViewNativeComponent";
import { runOnUI, runOnJS } from "react-native-reanimated";
import type { LayoutRectangle, NativeMethods, ViewStyle } from "react-native";
import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { SkiaRoot } from "@shopify/react-native-skia/lib/module/renderer/Reconciler";
import { SkiaViewApi } from "@shopify/react-native-skia/lib/module/views/api";

export function SkiaScrollView({
	list,
	style,
	children,
	debug,
	fixedChildren,
	...props
}: {
	list?: SkiaScrollViewState;
	style?: ViewStyle;
	children?: ReactNode;
	fixedChildren?: ReactNode;
	debug?: boolean;
} & SkiaScrollViewProps) {
	const ref = useRef<(React.Component<NativeProps, {}, any> & Readonly<NativeMethods>) | null>(null);
	const state = list || useSkiaScrollView(props);
	const { _nativeId, gesture, layout, root, safeArea, maxHeight, content, Scrollbar, mode } = state;

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

	const fixedReconciler = useMemo(() => {
		const reconciler = new SkiaRoot(Skia, !!global.SkiaDomApi, state.redraw);

		state.root.value.insertChildBefore(reconciler.dom, content.value);

		return reconciler;
	}, []);
	const contentReconciler = useMemo(() => {
		const reconciler = new SkiaRoot(Skia, !!global.SkiaDomApi, state.redraw);

		state.content.value.addChild(reconciler.dom);

		return reconciler;
	}, []);

	contentReconciler.render(children);
	fixedReconciler.render(
		<>
			{fixedChildren}
			<Scrollbar />
		</>
	);

	useLayoutEffect(() => {
		SkiaViewApi.setJsiProperty(_nativeId, "root", root.value);

		return () => {
			contentReconciler.unmount();
		};
	}, []);

	return (
		<GestureDetector gesture={gesture}>
			<SkiaDomViewNativeComponent
				ref={(x) => (ref.current = x)}
				onLayout={(e) => {
					runOnUI((rect: LayoutRectangle) => {
						"worklet";

						layout.value = rect;

						if (props.height) {
							maxHeight.value = Math.max(
								props.height - rect.height + safeArea.value.top + safeArea.value.bottom,
								1
							);
						}

						console.log("onLayout", rect);
					})(e.nativeEvent.layout);
				}}
				nativeID={`${_nativeId}`}
				// mode={"continuous"}
				mode={"default"}
				debug={debug}
				style={style || { flex: 1 }}
			/>
		</GestureDetector>
	);
}
