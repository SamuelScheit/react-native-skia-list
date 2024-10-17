// import "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { GestureDetector } from "react-native-gesture-handler";
import { useSkiaScrollView, type SkiaScrollViewProps, type SkiaScrollViewState } from "./State";
import { Skia } from "@shopify/react-native-skia";
import SkiaDomViewNativeComponent from "@shopify/react-native-skia/src/specs/SkiaDomViewNativeComponent";
import { runOnUI } from "react-native-reanimated";
import type { LayoutRectangle, ViewStyle } from "react-native";
import { useLayoutEffect, useMemo, type ReactNode } from "react";
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
	const state = list || useSkiaScrollView(props);
	const { _nativeId, gesture, layout, root, maxHeight, content, Scrollbar } = state;

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
			<Scrollbar />
			{fixedChildren}
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
				onLayout={(e) => {
					runOnUI((rect: LayoutRectangle) => {
						"worklet";

						layout.value = rect;

						if (props.height) maxHeight.value = Math.max(props.height - rect.height, 1);
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
