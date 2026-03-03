<script lang="ts">
	import { onMount } from 'svelte';
	import { bootMessages, progressBar } from '$lib/data/boot-messages';
	import { bootPhase, skipBoot, finishBoot } from '$lib/stores/boot';
	import { prefersReducedMotion } from '$lib/stores/motion';

	let lines: { text: string; type: string }[] = $state([]);
	let progress = $state(0);
	let showProgressBar = $state(false);
	let cancelled = false;
	let fadeOut = $state(false);

	function wait(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function runBootSequence() {
		for (const msg of bootMessages) {
			if (cancelled) return;

			if (msg.type === 'progress') {
				showProgressBar = true;
				// Animate progress bar
				for (let p = 0; p <= 100; p += 8) {
					if (cancelled) return;
					progress = p;
					await wait(30);
				}
				progress = 100;
				showProgressBar = false;
				lines = [...lines, { text: msg.text.replace('Memory test: ', 'Memory test: ') + '32768 MB OK', type: 'success' }];
				continue;
			}

			await wait(msg.delay);
			if (cancelled) return;
			lines = [...lines, { text: msg.text, type: msg.type || 'normal' }];
		}

		// Done — fade out
		await wait(400);
		if (cancelled) return;
		fadeOut = true;
		await wait(600);
		finishBoot();
	}

	function handleSkip() {
		cancelled = true;
		skipBoot();
	}

	onMount(() => {
		if ($prefersReducedMotion) {
			skipBoot();
			return;
		}

		runBootSequence();

		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
				handleSkip();
			}
		}
		window.addEventListener('keydown', handleKeydown);

		return () => {
			cancelled = true;
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

{#if $bootPhase === 'booting'}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="boot-screen" class:fade-out={fadeOut} onclick={handleSkip}>
		<div class="boot-content">
			{#each lines as line}
				<div class="boot-line {line.type}">
					{line.text}
				</div>
			{/each}

			{#if showProgressBar}
				<div class="boot-line progress">
					{progressBar(progress)}
				</div>
			{/if}
		</div>

		<div class="skip-hint">
			Press any key or click to skip
		</div>
	</div>
{/if}

<style>
	.boot-screen {
		position: fixed;
		inset: 0;
		z-index: 10000;
		background: var(--color-bg);
		padding: var(--space-xl);
		overflow-y: auto;
		cursor: pointer;
		transition: opacity 0.6s ease;
	}

	.boot-screen.fade-out {
		opacity: 0;
	}

	.boot-content {
		max-width: 700px;
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	.boot-line {
		white-space: pre-wrap;
		min-height: 1.5em;
	}

	.boot-line.success {
		color: var(--color-green);
	}

	.boot-line.warn {
		color: var(--color-coral);
	}

	.boot-line.normal {
		color: var(--color-text-dim);
	}

	.boot-line.progress {
		color: var(--color-cyan);
	}

	.skip-hint {
		position: fixed;
		bottom: var(--space-xl);
		right: var(--space-xl);
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.4; }
		50% { opacity: 0.8; }
	}
</style>
