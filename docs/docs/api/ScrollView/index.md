# ScrollView

## **SkiaScrollView**([`SkiaScrollViewElementProps`](index.md#skiascrollviewelementprops)): `Element`

Use `<SkiaScrollView />` as a replacement for the React Native `<ScrollView />` component.

:::info
It uses the Skia rendering engine to render the content so you can't use React Native components inside it.
:::

:::note
You must specify the `height` prop of [ScrollGestureProps](#scrollgestureprops) to make the list scrollable.
:::

### Example
```tsx
const paint = Skia.Paint();
paint.setColor(Skia.Color("rgb(91, 128, 218)"));

const circleCount = 100;

<SkiaScrollView height={circleCount * 100} style={{ flex: 1 }}>
	{Array.from({ length: circleCount }, (_, i) => (
		<Circle key={i} cx={50} cy={50 + i * 100} r={50} paint={paint} />
	))}
</SkiaScrollView>
```

### Example with `useSkiaScrollView`

You can manage the list state yourself by using `useSkiaScrollView`: \
This is useful when you need to build custom behavior on top of the list, e.g. custom gestures/renderer.

```tsx
const state = useSkiaScrollView({ height: 1000 });
const content = content.value;

content.addChild(SkiaDomApi.RectNode({ width: 100, height: 100, x: 0, y: 0 }));

<SkiaScrollView list={state} style={{ flex: 1 }} />
```

***

## SkiaScrollViewElementProps

### list?: `SkiaScrollViewState`

Manage the list state yourself using `useSkiaScrollView`:

```tsx
const list = useSkiaScrollView({ height: 1000 });

// do something with the list, e.g. skew the list content:
list.matrix.value[1] = 0.1;

<SkiaScrollView list={list} />
```

### style?: `ViewStyle`

The [view style](https://reactnative.dev/docs/view-style-props) of the canvas style.
You should specify `flex: 1` to ensure the canvas fills the screen.

```tsx
<SkiaScrollView style={{ flex: 1 }} />
```

### children?: `ReactNode`

Use children to render skia elements.
:::info
You must manually specify the `height` prop of [ScrollGestureProps](#scrollgestureprops) to make the list scrollable.
:::

```tsx
<SkiaScrollView height={100} style={{ flex: 1 }}>
	<Circle cx={50} cy={50 + 100} r={50} color="blue" />
</SkiaScrollView>
```

:::info
If you are updating the children very fequently, you should consider using `useSkiaScrollView`
to improve performance by imperatively updating the list content and therefore avoiding the React reconciler.

```tsx
const state = useSkiaScrollView({ height: 1000 });
const content = content.value;

let previous = null;
// do something with the list content, e.g. add a new rect every 10ms
setInterval(() => {
	if (previous) content.removeChild(previous);

	previous = SkiaDomApi.RectNode({
		width: 100, height: 100,
		x: Math.random() * 1000,
		y: Math.random() * 1000
	});

	content.addChild(previous);
}, 10);
```
:::

### fixedChildren?: `ReactNode`

Use `fixedChildren` to render skia elements that are displayed fixed on top of the list content and are not scrollable.

```tsx
<SkiaScrollView fixedChildren={<Fill color="blue" />} />
```

### debug?: `boolean`

Enable debug mode to show the FPS count and render time.

### keyboardDismissMode?: `"none" | "interactive" | "on-drag"`

Determines whether the keyboard gets dismissed in response to a drag.
  - `none` (the default) drags do not dismiss the keyboard.
  - `onDrag` the keyboard is dismissed when a drag begins.
  - `interactive` the keyboard is dismissed interactively with the drag
    and moves in synchrony with the touch; dragging upwards cancels the
    dismissal.

### keyboardShouldPersistTaps?: `boolean | "always" | "never"`

Determines when the keyboard should stay visible after a tap.
- `never` (the default), tapping outside of the focused text input when the keyboard is up dismisses the keyboard. When this happens, children won`t receive the tap.
- `always`, the keyboard will not dismiss automatically, and the scroll view will not catch taps, but children of the scroll view can catch taps.
- `false`, deprecated, use `never` instead
- `true`, deprecated, use `always` instead

***

## ScrollGestureInitalState

### layout: `SharedValue<object>`

Contains the width and height of the scroll view.
Will automatically update when the layout changes.

#### width: `number`

#### height: `number`

### scrollY: `SharedValue<number>`

The current scroll Y position.

### startY: `SharedValue<number>`

Used internally to keep track of the start Y position when dragging.

### offsetY: `SharedValue<number>`

Used to indepentently control the scroll position without affecting the scrollY value (which is used by the gesture handler) e.g. used for keyboard handling.

### maxHeight: `SharedValue<number>`

The maximum height the scroll view can scroll to.
Automatically updated when the layout/data changes.

### scrolling: `SharedValue<boolean>`

Shared value that indicates if the view is currently being scrolled.

### scrollingDisabled: `SharedValue<boolean>`

Shared value to disable scrolling.

### bounces: `boolean`

If the scroll view should bounce when reaching the top or bottom.

### decelerationRate: `number`

The deceleration rate for momentum scrolling. Default is 0.998.

***

## ScrollGestureProps

### height?: `number`

Sets the initial value for `maxHeight` while taking the layout height into consideration.
:::warning
You need to set this value for SkiaScrollView to be able to scroll.
:::

### inverted?: `boolean`

Inverts the scroll direction of the Gesture Handler. Used in conjunction with `inverted` of [SkiaScrollViewProps](#skiascrollviewprops).

### onScroll?: `(value) => void`

Callback that is invoked every time the scroll position changes.
Needs to be a worklet function.
You need to implement throttling yourself:

```tsx
function onScroll(event: ScrollEvent) {
	"worklet";
	const { scrollY } = event;
	// do something with scrollY, e.g. update the position of a sticky header
}

<SkiaScrollView onScroll={onScroll} />
```

### onScrollBeginDrag?: `() => void`

Callback that is invoked when the user starts dragging the scroll view.
Needs to be a worklet function.

### onScrollEndDrag?: `() => void`

Callback that is invoked when the user stops dragging the scroll view.
Needs to be a worklet function.

### onMomentumScrollEnd?: `() => void`

Callback that is invoked when the momentum scroll begins.
Needs to be a worklet function.

### onMomentumScrollBegin?: `() => void`

Callback that is invoked when the momentum scroll ends.
Needs to be a worklet function.

### startedAnimation?: `() => void`

Call this function when you start animating an SharedValue to enable continous rendering mode.

### finishedAnimation?: `() => void`

Call this function when you finish animating an SharedValue to return to default rendering mode.

:::warning
Ensure that you have the equal amount of `startedAnimation` and `finishedAnimation` calls to avoid unecessary re-renders when idling.
:::

***

## ScrollGestureState

### gesture: `GestureType`

### scrollTo: `(opts) => void`

Scroll to a certain Y position.

### scrollToEnd: `(opts) => void`

Scroll to the end of the scroll view (inferred by maxHeight).

### startMomentumScroll: `(velocityY) => void`

If you manually handle scrolling, e.g. with a custom ScrollBar, you can call this function to start momentum scrolling.

***

## **useSkiaScrollView**([`SkiaScrollViewProps`](index.md#skiascrollviewprops)): `SkiaScrollViewState`

Use this hook to manage and access the state of SkiaScrollView.

```tsx
const state = useSkiaScrollView({ height: 1000 });

state.content.value.addChild(SkiaDomApi.RectNode({ width: 100, height: 100, x: 0, y: 0 }));

<SkiaScrollView list={state} style={{ flex: 1 }} />
```

***

## InitialScrollViewState

### root: `SharedValue<RenderNode<GroupProps>>`

The root [group node](https://shopify.github.io/react-native-skia/docs/group) of the skia list view with a fixed position that contains the `content` group node

You can transform the entire list by setting the `matrix` property.

```tsx
root.value.setProp("matrix", Skia.Matrix().skew(1, 0.5).get());
```

### content: `SharedValue<RenderNode<GroupProps>>`

The content [group node](https://shopify.github.io/react-native-skia/docs/group) of the skia list view that contains the list items which are translated based on the scroll position.

### matrix: `SharedValue<SkMatrix>`

The Skia Matrix that translates the content node.

- `matrix.value[0]` is the **X scale**.
- `matrix.value[4]` is the **Y scale**.
- `matrix.value[5]` is the **Y translation**. Use `scrollY` instead
- `matrix.value[2]` is the **X translation**. Use `safeArea.left` instead
- `matrix.value[1]` is the **X skew**.
- `matrix.value[3]` is the **Y skew**.

### redraw: `() => void`

Call `redraw()` to request a redraw of the skia canvas, e.g. when adding a fixed element to the root node. \
When using FlatList use `redrawItems()` instead to redraw the list items. \
When animating a property use `startedAnimation()` and `finishedAnimation()` to efficiently rerender the list.

### pressing: `SharedValue<boolean>`

Shared value that indicates if the view is currently being pressed.

***

## SkiaScrollViewProps

### customScrollGesture?: `typeof getScrollGesture`

Specify a custom scroll gesture.

### customGesture?: `(props) => ComposedGesture`

Specify a custom gesture handler.
E.g. to implement scrolling and swiping list items horizontally.

### safeArea?: `EdgeInsets`

Specify offsets for the content of the scroll view.

e.g. `{ top: 30, bottom: 20, left: 15, right: 15 }`

### automaticallyAdjustKeyboardInsets?: `boolean`

Set to `false` to disable the automatic keyboard adjustment.

### keyboard?: `ReanimatedContext`

Specify a custom keyboard handler

### inverted?: `boolean`

SkiaScrollView so that the elements start rendering from the bottom screen to the top.
