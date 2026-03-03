export interface BootMessage {
	text: string;
	delay: number;
	type?: 'normal' | 'success' | 'warn' | 'progress';
}

export const bootMessages: BootMessage[] = [
	{ text: 'SENIK BIOS v4.2.0 — Copyright (C) 2026', delay: 100 },
	{ text: '', delay: 50 },
	{ text: 'Detecting hardware...', delay: 200 },
	{ text: '  CPU: Creative Cortex M1 @ 4.2 GHz', delay: 80 },
	{ text: '  GPU: Imagination Engine RTX 4090', delay: 80 },
	{ text: '  RAM: 32GB DDR5 Aesthetic Memory', delay: 80 },
	{ text: '', delay: 50 },
	{ text: 'Memory test: ', delay: 100, type: 'progress' },
	{ text: 'Memory test: 32768 MB OK', delay: 400, type: 'success' },
	{ text: '', delay: 50 },
	{ text: 'Loading kernel modules...', delay: 200 },
	{ text: '  [OK] design-systems.ko', delay: 100, type: 'success' },
	{ text: '  [OK] creative-coding.ko', delay: 100, type: 'success' },
	{ text: '  [OK] motion-engine.ko', delay: 100, type: 'success' },
	{ text: '  [OK] cinema-pipeline.ko', delay: 100, type: 'success' },
	{ text: '  [WARN] sleep-scheduler.ko — not found', delay: 100, type: 'warn' },
	{ text: '', delay: 50 },
	{ text: 'Mounting filesystems...', delay: 150 },
	{ text: '  /dev/portfolio    mounted', delay: 80 },
	{ text: '  /dev/experiments  mounted', delay: 80 },
	{ text: '  /dev/music        mounted', delay: 80 },
	{ text: '', delay: 100 },
	{ text: '> profile --load --mode=creative', delay: 300 },
	{ text: '', delay: 200 },
	{ text: 'System ready.', delay: 100, type: 'success' }
];

/**
 * Generate an ASCII progress bar string.
 */
export function progressBar(percent: number, width = 30): string {
	const filled = Math.round((percent / 100) * width);
	const empty = width - filled;
	return `[${'#'.repeat(filled)}${'.'.repeat(empty)}] ${percent}%`;
}
