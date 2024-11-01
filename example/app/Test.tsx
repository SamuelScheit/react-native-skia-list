import "react-native-skia-list";
import type {} from "@shopify/react-native-skia/lib/typescript/src/renderer/HostComponents";
const { Skia } =
	require("@shopify/react-native-skia/src/") as typeof import("@shopify/react-native-skia/lib/typescript/src/");

const { SkiaViewNativeId } =
	require("@shopify/react-native-skia/src/views/SkiaViewNativeId") as typeof import("@shopify/react-native-skia/lib/typescript/src/views/SkiaViewNativeId");

import SkiaPictureViewNativeComponent from "../src/Util/SkiaPictureView";

import { useLayoutEffect, useRef, useState } from "react";
import { runOnUI as runOnUIImmediately, useFrameCallback } from "react-native-reanimated";
import { makeMutable, type SharedValue, useSharedValue } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Platform } from "react-native";
import {
	Canvas,
	FontSlant,
	FontWeight,
	FontWidth,
	matchFont,
	Paragraph,
	Rect,
	Text,
	TextAlign,
	TextBaseline,
	TextDecoration,
	TextDecorationStyle,
	type SkPicture,
	type SkTypefaceFontProvider,
} from "@shopify/react-native-skia";
const { JsiSkParagraphBuilder } =
	require("@shopify/react-native-skia/src/skia/web/JsiSkParagraphBuilder") as typeof import("@shopify/react-native-skia/lib/typescript/src/skia/web/JsiSkParagraphBuilder");

declare global {
	var fontManager: SkTypefaceFontProvider;
}

console.log("Skia", globalThis.fontManager);

globalThis.Skia = Skia;

const paragraphBuilder = Skia.ParagraphBuilder.Make(
	{
		textStyle: {
			color: Skia.Color("red"),
			fontSize: 50,
			fontFamilies: ["Roboto", "Noto"],
			decoration: TextDecoration.Underline,
			decorationColor: Skia.Color("green"),
			decorationStyle: TextDecorationStyle.Wavy,
			decorationThickness: 1,
			letterSpacing: 1,
			fontStyle: {
				slant: FontSlant.Upright,
				weight: FontWeight.Normal,
				width: FontWidth.Normal,
			},
			shadows: [
				{
					blurRadius: 10,
					color: Skia.Color("blue"),
					offset: { x: 10, y: 10 },
				},
			],
			textBaseline: TextBaseline.Ideographic,
		},
	},
	globalThis.fontManager
);

Skia.ParagraphBuilder.Make;

globalThis.paragraphBuilder = paragraphBuilder;

const paragraph = paragraphBuilder.addText("test 😂").build();

globalThis.paragraph = paragraph;
paragraph.layout(300);
console.log("paragraph", paragraph.getHeight());

const paint = Skia.Paint();
paint.setColor(Skia.Color("red"));

export default function TestSkiaPicture() {
	const _nativeId = SkiaViewNativeId.current++;
	// const recorderShared = useSharedValue<SkPictureRecorder>(Skia.PictureRecorder());
	// const canvasShared = useSharedValue<SkCanvas>(recorderShared.value.beginRecording());
	const startY = useSharedValue(0);
	const startX = useSharedValue(0);
	const y = useSharedValue(100);
	const x = useSharedValue(100);
	// const ref = useRef(null);

	// const setPicture =
	// 	Platform.OS === "web"
	// 		? (picture: SkPicture) => {
	// 				ref.current.props.picture = picture;
	// 			}
	// 		: (picture: SkPicture) => {
	// 				"worklet";
	// 			};

	// useFrameCallback(() => {
	// 	"worklet";

	// 	const recorder = Skia.PictureRecorder();
	// 	const canvas = recorder.beginRecording();

	// 	for (let i = 0; i < 20; i++) {
	// 		for (let j = 0; j < 20; j++) {
	// 			const paint = Skia.Paint();
	// 			paint.setColor(Skia.Color("red"));
	// 			canvas.drawCircle(x.value + i * 20, y.value + j * 20, 10, paint);
	// 		}
	// 	}

	// 	const picture = recorder.finishRecordingAsPicture();

	// 	SkiaViewApi.setJsiProperty(_nativeId, "picture", picture);
	// 	SkiaViewApi.requestRedraw(_nativeId);

	// 	setPicture(picture);
	// }, true);

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
			<Canvas style={{ flex: 1 }} mode="continuous">
				{/* <Rect x={x} y={y} width={300} height={300} color="red" /> */}
				<Paragraph paragraph={paragraph} x={x} y={y} width={300} />
				{/* <Text x={x} y={y} text="Hello, world!" font={font} color="red" /> */}
			</Canvas>
		</GestureDetector>
	);
}
