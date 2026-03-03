<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preload" href="/fonts/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
