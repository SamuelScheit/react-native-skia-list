import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
	// By default, Docusaurus generates a sidebar from the docs folder structure
	tutorialSidebar: [
		{
			type: "doc",
			id: "index",
			label: "Getting Started",
		},
		// {
		// 	type: "doc",
		// 	id: "ScrollView/index",
		// 	label: "<SkiaScrollView />",
		// },
		// {
		// 	type: "doc",
		// 	id: "FlatList/index",
		// 	label: "<SkiaFlatList />",
		// },
		{
			type: "category",
			label: "API",
			items: [
				{
					type: "doc",
					id: "api/FlatList/index",
					label: "<SkiaFlatList />",
				},
				{
					type: "doc",
					id: "api/ScrollView/index",
					label: "<SkiaScrollView />",
				},
			],
		},
	],
};

export default sidebars;
