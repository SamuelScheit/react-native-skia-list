import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
	title: "React Native Skia List",
	tagline: "The fastest list renderer for React Native based on Skia",
	favicon: "img/favicon.ico",

	// Set the production url of your site here
	url: "https://samuelscheit.github.io",
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: process.env.NODE_ENV === "production" ? "/react-native-skia-list/" : "/",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	organizationName: "samuelscheit", // Usually your GitHub org/user name.
	projectName: "react-native-skia-list", // Usually your repo name.

	onBrokenLinks: "throw",
	onBrokenMarkdownLinks: "warn",

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	plugins: [
		function tailwindPlugin() {
			return {
				name: "tailwind-plugin",
				configurePostCss(postcssOptions) {
					postcssOptions.plugins = [
						require("postcss-import"),
						require("tailwindcss"),
						require("autoprefixer"),
					];
					return postcssOptions;
				},
			};
		},
		[
			"docusaurus-plugin-typedoc",
			{
				out: "./docs/",
				watch: process.env.TYPEDOC_WATCH,
				entryPoints: [
					// "../src/index.ts",
					// "../src/ScrollView/ScrollGesture.ts",
					"../src/ScrollView/index.ts",
					// "../src/ScrollView/Render.tsx",
					// "../src/ScrollView/State.ts",
					"../src/FlatList/index.ts",
				],
				tsconfig: "../tsconfig.json",
				entryPointStrategy: "expand",
				skipErrorChecking: true,
				readme: "../README.md",
				mergeReadme: true,
				excludeNotDocumented: true,
				flattenOutputFiles: false,
				outputFileStrategy: "members",
				membersWithOwnFile: [],
				name: "React Native Skia List",
				useCodeBlocks: false,
				useHTMLEncodedBrackets: false,
				useHTMLAnchors: true,
				hidePageTitle: false,
				hideGroupHeadings: true,
				categorizeByGroup: false,
				disableSources: true,
				expandObjects: false,
				sort: [],
				groupOrder: ["*"],
				kindSortOrder: [],
				expandParameters: false,
				hideBreadcrumbs: true,
				parametersFormat: "list",
				interfacePropertiesFormat: "list",
				classPropertiesFormat: "list",
				enumMembersFormat: "list",
				typeDeclarationFormat: "list",
				propertyMembersFormat: "list",
				tableColumnSettings: {
					hideDefaults: false,
					hideInherited: false,
					hideModifiers: false,
					hideOverrides: false,
					hideSources: false,
					hideValues: false,
					leftAlignHeaders: false,
				},
			},
		],
	],
	presets: [
		[
			"classic",
			{
				docs: {
					sidebarPath: "./sidebars.ts",
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl: "https://github.com/samuelscheit/react-native-skia-list/tree/main/docs/",
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],

	themeConfig: {
		colorMode: {
			defaultMode: "dark",
			disableSwitch: false,
			respectPrefersColorScheme: true,
		},
		// Replace with your project's social card
		image: "/img/banner.png",
		navbar: {
			title: "React Native Skia List",
			logo: {
				alt: "React Native Skia List Logo",
				src: "img/logo.svg",
			},
			items: [
				{
					type: "docSidebar",
					sidebarId: "tutorialSidebar",
					position: "left",
					label: "Docs",
				},
				{
					href: "https://github.com/samuelscheit/react-native-skia-list",
					label: "GitHub",
					position: "right",
				},
			],
		},
		footer: {
			style: "dark",
			links: [
				{
					label: "Docs",
					to: "/docs/",
				},
				{
					label: "GitHub",
					href: "https://github.com/samuelScheit/react-native-skia-list",
				},
				{
					label: "Samuel Scheit",
					href: "https://samuelscheit.com/",
				},
			],
			// copyright: `Copyright © ${new Date().getFullYear()} Samuel Scheit`,
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
