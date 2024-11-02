# FlatList

## **SkiaFlatList**(`SkiaFlatListElementProps<T,B>`): `Element`

Use `<SkiaFlatList />` as a replacement for `<FlatList />` to render a list of items.

:::info
This component uses the `<SkiaScrollView />` and inherits all props from it. \
Also it uses the Skia Rendering Engine so you can't use React Native components inside it.
:::

:::note
You must know or calculate the layout and dimensions of the list items to use this list. \
For text content you can use the [`measureText()`](https://github.com/Shopify/react-native-skia/blob/569d071f3187b436fc1b2bdb38c74b73d962bfc8/packages/skia/src/skia/types/Font/Font.ts#L22) method or the Paragraph [`getHeight()`](https://github.com/Shopify/react-native-skia/blob/569d071f3187b436fc1b2bdb38c74b73d962bfc8/packages/skia/src/skia/types/Font/Font.ts#L22) API.
:::

### Example

```tsx
// needed for SkiaDomApi type
import type {} from "@shopify/react-native-skia/lib/typescript/src/renderer/HostComponents";
import { Skia } from "@shopify/react-native-skia";
import { SkiaFlatList } from "react-native-skia-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Create a Skia ParagraphBuilder that will be used to build the paragraph for each item
const paragraphBuilder = Skia.ParagraphBuilder.Make({
 textStyle: {
   color: Skia.Color("black"),
   fontSize: 20,
 },
});

export default function Test2() {
 const safeArea = useSafeAreaInsets();

 return (
   <SkiaFlatList
  safeArea={safeArea}
     // Provide an initialData array that can be serialized and passed to the worklet thread
     initialData={() => [0, 1, 2, 3, 4, 5, 6, 7, 8]}
     // To optimize performance for the initial mount you can provide a transformItem function
     // It will be called once for each item when it is mounted the first time
     transformItem={(item, index, id, state) => {
       "worklet";

       paragraphBuilder.reset(); // reuses the paragraphBuilder for each item

       return paragraphBuilder.addText(`Item ${item}`).build();
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
         }),
       );

       return height;
     }}
   />
 );
}

```

***

## **useSkiaFlatList**([`SkiaFlatListProps<T,B>`](index.md#skiaflatlistprops)): [`SkiaFlatListState<T,B>`](index.md#skiaflatliststate)

Use this hook to manage and access the state of SkiaFlatList.
```tsx
const state = useSkiaFlatList({ ... });

<SkiaFlatList list={state} style={{ flex: 1 }} />
```

***

## SkiaFlatListProps

### initialData?: `() => T[]`

### initialTransformed?: `() => Record<string,B>`

### estimatedItemHeight?: `number`

Rough estimate of the height of each item in the list.
Used to calculate the maximum scroll height.
Set a higher value than average to ensure the user can easily scroll to the end of the list.
Default is 100.

### keyExtractor?: `(item, index) => string`

***

## SkiaFlatListState

### elements: `SharedValue<Record<string,RenderNode<GroupProps> | undefined>>`

Contains currently mounted elements

### heights: `SharedValue<Record<string,number>>`

Contains the height of each element

### rowOffsets: `SharedValue<Record<string,number>>`

Contains the y position of each element

### firstRenderIndex: `SharedValue<number>`

The index of the first visible element on the screen

### firstRenderHeight: `SharedValue<number>`

The y position of the first visible element on the screen

### maintainVisibleContentPosition: `boolean`

Whether to maintain the visible content position when adding new items. Defaults to true.

### keyExtractor: `(item, index) => string`

Specify this function to return a unique key for each item

### renderItem: `(item, index, state, element?) => number`

Renders an item

### transformItem?: `(item, index, id, state) => B`

Transforms the item data

### getTransformed: `(item, index, id, state) => B`

Returns the transformed item

### data: `SharedValue<T[]>`

The data array

### scrollToIndex: `(index, animated?) => void`

Scrolls to a specific index

### scrollToItem: `(item, animated?) => void`

Scrolls to a specific item

### scrollToStart: `(animated?) => void`

Scrolls to the start of the list

### scrollToEnd: `(animated?) => void`

Scrolls to the end of the list

### resetData: `(newData?) => void`

Sets a new data array and resets the list position and cache

### insertAt: `(data, index, animated?) => void`

Inserts new data at a specific index

### append: `(data, animated?) => void`

Appends new data to the end of the list

### prepend: `(data, animated?) => void`

Prepends new data to the start of the list

### removeAt: `(index, animated?) => void`

Removes data at a specific index

### removeItem: `(item, animated?) => void`

Removes a specific item from the list

### unmountElement: `(index, item) => void`

Unmounts an element at a specific index or by item

### redrawItems: `() => void`

Recalculates the items in the list and (un)mounts elements as needed.
Is automatically called on scroll or when the data changes.

### getItemFromTouch: `(e) => `[`TapResult<T>`](index.md#tapresult)` | undefined`

Returns the item at a specific touch position. \
Receives the touch event as `{ x: number, y: number }`

***

## TapResult

Result returned by `getItemFromTouch({ x: number, y: number })`

:::note
`getItemFromTouch` returns `undefined` if no item is found at the touch position.
:::

### item: `T`

The item at the touch position

### id: `number | string`

The unique key of the item

### index: `number`

The index of the item in the data array

### x: `number`

The left x position of the list item relative to the screen

### y: `number`

The top y position of the list item relative to the screen

### rowY: `number`

The top y position of the list row relative to content start of the list

### touchX: `number`

The x position of the touch event

### touchY: `number`

The y position of the touch event

### height: `number`

The height of the list item
