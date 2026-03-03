<script lang="ts">
	import { bootPhase } from '$lib/stores/boot';
	import BootSequence from '$lib/components/BootSequence.svelte';
	import MatrixRain from '$lib/components/MatrixRain.svelte';
	import CRTOverlay from '$lib/components/CRTOverlay.svelte';
	import ProfileCard from '$lib/components/ProfileCard.svelte';
	import LinkGrid from '$lib/components/LinkGrid.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import { profile } from '$lib/data/links';

	let showContent = $derived($bootPhase === 'ready');
</script>

<svelte:head>
	<title>{profile.name} — Links</title>
	<meta name="description" content="{profile.tagline} — {profile.bio}" />
	<meta name="theme-color" content="#0a0a0f" />
	<meta property="og:title" content="{profile.name} — Links" />
	<meta property="og:description" content="{profile.bio}" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{profile.name}" />
	<meta name="twitter:description" content="{profile.bio}" />
</svelte:head>

<!-- Skip link for accessibility -->
<a href="#links" class="skip-link">Skip to links</a>

<!-- Boot Sequence -->
<BootSequence />

<!-- Background layers (always rendered, behind content) -->
<MatrixRain />
<CRTOverlay />

<!-- Main content -->
{#if showContent}
	<main class="page" style="opacity: 0; animation: fadeIn 0.8s ease forwards;">
		<ProfileCard />

		<div class="divider" aria-hidden="true">
			<span>───── links ─────</span>
		</div>

		<LinkGrid />

		<footer class="footer">
			<p>&copy; {new Date().getFullYear()} {profile.name}</p>
		</footer>
	</main>

	<Terminal />
{/if}

<style>
	.skip-link {
		position: absolute;
		top: -100%;
		left: var(--space-md);
		padding: var(--space-sm) var(--space-md);
		background: var(--color-green);
		color: var(--color-bg);
		font-weight: 700;
		font-size: var(--font-size-sm);
		z-index: 99999;
		border-radius: var(--radius-sm);
	}

	.skip-link:focus {
		top: var(--space-md);
	}

	.page {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		padding: var(--space-2xl) var(--space-md);
		padding-bottom: 80px; /* Space for terminal */
	}

	.divider {
		color: var(--color-text-dim);
		font-size: var(--font-size-xs);
		margin: var(--space-lg) 0;
		letter-spacing: 0.3em;
		text-transform: uppercase;
	}

	.footer {
		margin-top: auto;
		padding-top: var(--space-2xl);
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
