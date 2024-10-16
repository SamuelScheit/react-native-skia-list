export function isInBound(
	x: number,
	y: number,
	rectX: number,
	rectY: number,
	width: number,
	height: number,
	hitSlop = 10
) {
	"worklet";

	rectX -= hitSlop;
	rectY -= hitSlop;
	width += hitSlop + hitSlop;
	height += hitSlop + hitSlop;

	return x >= rectX && x <= rectX + width && y >= rectY && y <= rectY + height;
}
