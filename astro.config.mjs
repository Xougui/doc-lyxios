// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/R5Zs9m2u7X' }],
			sidebar: [
				{
					label: 'Démarrage',
					items: [
						{ label: 'Introduction', slug: 'index' },
						// { label: 'Inviter le bot', slug: 'guides/invite' },
					],
				},
				{
					label: 'Commandes',
					autogenerate: { directory: 'commandes' },
				},
			],
		}),
	],
});
