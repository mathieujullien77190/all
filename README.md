# all

Tableau de bord de tous mes projets : repos GitHub, ressources externes (MongoDB Atlas, Firebase, Vercel...), acces au dossier local et lancement des scripts npm.

React + TypeScript + Vite + Tailwind + ESLint, plus une petite API Node locale (`server/index.mjs`).

## Lancer

```
npm install
npm run dev
```

- front : http://localhost:5173
- API locale : http://127.0.0.1:4777 (ecoute uniquement sur localhost)

## Config

- `data/projects.json` : projets, liens, ressources. A modifier pour ajouter un projet.
- Les scripts npm sont lus en direct depuis chaque `package.json`.
- `PROJECTS_ROOT` : dossier racine des projets (defaut : le dossier parent de ce repo).
- `MONGO_COMPASS_PATH` : chemin de MongoDBCompass.exe si installe ailleurs que `%LOCALAPPDATA%\MongoDBCompass`.
- Le bouton Compass lit `MONGODB_URI` dans `order/.env.local` (jamais envoye au navigateur ni commite).

## Securite

L'API n'execute que les scripts declares dans les `package.json` des projets listes, refuse les requetes dont le Host/Origin n'est pas localhost, et ne sert aucun secret.
