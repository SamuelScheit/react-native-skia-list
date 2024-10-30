import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";
import App from "../app/SkiaMessageList";

registerRootComponent(() => {
	return (
		<SafeAreaProvider>
			<App />
		</SafeAreaProvider>
	);
});
