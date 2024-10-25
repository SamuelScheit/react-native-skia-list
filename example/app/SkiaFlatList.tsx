import type {} from "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { matchFont, Skia } from "@shopify/react-native-skia";
import { SkiaFlatList, useSkiaFlatList } from "react-native-skia-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useEffect, useMemo } from "react";

export default function FlatList() {
	const safeArea = useSafeAreaInsets();

	const blue = Skia.Paint();
	blue.setColor(Skia.Color("rgb(0, 96, 162)"));

	const white = Skia.Color("#fff");

	const paragraphBuilder = useMemo(() => {
		return Skia.ParagraphBuilder.Make({
			textStyle: {
				fontSize: 24,
				fontFamilies: ["Arial"],
				color: Skia.Color("#fff"),
			},
		});
	}, []);

	const initialData = useCallback(() => {
		return Array.from({ length: 100 }, (_, i) => {
			paragraphBuilder.reset();

			return {
				id: `${i}`,
				text: paragraphBuilder.addText(`Item ${i}`).build(),
			};
		});
	}, []);

	type Entry = ReturnType<typeof initialData>[number];

	const keyExtractor = useCallback((item: Entry) => {
		"worklet";
		return item.id;
	}, []);

	const rectPadding = 10;
	const rectMargin = 10;

	const list = useSkiaFlatList({
		safeArea,
		keyExtractor,
		inverted: true,
		renderItem: (item, _index, state, element) => {
			"worklet";

			const { width } = state.layout.value;

			let maxTextWidth = width - rectPadding * 2;

			item.text.layout(maxTextWidth);

			const textHeight = item.text.getHeight();
			const rectHeight = textHeight + rectPadding * 2;

			const itemHeight = rectHeight + rectMargin;

			if (!element) return itemHeight;

			element.addChild(
				SkiaDomApi.RectNode({
					x: 0,
					y: 0,
					width,
					height: rectHeight,
					paint: blue,
				})
			);

			element.addChild(
				SkiaDomApi.ParagraphNode({
					paragraph: item.text,
					x: rectPadding,
					y: rectPadding,
					width: maxTextWidth,
					color: white,
				})
			);

			return itemHeight;
		},
	});

	useEffect(() => {
		console.log("resetData");
		list.resetData(initialData());
	}, [initialData]);

	return <SkiaFlatList list={list} style={{ flex: 1 }} />;
}
