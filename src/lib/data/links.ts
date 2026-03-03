export interface Profile {
	name: string;
	handle: string;
	tagline: string;
	bio: string;
	location: string;
	email: string;
	ascii: string;
}

export interface Link {
	label: string;
	url: string;
	icon: string;
	description?: string;
	color?: string;
}

export const profile: Profile = {
	name: 'Stüssy Senik',
	handle: 'stussysenik',
	tagline: 'DevEx & Experience Design Engineer',
	bio: 'Building at the intersection of science, design, cinema, computation and code',
	location: 'NYC / PRAGUE',
	email: 'itsmxzou@gmail.com',
	ascii: `
    ┌─────────┐
    │  ◉   ◉  │
    │    ▲    │
    │  ╰───╯  │
    └─────────┘`.trim()
};

export const links: Link[] = [
	{
		label: 'GitHub',
		url: 'https://github.com/stussysenik',
		icon: 'GH',
		description: 'Open source & experiments',
		color: 'var(--color-text)'
	},
	{
		label: 'SoundCloud',
		url: 'https://on.soundcloud.com/b7PpyyqCuScmugtNZc',
		icon: 'SC',
		description: 'Mixes & sets',
		color: 'var(--color-coral)'
	},
	{
		label: 'LinkedIn',
		url: 'https://www.linkedin.com/in/mxzou',
		icon: 'LI',
		description: 'Professional network',
		color: 'var(--color-cyan)'
	},
	{
		label: 'Instagram',
		url: 'https://instagram.com/mx.zou',
		icon: 'IG',
		description: 'Visual diary',
		color: 'var(--color-coral)'
	},
	{
		label: 'X / Twitter',
		url: 'https://x.com/mx_zou',
		icon: 'X',
		description: 'Thoughts & threads',
		color: 'var(--color-text)'
	},
	{
		label: 'IMDb',
		url: 'https://www.imdb.com/name/nm14502866/',
		icon: 'IM',
		description: 'Film credits',
		color: 'var(--color-green)'
	},
	{
		label: 'Email',
		url: 'mailto:itsmxzou@gmail.com',
		icon: '@',
		description: 'Direct line',
		color: 'var(--color-cyan)'
	}
];
