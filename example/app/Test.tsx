import { Skia } from "@shopify/react-native-skia";
import { SkiaViewNativeId } from "@shopify/react-native-skia/src/views/SkiaViewNativeId";
import { useLayoutEffect } from "react";
import { runOnUIImmediately } from "react-native-reanimated/src/threads";
import { makeMutable, type SharedValue, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import SkiaPictureViewNativeComponent from "@shopify/react-native-skia/src/specs/SkiaPictureViewNativeComponent";

export default function TestSkiaPicture() {
	const _nativeId = SkiaViewNativeId.current++;
	// const recorderShared = useSharedValue<SkPictureRecorder>(Skia.PictureRecorder());
	// const canvasShared = useSharedValue<SkCanvas>(recorderShared.value.beginRecording());
	const startY = useSharedValue(0);
	const startX = useSharedValue(0);
	const y = useSharedValue(0);
	const x = useSharedValue(0);

	function onDraw(stopped: SharedValue<boolean>) {
		"worklet";

		if (stopped.value) return;

		const recorder = Skia.PictureRecorder();
		const canvas = recorder.beginRecording();

		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 20; j++) {
				const paint = Skia.Paint();
				paint.setColor(Skia.Color("red"));
				canvas.drawCircle(x.value + i * 20, y.value + j * 20, 10, paint);
			}
		}

		const picture = recorder.finishRecordingAsPicture();

		SkiaViewApi.setJsiProperty(_nativeId, "picture", picture);
		SkiaViewApi.requestRedraw(_nativeId);

		requestAnimationFrame(() => {
			onDraw(stopped);
		});
	}

	useLayoutEffect(() => {
		const stopped = makeMutable(false);

		runOnUIImmediately(onDraw)(stopped);

		return () => {
			stopped.value = true;
		};
	}, []);

	const gesture = Gesture.Pan()
		.onBegin((e) => {})
		.onStart(() => {
			startY.value = y.value;
			startX.value = x.value;
		})
		.onChange((e) => {
			y.value = startY.value + e.translationY;
			x.value = startX.value + e.translationX;
		})
		.onEnd((e) => {
			// end scroll
		})
		.onFinalize((g, success) => {});

	return (
		<GestureDetector gesture={gesture}>
			<SkiaPictureViewNativeComponent
				style={{ flex: 1 }}
				collapsable={false}
				nativeID={`${_nativeId}`}
				mode={"default"}
				debug
			/>
		</GestureDetector>
	);
}
