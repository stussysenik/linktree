/**
 * Typewriter effect — async generator that yields characters one at a time.
 */

export interface TypewriterOptions {
	charDelay?: number;
	lineDelay?: number;
	startDelay?: number;
}

const DEFAULTS: Required<TypewriterOptions> = {
	charDelay: 40,
	lineDelay: 200,
	startDelay: 0
};

function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function* typewriter(
	text: string,
	options: TypewriterOptions = {}
): AsyncGenerator<string> {
	const opts = { ...DEFAULTS, ...options };

	if (opts.startDelay > 0) {
		await wait(opts.startDelay);
	}

	let result = '';
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		result += char;
		yield result;

		if (char === '\n') {
			await wait(opts.lineDelay);
		} else {
			await wait(opts.charDelay);
		}
	}
}

/**
 * Helper to drive a typewriter into a setter callback.
 * Returns a cancel function.
 */
export function typewriterEffect(
	text: string,
	setter: (value: string) => void,
	options: TypewriterOptions = {}
): () => void {
	let cancelled = false;

	(async () => {
		for await (const value of typewriter(text, options)) {
			if (cancelled) break;
			setter(value);
		}
	})();

	return () => {
		cancelled = true;
	};
}
