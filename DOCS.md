# TAZO TV — Documentation complète

> Agrégateur de streams de matchs de football en direct.
> Déployé sur Vercel · PWA installable · React 19 + Vite + Tailwind v4

---

## Table des matières

- [Guide utilisateur](#guide-utilisateur)
- [Guide développeur](#guide-développeur)
  - [Stack technique](#stack-technique)
  - [Architecture](#architecture)
  - [APIs externes](#apis-externes)
  - [Structure des fichiers](#structure-des-fichiers)
  - [Composants](#composants)
  - [Hooks](#hooks)
  - [Store Zustand](#store-zustand)
  - [Utilitaires](#utilitaires)
  - [Déploiement](#déploiement)
  - [Variables d'environnement](#variables-denvironnement)
  - [Limitations connues](#limitations-connues)

---

## Guide utilisateur

### Accéder au site

Ouvre le site dans ton navigateur. Il est installable comme application mobile (PWA) :
- **Android** : Chrome → menu ⋮ → "Ajouter à l'écran d'accueil"
- **iOS** : Safari → partager → "Sur l'écran d'accueil"

---

### Page d'accueil

#### Naviguer entre les dates
Le slider en haut permet de naviguer **14 jours en arrière et 14 jours en avant**. Aujourd'hui est marqué d'un point cyan. Clique sur n'importe quelle date pour voir les matchs de ce jour.

#### Filtrer par compétition
Le menu déroulant **"Toutes les compétitions"** liste toutes les ligues disponibles pour la date sélectionnée. Chaque option affiche le nombre de matchs en direct. Clique sur ✕ pour revenir à toutes les compétitions.

#### Rechercher un match
La barre de recherche filtre en temps réel par nom d'équipe ou de compétition.

#### Modes d'affichage
Le bouton grille/liste en haut à droite bascule entre :
- **Grille** : cards avec logos, score, heure
- **Liste** : vue compacte, une ligne par match

#### Compteur live
Le badge rouge "LIVE NOW" en haut à droite indique le nombre de matchs en cours en temps réel.

#### Notifications
Clique sur la cloche 🔔 pour activer les notifications. Tu recevras une alerte :
- Quand un match favori commence
- 30 minutes avant le coup d'envoi d'un match favori (rappels toutes les 5 min)

---

### Cards de match

Chaque card affiche :
- **Logo de la compétition** (en haut à gauche)
- **Badge de statut** : LIVE (rouge), À venir (cyan), Terminé (gris)
- **Logos des équipes** avec leur nom
- **Score** pour les matchs en cours ou terminés
- **Heure de coup d'envoi** pour les matchs à venir (ajustée selon le fuseau horaire sélectionné)
- **Étoile ★** sur chaque logo d'équipe pour l'ajouter aux favoris équipes
- **Étoile ★** en haut à droite pour ajouter le match aux favoris

Seuls les matchs avec un stream disponible sont cliquables (les autres sont grisés).

---

### Page match

#### Infos du match
En haut : logo de la compétition, noms et logos des équipes, score en temps réel, statut.

**Cliquer sur une équipe** ouvre un panneau avec :
- Informations sur l'équipe (stade, capacité, ligue, année de fondation)
- 5 derniers résultats avec indicateur V/N/D
- Bouton pour ajouter l'équipe aux favoris

#### Changer de serveur
Plusieurs serveurs sont disponibles. Clique sur un bouton pour changer. Tu peux aussi utiliser les touches **1, 2, 3...** du clavier.

**Auto-switch** : si un serveur ne charge pas en 20 secondes, le système passe automatiquement au suivant.

#### Plein écran
Touche **F** ou le bouton plein écran dans la barre de contrôles du player.

#### Mini player
Quand tu quittes la page d'un match en direct, le stream continue dans un **mini player flottant** en bas à droite. Clique dessus pour revenir au match.

#### Événements et commentaires
Pour les matchs en cours ou terminés, la section "ÉVÉNEMENTS" affiche les buts, cartons et remplacements avec la minute.

#### Statistiques
Pour les matchs terminés, les statistiques (buts, tirs, corners) et les notes des joueurs s'affichent si disponibles.

---

### Favoris

#### Matchs favoris
Clique sur l'étoile ★ d'une card pour sauvegarder un match. Les favoris apparaissent en haut de la page d'accueil dans la section "MATCHS FAVORIS".

#### Équipes favorites
Clique sur l'étoile ★ sur le logo d'une équipe (dans les cards ou la page match) pour la sauvegarder. Les équipes favorites apparaissent dans la section "ÉQUIPES FAVORITES".

Les favoris sont sauvegardés localement dans le navigateur (localStorage) — ils persistent entre les sessions.

---

### Fuseau horaire
Le sélecteur dans le header ajuste l'heure d'affichage des matchs à venir :
- GMT, Lomé (GMT+0)
- Alger (GMT+1)
- Paris, Cairo (GMT+2)
- Riyadh (GMT+3)

---

### Mode clair / sombre
Le bouton ☀️/🌙 dans le header bascule entre les deux thèmes. Le choix est sauvegardé.

---

## Guide développeur

### Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool + dev server |
| Tailwind CSS | 4 | Styling (via `@tailwindcss/vite`) |
| Zustand | 5 | State management global |
| React Router | 7 | Routing SPA |
| Axios | 1.x | Requêtes HTTP |
| dayjs | 1.x | Manipulation des dates |
| hls.js | 1.x | Lecture streams HLS (m3u8) |

---

### Architecture

```
TAZO TV
├── Frontend SPA (React + Vite)
│   ├── Pages : Home, Match, NotFound
│   ├── Composants : layout, matches, player, ui
│   ├── Hooks : data fetching, state, effets
│   └── Store : Zustand (theme, timezone, favoris, mini-player)
│
├── APIs externes (appels directs depuis le browser)
│   ├── kora-api.space      → liste des matchs + détails
│   ├── thesportsdb.com     → stats équipes, résultats
│   └── cdn.kora-api.space  → logos équipes et compétitions
│
└── Déploiement
    └── Vercel (SPA rewrite via vercel.json)
```

**Pas de backend** — toutes les APIs acceptent les requêtes cross-origin (CORS `*`).

---

### APIs externes

#### kora-api.space (principale)

| Endpoint | Description |
|---|---|
| `GET /api/matches/{date}/1?t={timestamp}` | Liste des matchs pour une date |
| `GET /api/matche/{id}/{lang}?t={timestamp}` | Détails d'un match (channels inclus) |

Le paramètre `t` est un timestamp `YYYYMMDDHHmm` qui sert de cache-buster.

**Structure d'un match :**
```json
{
  "id": "30053",
  "status": 1,
  "has_channels": 1,
  "home_en": "PSG",
  "away_en": "Real Madrid",
  "home_logo": "1234567890.png",
  "away_logo": "0987654321.png",
  "league_en": "UEFA Champions League",
  "league_logo": "11.png",
  "score": "1 - 0",
  "time": "21:00",
  "date": "2026-05-06",
  "api_matche_id": "1535194",
  "channels": [
    {
      "id": "93633",
      "server_name_en": "Live 1",
      "link": "https://score808.app/...",
      "mobile_link": "https://v3.sportssonline.click/..."
    }
  ]
}
```

**Statuts :** `0` = À venir · `1` = En direct · `2` = Terminé

#### CDN logos
- Équipes : `https://cdn.kora-api.space/uploads/team/{logo}`
- Compétitions : `https://cdn.kora-api.space/uploads/league/{logo}`

#### TheSportsDB (bonus)
- `GET /api/v1/json/3/searchteams.php?t={name}` → infos équipe
- `GET /api/v1/json/3/eventslast.php?id={teamId}` → derniers résultats
- `GET /api/v1/json/3/lookupevent.php?id={apiMatchId}` → stats match
- `GET /api/v1/json/3/lookuplineup.php?id={eventId}` → notes joueurs

> ⚠️ TheSportsDB tier gratuit ne retourne pas les stats football détaillées (tirs, corners). Les données de base (score, stade) sont disponibles.

---

### Structure des fichiers

```
src/
├── api/
│   ├── koraApi.js        # fetchMatches, fetchMatch (avec cache mémoire)
│   ├── sportsDbApi.js    # fetchLeagueInfo, fetchTeamInfo, fetchMatchStats, fetchTeamStats
│   ├── streamApi.js      # fetchStreamUrl (meshify — non utilisé actuellement)
│   └── commentsApi.js    # fetchLiveCommentary (TheSportsDB timeline)
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx    # Logo, timezone, theme toggle, indicateur live
│   │   └── Footer.jsx    # Branding, année
│   │
│   ├── matches/
│   │   ├── MatchCard.jsx       # Card grille avec logos, score, favoris équipes
│   │   ├── MatchList.jsx       # Grille/liste avec sections En direct / À venir / Terminés
│   │   ├── MatchBadge.jsx      # Badge LIVE / À venir / Terminé
│   │   ├── MatchFilter.jsx     # Filtre Hier/Aujourd'hui/Demain (legacy)
│   │   ├── MatchInfo.jsx       # Tableau infos match (date, heure, statut, score)
│   │   ├── MatchStats.jsx      # Barres stats + notes joueurs
│   │   ├── MatchEvents.jsx     # Feed événements (buts, cartons)
│   │   ├── Commentary.jsx      # Timeline événements TheSportsDB
│   │   ├── DateSlider.jsx      # Slider 14j avant/après avec scroll auto
│   │   ├── FavoritesList.jsx   # Section favoris matchs + équipes
│   │   ├── LeagueFilter.jsx    # Select compétition avec badge live
│   │   ├── LeagueBadge.jsx     # Logo + nom compétition inline
│   │   ├── SearchBar.jsx       # Input recherche temps réel
│   │   └── TeamStatsPanel.jsx  # Modal stats équipe + derniers résultats
│   │
│   ├── player/
│   │   ├── VideoPlayer.jsx  # Iframe (streams HTML) ou video HLS natif
│   │   ├── ServerList.jsx   # Boutons serveurs avec raccourcis clavier
│   │   └── MiniPlayer.jsx   # Player flottant persistant (quitter page match)
│   │
│   └── ui/
│       ├── Icons.jsx            # Tous les SVG icons centralisés
│       ├── Skeleton.jsx         # Skeletons de chargement
│       ├── FavoriteButton.jsx   # Bouton étoile toggle
│       └── NotificationBell.jsx # Cloche avec état permission
│
├── hooks/
│   ├── useMatches.js         # Liste matchs par date + auto-refresh 30s
│   ├── useMatch.js           # Détails match par id + auto-refresh 30s
│   ├── useStream.js          # Fetch URL stream (meshify)
│   ├── useAutoSwitch.js      # Switch serveur auto après 20s si pas chargé
│   ├── useCommentary.js      # Événements live TheSportsDB (refresh 60s)
│   ├── useDocumentTitle.js   # Titre onglet avec score en temps réel
│   ├── useFavorites.js       # CRUD favoris matchs (localStorage)
│   ├── useTeamFavorites.js   # CRUD favoris équipes (localStorage)
│   ├── useKeyboardShortcuts.js # Touches 1/2/3 pour changer serveur
│   ├── useLeagueInfo.js      # Infos ligue TheSportsDB
│   ├── useMatchEvents.js     # Événements match (apifootball.com)
│   ├── useMatchStats.js      # Stats + ratings TheSportsDB
│   ├── useNotifications.js   # Web Notifications API (favoris live + 30min avant)
│   ├── useSearch.js          # Filtre texte + ligue sur les matchs
│   └── useTeamStats.js       # Stats équipe TheSportsDB
│
├── pages/
│   ├── Home.jsx     # Page principale avec slider, filtres, liste matchs
│   ├── Match.jsx    # Page match avec player, serveurs, stats, commentaires
│   └── NotFound.jsx # Page 404
│
├── store/
│   └── useAppStore.js  # Zustand : timezone, theme, favoris, miniPlayer
│
├── styles/
│   └── globals.css  # Tailwind v4 @theme, tokens dark/light, classes utilitaires
│
└── utils/
    ├── cache.js      # Cache mémoire avec TTL (30s live, 5min autres)
    ├── constants.js  # URLs APIs, CDN, statuts, refresh interval
    ├── status.js     # getStatusLabel(status) → { label, color, dot }
    └── time.js       # getToday, getYesterday, getTomorrow, formatTime, getDateRange
```

---

### Composants

#### VideoPlayer
Détecte automatiquement le type de source :
- **`.m3u8`** → utilise `hls.js` (ou video natif sur Safari)
- **Autre URL** → charge dans une `<iframe>` avec `sandbox` anti-popup

```jsx
<VideoPlayer
  src={streamUrl}
  onStreamError={() => {/* appelé si HLS fatal error */}}
  onReady={(isReady) => {/* true quand le stream est chargé */}}
/>
```

#### MiniPlayer
S'affiche automatiquement quand `useAppStore().miniPlayer` est non-null. Activé depuis `Match.jsx` via `setMiniPlayer({ matchId, src, homeName, awayName, ... })` au `beforeunload`.

#### DateSlider
Génère 29 dates (-14 à +14 jours). Scroll automatique vers la date active au montage.

---

### Hooks

#### useMatches(date)
```js
const { matches, loading, error, refetch } = useMatches('2026-05-06')
```
- Charge les matchs pour une date
- Auto-refresh toutes les 30s
- Cache mémoire : 30s si live présent, 5min sinon
- `loading` repasse à `true` à chaque changement de date

#### useMatch(id)
```js
const { match, loading, error } = useMatch('30053')
```
- Charge les détails d'un match (channels inclus)
- Auto-refresh toutes les 30s

#### useAutoSwitch(streamUrl, channels, activeChannel, onSwitch, iframeReady)
- Démarre un timer de **20s** (premier essai) ou **30s** (suivants)
- Si `iframeReady` passe à `true` avant le timeout → timer annulé
- Appelle `onSwitch(nextChannel)` si timeout atteint

#### useNotifications(matches, favorites)
- Vérifie toutes les 60s
- Envoie une notification Web si un favori passe en live
- Envoie des rappels toutes les 5min dans les 30min avant le coup d'envoi
- Utilise localStorage pour éviter les doublons (`tazo_notified`)

#### useSearch(matches)
```js
const { query, setQuery, league, setLeague, leagues, filtered } = useSearch(matches)
```
- `leagues` : liste dédupliquée des compétitions présentes
- `filtered` : matchs filtrés par query ET league

---

### Store Zustand

```js
// src/store/useAppStore.js
{
  timezone: 0,              // offset GMT en heures
  lang: 'en',
  theme: 'dark' | 'light',  // persisté en localStorage
  activeMatch: null,
  favorites: [],             // matchs favoris, persistés en localStorage
  miniPlayer: null,          // { matchId, src, homeName, awayName, homeLogo, awayLogo, score, isLive }

  setTimezone(tz),
  setTheme(theme),
  setMiniPlayer(data),
  clearMiniPlayer(),
  toggleFavorite(match),
  isFavorite(id),
}
```

---

### Utilitaires

#### cache.js
```js
cacheGet(key)              // null si expiré
cacheSet(key, value, ttlMs)
cacheClear()
cacheSize()
```
Auto-purge des entrées expirées toutes les 5 minutes.

#### constants.js
```js
KORA_BASE    = 'https://kora-api.space'
MESHIFY_BASE = 'https://us.meshify.cloud'
CDN_LOGOS    = 'https://cdn.kora-api.space/uploads/team'
CDN_LEAGUES  = 'https://cdn.kora-api.space/uploads/league'
MATCH_STATUS = { NOT_STARTED: 0, LIVE: 1, FINISHED: 2 }
REFRESH_INTERVAL = 30000
APIFOOTBALL_KEY  = import.meta.env.VITE_APIFOOTBALL_KEY || ''
```

#### time.js
```js
getTimestamp()   // 'YYYYMMDDHHmm' — cache-buster pour kora API
getToday()       // 'YYYY-MM-DD'
getYesterday()
getTomorrow()
formatTime(time, offsetHours)  // '21:00' + 2 → '23:00'
getDateRange()   // tableau de 29 dates avec labels
```

---

### Déploiement

#### Vercel (actuel)

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Le rewrite SPA redirige toutes les routes vers `index.html`. Pas de serverless functions — les APIs sont appelées directement depuis le browser (CORS `*` activé sur kora-api.space).

#### Netlify (alternatif)

Le fichier `public/_redirects` est déjà présent :
```
/* /index.html 200
```
Importer le repo sur Netlify, build command `npm run build`, publish directory `dist`.

#### Commandes

```bash
npm install       # installer les dépendances
npm run dev       # serveur dev sur http://localhost:3000
npm run build     # build production dans /dist
npm run preview   # prévisualiser le build
npm run lint      # ESLint
```

---

### Variables d'environnement

Créer un fichier `.env` à la racine (voir `.env.example`) :

```env
# Optionnel — événements live détaillés (buts, cartons, remplacements)
# Inscription gratuite sur https://apifootball.com/documentation/
# Tier gratuit : 180 req/heure, Championship anglais + Ligue 2 française
VITE_APIFOOTBALL_KEY=ta_cle_ici
```

Sur Vercel : Settings → Environment Variables → ajouter `VITE_APIFOOTBALL_KEY`.

---

### Limitations connues

| Limitation | Cause | Contournement possible |
|---|---|---|
| Contrôle du volume impossible | Iframe cross-origin | Accès direct au flux `.m3u8` |
| Stream repart à zéro si connexion coupe | Iframe rechargée par le browser | Accès direct au flux `.m3u8` |
| Stats football limitées (TheSportsDB) | Tier gratuit sans stats détaillées | Intégrer api-football.com (~10$/mois) |
| Commentaires live limités | TheSportsDB timeline peu fourni | Intégrer api-football.com |
| Notifications bloquées sur iOS Safari | Restriction Apple PWA | Aucun (limitation OS) |
| Auto-switch peut être agressif | Timer fixe 20s | Augmenter `BASE_TIMEOUT` dans `useAutoSwitch.js` |

---

### PWA

Le site est installable comme application native :

- **Manifest** : `public/manifest.json` — nom "TAZO TV", short_name "ptitazo", icône `ptitazologo.jpeg`
- **Service Worker** : `public/sw.js` — cache les assets statiques, network-first pour les APIs
- **Theme color** : `#00d4ff` (cyan)
- **Background color** : `#080c18` (dark)

---

*Documentation générée le 6 mai 2026 — TAZO TV v1.0*
