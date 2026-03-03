import { links, profile } from './links';

export interface CommandResult {
	output: string;
	action?: 'clear' | 'navigate';
	url?: string;
}

const NEOFETCH = `
<span class="c-green">    ┌─────────┐</span>     <span class="c-cyan">visitor</span>@<span class="c-cyan">senik.dev</span>
<span class="c-green">    │  ◉   ◉  │</span>     ─────────────────
<span class="c-green">    │    ▲    │</span>     <span class="c-cyan">OS:</span> CreativeOS 4.2
<span class="c-green">    │  ╰───╯  │</span>     <span class="c-cyan">Host:</span> ${profile.location}
<span class="c-green">    └─────────┘</span>     <span class="c-cyan">Kernel:</span> design-systems 2.0
                     <span class="c-cyan">Shell:</span> senik-sh 1.0
                     <span class="c-cyan">DE:</span> Terminal
                     <span class="c-cyan">Theme:</span> Hacker Green
                     <span class="c-cyan">CPU:</span> Creative Cortex M1
                     <span class="c-cyan">Memory:</span> Infinite / ∞

                     <span class="c-green">███</span><span class="c-coral">███</span><span class="c-cyan">███</span><span class="c-text-dim">███</span>`.trim();

const HELP_TEXT = `Available commands:

  <span class="c-green">help</span>        Show this help message
  <span class="c-green">ls</span>          List links
  <span class="c-green">ls -l</span>       List links (detailed)
  <span class="c-green">whoami</span>      Print bio
  <span class="c-green">neofetch</span>    System info
  <span class="c-green">open</span> &lt;link&gt; Navigate to link
  <span class="c-green">clear</span>       Clear terminal
  <span class="c-green">echo</span> &lt;text&gt; Print text
  <span class="c-green">date</span>        Print current date
  <span class="c-green">history</span>     Show command history
  <span class="c-green">pwd</span>         Print working directory`;

function matchLink(name: string): typeof links[number] | undefined {
	const lower = name.toLowerCase();
	return links.find(
		(l) =>
			l.label.toLowerCase() === lower ||
			l.icon.toLowerCase() === lower
	);
}

export const AVAILABLE_COMMANDS = [
	'help', 'ls', 'whoami', 'neofetch', 'open', 'clear',
	'echo', 'date', 'history', 'pwd', 'cat', 'sudo', 'rm'
];

export function executeCommand(
	input: string,
	history: string[]
): CommandResult {
	const parts = input.trim().split(/\s+/);
	const cmd = parts[0]?.toLowerCase();
	const args = parts.slice(1);

	switch (cmd) {
		case 'help':
			return { output: HELP_TEXT };

		case 'ls':
			if (args[0] === '-l') {
				const lines = links.map(
					(l) =>
						`<span class="c-cyan">[${l.icon.padEnd(2)}]</span> ${l.label.padEnd(14)} <span class="c-text-dim">${l.description || ''}</span>`
				);
				return { output: lines.join('\n') };
			}
			return {
				output: links
					.map((l) => `<span class="c-cyan">[${l.icon}]</span> ${l.label}`)
					.join('  ')
			};

		case 'whoami':
			return {
				output: `<span class="c-green">${profile.name}</span>\n${profile.tagline}\n<span class="c-text-dim">${profile.bio}</span>\n<span class="c-cyan">${profile.location}</span>`
			};

		case 'neofetch':
			return { output: NEOFETCH };

		case 'open': {
			if (!args[0]) {
				return { output: 'Usage: open <link-name>\nTry: open github' };
			}
			const link = matchLink(args[0]);
			if (!link) {
				return {
					output: `<span class="c-coral">Link not found: ${args[0]}</span>\nAvailable: ${links.map((l) => l.label.toLowerCase()).join(', ')}`
				};
			}
			return {
				output: `Opening ${link.label}...`,
				action: 'navigate',
				url: link.url
			};
		}

		case 'clear':
			return { output: '', action: 'clear' };

		case 'echo':
			return { output: args.join(' ') || '' };

		case 'date':
			return { output: `<span class="c-cyan">${new Date().toLocaleString()}</span>` };

		case 'history':
			if (history.length === 0) return { output: 'No commands in history.' };
			return {
				output: history
					.map((h, i) => `<span class="c-text-dim">${String(i + 1).padStart(4)}</span>  ${h}`)
					.join('\n')
			};

		case 'pwd':
			return { output: '/home/visitor' };

		case 'cat':
			if (!args[0]) return { output: 'Usage: cat <filename>' };
			if (args[0] === 'about.txt')
				return { output: profile.bio };
			if (args[0] === '.env')
				return { output: '<span class="c-coral">Permission denied: nice try</span>' };
			return {
				output: `<span class="c-coral">cat: ${args[0]}: No such file or directory</span>`
			};

		case 'sudo':
			return { output: '<span class="c-coral">Nice try.</span>' };

		case 'rm':
			if (args.join(' ').includes('-rf')) {
				return {
					output: `<span class="c-coral">Deleting everything...</span>\n<span class="c-coral">rm: /home/*</span>\n<span class="c-coral">rm: /usr/*</span>\n<span class="c-coral">rm: /var/*</span>\n\n<span class="c-green">Just kidding. Everything is fine.</span>`
				};
			}
			return { output: `<span class="c-coral">rm: missing operand</span>` };

		default:
			return {
				output: `<span class="c-coral">command not found: ${cmd}</span>\nType <span class="c-green">help</span> for available commands.`
			};
	}
}
