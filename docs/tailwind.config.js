const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
	corePlugins: {
		preflight: false,
		container: false,
	},
	darkMode: ["class", '[data-theme="dark"]'],
	content: ["./src/**/*.{jsx,tsx,html}"],
	theme: {
		colors: {
			...colors,
			gray: {
				...colors.gray,
				900: "#080808",
			},
		},
		extend: {
			backgroundSize: {
				"size-200": "200% 200%",
				"size-300": "300% 300%",
			},
			backgroundPosition: {
				"pos-0": "0% 0%",
				"pos-100": "100% 100%",
			},
			fontFamily: {
				sans: ['"Inter"', ...fontFamily.sans],
				jakarta: ['"Plus Jakarta Sans"', ...fontFamily.sans],
				mono: ['"Fira Code"', ...fontFamily.mono],
			},
			borderRadius: {
				sm: "4px",
			},
			screens: {
				sm: "0px",
				lg: "997px",
			},
			colors: {},
		},
	},
	plugins: [],
};
