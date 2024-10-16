import type { ViewStyle } from "react-native";
import { useSkiaFlatList, type SkiaFlatListProps, type SkiaFlatListState } from "./State";
import type { ReactNode } from "react";
import { SkiaScrollView } from "../ScrollView";

export function SkiaFlatList<T>({
	list,
	...props
}: {
	list?: SkiaFlatListState<T>;
	style?: ViewStyle;
	fixedChildren?: ReactNode;
	debug?: boolean;
} & SkiaFlatListProps<T>) {
	const state = list || useSkiaFlatList(props);

	return <SkiaScrollView {...props} list={state} />;
}
