import type {} from "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { Skia } from "@shopify/react-native-skia";
import { SkiaFlatList } from "react-native-skia-list";

const paint = Skia.Paint();
paint.setColor(Skia.Color("rgb(91, 128, 218)"));

export default function FlatList() {
	return (
		<SkiaFlatList
			height={1300}
			debug
			style={{ backgroundColor: "white", flex: 1 }}
			initialData={() => Array.from({ length: 100 }, (_, i) => i)}
			renderItem={(element, item, index, state) => {
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

				return 100;
			}}
			// fixedChildren={<Fill invertClip clip={{ x: 6, y: 5, width: 130, height: 17 }} color="white" />}
		/>
	);
}
