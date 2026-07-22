// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { parse as parseJs } from 'acorn';
import { unified } from '@astrojs/markdown-remark';

/**
 * Plugin Remark pour auto-importer les composants dans les fichiers MDX.
 * Injecte les imports ESM avec un AST complet (via acorn) pour que MDX les reconnaisse.
 */
function remarkAutoImport() {
	return (tree, vfile) => {
		// Ne pas injecter dans les fichiers .md (uniquement .mdx)
		if (vfile.basename?.endsWith('.md')) return;

		// 1. Détecter les identifiants déjà importés/déclarés dans le fichier
		const existingIdentifiers = new Set();
		for (const node of tree.children) {
			if (node.type === 'mdxjsEsm' && node.data?.estree?.body) {
				for (const statement of node.data.estree.body) {
					if (statement.type === 'ImportDeclaration') {
						for (const specifier of statement.specifiers) {
							existingIdentifiers.add(specifier.local.name);
						}
					}
				}
			}
		}

		// 2. Préparer la liste des imports à injecter (uniquement ceux qui manquent)
		const importsToInject = [];
		const cwd = process.cwd().replace(/\\/g, '/');

		if (!existingIdentifiers.has('DiscordElement')) {
			importsToInject.push(`import DiscordElement from '${cwd}/src/components/DiscordElement.astro';`);
		}
		if (!existingIdentifiers.has('CommandList')) {
			importsToInject.push(`import CommandList from '${cwd}/src/components/CommandList.jsx';`);
		}
		if (!existingIdentifiers.has('TeamList')) {
			importsToInject.push(`import TeamList from '${cwd}/src/components/TeamList.jsx';`);
		}

		// Pour les composants Starlight, on injecte seulement ceux qui ne sont pas déjà là
		const starlightComponents = [
			'Card', 'CardGrid', 'Aside', 'Steps', 'Tabs', 'TabItem', 'Badge', 'FileTree', 'Icon', 'LinkButton', 'LinkCard'
		];
		const missingStarlight = starlightComponents.filter(name => !existingIdentifiers.has(name));

		if (missingStarlight.length > 0) {
			importsToInject.push(`import { ${missingStarlight.join(', ')} } from '@astrojs/starlight/components';`);
		}

		// 3. Injection si nécessaire
		if (importsToInject.length === 0) return;

		const importStatements = importsToInject.join('\n');
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

		tree.children.unshift(importNode);
	};
}

export default defineConfig({
	site: 'https://doc.lyxios.fr/',
	output: 'server',
	adapter: vercel({
		webAnalytics: { enabled: true },
	}),
	// Plugin remark au niveau Astro → hérité par MDX (ajouté par Starlight)
	markdown: {
		processor: unified({
			remarkPlugins: [remarkAutoImport],
		}),
	},
	integrations: [
		starlight({
			title: 'Lyxios Docs',
			disable404Route: true,
			logo: {
				light: './src/assets/logo_light.svg',
				dark: './src/assets/logo_dark.svg',
				alt: 'Lyxios Logo',
			},
			components: { Head: './src/components/Head.astro' },
			customCss: ['./src/styles/custom.css'],
			defaultLocale: 'root',
			locales: {
				root: { label: 'Français', lang: 'fr' },
				en: { label: 'English', lang: 'en' },
				es: { label: 'Español', lang: 'es' }
			},
			social: [
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/RZHrtzwUC2' },
				{ icon: 'laptop', label: 'Statut', href: 'https://status.lyxios.fr/' },
			],
			sidebar: [
				{ label: 'Accueil', link: '/' },
				{
					label: 'Démarrage',
					collapsed: false,
					items: [
						{ autogenerate: { directory: 'guides/demarrage' } },
						{ label: 'Commandes', link: 'commandes' }
					]
				},
				{
					label: 'Modules',
					collapsed: false,
					items: [
						{ label: 'Sommaire', link: 'guides/modules/' },
						{
							label: 'Sécurité & Modération',
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Sécurité & Modération' } }]
						},
						{
							label: 'Communauté & Fun',
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Communauté & Fun' } }]
						},
						{
							label: 'Administration & Système',
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Administration & Système' } }]
						},
						{
							label: 'Utilitaires & Boost',
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Utilitaires & Boost' } }]
						}
					]
				},
				{
					label: 'Autres fonctionnalités',
					collapsed: true,
					items: [{ autogenerate: { directory: 'guides/autres' } }]
				},
				{
					label: 'Légal & Informations',
					collapsed: false,
					items: [
						{ label: 'Conditions d\'utilisation', link: 'legal/terms-of-service' },
						{ label: 'Politique de confidentialité', link: 'legal/privacy-policy' },
					]
				}
			],
		}),
		react(),
		sitemap(),
	],
});