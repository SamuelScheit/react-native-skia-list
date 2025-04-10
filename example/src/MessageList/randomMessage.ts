const { FontSlant, FontWeight, FontWidth, loadData, Skia, TextAlign } =
	require("@shopify/react-native-skia/src/") as typeof import("@shopify/react-native-skia/lib/typescript/src/");
import { lipsum } from "./lipsum";
import { black, emojiBuilder, scale, white } from "./ContextMenu";
import type { MessageItem } from "./State";
import type {
	SkParagraph,
	SkImage,
	SkParagraphStyle,
	SkTextStyle,
} from "@shopify/react-native-skia/lib/typescript/src/";
import { emojiFontFamily } from "./Assets";

const paragraphStyle: SkTextStyle = {
	fontSize: 18,
	color: black,
	fontStyle: {
		slant: FontSlant.Upright,
		weight: FontWeight.Normal,
		width: FontWidth.Normal,
	},
	fontFamilies: ["Roboto", "NotoColorEmoji"],
	heightMultiplier: 1.1,
};

const paragraphParams: SkParagraphStyle = {
	textAlign: TextAlign.Left,
};

export const dateStyle = {
	...paragraphStyle,
	fontSize: 13 * scale,
	color: Skia.Color("#6b6c6f"),
};

export const textRecipientBuilder = Skia.ParagraphBuilder.Make(
	{
		...paragraphParams,
		textStyle: { ...paragraphStyle, color: black },
	},
	globalThis.fontManager
);

export const textMeBuilder = Skia.ParagraphBuilder.Make(
	{
		...paragraphParams,
		textStyle: { ...paragraphStyle, color: white },
	},
	globalThis.fontManager
);

export const authorFontSize = 15 * scale;
export const authorBuilder = Skia.ParagraphBuilder.Make(
	{
		...paragraphParams,
		maxLines: 1,
		ellipsis: "...",
		textStyle: {
			...paragraphStyle,
			color: Skia.Color("#3d3e3f"),
			fontSize: authorFontSize,
			fontStyle: {
				weight: FontWeight.Normal,
			},
		},
	},
	globalThis.fontManager
);

export function loadImage(x = 400, y = 400) {
	return loadData(`https://picsum.photos/${x}/${y}`, (data) => Skia.Image.MakeImageFromEncoded(data), console.log);
}

export function biasedRandomNumber() {
	const ranges = [
		{ min: 4, max: 50, probability: 0.5 },
		{ min: 50, max: 100, probability: 0.3 },
		{ min: 100, max: 200, probability: 0.1 },
		{ min: 200, max: 400, probability: 0.07 },
		{ min: 400, max: 600, probability: 0.03 },
	];

	let cumulativeProbability = 0;
	const cumulativeRanges = ranges.map((range) => {
		cumulativeProbability += range.probability;
		return { ...range, cumulativeProbability };
	});

	const random = Math.random();

	let selectedRange = cumulativeRanges.find((range) => random <= range.cumulativeProbability);
	if (!selectedRange) return 0;

	const { min, max } = selectedRange;
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let acc = 0;

export function getRandomMessageData(i: number) {
	"worklet";
	authorBuilder.reset();

	const date = new Date(Date.now() * Math.random());
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const dateString = `${hours}:${minutes}`;

	const random = Math.random();
	// const user_id: string = "1";
	const user_id = random < 0.33 ? "1" : random < 0.66 ? "2" : "3";
	// const user_id: any = random < 0.5 ? "2" : "3";

	const authorName = user_id === "1" ? "Me" : user_id === "2" ? "John" : "Jane";

	let len = biasedRandomNumber();
	// let len = 20;
	let text: string | undefined = `${i}${lipsum.slice(acc % lipsum.length, (acc % lipsum.length) + len).trim()} `;
	// let text: string | undefined = `${i}${lipsum.slice(0, len).trim()}`;
	// lipsum = lipsum.slice(i * 3);
	acc += len;

	function getReactions() {
		const reactions = [] as {
			emoji: string;
			count: string;
		}[];
		const list = ["👍", "❤️", "😂", "😮", "😢", "😡", "🙏", "💯"];

		while (Math.random() > 0.8) {
			const emoji = list[Math.floor(Math.random() * list.length)]!;
			const count = Math.floor(Math.random() * 11 + 1).toString();

			reactions.push({
				emoji,
				count,
			});
		}
		return reactions;
	}

	const attachments = Math.random() < 0.1 ? [null] : [];
	if (attachments.length && Math.random() < 0.5) text = undefined;
	// const attachments = [] as any[];

	return {
		text: text,
		author: authorName,
		user_id,
		reactions: getReactions(),
		attachments,
		dateString,
		// id: Math.random().toString(),
		id: i.toString(),
	};
}

export function getRandomMessage(
	i: number,
	msg?: ReturnType<typeof getRandomMessageData>,
	my_user_id: string = "1",
	attachment?: SkImage,
	avatar1?: SkImage,
	avatar2?: SkImage
) {
	"worklet";
	authorBuilder.reset();

	if (!msg) msg = getRandomMessageData(i);

	const user_id = msg.user_id;

	// let len = 20;
	let text = msg.text;
	// let text: string | undefined = `${i}${lipsum.slice(0, len).trim()}`;
	// lipsum = lipsum.slice(i * 3);
	const author = authorBuilder
		.addText(msg.author)
		.pushStyle(dateStyle)
		.addText(" " + msg.dateString)
		.build();

	const textBuilder = user_id === my_user_id ? textMeBuilder : textRecipientBuilder;
	textBuilder.reset();

	const reactions = [] as {
		emoji: string;
		count: string;
		width: number;
		paragraph: SkParagraph;
	}[];

	for (const reaction of msg.reactions) {
		emojiBuilder.reset();
		const paragraph = emojiBuilder
			.pushStyle({ fontSize: 15, color: black, fontFamilies: [emojiFontFamily] })
			.addText(reaction.emoji)
			.pushStyle({ fontSize: 14, color: black, fontFamilies: ["Roboto"] })
			.addText(" " + reaction.count)
			.build();
		paragraph.layout(40);

		reactions.push({
			...reaction,
			width: paragraph.getMaxIntrinsicWidth(),
			paragraph,
		});
	}

	if (attachment === undefined) attachment = null;

	const attachments = Math.random() < 0.1 ? [attachment] : [];
	if (attachments.length && Math.random() < 0.5) text = undefined;
	if (avatar1 === undefined) avatar1 = null;
	if (avatar2 === undefined) avatar2 = null;

	let avatar = user_id === "1" ? null : user_id === "2" ? avatar2 : avatar1;

	const textParagraph = text ? textBuilder.addText(text).build() : undefined;

	if (textParagraph) globalThis.text = textParagraph;

	return {
		text: textParagraph,
		test: text,
		author,
		user_id,
		reactions,
		attachments,
		avatar,
		// id: Math.random().toString(),
		id: i.toString(),
	} as MessageItem;
}
