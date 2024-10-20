import type {} from "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { matchFont, Skia } from "@shopify/react-native-skia";
import { SkiaFlatList } from "react-native-skia-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const paint = Skia.Paint();
paint.setColor(Skia.Color("rgb(91, 128, 218)"));

const white = Skia.Paint();
white.setColor(Skia.Color("#fff"));

const font = matchFont({ fontSize: 20, fontFamily: "Arial" });

export default function FlatList() {
	const safeArea = useSafeAreaInsets();

	return (
		<SkiaFlatList
			debug
			safeArea={safeArea}
			style={{ backgroundColor: "white", flex: 1 }}
			initialData={() => Array.from({ length: 1000 }, (_, i) => i)}
			renderItem={(element, item, _index, _state) => {
				"worklet";

				if (!element) return 100;

				element?.addChild(
					SkiaDomApi.RectNode({
						x: 0,
						y: 0,
						width: 130,
						height: 80,
						paint,
					})
				);

				element.addChild(
					SkiaDomApi.TextNode({
						text: `${item}`,
						font,
						x: 50,
						y: 40,
						paint: white,
					})
				);

				return 100;
			}}
			// fixedChildren={<Fill invertClip clip={{ x: 6, y: 5, width: 130, height: 17 }} color="white" />}
		/>
	);
}
