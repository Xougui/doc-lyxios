import { config, fields, collection } from '@keystatic/core';
import { block, wrapper, inline } from '@keystatic/core/content-components';

// --- Composants pour le Manager ---
const mdxComponents = {
  // --- ILLUSTRATIONS DISCORD (Visuel uniquement) ---
  DiscordElement: inline({
    label: 'Illustration Discord (Bouton/Menu)',
    description: 'À utiliser pour imiter l\'interface Discord dans vos explications (Non cliquable).',
    schema: {
      type: fields.select({
        label: 'Style visuel',
        options: [
          { label: 'Bouton Vert (Succès)', value: 'btn-success' },
          { label: 'Bouton Rouge (Danger)', value: 'btn-danger' },
          { label: 'Bouton Bleu (Principal)', value: 'btn-primary' },
          { label: 'Bouton Gris (Secondaire)', value: 'btn-secondary' },
          { label: 'Menu de Sélection', value: 'select' },
        ],
        defaultValue: 'btn-primary',
      }),
      content: fields.text({ label: 'Texte à afficher' }),
      icon: fields.checkbox({ label: 'Ajouter la flèche (pour les menus)', defaultValue: false }),
    },
  }),
  Image: block({
    label: 'Image / Média',
    description: 'Insérer une image depuis le dossier src/assets/guides/',
    schema: {
      src: fields.image({
        label: 'Image',
        directory: 'src/assets/guides',
        publicPath: '../../assets/guides/',
      }),
      alt: fields.text({ label: 'Texte alternatif (SEO)' }),
    },
  }),

  // --- NAVIGATION (Vrais liens) ---
  LinkButton: wrapper({
    label: 'Bouton de Lien (Navigation)',
    description: 'Un VRAI bouton cliquable pour envoyer le lecteur vers une autre page.',
    schema: {
      href: fields.text({ label: 'Lien (URL)' }),
      icon: fields.text({ label: 'Icône (ex: right-arrow, external)' }),
      variant: fields.select({
        label: 'Style du bouton',
        options: [
          { label: 'Plein (Principal)', value: 'primary' },
          { label: 'Contour (Secondaire)', value: 'secondary' },
          { label: 'Minimal (Texte)', value: 'minimal' },
        ],
        defaultValue: 'primary',
      }),
    },
  }),

  // --- CONTENU AUTOMATIQUE ---
  CommandList: block({
    label: 'Liste des Commandes (Auto)',
    description: 'Affiche automatiquement la liste des commandes.',
    schema: {},
  }),
  TeamList: block({
    label: 'Liste de l\'Équipe (Auto)',
    description: 'Affiche dynamiquement les membres de l\'équipe.',
    schema: {},
  }),

  // --- MISE EN PAGE ---
  Aside: wrapper({
    label: 'Bloc d\'Alerte (Note/Info)',
    schema: {
      type: fields.select({
        label: 'Couleur',
        options: [
          { label: 'Bleu (Note)', value: 'note' },
          { label: 'Vert (Astuce)', value: 'tip' },
          { label: 'Jaune (Attention)', value: 'caution' },
          { label: 'Rouge (Danger)', value: 'danger' },
        ],
        defaultValue: 'note',
      }),
      title: fields.text({ label: 'Titre personnalisé (Optionnel)' }),
    },
  }),
  Card: wrapper({
    label: 'Carte de contenu',
    schema: {
      title: fields.text({ label: 'Titre' }),
      icon: fields.text({ label: 'Icône Starlight' }),
      class: fields.ignored(),
    },
  }),
  Badge: inline({
    label: 'Petit Badge',
    schema: {
      text: fields.text({ label: 'Texte' }),
      variant: fields.select({
        label: 'Couleur',
        options: [
          { label: 'Bleu', value: 'note' },
          { label: 'Vert', value: 'success' },
          { label: 'Rouge', value: 'danger' },
          { label: 'Gris', value: 'default' },
        ],
        defaultValue: 'note',
      }),
      size: fields.ignored(),
    },
  }),
  Steps: wrapper({ label: 'Liste d\'Étapes', schema: {} }),

  // --- COMPOSANTS STARLIGHT / INTERNES (Pour compatibilité) ---
  CardGrid: wrapper({
    label: 'Grille de Cartes (Starlight)',
    schema: {
      stagger: fields.checkbox({ label: 'Décalage (Stagger)' }),
      class: fields.ignored(),
    },
  }),
  ChevronDown: inline({
    label: 'Icône Flèche (Lucide)',
    schema: {
      size: fields.ignored(),
      style: fields.ignored(),
    },
  }),
  span: wrapper({
    label: 'Span (HTML)',
    schema: {
      class: fields.ignored(),
      style: fields.ignored(),
    },
  }),
};

export default config({
  storage: import.meta.env.DEV ? { kind: 'local' } : { kind: 'github', repo: 'Xougui/doc-lyxios', branch: 'drafts' },
  collections: {
    docs: collection({
      label: 'Documentation',
      slugField: 'title',
      path: 'src/content/docs/**',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Titre de la page', description: 'Génère l\'URL et le nom du fichier.' }
        }),
        description: fields.text({
          label: 'Résumé SEO',
          description: 'Résumé pour Google (150 caractères).',
          multiline: true
        }),
        template: fields.select({
          label: 'Format de page',
          options: [
            { label: 'Standard (Documentation)', value: 'doc' },
            { label: 'Pleine page (Accueil)', value: 'splash' },
          ],
          defaultValue: 'doc',
        }),
        // --- Paramètres Starlight ---
        slug: fields.ignored(), // Le slug explicite ajouté par le script
        lastUpdated: fields.date({
          label: 'Dernière mise à jour',
          description: 'Format AAAA-MM-JJ'
        }),
        sidebar: fields.ignored(),
        hero: fields.ignored(),
        tableOfContents: fields.ignored(),
        editUrl: fields.ignored(),
        content: fields.mdx({
          label: 'Contenu',
          description: 'Rédigez ici. Utilisez le bouton + pour ajouter des composants.',
          components: mdxComponents,
        }),
      },
    }),
  },
});
