# FlatList

<a id="skiaflatlist" name="skiaflatlist"></a>

## **SkiaFlatList**([`SkiaFlatListElementProps<T,A>`](index.md#skiaflatlistelementprops)): `Element`

***

<a id="skiaflatlistelementprops" name="skiaflatlistelementprops"></a>

## SkiaFlatListElementProps

### list?: [`SkiaFlatListState<T,A>`](index.md#skiaflatliststate)

### style?: `ViewStyle`

### fixedChildren?: `ReactNode`

### debug?: `boolean`

***

<a id="useskiaflatlist" name="useskiaflatlist"></a>

## **useSkiaFlatList**([`SkiaFlatListProps<T,A>`](index.md#skiaflatlistprops)): [`SkiaFlatListState<T,A>`](index.md#skiaflatliststate)

***

<a id="skiaflatlistprops" name="skiaflatlistprops"></a>

## SkiaFlatListProps

### initialData?: `() => T[]`

### maintainVisibleContentPosition?: `boolean`

Rough estimate of the height of each item in the list.
Used to calculate the maximum scroll height.
Not required because max height will be calculated if user reaches the end of the list.

### estimatedItemHeight?: `number`

### keyExtractor?: `(item, index) => string`

### renderItem?: `(element, item, index, state) => number`

***

<a id="tapresult" name="tapresult"></a>

## TapResult

<a id="item" name="item"></a>

### item: `T`

<a id="id" name="id"></a>

### id: `number | string`

<a id="index" name="index"></a>

### index: `number`

<a id="x" name="x"></a>

### x: `number`

<a id="y" name="y"></a>

### y: `number`

<a id="rowy" name="rowy"></a>

### rowY: `number`

<a id="touchx" name="touchx"></a>

### touchX: `number`

<a id="touchy" name="touchy"></a>

### touchY: `number`

<a id="absolutey" name="absolutey"></a>

### absoluteY: `number`

<a id="height" name="height"></a>

### height: `number`

***

<a id="skiaflatliststate" name="skiaflatliststate"></a>

## SkiaFlatListState

### elements: `SharedValue<Record<string,RenderNode<GroupProps> | undefined>>`

### presses: `SharedValue<Record<string,object | undefined>>`

### heights: `SharedValue<Record<string,number>>`

### rowOffsets: `SharedValue<Record<string,number>>`

### firstRenderIndex: `SharedValue<number>`

### firstRenderHeight: `SharedValue<number>`

### maintainVisibleContentPosition: `boolean`

### keyExtractor: `(item, index) => string`

### renderItem: `(element, item, index, state) => number`

### data: `SharedValue<T[]>`

### renderTime: `SharedValue<number>`

### scrollToIndex: `(index, animated?) => void`

### resetData: `(newData?) => void`

### insertAt: `(d, index, animated?) => void`

### getItemFromTouch: `(e) => `[`TapResult<T>`](index.md#tapresult)` | undefined`

### unmountElement: `(index, item) => void`

### redrawItems: `() => void`
