// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { visit } from 'unist-util-visit';

/**
 * Plugin Remark pour injecter automatiquement les imports Starlight
 * Permet aux CM de ne pas avoir à écrire les "import { ... }" manuellement.
 */
function remarkStarlightComponents() {
	return (tree) => {
		const starlightComponents = new Set();
		const customComponents = new Set();

		visit(tree, (node) => {
			if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
				if (['Card', 'CardGrid', 'Aside', 'Steps', 'Tabs', 'TabItem', 'Badge', 'FileTree'].includes(node.name)) {
					starlightComponents.add(node.name);
				}
				if (['CommandList', 'TeamList'].includes(node.name)) {
					customComponents.add(node.name);
				}
			}
		});

		if (starlightComponents.size > 0) {
			const names = Array.from(starlightComponents).join(', ');
			tree.children.unshift({
				type: 'mdxjsEsm',
				value: `import { ${names} } from '@astrojs/starlight/components';`,
			});
		}

		if (customComponents.has('CommandList')) {
			tree.children.unshift({
				type: 'mdxjsEsm',
				value: `import CommandList from '/src/components/CommandList.jsx';`,
			});
		}
		if (customComponents.has('TeamList')) {
			tree.children.unshift({
				type: 'mdxjsEsm',
				value: `import TeamList from '/src/components/TeamList.jsx';`,
			});
		}
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://doc.lyxios.xouxou-hosting.fr/',
	output: 'server',
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	integrations: [
		starlight({
			title: 'Lyxios Docs',
			disable404Route: true,
			logo: {
				src: '/src/assets/logo.webp',
				alt: 'Lyxios Logo',
			},
			components: {
				Head: './src/components/Head.astro',
			},
			customCss: [
				'./src/styles/custom.css',
			],
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

			social: [
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/R5Zs9m2u7X' },
				{ icon: 'laptop', label: 'Statut', href: 'https://status.xouxou-hosting.fr' },
			],
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
				{ label: 'Commandes', link: 'commandes' },
				{ label: 'Conditions d\'utilisation', link: 'legal/terms-of-service' },
				{ label: 'Politique de confidentialité', link: 'legal/privacy-policy' },
			],
			markdown: {
				remarkPlugins: [remarkStarlightComponents],
			},
		}),
		react(),
		keystatic(),
	],
});