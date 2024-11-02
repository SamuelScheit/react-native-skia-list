import type {} from "@shopify/react-native-skia/lib/typescript/src/renderer/HostComponents";
import {
	useSkiaScrollView,
	type EdgeInsets,
	type SkiaScrollViewElementProps,
	type SkiaScrollViewState,
} from "../ScrollView";
import { useState } from "react";
import { makeMutable, cancelAnimation, withTiming, runOnUI, type SharedValue } from "react-native-reanimated";
const { Skia } =
	require("@shopify/react-native-skia/src/") as typeof import("@shopify/react-native-skia/lib/typescript/src/");
import type { GroupProps, RenderNode } from "@shopify/react-native-skia/lib/typescript/src/";
import type {} from "@shopify/react-native-skia/lib/typescript/src/renderer/HostComponents";
import type { PointProp } from "react-native";
import { callOnUI } from "../Util/callOnUI";

export interface Dimensions {
	width: number;
	height: number;
}

/** */
export type SkiaFlatListProps<T = any, B = T> = Partial<Omit<SkiaFlatListState<T, B>, "safeArea">> &
	SkiaScrollViewElementProps & {
		initialData?: () => T[];
		initialTransformed?: () => Record<string, B>;
		/**
		 * Rough estimate of the height of each item in the list.
		 * Used to calculate the maximum scroll height.
		 * Set a higher value than average to ensure the user can easily scroll to the end of the list.
		 * Default is 100.
		 *  */
		estimatedItemHeight?: number;
		keyExtractor?: (item: T, index: number) => string;
	};

export type ShareableState<T = any> = {
	layout: SharedValue<Dimensions>;
	scrollY: SharedValue<number>;
	elements: SharedValue<Record<string, RenderNode<GroupProps> | undefined>>;
	heights: SharedValue<Record<string, number>>;
	rowOffsets: SharedValue<Record<string, number>>;
	firstRenderIndex: SharedValue<number>;
	firstRenderHeight: SharedValue<number>;
	maintainVisibleContentPosition: boolean;
	keyExtractor: (item: T, index: number) => string;
	data: SharedValue<T[]>;
	renderTime: SharedValue<number>;
	maxHeight: SharedValue<number>;
	safeArea: SharedValue<EdgeInsets>;
	content: SharedValue<RenderNode<GroupProps>>;
	startY: SharedValue<number>;
	pressing: SharedValue<boolean>;
	invertedFactor: number;
};

/** */
export type SkiaFlatListState<T = any, B = T> = {
	/** Contains currently mounted elements */
	elements: SharedValue<Record<string, RenderNode<GroupProps> | undefined>>;
	/** Contains the height of each element */
	heights: SharedValue<Record<string, number>>;
	/** Contains the y position of each element */
	rowOffsets: SharedValue<Record<string, number>>;
	/** The index of the first visible element on the screen */
	firstRenderIndex: SharedValue<number>;
	/** The y position of the first visible element on the screen */
	firstRenderHeight: SharedValue<number>;
	/** Whether to maintain the visible content position when adding new items. Defaults to true. */
	maintainVisibleContentPosition: boolean;
	/** Specify this function to return a unique key for each item */
	keyExtractor: (item: T, index: number) => string;
	/** Renders an item */
	renderItem: (item: B, index: number, state: ShareableState<T>, element?: RenderNode<GroupProps>) => number;
	/** Transforms the item data */
	transformItem?: (item: T, index: number, id: any, state: ShareableState<T>) => B;
	/** Returns the transformed item */
	getTransformed: (item: T, index: number, id: any, state: ShareableState<T>) => B;
	/** The data array */
	data: SharedValue<T[]>;
	/** The transformed data array */
	// transformedData: SharedValue<Record<string, B>>;
	/** @hidden Time spent on rendering */
	renderTime: SharedValue<number>;

	/** Scrolls to a specific index */
	scrollToIndex: (index: number, animated?: boolean) => void;

	/** Scrolls to a specific item */
	scrollToItem: (item: T, animated?: boolean) => void;

	/** Scrolls to the start of the list */
	scrollToStart: (animated?: boolean) => void;

	/** Scrolls to the end of the list */
	scrollToEnd: (animated?: boolean) => void;

	/** Sets a new data array and resets the list position and cache */
	resetData: (newData?: T[]) => void;

	/** Inserts new data at a specific index */
	insertAt: (data: T | T[], index: number, animated?: boolean) => void;

	/** Appends new data to the end of the list */
	append: (data: T | T[], animated?: boolean) => void;

	/** Prepends new data to the start of the list */
	prepend: (data: T | T[], animated?: boolean) => void;

	/** Removes data at a specific index */
	removeAt: (index: number, animated?: boolean) => void;

	/** Removes a specific item from the list */
	removeItem: (item: T, animated?: boolean) => void;

	/** Unmounts an element at a specific index or by item */
	unmountElement: (index: number | undefined, item: T | undefined) => void;

	/** Recalculates the items in the list and (un)mounts elements as needed.
	 * Is automatically called on scroll or when the data changes.
	 */
	redrawItems: () => void;

	/**
	 * Returns the item at a specific touch position. \
	 * Receives the touch event as `{ x: number, y: number }`
	 */
	getItemFromTouch: (e: PointProp) => TapResult<T> | undefined;
} & SkiaScrollViewState;

