# ScrollView

<a id="skiascrollview" name="skiascrollview"></a>

## **SkiaScrollView**([`SkiaScrollViewElementProps`](index.md#skiascrollviewelementprops)): `Element`

Use `SkiaScrollView` as a replacement for the React Native `ScrollView` component.

:::note
It uses the Skia renderer to render the content so you can't use React Native components inside it.
:::

:::info
You must specify the `height` prop of [ScrollGestureProps](#scrollgestureprops) to make the list scrollable.
:::

#### Example
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

You can manage the list state yourself by using `useSkiaScrollView`: \
This is useful when you need to build custom behavior on top of the list, e.g. a sticky header, custom gestures/renderer.

#### Example with `useSkiaScrollView`
```tsx
const state = useSkiaScrollView({ height: 1000 });
const content = content.value;

content.addChild(SkiaDomApi.RectNode({ width: 100, height: 100, x: 0, y: 0 }));

<SkiaScrollView list={state} style={{ flex: 1 }} />
```

***

<a id="skiascrollviewelementprops" name="skiascrollviewelementprops"></a>

## SkiaScrollViewElementProps

### list?: `SkiaScrollViewState`

Create your self managed list state using `useSkiaScrollView`:

```tsx
const state = useSkiaScrollView({ height: 1000 });

// do something with the state, e.g. skew the list content:
state.matrix.value[1] = 0.1;

<SkiaScrollView list={state} />
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
- false, deprecated, use `never` instead
- true, deprecated, use `always` instead

***

<a id="getscrollgesture" name="getscrollgesture"></a>

## **getScrollGesture**([`ScrollGestureProps`](index.md#scrollgestureprops)): [`ScrollGestureState`](index.md#scrollgesturestate)

***

<a id="scrollgestureinitalstate" name="scrollgestureinitalstate"></a>

## ScrollGestureInitalState

<a id="layout" name="layout"></a>

### layout: `SharedValue<object>`

Contains the width and height of the scroll view.
Will automatically update when the layout changes.

#### width: `number`

#### height: `number`

<a id="scrolly" name="scrolly"></a>

### scrollY: `SharedValue<number>`

The current scroll Y position.

<a id="starty" name="starty"></a>

### startY: `SharedValue<number>`

**`Internal`**

Used internally to keep track of the start Y position when dragging.

<a id="offsety" name="offsety"></a>

### offsetY: `SharedValue<number>`

Used to indepentently control the scroll position without affecting the scrollY value (which is used by the gesture handler) e.g. used for keyboard handling.

<a id="maxheight" name="maxheight"></a>

### maxHeight: `SharedValue<number>`

The maximum height the scroll view can scroll to.
Automatically updated when the layout/data changes.

<a id="scrolling" name="scrolling"></a>

### scrolling: `SharedValue<boolean>`

Shared value that indicates if the view is currently being scrolled.

<a id="pressing" name="pressing"></a>

### pressing: `SharedValue<boolean>`

Shared value that indicates if the view is currently being pressed.

<a id="scrollingdisabled" name="scrollingdisabled"></a>

### scrollingDisabled: `SharedValue<boolean>`

Shared value to disable scrolling.

<a id="bounces" name="bounces"></a>

### bounces: `boolean`

If the scroll view should bounce when reaching the top or bottom.

<a id="decelerationrate" name="decelerationrate"></a>

### decelerationRate: `number`

The deceleration rate for momentum scrolling. Default is 0.998.

***

<a id="scrollgestureprops" name="scrollgestureprops"></a>

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

<a id="scrollgesturestate" name="scrollgesturestate"></a>

## ScrollGestureState

### gesture: `GestureType`

### scrollTo: `(opts) => void`

Scroll to a certain Y position.

### scrollToEnd: `(opts) => void`

Scroll to the end of the scroll view (inferred by maxHeight).

### startMomentumScroll: `(velocityY) => void`

If you manually handle scrolling, e.g. with a custom ScrollBar, you can call this function to start momentum scrolling.

***

<a id="useskiascrollview" name="useskiascrollview"></a>

## **useSkiaScrollView**([`SkiaScrollViewProps<A>`](index.md#skiascrollviewprops)): `SkiaScrollViewState`

***

<a id="skiascrollviewprops" name="skiascrollviewprops"></a>

## SkiaScrollViewProps

### customScrollGesture?: `typeof `[`getScrollGesture`](index.md#getscrollgesture)

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
