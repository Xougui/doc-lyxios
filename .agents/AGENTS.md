<RULE[doc_lyxios_standards]>
Lors de la création ou de la mise à jour de la documentation des modules Lyxios :
1. **Titres Frontmatter** : Le `title` doit être le nom brut et direct du module (ex: "Logs", "Tickets"), sans ajouts (pas de "Système de..."), pour garantir la cohérence du menu latéral.
2. **Vérification du code source & Libellés exacts** : N'inventez jamais les étapes. Consultez le code Python du bot (ex: `commandes_config.py`, vues `LayoutView`) pour documenter les options (boutons, sélecteurs). **Attention** : Reprenez les noms EXACTS des catégories du bot (ex: "Administration & Système", "Communauté & Fun") et non des raccourcis.
3. **Formatage UI Discord** : Utilisez obligatoirement les composants Starlight (`Steps`, `Aside`, `Badge`) et les classes HTML personnalisées (ex: `discord-element discord-btn-success`, `discord-select`) pour illustrer l'interface Discord, en prenant modèle sur les fichiers existants comme `bienvenue.mdx`.
4. **Cible** : Documentez la configuration via le bot Discord (commande `/config`), et mentionnez le Dashboard en ligne de manière secondaire, sauf indication contraire de l'utilisateur.
5. **Mise à jour des dates** : Mettez systématiquement à jour la variable `lastUpdated` dans le frontmatter avec la date du jour (format AAAA-MM-JJ) lors de la création ou modification d'une page.
</RULE[doc_lyxios_standards]>
