<!-- ![](./docs/static/img/banner-dark.png#gh-dark-mode-only)
![](./docs/static/img/banner-light.png#gh-light-mode-only) -->

# React Native Skia List

![](_media/banner.png)

## Installation

Be aware the library is still in development and not done yet.

```sh
npm install react-native-skia-list
```

## [Documentation](https://samuelscheit.github.io/react-native-skia-list/)

<a href="https://samuelscheit.github.io/react-native-skia-list/#demo">
	<img width="230" src="_media/demo.gif" />
</a>

## Usage

```tsx
import { SkiaScrollView } from "react-native-skia-list";

function App() {
	return (
		<SkiaScrollView
			data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
			renderItem={({ item }) => <Text>{item}</Text>}
			height={200}
		/>
	);
}
```

## Contributing

See the [contributing guide](https://github.com/SamuelScheit/react-native-skia-list/blob/main/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Modules

- [ScrollView](ScrollView/index.md)
- [FlatList](FlatList/index.md)
