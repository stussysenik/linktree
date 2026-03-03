<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { executeCommand, AVAILABLE_COMMANDS } from '$lib/data/commands';
	import { prefersReducedMotion } from '$lib/stores/motion';

	let inputElement: HTMLInputElement = $state(null!);
	let terminalEl: HTMLElement = $state(null!);
	let terminalHistory: { type: 'input' | 'output'; content: string }[] = $state([
		{ type: 'output', content: '<span class="c-green">Welcome to senik-sh v1.0</span>' },
		{ type: 'output', content: 'Type <span class="c-green">help</span> for available commands.' }
	]);
	let currentInput = $state('');
	let historyIndex = $state(-1);
	let commandHistory: string[] = [];
	let expanded = $state(false);
	let tabSuggestion = $state('');

	const PROMPT = '<span class="c-cyan">visitor</span>@<span class="c-green">senik</span>:<span class="c-text-dim">~$</span>';

	function handleKeydown(e: KeyboardEvent) {
		tabSuggestion = '';

		if (e.key === 'Enter') {
			const command = currentInput.trim();
			terminalHistory = [...terminalHistory, { type: 'input', content: command }];

			if (command) {
				commandHistory.push(command);
				historyIndex = commandHistory.length;

				const result = executeCommand(command, commandHistory);

				if (result.action === 'clear') {
					terminalHistory = [];
				} else if (result.output) {
					terminalHistory = [...terminalHistory, { type: 'output', content: result.output }];
				}

				if (result.action === 'navigate' && result.url) {
					window.open(result.url, '_blank', 'noopener,noreferrer');
				}
			}
			currentInput = '';
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				currentInput = commandHistory[historyIndex];
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				currentInput = commandHistory[historyIndex];
			} else {
				historyIndex = commandHistory.length;
				currentInput = '';
			}
		} else if (e.key === 'Tab') {
			e.preventDefault();
			const partial = currentInput.trim().toLowerCase();
			if (!partial) return;

			// Check if input has a space (completing argument, not command)
			if (partial.includes(' ')) return;

			const matches = AVAILABLE_COMMANDS.filter((c) => c.startsWith(partial));
			if (matches.length === 1) {
				currentInput = matches[0];
			} else if (matches.length > 1) {
				tabSuggestion = matches.join('  ');
			}
		} else if (e.key === 'l' && e.ctrlKey) {
			e.preventDefault();
			terminalHistory = [];
		}
	}

	function focusInput() {
		inputElement?.focus();
	}

	function toggleExpand() {
		expanded = !expanded;
		if (expanded) {
			setTimeout(() => inputElement?.focus(), 100);
		}
	}

	$effect(() => {
		// Track history length to trigger scroll
		terminalHistory.length;
		tick().then(() => {
			if (terminalEl) {
				terminalEl.scrollTop = terminalEl.scrollHeight;
			}
		});
	});
</script>

<div class="terminal-container" class:expanded>
	<button class="terminal-header" onclick={toggleExpand} aria-expanded={expanded}>
		<span class="terminal-dots" aria-hidden="true">
			<span class="dot red"></span>
			<span class="dot yellow"></span>
			<span class="dot green"></span>
		</span>
		<span class="terminal-title">senik-sh</span>
		<span class="terminal-toggle">{expanded ? '▼' : '▲'}</span>
	</button>

	{#if expanded}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="terminal-body" bind:this={terminalEl} onclick={focusInput}>
			<div class="output">
				{#each terminalHistory as line}
					<div class="line" class:input-line={line.type === 'input'}>
						{#if line.type === 'input'}
							<span class="prompt">{@html PROMPT}</span>
						{/if}
						<span class="content">{@html line.content}</span>
					</div>
				{/each}

				{#if tabSuggestion}
					<div class="line tab-suggestion">
						{tabSuggestion}
					</div>
				{/if}
			</div>

			<div class="input-line active">
				<span class="prompt">{@html PROMPT}</span>
				<input
					bind:this={inputElement}
					bind:value={currentInput}
					onkeydown={handleKeydown}
					type="text"
					class="terminal-input"
					spellcheck="false"
					autocomplete="off"
					aria-label="Terminal input"
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.terminal-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: var(--color-surface);
		border-top: 1px solid var(--color-green);
		transition: height var(--transition-base) ease;
		max-height: 50vh;
		display: flex;
		flex-direction: column;
	}

	.terminal-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		padding: var(--space-sm) var(--space-md);
		background: rgba(26, 26, 46, 0.95);
		border: none;
		cursor: pointer;
		width: 100%;
		text-align: left;
		color: var(--color-text-dim);
		font-size: var(--font-size-xs);
	}

	.terminal-header:hover {
		background: rgba(26, 26, 46, 1);
	}

	.terminal-dots {
		display: flex;
		gap: 6px;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}

	.dot.red { background: #ff5f56; }
	.dot.yellow { background: #ffbd2e; }
	.dot.green { background: #27c93f; }

	.terminal-title {
		flex: 1;
		text-align: center;
	}

	.terminal-toggle {
		font-size: 10px;
	}

	.terminal-body {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-md);
		font-size: var(--font-size-sm);
		line-height: 1.6;
		cursor: text;
		min-height: 200px;
		max-height: calc(50vh - 40px);
	}

	.line {
		display: flex;
		gap: 1ch;
		white-space: pre-wrap;
		word-break: break-all;
	}

	.input-line {
		display: flex;
		gap: 1ch;
		align-items: center;
	}

	.input-line.active {
		margin-top: var(--space-xs);
	}

	.prompt {
		user-select: none;
		flex-shrink: 0;
	}

	.terminal-input {
		flex: 1;
		background: transparent;
		border: none;
		color: var(--color-text);
		font-family: inherit;
		font-size: inherit;
		padding: 0;
		outline: none;
		caret-color: var(--color-green);
	}

	.tab-suggestion {
		color: var(--color-text-dim);
		font-style: italic;
	}

	/* Terminal color classes */
	:global(.c-green) { color: var(--color-green); }
	:global(.c-coral) { color: var(--color-coral); }
	:global(.c-cyan) { color: var(--color-cyan); }
	:global(.c-text-dim) { color: var(--color-text-dim); }
</style>
