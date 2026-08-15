# Roadbook — Carnet de voyage (PWA)

Appli de road trip autonome : étapes + carte, budget, billets, idées, checklist,
contacts SOS et **météo des jours à venir** (Open-Meteo, sans clé API).
Tout est stocké **en local sur l'appareil** (localStorage) — aucun serveur requis.

## Fichiers
- `index.html` — l'application (tout est dedans)
- `manifest.json` — pour l'installation en appli
- `service-worker.js` — fonctionnement hors-ligne
- `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-180.png` — icônes

## Mettre en ligne sur GitHub Pages
1. Crée un dépôt (ex. `roadbook`) et pousse **tous** ces fichiers à la racine.
2. `Settings → Pages → Source : Deploy from a branch → main / (root)`.
3. Ouvre l'URL `https://<ton-pseudo>.github.io/roadbook/`.
4. Sur mobile : menu du navigateur → **« Ajouter à l'écran d'accueil »**.

> Le service worker et le manifest exigent du HTTPS : GitHub Pages le fournit
> automatiquement. En local, teste avec `python3 -m http.server` (pas en `file://`).

## Sauvegarde
Roue crantée ⚙️ → **Exporter** (fichier `.json`) / **Importer**.
À faire avant de vider le cache du navigateur, sinon les données locales sont perdues.

## Limites météo
Les prévisions Open-Meteo vont jusqu'à ~16 jours. Au-delà, l'app affiche
« météo indisponible » — c'est normal. La météo s'affiche pour la première étape
géolocalisée d'une journée (saisis une **ville** dans le champ Lieu).
