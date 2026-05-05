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
        content: fields.mdx({ 
          label: 'Contenu de la page'
        }),
      },
    }),
  },
});
