# 📖 Guide de Contribution à la Documentation Lyxios

Merci de votre intérêt pour la documentation officielle de **Lyxios** ! Ce guide rassemble toutes les consignes techniques et éditoriales pour vous aider à proposer des modifications ou ajouter de nouvelles pages.

---

## 🛠️ Workflow de Contribution (Pull Requests)

1. **Forker le dépôt** sur votre compte GitHub.
2. **Créer une branche dédiée** pour votre fonctionnalité ou correctif :
   ```bash
   git checkout -b doc/nom-de-votre-page
   ```
3. **Tester en local** :
   ```bash
   npm install
   npm run dev
   ```
4. **Vérifier le projet (Typecheck, Build & Sécurité)** :
   Avant de pousser vos modifications ou d'ouvrir une PR, lancez la commande de vérification globale :
   ```bash
   npm run verify
   ```
   *(Cette commande enchaîne `astro check`, `npm run build` et `npm audit` pour s'assurer qu'aucune erreur TypeScript, de build ou de sécurité n'est introduite).*
5. **Ouvrir une Pull Request (PR)** vers la branche `main` du dépôt officiel.

> 💡 **Règle d'or (1 PR = 1 Changement)** : Chaque Pull Request doit se concentrer sur un seul sujet ou une seule page. Ne regroupez pas plusieurs modifications sans rapport dans une même PR, sauf si ces pages sont directement liées entre elles.

---

## 📁 Organisation du Contenu

Les fichiers de documentation sont rédigés en MDX et se trouvent dans `src/content/docs/` :

- `guides/demarrage/` : Guide d'installation, invitation et prise en main.
- `guides/modules/` : Documentation des modules du bot, rangée par catégories exactes :
  - `Sécurité & Modération/`
  - `Communauté & Fun/`
  - `Administration & Système/`
  - `Utilitaires & Boost/`
- `guides/autres/` : Fonctionnalités secondaires.
- `legal/` : Conditions d'utilisation et politique de confidentialité.

> ⚠️ **Important** : Respectez scrupuleusement la casse et l'orthographe des dossiers pour garantir une génération correcte du menu latéral Starlight.

---

## ✍️ Normes Éditoriales & Frontmatter

Chaque fichier `.mdx` doit commencer par un en-tête YAML (frontmatter) configuré ainsi :

```yaml
---
title: Tickets
description: Guide complet pour configurer le système de tickets sur votre serveur Discord.
lastUpdated: 2026-07-22
sidebar:
  badge:
    text: Nouveau
    variant: note
---
```

### Règles du Frontmatter :
1. **Titre (`title`)** : Indiquez uniquement le **nom brut du module** (ex: `Tickets`, `Logs`, `Surveillance`). N'ajoutez pas de préfixes comme *"Système de..."* ou *"Module de..."*.
2. **Mise à jour (`lastUpdated`)** : Mettez systématiquement la date du jour au format `AAAA-MM-JJ`.
3. **Badges (`sidebar.badge`)** : Les badges s'ajoutent directement dans le frontmatter (pas dans la config Astro). Variants autorisés : `note` (bleu), `success` (vert), `caution` (jaune), `danger` (rouge), `default` (gris).
4. **Priorité d'explication** : Documentez en premier lieu la configuration via le bot Discord (commande `/config`), puis mentionnez le Dashboard web en second plan.

---

## 🎨 Composants UI & Interface Discord

Pour maintenir une cohérence visuelle haut de gamme, utilisez les composants intégrés.

### 1. Reproduction de l'interface Discord (`<DiscordElement>`)
Utilisez ce composant pour illustrer les boutons ou menus de sélection du bot :

```mdx
{/* Bouton de confirmation */}
<DiscordElement type="discord-btn-success" text="Valider" />

{/* Bouton de suppression */}
<DiscordElement type="discord-btn-danger" text="Supprimer" />

{/* Menu déroulant */}
<DiscordElement type="discord-select" text="Sélectionner une catégorie..." />
```

### 2. Blocs d'Alerte (`<Aside>`)
Les types d'alertes autorisés sont **strictement** : `"note"`, `"tip"`, `"caution"`, ou `"danger"`.
*(N'utilisez jamais `"important"` qui n'est pas supporté par Starlight).*

```mdx
<Aside type="tip">
  Seuls les membres avec la permission Administrateur peuvent modifier cette option.
</Aside>
```

### 3. Icônes Lucide (`lucide-react`) & Émojis
- **Icônes d'éléments UI & Boutons** : Privilégiez les icônes de la bibliothèque `lucide-react` (ex: boutons, titres de section).
- **Émojis standards** : L'utilisation d'émojis texte normaux est **autorisée uniquement si la fonctionnalité ou l'élément du bot Discord utilise directement cet émoji sur Discord**. Dans tous les autres cas, utilisez le composant d'icône `lucide-react`.

```mdx
import { ShieldCheck, Settings } from 'lucide-react';

<ShieldCheck className="w-5 h-5 text-indigo-400 inline-block mr-1" />
```

### 4. Guide Pas à Pas (`<Steps>`)
```mdx
<Steps>
1. Tapez la commande `/config` dans votre serveur.
2. Sélectionnez le module **Administration & Système**.
3. Activez l'option souhaitée.
</Steps>
```

---

## 🖼️ Captures d'Écran et Images

- **Qualité & Clarté** : Les captures d'écran doivent être nettes, lisibles, bien cadrées et illustrer précisément l'action ou la fonctionnalité expliquée. Evitez les images floues ou tronquées.
- **Emplacement** : Déposez vos images dans le dossier `src/assets/guides/`.
- **Ratios & Dimensions** : N'imposez pas d'attributs `width` ou `height` fixes afin d'éviter le rognage responsive et de conserver le ratio d'aspect original.
- **Chemins relatifs** : Calculez avec précision le chemin relatif vers l'image dans le fichier MDX.

---

## 📋 Checklist Avant de Soumettre une PR

- [ ] Le projet passe toutes les vérifications sans erreur (`npm run verify`).
- [ ] Le titre du frontmatter est le nom brut du module.
- [ ] La date `lastUpdated` a été mise à jour.
- [ ] Les types de `<Aside>` sont uniquement `note`, `tip`, `caution` ou `danger`.
- [ ] Les émojis standards ne sont utilisés que s'ils correspondent à l'affichage exact du bot Discord (sinon `lucide-react`).
- [ ] Les captures d'écran sont claires, nettes et expliquent directement la fonctionnalité.
- [ ] Les étapes de configuration privilégient la commande `/config` de Discord.
- [ ] Le fichier [LICENSE](./LICENSE) a été lu et accepté.
