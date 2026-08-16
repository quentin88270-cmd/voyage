# Roadbook — Carnet de voyage (PWA)

Appli de road trip à plusieurs : comptes, trajet jour par jour + carte, météo,
autour de moi, budget, billets, idées, checklist, SOS, suivi GPS en direct,
et compte rendu PDF de fin de voyage.

## Fichiers
- `index.html` — l'application (config Firebase incluse)
- `manifest.json`, `service-worker.js` — installation + hors-ligne + mises à jour auto
- `icon.svg`, `icon-192.png`, `icon-512.png`, `icon-180.png` — icônes

## Déployer sur GitHub Pages
Pousse tous les fichiers à la racine → Settings → Pages → Deploy from a branch →
main / (root). Ouvre `https://<pseudo>.github.io/<depot>/`.

## Firebase (comptes + partage)
La config est déjà dans `index.html`. Il reste 2 choses à activer côté console :

### 1) Authentification (comptes email / mot de passe)
Console Firebase → **Build → Authentication → Commencer → Sign-in method →**
**E-mail/Mot de passe → Activer**. Sans ça, personne ne peut créer de compte.

### 2) Base Firestore + règles
Firestore doit exister (Build → Firestore Database). Puis onglet **Rules**,
colle ceci et **Publie** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Profils : chacun lit/écrit le sien ; lisibles par les connectés (liste des membres)
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // Voyages : réservés aux comptes connectés
    match /trips/{code} {
      allow read, write: if request.auth != null;
    }

    // Signalements de bug : création seule, lecture via la console
    match /feedback/{doc} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

> Ces règles remplacent l'ancienne (`trips: if true`). Elles nécessitent d'avoir
> activé l'authentification (étape 1), sinon plus personne n'accède aux voyages.

## Réglages facultatifs (en haut de index.html)
```js
const DON_URL = "";       // ton lien de cagnotte Leetchi
const CONTACT_EMAIL = ""; // pour recevoir les signalements par email
```

## Notes
- **Mises à jour** : le HTML se charge en réseau d'abord → tes amis reçoivent les
  nouvelles versions automatiquement, sans réinstaller. Pour purger le cache chez
  tout le monde, incrémente `roadbook-v4` → `v5` en haut du service worker.
- **Météo** : Open-Meteo (~16 jours). **Lieux** : Nominatim (adresses/POI).
  **Autour** : Overpass. **Itinéraire réel** : OSRM. Tous gratuits, sans clé.
- **PDF** : généré côté navigateur (jsPDF chargé à la demande). Les pays traversés
  sont détectés au mieux (échantillon de points, ~1 requête/seconde).
- **Photos** en voyage partagé : un document Firestore fait 1 Mo max ; avec
  beaucoup de photos, préfère des liens.
