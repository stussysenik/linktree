<script lang="ts">
	import { prefersReducedMotion } from '$lib/stores/motion';
</script>

{#if !$prefersReducedMotion}
	<div class="crt-overlay" aria-hidden="true">
		<div class="scanlines"></div>
		<div class="phosphor-glow"></div>
	</div>
{/if}

<style>
	.crt-overlay {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 9999;
	}

	.scanlines {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(0, 0, 0, 0.08) 2px,
			rgba(0, 0, 0, 0.08) 4px
		);
	}

	.phosphor-glow {
		position: absolute;
		inset: 0;
		box-shadow: inset 0 0 120px rgba(61, 232, 74, 0.03),
			inset 0 0 60px rgba(61, 232, 74, 0.02);
		animation: flicker 4s ease-in-out infinite;
	}

	@keyframes flicker {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.97; }
		52% { opacity: 1; }
		54% { opacity: 0.98; }
	}
</style>
