export function debounce(fn: Function, wait = 100) {
	let timeout: any;
	return function (...args: any) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, wait);
	};
}

export function throttle(fn: Function, wait = 100) {
	let lastTime = 0;
	return function (...args: any) {
		const now = performance.now();
		if (now - lastTime >= wait) {
			lastTime = now;
			fn(...args);
		}
	};
}
