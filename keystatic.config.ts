import { config, fields, collection } from '@keystatic/core';
import { block, wrapper, inline } from '@keystatic/core/content-components';

// --- Composants MDX ---
const mdxComponents = {
  // --- Starlight Standard ---
  Aside: wrapper({
    label: 'Encadré (Aside)',
    description: 'Affiche un encadré de type note, astuce, ou avertissement.',
    schema: {
      type: fields.select({
        label: 'Type',
        options: [
          { label: 'Note', value: 'note' },
          { label: 'Astuce (Tip)', value: 'tip' },
          { label: 'Attention (Caution)', value: 'caution' },
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
};

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
        title: fields.slug({ name: { label: 'Titre de la page' } }),
        
        content: fields.mdx({
          label: 'Corps de la page',
          description: 'Utilisez les composants disponibles pour enrichir votre documentation.',
          components: mdxComponents,
        }),

        description: fields.text({ 
          label: 'Description SEO', 
          description: 'Sert pour les moteurs de recherche et les partages réseaux sociaux.',
          multiline: true 
        }),

        template: fields.select({
          label: 'Template de page',
          description: '"Standard" pour la doc, "Splash" pour une page d\'accueil.',
          options: [
            { label: 'Standard', value: 'doc' },
            { label: 'Splash (Accueil)', value: 'splash' },
          ],
          defaultValue: 'doc',
        }),

        banner: fields.object({
          content: fields.text({ label: 'Texte du bandeau', multiline: true }),
        }, {
          label: 'Bandeau d\'annonce',
          description: 'Affiche un bandeau en haut de la page.',
        }),

        hero: fields.conditional(
          fields.checkbox({ label: 'Activer la section "Hero" (Mode Splash uniquement)', defaultValue: false }),
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
                { label: 'Boutons d\'action', itemLabel: props => props.fields.text.value }
              ),
            }),
            false: fields.empty(),
          }
        ),

        sidebar: fields.object({
          label: fields.text({ label: 'Titre dans la navigation', description: 'Si différent du titre de la page.' }),
          order: fields.number({ label: 'Position (Ordre)' }),
          hidden: fields.checkbox({ label: 'Masquer de la navigation', defaultValue: false }),
          badge: fields.object({
            text: fields.text({ label: 'Texte du badge' }),
            variant: fields.select({
              label: 'Couleur',
              options: [
                { label: 'Note (Bleu)', value: 'note' },
                { label: 'Tip (Vert)', value: 'tip' },
                { label: 'Caution (Jaune)', value: 'caution' },
                { label: 'Danger (Rouge)', value: 'danger' },
                { label: 'Success (Vert clair)', value: 'success' },
              ],
              defaultValue: 'note',
            }),
          }, {
            label: 'Badge de navigation',
          }),
        }, {
          label: 'Paramètres Sidebar (ToC latérale)',
        }),

        tableOfContents: fields.conditional(
          fields.checkbox({ label: 'Afficher la table des matières', defaultValue: true }),
          {
            true: fields.object({
              minHeadingLevel: fields.number({ label: 'Niveau min (H2 par défaut)', defaultValue: 2 }),
              maxHeadingLevel: fields.number({ label: 'Niveau max (H3 par défaut)', defaultValue: 3 }),
            }),
            false: fields.empty(),
          }
        ),

        editUrl: fields.text({ 
          label: 'URL d\'édition personnalisée', 
          description: 'Laisser vide pour utiliser l\'URL GitHub automatique.' 
        }),
        
        lastUpdated: fields.checkbox({ 
          label: 'Afficher la date de mise à jour', 
          defaultValue: true 
        }),
      },
    }),
  },
});


