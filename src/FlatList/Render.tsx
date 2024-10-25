import type { ViewStyle } from "react-native";
import { useSkiaFlatList, type SkiaFlatListProps, type SkiaFlatListState } from "./State";
import type { ReactNode } from "react";
import { SkiaScrollView, type SkiaScrollViewElementProps } from "../ScrollView";

export type SkiaFlatListElementProps<T = any, A = any> = SkiaScrollViewElementProps & SkiaFlatListProps<T>;

/**
 * Use `<SkiaFlatList />` as a replacement for `<FlatList />` to render a list of items.
 *
 * :::info
 * This component uses the [`<SkiaScrollView />`](../ScrollView/) and inherits all props from it. \
 * Also it uses the Skia Rendering Engine so you can't use React Native components inside it.
 * :::
 *
 * :::note
 * You must know or calculate the layout and dimensions of the list items to use this list. \
 * For text content you can use the [`measureText()`](https://github.com/Shopify/react-native-skia/blob/569d071f3187b436fc1b2bdb38c74b73d962bfc8/packages/skia/src/skia/types/Font/Font.ts#L22) method or the Paragraph [`getHeight()`](https://github.com/Shopify/react-native-skia/blob/569d071f3187b436fc1b2bdb38c74b73d962bfc8/packages/skia/src/skia/types/Font/Font.ts#L22) API.
 * :::
 *
 * ### Example
 *
 * 
 * ```tsx
 * function FlatList() {
 *  const safeArea = useSafeAreaInsets();
 *
 *  const blue = Skia.Paint();
 *  blue.setColor(Skia.Color("rgb(67, 96, 162)"));
 *
 *  const white = Skia.Color("#fff");
 *
 *  const paragraphBuilder = useMemo(() => {
 *    return Skia.ParagraphBuilder.Make({
 *      textStyle: {
 *        fontSize: 24,
 *        fontFamilies: ["Arial"],
 *        color: Skia.Color("#fff"),
 *      },
 *    });
 *  }, []);
 *
 *  const initialData = useCallback(() => {
 *    return Array.from({ length: 100 }, (_, i) => {
 *      paragraphBuilder.reset();
 *
 *      return {
 *        id: `${i}`,
 *        text: paragraphBuilder.addText(`Item ${i}`).build(),
 *      };
 *    });
 *  }, []);
 *
 *  type Entry = ReturnType<typeof initialData>[number];
 *
 *  const keyExtractor = useCallback((item: Entry) => {
 *    "worklet";
 *    return item.id;
 *  }, []);
 *
 *  const rectPadding = 10;
 *  const rectMargin = 10;
 *
 *  return (
 *    <SkiaFlatList
 *      safeArea={safeArea}
 *      style={{ flex: 1 }}
 *      initialData={initialData}
 *      keyExtractor={keyExtractor}
 *      renderItem={(item, _index, state, element) => {
 *        "worklet";
 *
 *        const { width } = state.layout.value;
 *
 *        let maxTextWidth = width - rectPadding * 2;
 *
 *        item.text.layout(maxTextWidth);
 *
 *        const textHeight = item.text.getHeight();
 *        const rectHeight = textHeight + rectPadding * 2;
 *
 *        const itemHeight = rectHeight + rectMargin;
 *
 *        if (!element) return itemHeight;
 *
 *        element.addChild(
 *           SkiaDomApi.RectNode({
 *             x: 0,
 *             y: 0,
 *             width,
 *             height: rectHeight,
 *             paint: blue,
 *           })
 *        );
 *
 *        element.addChild(
 *          SkiaDomApi.ParagraphNode({
 *            paragraph: item.text,
 *            x: rectPadding,
 *            y: rectPadding,
 *            width: maxTextWidth,
 *            color: white,
 *          })
 *        );
 *
 *        return itemHeight;
 *      }}
 *    />
 *  );
 *}

 * ```
 */
export function SkiaFlatList<T, A>(props: SkiaFlatListElementProps<T, A>) {
	var { list, ...p } = props;
	if (!list) {
		list = useSkiaFlatList(p) as any;
	}

	return <SkiaScrollView {...p} list={list} />;
}
