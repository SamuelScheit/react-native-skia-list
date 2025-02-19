<!-- ![](./docs/static/img/banner-dark.png#gh-dark-mode-only)
![](./docs/static/img/banner-light.png#gh-light-mode-only) -->

# React Native Skia List

![](./docs/static/img/banner.png)

React Native Skia List is a high-performance list component for React Native. \
It is built on top of [@shopify/react-native-skia](https://shopify.github.io/react-native-skia/), a powerful 2D graphics library designed to be fast and customizable.

## Installation

> [!CAUTION]
> This library is in early development and not ready for production use.

```sh
yarn add react-native-skia-list @shopify/react-native-skia react-native-keyboard-controller react-native-reanimated react-native-gesture-handler
```

## [Documentation](https://samuelscheit.github.io/react-native-skia-list/)

You can achieve good looking, interactive and high-performance lists with a lot of items like the following example:

<a href="https://samuelscheit.github.io/react-native-skia-list/#demo">
	<img width="230" src="./docs/static/demo.gif" />
</a>

## Usage

```tsx
// needed for SkiaDomApi type
import type {} from "@shopify/react-native-skia/lib/typescript/src/renderer/HostComponents";
import { Skia } from "@shopify/react-native-skia";
import { SkiaFlatList } from "react-native-skia-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

// Create a Skia ParagraphBuilder that will be used to build the text for each item
const paragraphBuilder = Skia.ParagraphBuilder.Make({
	textStyle: {
		color: Skia.Color("black"),
		fontSize: 20,
	},
});

export default function Test() {
	const safeArea = useSafeAreaInsets();

	return (
		<KeyboardProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<SkiaFlatList
					safeArea={safeArea}
					// Provide an initialData array that can be serialized and passed to the worklet thread
					initialData={() => [0, 1, 2, 3, 4, 5, 6, 7, 8]}
					// To optimize performance for the initial mount you can provide a transformItem function
					// It will be called once for each item when it is mounted the first time
					transformItem={(item, index, id, state) => {
						"worklet";

						paragraphBuilder.reset(); // reuses the paragraphBuilder for each item
						const text = `Item ${item}`;

						return paragraphBuilder.addText(text).build();
					}}
					// renderItem will be called whenever an item visibility changes
					renderItem={(item, index, state, element) => {
						"worklet";

						const { width } = state.layout.value;

						item.layout(width); // calculates the paragraph layout

						const height = item.getHeight(); // gets the height of the paragraph

						// element is a Skia.GroupNode or will be undefined if only the height of the element is needed
						if (!element) return height;

						element.addChild(
							// see the following link for all element types
							// https://github.com/Shopify/react-native-skia/blob/5c38b27d72cea9c158290adb7d23c6109369ac2f/packages/skia/src/renderer/HostComponents.ts#L72-L191
							SkiaDomApi.ParagraphNode({
								paragraph: item,
								x: 0,
								y: 0,
								width,
							})
						);

						return height;
					}}
				/>
			</GestureHandlerRootView>
		</KeyboardProvider>
	);
}
```

## Contributing

See the [contributing guide](https://github.com/SamuelScheit/react-native-skia-list/blob/main/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
