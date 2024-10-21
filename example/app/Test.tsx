import { useRef, useState } from "react";
import { Dimensions, TextInput, View, type LayoutRectangle } from "react-native";
import { Gesture, GestureDetector, PanGestureHandler, ScrollView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const customRef = { current: null } as any;

export default function Test() {
	const safeArea = useSafeAreaInsets();
	const { width, height } = Dimensions.get("window");
	const x = useSharedValue(width / 2);
	const y = useSharedValue(height / 2);
	const style = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: x.value }, { translateY: y.value }],
		};
	});
	const panGestureRef = useRef(Gesture.Pan());

	const gesture = Gesture.Pan()
		.onChange((e) => {
			x.value += e.changeX;
			y.value += e.changeY;
		})
		.enabled(true)
		.withRef(customRef);

	const [layout, setLayout] = useState<LayoutRectangle>({ x: 0, y: 0, width: 0, height: 0 });

	const nativeRef = useRef(Gesture.Native());
	const native = Gesture.Native()
		.simultaneousWithExternalGesture(gesture)
		.disallowInterruption(false)
		.shouldActivateOnStart(true)
		.withRef(nativeRef)
		.onTouchesMove((e) => {
			console.log("onTouchesMove", e.allTouches[0]);
		})
		.enabled(true);

	return (
		<View style={{ flex: 1, backgroundColor: "#222", paddingLeft: 10 }}>
			<View style={{ flex: 1 }}>
				<GestureDetector gesture={gesture}>
					<ScrollView
						keyboardDismissMode="interactive"
						simultaneousHandlers={customRef}
						style={{
							zIndex: 100,
							// backgroundColor: "#00000070",
							position: "absolute",
							width: layout.width,
							height: layout.height,
							top: layout.y,
							left: layout.x,
						}}
					>
						{/* <Animated.View
							style={[{ top: 100, width: 10, height: 10, backgroundColor: "#00f000", borderRadius: 50 }]}
						/> */}
					</ScrollView>
				</GestureDetector>
				<View
					style={{ flex: 1 }}
					onLayout={(e) => {
						setLayout(e.nativeEvent.layout);
					}}
				>
					<Animated.View
						style={[{ width: 100, height: 100, backgroundColor: "#0000f0", borderRadius: 50 }, style]}
					/>
					<Animated.View
						style={[
							{
								width: 100,
								height: 100,
								backgroundColor: "#00f000",
								position: "absolute",
								top: 0,
								left: 0,
							},
						]}
					/>
				</View>
				<TextInput
					style={{
						padding: 20,
						paddingBottom: 20 + safeArea.bottom,
						borderColor: "gray",
						borderWidth: 1,
						color: "#fff",
					}}
					placeholderTextColor={"#aaa"}
					placeholder="Message"
				/>
			</View>
		</View>
	);
}
