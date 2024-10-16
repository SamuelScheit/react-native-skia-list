import { Skia } from "@shopify/react-native-skia";
import { Platform } from "react-native";

export const replyIconFactory = (color: string) =>
	Skia.SVG.MakeFromString(
		`<svg viewBox="0 0 24 24"><path fill="${color}" d="M20.446 16.06a.5.5 0 0 1-.655.68l-2.5-1.153a14.4 14.4 0 0 0-6.681-1.309a61 61 0 0 1-.121 2.204l-.069.938a.754.754 0 0 1-1.158.581a19.6 19.6 0 0 1-5.351-5.068l-.46-.64a.5.5 0 0 1 0-.584l.46-.64A19.6 19.6 0 0 1 9.262 6a.754.754 0 0 1 1.158.58l.069.94q.069.945.108 1.89h.644a9.5 9.5 0 0 1 8.475 5.209z"/></svg>`
	);

export const copyIconFactory = (color: string) =>
	Skia.SVG.MakeFromString(
		`<svg viewBox="0 0 24 24"><path fill="${color}" d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593s1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.6 3.6 0 0 0 15.24 2"/><path fill="${color}" d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847S21 8.671 21 11.397v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936z"/></svg>`
	);

export const deleteIconFactory = (color: string) =>
	Skia.SVG.MakeFromString(
		`<svg viewBox="0 0 24 24"><path fill="${color}" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/></svg>`
	);

export const emojiFontFamily =
	Platform.select({ ios: "Apple Color Emoji", android: "Noto Color Emoji" }) || "sans-serif";
