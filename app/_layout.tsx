import "react-native-url-polyfill/auto";
import { Slot, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardGestureArea, KeyboardProvider } from "react-native-keyboard-controller";
import { View } from "react-native";

export default function Layout() {
	return (
		<GestureHandlerRootView>
			<KeyboardProvider>
				<Slot />
			</KeyboardProvider>
		</GestureHandlerRootView>
	);
}
