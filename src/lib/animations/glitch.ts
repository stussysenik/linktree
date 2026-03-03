/**
 * Glitch text effect — scrambles characters then settles left-to-right.
 */

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function randomChar(): string {
	return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export interface GlitchOptions {
	/** Total duration in ms */
	duration?: number;
	/** How many scramble iterations per character */
	iterations?: number;
}

const DEFAULTS: Required<GlitchOptions> = {
	duration: 300,
	iterations: 3
};

/**
 * Runs a glitch scramble on `text`, calling `setter` each frame.
 * Characters settle left-to-right over `duration` ms.
 * Returns a cancel function.
 */
export function glitchText(
	text: string,
	setter: (value: string) => void,
	options: GlitchOptions = {}
): () => void {
	const opts = { ...DEFAULTS, ...options };
	let cancelled = false;
	let frame: number;

	const startTime = performance.now();
	const totalDuration = opts.duration;

	function tick() {
		if (cancelled) return;

		const elapsed = performance.now() - startTime;
		const progress = Math.min(elapsed / totalDuration, 1);

		// How many characters have settled (left to right)
		const settledCount = Math.floor(progress * text.length);

		let result = '';
		for (let i = 0; i < text.length; i++) {
			if (i < settledCount) {
				result += text[i];
			} else if (text[i] === ' ') {
				result += ' ';
			} else {
				result += randomChar();
			}
		}

		setter(result);

		if (progress < 1) {
			frame = requestAnimationFrame(tick);
		} else {
			setter(text);
		}
	}

	frame = requestAnimationFrame(tick);

	return () => {
		cancelled = true;
		cancelAnimationFrame(frame);
	};
}
