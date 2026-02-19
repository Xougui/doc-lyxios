// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Lyxios Docs',
			
			// ✅ C'est Starlight qui prend le contrôle exclusif des langues
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Français',
					lang: 'fr',
				},
				en: {
					label: 'English',
					lang: 'en',
				},
				es: {
					label: 'Español',
					lang: 'es',
				}
			},

			social: [{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/R5Zs9m2u7X' }],
			sidebar: [
				{ label: 'Accueil', link: '/' },
				{
					label: 'Démarrage',
					autogenerate: { directory: 'guides/demarrage' },
				},
				{
					label: 'Modules',
					autogenerate: { directory: 'guides/modules' },
				},
				{
					label: 'Commandes',
					autogenerate: { directory: 'commandes' },
				},
			],
		}),
	],
});