// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { parse as parseJs } from 'acorn';

/**
 * Plugin Remark pour auto-importer les composants dans les fichiers MDX.
 * Injecte les imports ESM avec un AST complet (via acorn) pour que MDX les reconnaisse.
 */
function remarkAutoImport() {
	// Prépare le nœud d'import une seule fois (performance)
	const importStatements = [
		`import DiscordElement from '${process.cwd().replace(/\\/g, '/')}/src/components/DiscordElement.astro';`,
		`import CommandList from '${process.cwd().replace(/\\/g, '/')}/src/components/CommandList.jsx';`,
		`import TeamList from '${process.cwd().replace(/\\/g, '/')}/src/components/TeamList.jsx';`,
		`import { Card, CardGrid, Aside, Steps, Tabs, TabItem, Badge, FileTree, Icon, LinkButton, LinkCard } from '@astrojs/starlight/components';`,
	].join('\n');

	const importNode = {
		type: 'mdxjsEsm',
		value: importStatements,
		data: {
			estree: {
				...parseJs(importStatements, { ecmaVersion: 'latest', sourceType: 'module' }),
				type: 'Program',
				sourceType: 'module',
			},
		},
	};

	return (tree, vfile) => {
		// Ne pas injecter dans les fichiers .md (uniquement .mdx)
		if (vfile.basename?.endsWith('.md')) return;
		tree.children.unshift(importNode);
	};
}

export default defineConfig({
	site: 'https://doc.lyxios.xouxou-hosting.fr/',
	output: 'server',
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
	// Plugin remark au niveau Astro → hérité par MDX (ajouté par Starlight)
	markdown: {
		remarkPlugins: [remarkAutoImport],
	},
	integrations: [
		starlight({
			title: 'Lyxios Docs',
			disable404Route: true,
			logo: { src: '/src/assets/logo.webp', alt: 'Lyxios Logo' },
			components: { Head: './src/components/Head.astro' },
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'root',
			locales: {
				root: { label: 'Français', lang: 'fr' },
				en: { label: 'English', lang: 'en' },
				es: { label: 'Español', lang: 'es' }
			},
			social: [
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/R5Zs9m2u7X' },
				{ icon: 'laptop', label: 'Statut', href: 'https://status.xouxou-hosting.fr' },
			],
			sidebar: [
				{ label: 'Accueil', link: '/' },
				{ label: 'Démarrage', autogenerate: { directory: 'guides/demarrage' } },
				{ label: 'Modules', autogenerate: { directory: 'guides/modules' } },
				{ label: 'Commandes', link: 'commandes' },
				{ label: 'Conditions d\'utilisation', link: 'legal/terms-of-service' },
				{ label: 'Politique de confidentialité', link: 'legal/privacy-policy' },
			],
		}),
		react(),
		keystatic(),
	],
});