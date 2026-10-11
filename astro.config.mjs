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
	/**
	 * @param {any} tree
	 * @param {any} vfile
	 */
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
			editLink: {
				baseUrl: 'https://github.com/Xougui/doc-lyxios/edit/main/',
			},
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
				{ label: 'Accueil', translations: { en: 'Home', es: 'Inicio' }, link: '/' },
				{
					label: 'Démarrage',
					translations: { en: 'Getting Started', es: 'Inicio Rápido' },
					collapsed: false,
					items: [
						{ autogenerate: { directory: 'guides/demarrage' } },
						{ label: 'Commandes', translations: { en: 'Commands', es: 'Comandos' }, link: 'commandes' }
					]
				},
				{
					label: 'Modules',
					translations: { en: 'Modules', es: 'Módulos' },
					collapsed: false,
					items: [
						{ label: 'Sommaire', translations: { en: 'Overview', es: 'Resumen' }, link: 'guides/modules/' },
						{
							label: 'Sécurité & Protection',
							translations: { en: 'Security & Protection', es: 'Seguridad & Protección' },
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Sécurité & Protection' } }]
						},
						{
							label: 'Accueil & Messagerie',
							translations: { en: 'Welcome & Messaging', es: 'Bienvenida & Mensajería' },
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Accueil & Messagerie' } }]
						},
						{
							label: 'Engagement & Récompenses',
							translations: { en: 'Engagement & Rewards', es: 'Participación & Recompensas' },
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Engagement & Récompenses' } }]
						},
						{
							label: 'Administration & Gestion',
							translations: { en: 'Administration & Management', es: 'Administración & Gestión' },
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Administration & Gestion' } }]
						},
						{
							label: 'Utilitaires & Visibilité',
							translations: { en: 'Utilities & Visibility', es: 'Utilidades & Visibilidad' },
							collapsed: true,
							items: [{ autogenerate: { directory: 'guides/modules/Utilitaires & Visibilité' } }]
						}
					]
				},
				{
					label: 'Autres fonctionnalités',
					translations: { en: 'Other Features', es: 'Otras Funciones' },
					collapsed: true,
					items: [{ autogenerate: { directory: 'guides/autres' } }]
				},
				{
					label: 'Légal & Informations',
					translations: { en: 'Legal & Information', es: 'Información Legal' },
					collapsed: false,
					items: [
						{ label: 'Mentions légales', translations: { en: 'Legal Notice', es: 'Aviso Legal' }, link: 'legal/mentions-legales' },
						{ label: 'Conditions d\'utilisation', translations: { en: 'Terms of Service', es: 'Términos de Servicio' }, link: 'legal/terms-of-service' },
						{ label: 'Politique de confidentialité', translations: { en: 'Privacy Policy', es: 'Política de Privacidad' }, link: 'legal/privacy-policy' },
					]
				}
			],
		}),
		react(),
		sitemap(),
	],
});