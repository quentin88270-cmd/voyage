# Roadbook — Carnet de voyage (PWA)

Appli de road trip : étapes + carte, **autour de moi**, budget, billets, idées,
checklist, contacts SOS et **météo des jours à venir**.
Profil + **voyage partagé en temps réel** avec les copains (via Firebase, optionnel).

## Fichiers
- `index.html` — l'application
- `manifest.json`, `service-worker.js` — installation + hors-ligne
- `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-180.png` — icônes

## Déployer sur GitHub Pages
1. Pousse **tous** ces fichiers à la racine d'un dépôt.
2. `Settings → Pages → Deploy from a branch → main / (root)`.
3. Ouvre `https://<ton-pseudo>.github.io/<depot>/`.
4. Sur mobile : menu du navigateur → **« Ajouter à l'écran d'accueil »**.

## Modes de fonctionnement
- **Local (par défaut)** : rien à configurer. Données stockées sur l'appareil.
  Pense à **Exporter** (⚙️) avant de vider le cache du navigateur.
- **Partagé** : nécessite une config Firebase (gratuit). Une fois configuré,
  crée un voyage → tu obtiens un **code à 6 lettres** → les autres le saisissent
  et tout se synchronise en direct (étapes, budget, idées, checklist…).

## Activer le partage (Firebase, ~5 min)
1. Va sur https://console.firebase.google.com → **Créer un projet**.
2. Menu **Build → Firestore Database → Create database** (mode *test* pour commencer).
3. Roue crantée du projet → **Paramètres → tes applications → Web (</>)** → enregistre l'app.
4. Copie l'objet `firebaseConfig` fourni et colle ses valeurs en haut de `index.html`
   dans `const FIREBASE_CONFIG = { ... }`.
5. Recharge la page : le bouton **« Créer un voyage partagé »** devient actif.

### Règles Firestore (démarrage)
En mode *test*, Firebase pose des règles ouvertes limitées dans le temps.
Pour un usage perso simple, tu peux garder des règles permissives sur la
collection `trips` :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /trips/{code} { allow read, write: if true; }
  }
}
```
> ⚠️ « if true » = tout le monde qui a le code peut lire/écrire. Suffisant entre
> amis, mais pas « sécurisé ». Si tu veux, je te branche l'auth anonyme Firebase
> pour verrouiller ça proprement.

## Notes
- **Météo** : Open-Meteo, prévisions à ~16 jours max. S'affiche pour la première
  étape géolocalisée d'une journée (saisis une **ville** dans le champ Lieu).
- **Autour de moi** : OpenStreetMap / Overpass (gratuit). Autorise la position.
- **Photos de billets** en voyage partagé : un document Firestore est limité à
  1 Mo. Avec beaucoup de photos, préfère des **liens** (Google Drive, etc.).
