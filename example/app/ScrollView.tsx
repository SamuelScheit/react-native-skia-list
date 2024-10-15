import { Circle, Rect, Skia } from "@shopify/react-native-skia";
import { SkiaScrollView } from "react-native-skia-list";

const paint = Skia.Paint();
paint.setColor(Skia.Color("rgb(91, 128, 218)"));

export default function ScrollView() {
	return (
		<SkiaScrollView
			height={1300}
			debug
			style={{ backgroundColor: "white", flex: 1, margin: 0 }}
			// fixedChildren={<Fill invertClip clip={{ x: 6, y: 5, width: 130, height: 17 }} color="white" />}
		>
			<Circle cx={200} cy={50} r={50} paint={paint} />
			<Circle cx={200} cy={150} r={50} paint={paint} />
			<Circle cx={200} cy={250} r={50} paint={paint} />
			<Circle cx={200} cy={350} r={50} paint={paint} />
			<Circle cx={200} cy={450} r={50} paint={paint} />
			<Circle cx={200} cy={550} r={50} paint={paint} />
			<Circle cx={200} cy={650} r={50} paint={paint} />
			<Circle cx={200} cy={750} r={50} paint={paint} />
			<Circle cx={200} cy={850} r={50} paint={paint} />
			<Circle cx={200} cy={950} r={50} paint={paint} />
			<Circle cx={200} cy={1050} r={50} paint={paint} />
			<Circle cx={200} cy={1150} r={50} paint={paint} />
			<Circle cx={200} cy={1250} r={50} paint={paint} />
		</SkiaScrollView>
	);
}
