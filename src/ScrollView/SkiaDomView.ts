import type { RenderNode } from "@shopify/react-native-skia";
import type { ViewProps } from "react-native";

const { default: SkiaDomViewNativeComponent } =
	require("@shopify/react-native-skia/src/specs/SkiaDomViewNativeComponent") as typeof import("@shopify/react-native-skia/lib/typescript/src/specs/SkiaDomViewNativeComponent");

export default SkiaDomViewNativeComponent as import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<
	{
		mode: string;
		debug?: boolean;
		root?: RenderNode<any>;
	} & ViewProps
>;
