import { readable } from 'svelte/store';
import { browser } from '$app/environment';

/** Reactive store that tracks prefers-reduced-motion */
export const prefersReducedMotion = readable(false, (set) => {
	if (!browser) return;

	const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
	set(mql.matches);

	const handler = (e: MediaQueryListEvent) => set(e.matches);
	mql.addEventListener('change', handler);
	return () => mql.removeEventListener('change', handler);
});
