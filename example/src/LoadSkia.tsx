import { LoadSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

LoadSkiaWeb({
	locateFile(file) {
		return `/${file}`;
	},
}).then(() => import("./LoadFonts"));
