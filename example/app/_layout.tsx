import "react-native-url-polyfill/auto";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardGestureArea, KeyboardProvider } from "react-native-keyboard-controller";

export default function Layout() {
	return (
		<GestureHandlerRootView>
			<KeyboardProvider>
				<Stack
					screenOptions={{
						fullScreenGestureEnabled: true,
						headerShown: false,
					}}
				/>
			</KeyboardProvider>
		</GestureHandlerRootView>
	);
}
