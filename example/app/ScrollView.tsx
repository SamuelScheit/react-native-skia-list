import { Circle, Rect, Skia } from "@shopify/react-native-skia";
import { SkiaScrollView } from "react-native-skia-list";

const paint = Skia.Paint();
paint.setColor(Skia.Color("rgb(91, 128, 218)"));

const circleCount = 100;

export default function ScrollView() {
	return (
		<SkiaScrollView
			height={circleCount * 100}
			debug
			style={{ backgroundColor: "white", flex: 1, margin: 0 }}
			// fixedChildren={<Fill invertClip clip={{ x: 6, y: 5, width: 130, height: 17 }} color="white" />}
		>
			{Array.from({ length: circleCount }, (_, i) => (
				<Circle key={i} cx={50} cy={50 + i * 100} r={50} paint={paint} />
			))}
		</SkiaScrollView>
	);
}
