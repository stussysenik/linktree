<script lang="ts">
	import { onMount } from 'svelte';
	import { MatrixRenderer } from '$lib/animations/matrix';
	import { prefersReducedMotion } from '$lib/stores/motion';

	let canvas: HTMLCanvasElement;
	let renderer: MatrixRenderer | null = null;

	onMount(() => {
		if ($prefersReducedMotion) return;

		renderer = new MatrixRenderer(canvas);
		renderer.start();

		// Pause on tab hidden
		function handleVisibility() {
			if (document.hidden) {
				renderer?.stop();
			} else {
				renderer?.start();
			}
		}
		document.addEventListener('visibilitychange', handleVisibility);

		// Handle resize
		function handleResize() {
			renderer?.resize();
		}
		window.addEventListener('resize', handleResize);

		return () => {
			renderer?.destroy();
			document.removeEventListener('visibilitychange', handleVisibility);
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

{#if !$prefersReducedMotion}
	<canvas bind:this={canvas} class="matrix-rain" aria-hidden="true"></canvas>
{/if}

<style>
	.matrix-rain {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
		opacity: 0.4;
	}
</style>
