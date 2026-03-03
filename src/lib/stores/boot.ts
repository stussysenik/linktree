import { writable } from 'svelte/store';

export type BootPhase = 'booting' | 'ready';

export const bootPhase = writable<BootPhase>('booting');
export const bootSkipped = writable(false);

export function skipBoot() {
	bootSkipped.set(true);
	bootPhase.set('ready');
}

export function finishBoot() {
	bootPhase.set('ready');
}
