# Audit d'Architecture & Dette Technique

## 🔵 Gravité Faible

### Absence de point d'entrée LLMs (`llms.txt` / Markdown brut)
- **Constat** : Le site de documentation Starlight (`doc.lyxios.fr`) est accessible aux agents de recherche en direct via `robots.txt`, mais ne propose pas de fichier standardisé `public/llms.txt` ni d'accès direct au contenu Markdown épuré.
- **Risques** : Consommation accrue de tokens pour les scrapers/agents IA, risque de parsing imparfait du HTML et manque de visibilité auprès des outils d'IA modernes (Cursor, LLMs en mode agent).
- **Pistes d'amélioration** :
  1. Générer et exposer un fichier `public/llms.txt` résumant la documentation et les liens utiles.
  2. Mettre à disposition une route ou un endpoint exposant les pages au format Markdown brut.
