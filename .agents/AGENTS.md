<RULE[doc_lyxios_standards]>
Lors de la création ou de la mise à jour de la documentation des modules Lyxios :
1. **Titres Frontmatter** : Le `title` doit être le nom brut et direct du module (ex: "Logs", "Tickets"), sans ajouts (pas de "Système de..."), pour garantir la cohérence du menu latéral.
2. **Vérification du code source & Libellés exacts** : N'inventez jamais les étapes. Consultez le code Python du bot (ex: `commandes_config.py`, vues `LayoutView`) pour documenter les options (boutons, sélecteurs). **Attention** : Reprenez les noms EXACTS des catégories du bot (ex: "Administration & Système", "Communauté & Fun") et non des raccourcis.
3. **Formatage UI Discord** : Utilisez obligatoirement les composants Starlight (`Steps`, `Aside`, `Badge`) et les classes HTML personnalisées (ex: `discord-element discord-btn-success`, `discord-select`) pour illustrer l'interface Discord, en prenant modèle sur les fichiers existants comme `bienvenue.mdx`.
4. **Cible** : Documentez la configuration via le bot Discord (commande `/config`), et mentionnez le Dashboard en ligne de manière secondaire, sauf indication contraire de l'utilisateur.
5. **Mise à jour des dates** : Mettez systématiquement à jour la variable `lastUpdated` dans le frontmatter avec la date du jour (format AAAA-MM-JJ) lors de la création ou modification d'une page.
</RULE[doc_lyxios_standards]>

<RULE[starlight_config_standards]>
Lors de la configuration de Starlight ou de l'ajout de métadonnées aux fichiers :
1. **Syntaxe `autogenerate` dans la sidebar** : Lors de la configuration manuelle d'un groupe avec `label` dans `astro.config.mjs`, placez toujours `autogenerate` dans un tableau `items`. Exemple : `{ label: 'Catégorie', items: [{ autogenerate: { directory: '...' } }] }`. Ne mettez jamais `label` et `autogenerate` au même niveau.
2. **Ajout de Badges** : Ne configurez pas les badges dans `astro.config.mjs` pour les fichiers autogénérés. Ajoutez-les toujours directement dans le frontmatter YAML du fichier `.mdx` ciblé via la propriété `sidebar.badge` (avec `text` et `variant`). Ne dupliquez jamais la clé racine `sidebar:` lors de cet ajout.
</RULE[starlight_config_standards]>
