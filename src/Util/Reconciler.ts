import type { Skia } from "@shopify/react-native-skia/lib/typescript/src/skia/types";
import type { ReactNode } from "react";
import type { OpaqueRoot } from "react-reconciler";
import ReactReconciler from "react-reconciler";
import { skHostConfig, debug as hostDebug } from "./HostConfig";

// const { skHostConfig, debug: hostDebug } =
// 	require("@shopify/react-native-skia/src/renderer/HostConfig") as typeof import("@shopify/react-native-skia/lib/typescript/src/renderer/HostConfig");

const { Container } =
	require("@shopify/react-native-skia/src/renderer/Container") as typeof import("@shopify/react-native-skia/lib/typescript/src/renderer/Container");

import type { Container as ContainerType } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";

const skiaReconciler = ReactReconciler(skHostConfig);

skiaReconciler.injectIntoDevTools({
	bundleType: 1,
	version: "0.0.1",
	rendererPackageName: "react-native-skia",
});

export class SkiaRoot {
	private root: OpaqueRoot;
	private container: ContainerType;

	constructor(Skia: Skia, native = false, redraw: () => void = () => {}, getNativeId: () => number = () => 0) {
		this.container = new Container(Skia, redraw, getNativeId, native);
		this.root = skiaReconciler.createContainer(this.container, 0, null, true, null, "", console.error, null);
	}

	render(element: ReactNode) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		skiaReconciler.updateContainer(element as any, this.root, null, () => {
			hostDebug("updateContainer");
		});
	}

	unmount() {
		this.container.unmounted = true;
		skiaReconciler.updateContainer(null, this.root, null, () => {
			hostDebug("unmountContainer");
		});
	}

	get dom() {
		return this.container.root;
	}
}
