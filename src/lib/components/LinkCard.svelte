<script lang="ts">
	import { glitchText } from '$lib/animations/glitch';
	import { Spring } from '$lib/animations/spring';
	import { prefersReducedMotion } from '$lib/stores/motion';
	import type { Link } from '$lib/data/links';

	let { link, style = '' }: { link: Link; style?: string } = $props();

	let glitchOverride: string | null = $state(null);
	let displayLabel = $derived(glitchOverride ?? link.label);
	let glitchCancel: (() => void) | null = null;
	let scale = $state(1);
	let glowing = $state(false);

	// Spring for scale animation
	const scaleSpring = new Spring(1, { stiffness: 180, damping: 24 });
	let animFrame: number;

	function animateSpring() {
		scaleSpring.step(1 / 60);
		scale = scaleSpring.current;

		if (!scaleSpring.isSettled(0.001)) {
			animFrame = requestAnimationFrame(animateSpring);
		}
	}

	function handleMouseEnter() {
		glowing = true;

		if ($prefersReducedMotion) {
			scale = 1.04;
			return;
		}

		glitchCancel?.();
		glitchCancel = glitchText(link.label, (v) => { glitchOverride = v; }, { duration: 250 });

		scaleSpring.target = 1.04;
		cancelAnimationFrame(animFrame);
		animFrame = requestAnimationFrame(animateSpring);
	}

	function handleMouseLeave() {
		glowing = false;

		glitchCancel?.();
		glitchCancel = null;
		glitchOverride = null;

		if ($prefersReducedMotion) {
			scale = 1;
			return;
		}

		scaleSpring.target = 1;
		cancelAnimationFrame(animFrame);
		animFrame = requestAnimationFrame(animateSpring);
	}
</script>

<a
	href={link.url}
	target="_blank"
	rel="noopener noreferrer"
	class="link-card"
	class:glowing
	aria-label="{link.label} — {link.description || ''}"
	style="transform: scale({scale}); {style}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	<span class="icon" style="color: {link.color}">[{link.icon}]</span>
	<span class="content">
		<span class="label">{displayLabel}</span>
		{#if link.description}
			<span class="description">{link.description}</span>
		{/if}
	</span>
	<span class="arrow">→</span>
</a>

<style>
	.link-card {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-md) var(--space-lg);
		background: var(--color-surface);
		border: 1px solid transparent;
		border-radius: var(--radius-md);
		transition: border-color var(--transition-fast),
			box-shadow var(--transition-fast);
		will-change: transform;
		text-decoration: none;
		color: var(--color-text);
	}

	.link-card:hover {
		border-color: var(--color-green);
	}

	.link-card.glowing {
		box-shadow: 0 0 20px rgba(61, 232, 74, 0.15),
			0 0 40px rgba(61, 232, 74, 0.05);
	}

	.icon {
		font-size: var(--font-size-sm);
		font-weight: 700;
		flex-shrink: 0;
		width: 3ch;
		text-align: center;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}

	.label {
		font-size: var(--font-size-base);
		font-weight: 700;
		white-space: pre;
	}

	.description {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
	}

	.arrow {
		color: var(--color-text-dim);
		transition: color var(--transition-fast),
			transform var(--transition-fast);
	}

	.link-card:hover .arrow {
		color: var(--color-green);
		transform: translateX(4px);
	}
</style>
