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
      label: 'Documentation',
      slugField: 'title',
      path: 'src/content/docs/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Titre' } }),
        description: fields.text({ label: 'Description (SEO)', multiline: true }),
        template: fields.select({
          label: 'Template de page',
          options: [
            { label: 'Standard', value: 'doc' },
            { label: 'Splash (Accueil)', value: 'splash' },
          ],
          defaultValue: 'doc',
        }),
        editUrl: fields.text({ label: 'URL d\'édition (optionnel)', description: 'Surcharger l\'URL GitHub par défaut' }),
        lastUpdated: fields.checkbox({ label: 'Afficher la date de mise à jour', defaultValue: true }),
        banner: fields.object({
          content: fields.text({ label: 'Contenu du bandeau d\'annonce', multiline: true }),
        }),
        hero: fields.conditional(
          fields.checkbox({ label: 'Activer le Hero (Splash page uniquement)', defaultValue: false }),
          {
            true: fields.object({
              tagline: fields.text({ label: 'Slogan / Tagline' }),
              image: fields.object({
                file: fields.text({ label: 'Chemin de l\'image (ex: ../../assets/logo.webp)' }),
                alt: fields.text({ label: 'Texte alternatif' }),
              }),
              actions: fields.array(
                fields.object({
                  text: fields.text({ label: 'Texte du bouton' }),
                  link: fields.text({ label: 'Lien' }),
                  icon: fields.text({ label: 'Nom de l\'icône Starlight' }),
                  variant: fields.select({
                    label: 'Variante',
                    options: [
                      { label: 'Primary', value: 'primary' },
                      { label: 'Secondary', value: 'secondary' },
                      { label: 'Minimal', value: 'minimal' },
                    ],
                    defaultValue: 'primary',
                  }),
                }),
                { label: 'Actions', itemLabel: props => props.fields.text.value }
              ),
            }),
            false: fields.empty(),
          }
        ),
        sidebar: fields.object({
          label: fields.text({ label: 'Libellé personnalisé (ToC)' }),
          order: fields.number({ label: 'Ordre de tri' }),
          hidden: fields.checkbox({ label: 'Masquer de la sidebar', defaultValue: false }),
          badge: fields.object({
            text: fields.text({ label: 'Texte du badge' }),
            variant: fields.select({
              label: 'Couleur du badge',
              options: [
                { label: 'Note (Bleu)', value: 'note' },
                { label: 'Tip (Vert)', value: 'tip' },
                { label: 'Caution (Jaune)', value: 'caution' },
                { label: 'Danger (Rouge)', value: 'danger' },
                { label: 'Success (Vert clair)', value: 'success' },
              ],
              defaultValue: 'note',
            }),
          }),
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
        content: fields.mdx({
          label: 'Contenu de la page',
          components: {
            // --- Composants Starlight Standard ---
            Aside: wrapper({
              label: 'Encadré (Aside)',
              schema: {
                type: fields.select({
                  label: 'Type',
                  options: [
                    { label: 'Note', value: 'note' },
                    { label: 'Tip', value: 'tip' },
                    { label: 'Caution', value: 'caution' },
                    { label: 'Danger', value: 'danger' },
                  ],
                  defaultValue: 'note',
                }),
                title: fields.text({ label: 'Titre (optionnel)' }),
              },
            }),
            Card: wrapper({
              label: 'Carte (Card)',
              schema: {
                title: fields.text({ label: 'Titre' }),
                icon: fields.text({ label: 'Icône' }),
              },
            }),
            CardGrid: wrapper({
              label: 'Grille de cartes (CardGrid)',
              schema: {
                stagger: fields.checkbox({ label: 'Décalage (stagger)' }),
              },
            }),
            Steps: wrapper({
              label: 'Étapes (Steps)',
              schema: {},
            }),
            Tabs: wrapper({
              label: 'Onglets (Tabs)',
              schema: {
                syncKey: fields.text({ label: 'Clé de synchronisation' }),
              },
            }),
            TabItem: wrapper({
              label: 'Élément d\'onglet (TabItem)',
              schema: {
                label: fields.text({ label: 'Label de l\'onglet' }),
                icon: fields.text({ label: 'Icône' }),
              },
            }),
            Badge: inline({
              label: 'Badge',
              schema: {
                text: fields.text({ label: 'Texte' }),
                variant: fields.select({
                  label: 'Variante',
                  options: [
                    { label: 'Note', value: 'note' },
                    { label: 'Tip', value: 'tip' },
                    { label: 'Caution', value: 'caution' },
                    { label: 'Danger', value: 'danger' },
                    { label: 'Success', value: 'success' },
                  ],
                  defaultValue: 'note',
                }),
              },
            }),
            FileTree: block({
              label: 'Arborescence (FileTree)',
              schema: {},
            }),
            // --- Composants Personnalisés ---
            CommandList: block({
              label: 'Liste des Commandes (API)',
              schema: {},
            }),
            TeamList: block({
              label: 'Liste de l\'Équipe (API)',
              schema: {},
            }),
            LinkButton: wrapper({
              label: 'Bouton Lien',
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
                target: fields.text({ label: 'Cible', defaultValue: '_blank' }),
              },
            }),
          }
        }),
      },
    }),
  },
});
