<script lang="ts">
	import { onMount } from 'svelte';
	import { typewriterEffect } from '$lib/animations/typewriter';
	import { prefersReducedMotion } from '$lib/stores/motion';
	import { profile } from '$lib/data/links';

	let nameText = $state('');
	let taglineText = $state('');
	let bioText = $state('');
	let showCursor = $state(true);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;

		if ($prefersReducedMotion) {
			nameText = profile.name;
			taglineText = profile.tagline;
			bioText = profile.bio;
			showCursor = false;
			return;
		}

		const cancelName = typewriterEffect(profile.name, (v) => { nameText = v; }, {
			charDelay: 60,
			startDelay: 200
		});

		const taglineDelay = 200 + profile.name.length * 60 + 300;
		const cancelTagline = typewriterEffect(profile.tagline, (v) => { taglineText = v; }, {
			charDelay: 30,
			startDelay: taglineDelay
		});

		const bioDelay = taglineDelay + profile.tagline.length * 30 + 400;
		const cancelBio = typewriterEffect(profile.bio, (v) => { bioText = v; }, {
			charDelay: 15,
			startDelay: bioDelay
		});

		const cursorTimeout = setTimeout(() => { showCursor = false; }, bioDelay + profile.bio.length * 15 + 500);

		return () => {
			cancelName();
			cancelTagline();
			cancelBio();
			clearTimeout(cursorTimeout);
		};
	});
</script>

<div class="profile-card" class:mounted>
	<pre class="ascii-avatar" aria-hidden="true">{profile.ascii}</pre>

	<div class="profile-info">
		<h1 class="name">
			{nameText}{#if showCursor && nameText && !bioText}<span class="cursor">_</span>{/if}
		</h1>

		{#if taglineText}
			<p class="tagline">{taglineText}</p>
		{/if}

		{#if bioText}
			<p class="bio">
				{bioText}{#if showCursor}<span class="cursor">_</span>{/if}
			</p>
		{/if}

		<p class="location">{profile.location}</p>
	</div>
</div>

<style>
	.profile-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-lg);
		padding: var(--space-xl) var(--space-md);
		opacity: 0;
		transform: translateY(10px);
		transition: opacity 0.5s ease, transform 0.5s ease;
	}

	.profile-card.mounted {
		opacity: 1;
		transform: translateY(0);
	}

	.ascii-avatar {
		font-size: var(--font-size-sm);
		line-height: 1.2;
		color: var(--color-green);
		text-align: center;
	}

	.profile-info {
		text-align: center;
		max-width: 500px;
	}

	.name {
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--color-green);
		margin-bottom: var(--space-xs);
		min-height: 1.2em;
	}

	.tagline {
		font-size: var(--font-size-sm);
		color: var(--color-cyan);
		margin-bottom: var(--space-sm);
		min-height: 1.4em;
	}

	.bio {
		font-size: var(--font-size-sm);
		color: var(--color-text-dim);
		line-height: 1.6;
		margin-bottom: var(--space-sm);
		min-height: 1.4em;
	}

	.location {
		font-size: var(--font-size-xs);
		color: var(--color-text-dim);
		letter-spacing: 0.2em;
		text-transform: uppercase;
	}

	.cursor {
		animation: blink 0.8s step-end infinite;
		color: var(--color-green);
	}

	@keyframes blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

	@media (min-width: 640px) {
		.profile-card {
			flex-direction: row;
			align-items: flex-start;
		}

		.profile-info {
			text-align: left;
		}
	}
</style>
