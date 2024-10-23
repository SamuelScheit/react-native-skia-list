import type { ViewStyle } from "react-native";
import { useSkiaFlatList, type SkiaFlatListProps, type SkiaFlatListState } from "./State";
import type { ReactNode } from "react";
import { SkiaScrollView } from "../ScrollView";

/** */
export type SkiaFlatListElementProps<T, A> = {
	list?: SkiaFlatListState<T, A>;
	style?: ViewStyle;
	fixedChildren?: ReactNode;
	debug?: boolean;
} & SkiaFlatListProps<T>;

/** */
export function SkiaFlatList<T, A>(props: SkiaFlatListElementProps<T, A>) {
	var { list, ...p } = props;
	if (!list) {
		list = useSkiaFlatList(p) as any;
	}

	return <SkiaScrollView {...p} list={list} />;
}
