const { Skia, Circle } =
	require("@shopify/react-native-skia/src/") as typeof import("@shopify/react-native-skia/lib/typescript/src/");

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SkiaScrollView } from "react-native-skia-list";

const paint = Skia.Paint();
paint.setColor(Skia.Color("rgb(91, 128, 218)"));

const circleCount = 20;

export default function ScrollView() {
	const safeArea = useSafeAreaInsets();

	return (
		<SkiaScrollView
			safeArea={safeArea}
			height={circleCount * 100}
			debug
			style={{ backgroundColor: "white", flex: 1, margin: 0 }}
			// fixedChildren={<Fill invertClip clip={{ x: 6, y: 5, width: 130, height: 17 }} color="white" />}
		>
			{Array.from({ length: circleCount }, (_, i) => (
				<Circle key={i} cx={210} cy={50 + i * 100} r={50} paint={paint} />
			))}
		</SkiaScrollView>
	);
}
