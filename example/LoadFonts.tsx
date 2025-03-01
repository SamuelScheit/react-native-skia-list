const { Skia } =
	require("@shopify/react-native-skia/src/") as typeof import("@shopify/react-native-skia/lib/typescript/src/");

const loadTypefaces = (typefacesToLoad: Record<string, string[]>) => {
	const promises = Object.keys(typefacesToLoad).flatMap((familyName) => {
		return typefacesToLoad[familyName].map((typefaceToLoad) => {
			return Skia.Data.fromURI(typefaceToLoad).then((data) => {
				console.log("Loaded typeface", familyName, data);
				const tf = Skia.Typeface.MakeFreeTypeFaceFromData(data);
				if (tf === null) {
					throw new Error(`Couldn't create typeface for ${familyName}`);
				}
				globalThis.roboto = tf;
				return [familyName, tf] as const;
			});
		});
	});
	return Promise.all(promises);
};

const fonts: Record<string, string[]> = {
	Roboto: [require("./assets/Roboto-Regular.ttf")],
	Noto: [require("./assets/NotoColorEmoji-Regular.ttf")],
};

loadTypefaces(fonts).then(async (result) => {
	const fMgr = Skia.TypefaceFontProvider.Make();
	result.forEach(([familyName, typeface]) => {
		fMgr.registerFont(typeface, familyName);
	});

	globalThis.fontManager = fMgr;

	return import("./LoadApp");
});
