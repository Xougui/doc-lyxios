import { config, fields, collection } from '@keystatic/core';

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
          label: 'Contenu de la page'
        }),
      },
    }),
  },
});
