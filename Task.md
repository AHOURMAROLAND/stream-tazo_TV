# TAZO TV — Plan rolax1212 v2.0.1

## Contexte
TAZO TV est un agrégateur de streams de matchs de football en direct déployé sur Vercel, installable comme PWA, utilisant React 19, Vite 8 et Tailwind CSS v4. Le projet récupère des données depuis des APIs externes (kora-api.space, TheSportsDB) et propose des fonctionnalités de favoris, de changement de serveur et de mini-player.

## Stack technique
Frontend : React 19, Vite 8, Tailwind CSS 4, Zustand 5, React Router 7, Axios, dayjs, hls.js. Aucune base de données (appels directs aux APIs externes).

## Tâches
- [x] Exécuter `npm audit` pour identifier et corriger les vulnérabilités de sécurité critiques dans les dépendances
- [x] Exécuter `npm outdated` et mettre à jour les packages ayant des mises à jour majeures critiques (react, react-dom, vite, tailwindcss)
- [x] Vérifier la présence et la validité de la variable d'environnement `APIFOOTBALL_KEY` en production (Vercel) et en développement
- [x] S'assurer que `api/football-data.js` inclut la vérification de l'absence de clé API et retourne une erreur 500 appropriée (comme dans la deuxième version fournie)
- [x] S'assurer que `api/proxy.js` inclut un mécanisme de timeout (15s) pour éviter les blocages et gère les erreurs de timeout (comme dans la deuxième version fournie)
- [x] Auditer les autres fonctions serverless (`api/home.js`, `api/match.js`, `api/stream.js`) pour améliorer la gestion des erreurs et ajouter des timeouts si nécessaire
- [x] Vérifier que le service worker (`public/sw.js`) ne met pas en cache les requêtes vers les APIs externes (kora-api.space, cdn.kora-api.space, thesportsdb.com, etc.)
- [x] Valider la configuration du proxy dans `vite.config.js` pour `/api-meshify` pointant vers `https://us.meshify.cloud` avec les headers Origin/Referer corrects
- [x] Confirmer que les réécritures dans `vercel.json` redirigent correctement les routes SPA vers `index.html` et les chemins API vers les fonctions serverless
- [x] Vérifier le `manifest.json` pour s'assurer que les icônes sont présentes, les catégories sont correctes et la couleur du thème correspond au design
- [x] Confirmer que `index.html` inclut le lien conditionnel vers le service worker (uniquement en production) et les balises meta essentielles pour le SEO/PWA
- [x] S'assurer que les styles sont bien gérés par `src/styles/globals.css` (vérifier l'existence de ce fichier) et que `src/App.css` et `src/index.css` restent vides
- [x] Supprimer tout code dupliqué ou mort (notamment les définitions en double de fichiers observées dans le contexte fourni)
- [x] Valider la cohérence des séparateurs de chemin dans la structure des fichiers (utiliser des slashes Unix partout)
- [x] Tester la récupération des données depuis l'API kora-api.space pour s'assurer que le paramètre `t` (timestamp) est correctement généré pour éviter le cache

## Généré le
2026-08-04