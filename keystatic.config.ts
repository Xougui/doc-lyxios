import { config, fields, collection } from '@keystatic/core';
import { block, wrapper, inline } from '@keystatic/core/content-components';

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
      kind: 'github',
      repo: 'Xougui/doc-lyxios',
    },
  collections: {
    docs: collection({
      label: 'Documentation (Starlight)',
      slugField: 'title',
      path: 'src/content/docs/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        template: fields.select({
          label: 'Template',
          options: [
            { label: 'Page standard', value: 'doc' },
            { label: 'Page d\'accueil (Splash)', value: 'splash' },
          ],
          defaultValue: 'doc',
        }),
        lastUpdated: fields.date({ label: 'Dernière mise à jour' }),
        sidebar: fields.object({
          label: fields.text({ label: 'Libellé sidebar (optionnel)' }),
          order: fields.number({ label: 'Ordre de tri' }),
          hidden: fields.checkbox({ label: 'Cacher dans la sidebar', defaultValue: false }),
        }),
        tableOfContents: fields.conditional(
          fields.checkbox({ label: 'Afficher la table des matières', defaultValue: true }),
          {
            true: fields.object({
              minHeadingLevel: fields.number({ label: 'Niveau min', defaultValue: 2 }),
              maxHeadingLevel: fields.number({ label: 'Niveau max', defaultValue: 3 }),
            }),
            false: fields.empty(),
          }
        ),
        hero: fields.object({
          tagline: fields.text({ label: 'Tagline' }),
          image: fields.object({
            file: fields.text({ label: 'Chemin de l\'image' }),
          }),
          actions: fields.array(
            fields.object({
              text: fields.text({ label: 'Texte' }),
              link: fields.text({ label: 'Lien' }),
              icon: fields.text({ label: 'Icône' }),
            }),
            { label: 'Actions', itemLabel: props => props.fields.text.value }
          ),
        }),
        content: fields.mdx({
          label: 'Contenu de la page',
          components: {
            Card: wrapper({
              label: 'Carte (Starlight)',
              schema: {
                title: fields.text({ label: 'Titre' }),
                icon: fields.text({ label: 'Icône' }),
              },
            }),
            CardGrid: wrapper({
              label: 'Grille de cartes (Starlight)',
              schema: {
                stagger: fields.checkbox({ label: 'Décalage (stagger)' }),
              },
            }),
            CommandList: block({
              label: 'Liste des commandes',
              schema: {},
            }),
            LinkButton: wrapper({
              label: 'Bouton de lien',
              schema: {
                href: fields.text({ label: 'Lien' }),
                variant: fields.select({
                  label: 'Variante',
                  options: [
                    { label: 'Primary', value: 'primary' },
                    { label: 'Secondary', value: 'secondary' },
                    { label: 'Minimal', value: 'minimal' },
                  ],
                  defaultValue: 'primary',
                }),
                icon: fields.text({ label: 'Icône' }),
                target: fields.text({ label: 'Cible (ex: _blank)', defaultValue: '_blank' }),
              },
            }),
            ExternalLink: inline({
              label: 'Lien externe (icône)',
              schema: {
                size: fields.number({ label: 'Taille', defaultValue: 14 }),
              },
            }),
          }
        }),
      },
    }),
  },
});