/**
 * Result returned by `getItemFromTouch({ x: number, y: number })`
 *
 * :::note
 * `getItemFromTouch` returns `undefined` if no item is found at the touch position.
 * :::
 * */
export type TapResult<T> = {
	/** The item at the touch position */
	item: T;
	/** The unique key of the item */
	id: number | string;
	/** The index of the item in the data array */
	index: number;
	/** The left x position of the list item relative to the screen */
	x: number;
	/** The top y position of the list item relative to the screen */
	y: number;
	/** The top y position of the list row relative to content start of the list */
	rowY: number;
	/** The x position of the touch event */
	touchX: number;
	/** The y position of the touch event */
	touchY: number;
	/** @hidden TODO */
	absoluteY: number;
	/** The height of the list item */
	height: number;
};

/**
 *
 * Use this hook to manage and access the state of SkiaFlatList.
 * ```tsx
 * const state = useSkiaFlatList({ ... });
 *
 * <SkiaFlatList list={state} style={{ flex: 1 }} />
 * ```
 */
export function useSkiaFlatList<T, B = T>(props: SkiaFlatListProps<T, B> = {} as any): SkiaFlatListState<T, B> {
	const scrollView = useSkiaScrollView(props);
	const [list] = useState(() => {
		const renderTime = props.renderTime || makeMutable(0);
		const renderMutex = makeMutable(false);
		const elements = makeMutable({} as Record<string, RenderNode<GroupProps> | undefined>);
		const heights = makeMutable({} as Record<string, number>);
		const rowOffsets = makeMutable({} as Record<string, number>);
		const firstRenderIndex = makeMutable(0);
		const firstRenderHeight = makeMutable(0);
		let start = performance.now();
		const initialData = props.initialData?.() ?? [];
		const data = makeMutable(initialData);
		const transformedData = makeMutable(props.initialTransformed?.() ?? {});
		console.log("initialData", performance.now() - start, initialData.length);
		const keyExtractor =
			props.keyExtractor ??
			((_item, index) => {
				"worklet";
				return `${index}`;
			});
		const renderItem =
			props.renderItem ??
			(() => {
				"worklet";
				return 100;
			});
		const { transformItem } = props;
		const getTransformed = !transformItem
			? (item: T, index: number, id: any, state: ShareableState<T>) => {
					return item as any as B;
				}
			: (item: T, index: number, id: any, state: ShareableState<T>) => {
					"worklet";
					const transformed = transformedData.value[id];
					if (transformed) return transformed;
					return (transformedData.value[id] = transformItem(item, index, id, state) as any as B);
				};

		const maintainVisibleContentPosition = props.maintainVisibleContentPosition ?? true;
		const estimatedItemHeight = props.estimatedItemHeight ?? 100;
		const addThreshold = 0;

		const { maxHeight, scrollY, startY, redraw, pressing, layout, safeArea, content, invertedFactor, root } =
			scrollView;

		const shareableState = {
			layout,
			scrollY,
			elements,
			heights,
			rowOffsets,
			firstRenderIndex,
			firstRenderHeight,
			maintainVisibleContentPosition,
			keyExtractor,
			data,
			transformedData,
			renderTime,
			maxHeight,
			safeArea,
			content,
			invertedFactor,
			startY,
			pressing, // @ts-ignore
			avatars: props.avatars,
		};

		const state = {
			...props,
			...scrollView,
			...shareableState,
		};

		function getItemFromTouch(e: PointProp): TapResult<T> | undefined {
			"worklet";

			// const y = matrix.value[5]!;

			const y = scrollY.value + layout.value.height - e.y - safeArea.value.bottom;
			let rowY = 0;
			let index = 0;

			const dataValue = data.value;
			var itemHeight = 0;
			var id = "";
			var item: T | undefined;

			for (index = 0; index < dataValue.length; index++) {
				item = dataValue[index]!;
				if (!item) continue;
				id = keyExtractor(item, index);
				itemHeight = heights.value[id]!;

				if (!itemHeight) return; // not rendered yet

				rowY += itemHeight;

				if (rowY > y) break;
			}

			if (!item || !itemHeight || !id) return;

			const topY = rowY - y;

			const absoluteY = (topY - e.y) * invertedFactor;

			return {
				item,
				id,
				index,
				x: 0,
				y: topY,
				rowY,
				touchY: e.y,
				touchX: e.x,
				absoluteY,
				height: itemHeight,
			};
		}

		/**
		 * Scrolls to a specific index
		 */
		function scrollToIndex(index: number, animated = true) {
			"worklet";
			if (index < 0 || index >= data.value.length) throw new Error("Index out of bounds");

			let rowY = 0;
			const dataValue = data.value;
			const heightsValue = heights.value;

			let start = performance.now();

			for (let i = 0; i < index; i++) {
				const item = dataValue[i];
				if (!item) continue;

				const id = keyExtractor(item, i);
				let itemHeight = heightsValue[id] || 0;

				if (itemHeight === undefined) {
					const transformed = getTransformed(item, i, id, shareableState as any);
					itemHeight = renderItem(transformed, i, shareableState as any);
					heightsValue[id] = itemHeight;
				}

				rowY += itemHeight;
			}

			console.log("scrollToIndex", index, rowY, performance.now() - start);

			const newY = Math.min(rowY, maxHeight.value);

			if (animated) {
				scrollY.value = withTiming(newY, { duration: 350 });
			} else {
				scrollY.value = newY;
				redraw();
			}
		}

		/**
		 * Scrolls to a specific item
		 */
		function scrollToItem(item: T, animated = true) {
			"worklet";
			const index = data.value.indexOf(item);
			if (index === -1) throw new Error("Item not found");

			scrollToIndex(index, animated);
		}

		/**
		 * Scrolls to the start of the list
		 */
		function scrollToStart(animated = true) {
			"worklet";
			scrollToIndex(0, animated);
		}

		/**
		 * Scrolls to the end of the list
		 */
		function scrollToEnd(animated = true) {
			"worklet";
			scrollToIndex(data.value.length - 1, animated);
		}

		function getItemsHeight(data: T[], indexOffset = 0) {
			"worklet";

			let rowY = 0;

			for (let i = 0; i < data.length; i++) {
				let index = i + indexOffset;
				const item = data[i];
				if (!item) continue;
				const id = keyExtractor(item, index);
				let height = heights.value[id];

				const transformed = getTransformed(item, i, id, shareableState as any);
				let itemHeight = renderItem(transformed, index, shareableState);

				if (itemHeight !== height && height) {
					const diff = itemHeight - height;

					scrollY.value += diff;
					startY.value += diff;
				}

				heights.value[id] = height = itemHeight;

				rowY += height;
			}

			return rowY;
		}

		function isBeforeStart(rowY: number, itemHeight: number) {
			"worklet";
			// item is below the start
			// when inverted it is below the bottom of the screen
			return rowY + itemHeight < scrollY.value - addThreshold - safeArea.value.top;
		}

		function isAfterEnd(rowY: number) {
			"worklet";
			// item is above the end
			// when inverted it is above the top of the screen
			return rowY - addThreshold > scrollY.value + layout.value.height;
		}

		/**
		 * Unmounts an element at a specific index or by item
		 */
		function unmountElement(index: number | undefined, item?: T | undefined) {
			"worklet";
			if (item === undefined && index !== undefined) item = data.value[index];
			if (index === undefined && item !== undefined) index = data.value.indexOf(item);
			if (index < 0 || index >= data.value.length) return;
			if (!item) return;

			const id = keyExtractor(item, index!);

			const element = elements.value[id];
			if (!element) return;

			content.value.removeChild(element);
			elements.value[id] = undefined;
		}

		/**
		 * Mounts an element at a specific y position
		 */
		function mountElement(rowY: number, item: T, index: number) {
			"worklet";

			let offset = rowY;
			const translation = Skia.Matrix().translate(safeArea.value.left, rowY);
			const element = SkiaDomApi.GroupNode({
				matrix: translation,
			});
			const id = keyExtractor(item, index);
			const transformed = getTransformed(item, index, id, shareableState as any);

			let itemHeight = renderItem(transformed, index, shareableState, element);

			if (invertedFactor === -1) {
				offset = rowY * invertedFactor - itemHeight;
				translation.identity().translate(safeArea.value.left, offset);
			}

			heights.value[id] = itemHeight;
			elements.value[id] = element;
			rowOffsets.value[id] = offset;
			content.value.addChild(element);

			return itemHeight;
		}

		/**
		 * Recalculates the items in the list and (un)mounts elements as needed.
		 * Automatically called when the list is scrolled or when the data changes.
		 */
		function redrawItems() {
			"worklet";

			let start = performance.now();

			const { width, height } = layout.value;

			if (width === 0 || height === 0) return;
			if (renderMutex.value) return;

			renderMutex.value = true;

			const dataValue = data.value;
			const elementsValue = elements.value;
			const heightsValue = heights.value;
			const rowOffsetsValue = rowOffsets.value;

			// const removeThreshold = 1000; // only remove elements that are 2 screens away

			let rowY = firstRenderHeight.value;
			let firstWasSet = false;

			for (var index = firstRenderIndex.value; index >= 0; index--) {
				let item = dataValue[index - 1];

				if (item === undefined) {
					firstRenderIndex.value = 0;
					firstRenderHeight.value = 0;
					continue;
				}

				let id = keyExtractor(item, index);
				let itemHeight = heightsValue[id];
				if (itemHeight === undefined) {
					const transformed = getTransformed(item, index, id, shareableState as any);

					itemHeight = renderItem(transformed, index, shareableState);
					heightsValue[id] = itemHeight;

					const diff = itemHeight - estimatedItemHeight;
					maxHeight.value += diff;
				}

				const beforeStart = isBeforeStart(rowY, itemHeight);
				if (beforeStart) {
					item = dataValue[index];
					if (!item) break;
					id = keyExtractor(item, index);

					const itemHeight2 = heightsValue[id] || 0;

					if (!isBeforeStart(rowY + itemHeight, itemHeight2)) {
						// prevent item from not being rendered if scrolling back to start
						firstRenderIndex.value = index;
						firstRenderHeight.value = rowY;
						firstWasSet = true;
					}

					break; // skip to forward loop
				}

				firstRenderIndex.value = index;
				firstRenderHeight.value = rowY;

				rowY -= itemHeight;
				firstWasSet = true;
			}

			rowY = firstRenderHeight.value;

			for (var index = firstRenderIndex.value; index < dataValue.length; index++) {
				const item = dataValue[index];
				if (!item) continue;

				let id = keyExtractor(item, index);

				let element = elementsValue[id];
				let itemHeight = heightsValue[id];

				const beforeStart = isBeforeStart(rowY, itemHeight || 0);
				const afterEnd = isAfterEnd(rowY);

				if (beforeStart || afterEnd) {
					if (element) {
						// console.log("removing", id, { beforeStart, afterEnd });
						unmountElement(index, item);
					}
					if (!itemHeight) {
						const transformed = getTransformed(item, index, id, shareableState as any);
						itemHeight = renderItem(transformed, index, shareableState);
					}

					rowY += itemHeight;

					if (afterEnd) {
						// continue if next element also needs to be unmounted
						const nextItem = dataValue[index + 1];
						if (!nextItem) break;

						id = keyExtractor(nextItem, index + 1);
						const nextElement = elementsValue[id];
						if (nextElement) continue;
						else break;
					} else if (beforeStart) continue;
				}

				if (!firstWasSet) {
					firstRenderIndex.value = index;
					firstRenderHeight.value = rowY;
					firstWasSet = true;
				}

				const previousHeight = itemHeight;

				if (!element || itemHeight === undefined) {
					itemHeight = mountElement(rowY, item, index);
					element = elementsValue[id];
					// console.log("adding", id, rowY);
				}

				let actualY = rowY;
				if (invertedFactor === -1) actualY = rowY * invertedFactor - itemHeight;

				if (previousHeight === undefined) {
					// element mounted first time
					const diff = itemHeight - estimatedItemHeight;
					maxHeight.value += diff;
				} else if (previousHeight !== itemHeight) {
					// heights changed
				}

				const previousRowY = rowOffsetsValue[id];

				if (previousRowY !== actualY && previousRowY !== undefined) {
					// element position changed
					const translation = Skia.Matrix().translate(0, actualY).get();
					element.setProp("matrix", translation);
					rowOffsetsValue[id] = actualY;
				}

				rowY += itemHeight;
			}

			if (index === dataValue.length) {
				maxHeight.value = Math.max(rowY - layout.value.height + safeArea.value.bottom + safeArea.value.top, 1);
			}

			const diff = performance.now() - start;
			if (diff > 2) {
				// console.log("Draw time", performance.now() - start, content.value.children().length);
			}
			renderTime.value += diff;

			renderMutex.value = false;
		}

		/**
		 * Sets a new data array and resets the list position and cache
		 */
		function resetData(newData: T[] = []) {
			"worklet";
			data.value = newData;
			transformedData.value = {};
			maxHeight.value = estimatedItemHeight * newData.length + 1;
			heights.value = {};
			elements.value = {};
			firstRenderIndex.value = 0;
			firstRenderHeight.value = 0;
			cancelAnimation(scrollY);
			scrollY.value = 0;
			startY.value = 0;
			const rootNode = root.value;
			const children = rootNode.children();
			for (const child of children) {
				rootNode.removeChild(child);
			}
			// root.value.removeChild(content.value);
			// content.value = SkiaDomApi.GroupNode({});
			// root.value.addChild(content.value);
			redrawItems();
		}

		/**
		 * Inserts new data at a specific index
		 */
		function insertAt(d: T | T[], index: number, animated?: boolean) {
			"worklet";
			if (index < 0 || index >= data.value.length) throw new Error("Index out of bounds");

			if (animated === undefined) {
				animated = Math.abs(scrollY.value) < 500;
			}

			const newData = Array.isArray(d) ? d : [d];

			data.value.splice(index, 0, ...newData);

			// will recalculate the height of the previous and next elements and adjust the y position accordingly
			if (index > 0) {
				unmountElement(index - 1);
				// getItemsHeight([data.value[index - 1]!], index - 1);
			}
			if (index + newData.length < data.value.length) {
				unmountElement(index + newData.length);
				// getItemsHeight([data.value[index + newData.length]!], index + newData.length);
			}

			let oldY = scrollY.value;

			const height = getItemsHeight(newData, index);
			if (!height) return;

			console.log("insertAt", height);

			if (firstRenderIndex.value >= index && maintainVisibleContentPosition) {
				firstRenderIndex.value += newData.length;
				firstRenderHeight.value += height;
				const newY = oldY + height;
				scrollY.value = newY;
				// startY.value += height;
				// do not scroll to new item, if finger is down
				// console.log("scroll to item", pressing.value, newY, oldY);
				if (animated && !pressing.value) {
					scrollY.value = withTiming(oldY, { duration: 350 });
				}
			}

			maxHeight.value += height;
			redrawItems();
		}

		/**
		 * Appends new data to the end of the list
		 */
		function append(d: T | T[], animated?: boolean) {
			"worklet";
			insertAt(d, data.value.length, animated);
		}

		/**
		 * Prepends new data to the start of the list
		 */
		function prepend(d: T | T[], animated?: boolean) {
			"worklet";
			insertAt(d, 0, animated);
		}

		/**
		 * Removes data at a specific index
		 */
		function removeAt(index: number, animated?: boolean) {
			"worklet";
			if (index < 0 || index >= data.value.length) throw new Error("Index out of bounds");

			if (animated === undefined) {
				animated = Math.abs(scrollY.value) < 500;
			}

			const removedData = data.value.splice(index, 1);

			if (removedData.length === 0) {
				return;
			}

			for (let i = 0; i < removedData.length; i++) {
				const item = removedData[i];
				const id = keyExtractor(item, index + i);
				const element = elements.value[id];
				if (element) {
					content.value.removeChild(element);
					elements.value[id] = undefined;
				}
				delete transformedData.value[id];
				delete heights.value[id];
				delete rowOffsets.value[id];
			}

			const height = getItemsHeight(removedData, index);
			if (!height) return;

			console.log("removeAt", height);

			if (firstRenderIndex.value > index && maintainVisibleContentPosition) {
				firstRenderIndex.value -= 1;
				firstRenderHeight.value -= height;
				const newY = scrollY.value - height;
				scrollY.value = newY;
				if (animated && !pressing.value) {
					scrollY.value = withTiming(newY, { duration: 350 });
				}
			}

			maxHeight.value -= height;
			redrawItems();
		}

		/**
		 * Removes a specific item from the list
		 */
		function removeItem(item: T, animated?: boolean) {
			"worklet";
			const index = data.value.findIndex((d) => d === item);
			if (index !== -1) removeAt(index, animated);
		}

		runOnUI(() => {
			"worklet";

			scrollY.addListener(2, () => {
				redrawItems();
			});
			layout.addListener(2, (value) => {
				maxHeight.value = Math.max(
					estimatedItemHeight * initialData.length -
						value.height +
						safeArea.value.bottom +
						safeArea.value.top,
					1
				);

				console.log("maxHeight", maxHeight.value, estimatedItemHeight * initialData.length);

				redrawItems();
			});
		})();

		redrawItems();

		return {
			...state,
			resetData: callOnUI(resetData),
			insertAt: callOnUI(insertAt),
			append: callOnUI(append),
			prepend: callOnUI(prepend),
			removeAt: callOnUI(removeAt),
			removeItem: callOnUI(removeItem),
			getItemFromTouch: callOnUI(getItemFromTouch),
			unmountElement: callOnUI(unmountElement),
			redrawItems: callOnUI(redrawItems),
			scrollToIndex: callOnUI(scrollToIndex),
			scrollToStart: callOnUI(scrollToStart),
			scrollToEnd: callOnUI(scrollToEnd),
			scrollToItem: callOnUI(scrollToItem),
			getTransformed: callOnUI(getTransformed),
		};
	});

	return list as SkiaFlatListState<T, B>;
}
