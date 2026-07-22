name: Modification ou ajout de documentation
description: Signaler une erreur, une omission ou proposer une nouvelle page de documentation
title: "[DOC] "
labels: ["documentation"]
assignees: []

body:
  - type: markdown
    attributes:
      value: Merci d'utiliser ce formulaire pour proposer une modification de la documentation.
  - type: input
    id: page_url
    attributes:
      label: URL ou fichier concerné
      placeholder: ex: src/content/docs/guides/modules/Tickets.mdx
    validations:
      required: false
  - type: textarea
    id: description
    attributes:
      label: Description du problème ou de l'amélioration
      placeholder: Expliquez en quoi la documentation doit être mise à jour...
    validations:
      required: true
