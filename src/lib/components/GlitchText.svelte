<script lang="ts">
	import { glitchText } from '$lib/animations/glitch';
	import { prefersReducedMotion } from '$lib/stores/motion';

	let { text, tag = 'span', class: className = '' }: {
		text: string;
		tag?: string;
		class?: string;
	} = $props();

	let glitchOverride: string | null = $state(null);
	let displayText = $derived(glitchOverride ?? text);
	let cancel: (() => void) | null = null;

	function handleMouseEnter() {
		if ($prefersReducedMotion) return;
		cancel?.();
		cancel = glitchText(text, (v) => { glitchOverride = v; });
	}

	function handleMouseLeave() {
		cancel?.();
		cancel = null;
		glitchOverride = null;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
	this={tag}
	class="glitch-text {className}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
>
	{displayText}
</svelte:element>

<style>
	.glitch-text {
		display: inline-block;
		white-space: pre;
	}
</style>
