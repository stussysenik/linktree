<script lang="ts">
	import { onMount } from 'svelte';
	import LinkCard from './LinkCard.svelte';
	import { Spring2D } from '$lib/animations/spring';
	import { prefersReducedMotion } from '$lib/stores/motion';
	import { links } from '$lib/data/links';

	const PROXIMITY_RADIUS = 200;
	const PUSH_STRENGTH = 15;

	let containerEl: HTMLElement;
	let mouseX = $state(0);
	let mouseY = $state(0);
	let cardEls: HTMLElement[] = [];
	let springs: Spring2D[] = [];
	let offsets: { x: number; y: number }[] = $state(links.map(() => ({ x: 0, y: 0 })));
	let animFrame: number;
	let mouseInside = $state(false);

	function initSprings() {
		springs = links.map(() => new Spring2D(0, 0, { stiffness: 120, damping: 18 }));
	}

	function handleMouseMove(e: MouseEvent) {
		if ($prefersReducedMotion) return;
		const rect = containerEl.getBoundingClientRect();
		mouseX = e.clientX - rect.left;
		mouseY = e.clientY - rect.top;
		mouseInside = true;
	}

	function handleMouseLeave() {
		mouseInside = false;
		springs.forEach((s) => s.setTarget(0, 0));
	}

	function tick() {
		if (!springs.length) return;

		for (let i = 0; i < cardEls.length; i++) {
			const el = cardEls[i];
			if (!el) continue;

			const rect = el.getBoundingClientRect();
			const containerRect = containerEl.getBoundingClientRect();
			const cardCenterX = rect.left - containerRect.left + rect.width / 2;
			const cardCenterY = rect.top - containerRect.top + rect.height / 2;

			if (mouseInside) {
				const dx = cardCenterX - mouseX;
				const dy = cardCenterY - mouseY;
				const dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < PROXIMITY_RADIUS && dist > 0) {
					const force = (1 - dist / PROXIMITY_RADIUS) * PUSH_STRENGTH;
					const nx = dx / dist;
					const ny = dy / dist;
					springs[i].setTarget(nx * force, ny * force);
				} else {
					springs[i].setTarget(0, 0);
				}
			}

			springs[i].step(1 / 60);
			offsets[i] = { x: springs[i].x.current, y: springs[i].y.current };
		}

		animFrame = requestAnimationFrame(tick);
	}

	onMount(() => {
		initSprings();

		if (!$prefersReducedMotion) {
			animFrame = requestAnimationFrame(tick);
		}

		return () => cancelAnimationFrame(animFrame);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="link-grid"
	bind:this={containerEl}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
	id="links"
>
	{#each links as link, i}
		<div
			class="link-wrapper"
			bind:this={cardEls[i]}
		>
			<LinkCard
				{link}
				style="transform: translate({offsets[i]?.x ?? 0}px, {offsets[i]?.y ?? 0}px)"
			/>
		</div>
	{/each}
</div>

<style>
	.link-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		max-width: 480px;
		width: 100%;
		margin: 0 auto;
		padding: 0 var(--space-md);
	}

	.link-wrapper {
		will-change: transform;
	}
</style>
