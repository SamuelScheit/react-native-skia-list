export function sleep(ms: number) {
	"worklet";

	return new Promise((res) => setTimeout(res, ms));
}
