import type {} from "@shopify/react-native-skia/lib/module/renderer/HostComponents";
import { useSkiaScrollView, type SkiaScrollViewProps } from "../ScrollView";
import { useLayoutEffect, useMemo } from "react";
import { makeMutable, cancelAnimation, withTiming, runOnUI } from "react-native-reanimated";
import { Skia } from "@shopify/react-native-skia";
import type { GroupProps, RenderNode } from "@shopify/react-native-skia/lib/module/";

export interface Dimensions {
	width: number;
	height: number;
}

export interface SkiaFlatListProps<T> extends SkiaScrollViewProps {
	initialData?: () => T[];
	/**
	 * Rough estimate of the height of each item in the list.
	 * Used to calculate the maximum scroll height.
	 * Not required because max height will be calculated if user reaches the end of the list.
	 * @default 100
	 *  */
	maintainVisibleContentPosition?: boolean;
	estimatedItemHeight?: number;
	keyExtractor?: (item: T, index: number) => string;
	renderItem?: (element: RenderNode<GroupProps> | undefined, item: T, index: number, state: any) => number;
}

export function useSkiaFlatList<T>(props: SkiaFlatListProps<T> = {}) {
	const scrollView = useSkiaScrollView(props);
	const list = useMemo(() => {
		const elements = makeMutable({} as Record<string, RenderNode<GroupProps> | undefined>);
		const presses = makeMutable({} as Record<string, { x: number; y: number } | undefined>);
		const heights = makeMutable({} as Record<string, number>);
		const rowOffsets = makeMutable({} as Record<string, number>);
		const firstRenderIndex = makeMutable(0);
		const firstRenderHeight = makeMutable(0);
		const initialData = props.initialData?.() ?? [];
		const data = makeMutable(initialData);
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
				return 0;
			});
		const maintainVisibleContentPosition = props.maintainVisibleContentPosition ?? true;
		const estimatedItemHeight = props.estimatedItemHeight ?? 100;
		const addThreshold = 0;

		const { maxHeight, scrollY, startY, redraw, pressing, layout, safeArea, content, inverted } = scrollView;

		const state = {
			...scrollView,
			elements,
			presses,
			heights,
			rowOffsets,
			firstRenderIndex,
			firstRenderHeight,
			maintainVisibleContentPosition,
			keyExtractor,
			renderItem,
			data,
		};

		function getItemsHeight(data: T[], indexOffset = 0) {
			"worklet";

			let rowY = 0;

			for (let i = 0; i < data.length; i++) {
				let index = i + indexOffset;
				const item = data[i];
				if (!item) continue;
				const id = keyExtractor(item, index);
				let height = heights.value[id];

				let itemHeight = renderItem(undefined, item, index, state);

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
			return rowY + itemHeight < scrollY.value * inverted - (addThreshold - safeArea.value.bottom) * inverted;
		}

		function isAfterEnd(rowY: number, height: number) {
			"worklet";
			// item is above the end
			// when inverted it is above the top of the screen
			return rowY - (addThreshold - safeArea.value.top) > scrollY.value * inverted + height;
		}

		function unmountElement(index: number | undefined, item: T | undefined) {
			"worklet";
			if (item === undefined && index !== undefined) item = data.value[index];
			if (!item) return;

			const id = keyExtractor(item, index!);

			const element = elements.value[id];
			if (!element) return;

			content.value.removeChild(element);
			elements.value[id] = undefined;
		}

		function mountElement(rowY: number, item: T, index: number) {
			"worklet";

			let offset = rowY;
			const translation = Skia.Matrix().translate(0, rowY).get();
			const element = SkiaDomApi.GroupNode({
				matrix: translation,
			});
			const itemHeight = renderItem(element, item, index, state);

			if (inverted === -1) {
				offset = rowY * inverted - itemHeight + layout.value.height;
				translation[5] = offset;
				element.setProp("matrix", translation);
			}

			const id = keyExtractor(item, index);
			heights.value[id] = itemHeight;
			elements.value[id] = element;
			rowOffsets.value[id] = offset;
			content.value.addChild(element);

			return itemHeight;
		}

		function onScroll() {
			"worklet";

			let start = performance.now();

			const { width, height } = layout.value;
			if (width === 0 || height === 0) return;

			const dataValue = data.value;
			const elementsValue = elements.value;
			const heightsValue = heights.value;

			// const removeThreshold = 1000; // only remove elements that are 2 screens away

			let rowY = firstRenderHeight.value;
			let firstWasSet = false;

			for (var index = firstRenderIndex.value; index >= 0; index--) {
				let item = dataValue[index - 1];

				if (item === undefined) {
					firstRenderIndex.value = index;
					firstRenderHeight.value = 0;
					continue;
				}

				let id = keyExtractor(item, index);
				let itemHeight = heightsValue[id];
				if (!itemHeight) continue;

				const afterEnd = isAfterEnd(rowY, height);
				const beforeStart = isBeforeStart(rowY, itemHeight);

				if (beforeStart) {
					item = data.value[index];
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
				let itemHeight = heightsValue[id] || 0;

				const beforeStart = isBeforeStart(rowY, itemHeight);
				const afterEnd = isAfterEnd(rowY, height);

				if (beforeStart || afterEnd) {
					if (element) {
						// console.log("removing", id);
						unmountElement(index, item);
					} else if (!itemHeight) {
						itemHeight = renderItem(undefined, item, index, state);
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

				if (!element) {
					itemHeight = mountElement(rowY, item, index);
					// console.log("adding", id, rowY);
				}

				rowY += itemHeight;
			}

			const diff = performance.now() - start;
			if (diff > 2) {
				// console.log("Draw time", performance.now() - start, content.value.children().length);
			}
			redraw();
		}

		/**
		 * Sets a new data array and resets the list position and cache
		 */
		function resetData(newData: T[] = []) {
			"worklet";
			data.value = newData;
			maxHeight.value = 0;
			heights.value = {};
			elements.value = {};
			firstRenderIndex.value = 0;
			firstRenderHeight.value = 0;
			cancelAnimation(scrollY);
			scrollY.value = 0;
			startY.value = 0;
			onScroll();
		}

		/**
		 * Inserts new data at a specific index
		 */
		function insertAt(d: T | T[], index: number, animated?: boolean) {
			"worklet";
			if (animated === undefined) {
				animated = Math.abs(scrollY.value) < 500;
			}

			const newData = Array.isArray(d) ? d : [d];

			data.value.splice(index, 0, ...newData);

			// will recalculate the height of the previous and next elements and adjust the y position accordingly
			if (index > 0) {
				getItemsHeight([data.value[index - 1]!], index - 1);
			}
			if (index + newData.length < data.value.length) {
				getItemsHeight([data.value[index + newData.length]!], index + newData.length);
			}

			let oldY = scrollY.value;

			const height = getItemsHeight(newData, index);

			if (!height) return;

			if (firstRenderIndex.value >= index && maintainVisibleContentPosition) {
				firstRenderIndex.value += newData.length;
				firstRenderHeight.value += height;
				const newY = oldY + height;
				scrollY.value = newY;
				scrollY.value = newY;
				startY.value += height;

				// do not scroll to new item, if finger is down
				console.log("scroll to item", pressing.value);
				if (animated && !pressing.value) {
					scrollY.value = withTiming(oldY, { duration: 350 });
				}
			}

			maxHeight.value += height;
			onScroll();
		}

		runOnUI(() => {
			"worklet";

			scrollY.addListener(2, () => {
				onScroll();
			});
			layout.addListener(1, (value) => {
				console.log("layout changed");
				maxHeight.value = estimatedItemHeight * initialData.length - value.height;

				onScroll();
			});
		})();

		onScroll();

		return { ...state, resetData, insertAt };
	}, []);

	useLayoutEffect(() => {
		const { scrollY, layout } = list;
		return runOnUI(() => {
			"worklet";

			scrollY.removeListener(2);
			layout.removeListener(1);
		});
	}, []);

	return list;
}

export type SkiaFlatListState = ReturnType<typeof useSkiaFlatList>;
