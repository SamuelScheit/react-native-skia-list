import { LoadSkiaWeb } from "@shopify/react-native-skia/src/web";

LoadSkiaWeb({
	locateFile(file) {
		return `/${file}`;
	},
}).then(() => import("./LoadFonts"));
