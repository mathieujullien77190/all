# all

Dashboard de tous les projets de Mathieu : repos GitHub, ressources externes, ouverture des dossiers locaux, lancement des scripts npm. Deux modes : local (complet) et GitHub Pages (lecture seule).

## Stack

React 19 + TypeScript + Vite + Tailwind 4 + ESLint. API Node sans dependance dans `server/index.mjs`.

## Commandes

- `npm run dev` : front (http://localhost:5173) + API (http://127.0.0.1:4777), via concurrently.
- `npm run typecheck`, `npm run lint`.
- `npm run build:pages` : build statique pour GitHub Pages (base `/all/`).
- `npm run shortcut` : cree le raccourci bureau (`scripts/launch.ps1`).

## Architecture

- `data/projects.json` : source des projets, liens et ressources. **Repo public : jamais de chemin local, secret ou nom d'utilisateur dedans.**
- `data/local.json` (git-ignore) : overrides `{ "<id>": "<chemin>" }` pour les repos hors `PROJECTS_ROOT` (ex. `job`).
- `server/index.mjs` : API locale (127.0.0.1 uniquement, refuse Host/Origin non locaux). Routes : `GET /api/projects`, `GET /api/runs`, `POST /api/run|stop|dismiss|open|tool`. Ne lance que les scripts declares dans les `package.json` des projets listes.
  - Dossiers : `discoverRepos()` scanne les enfants de `ROOT` et lit le remote `origin` de `.git/config`; `resolveProjectDir()` applique d'abord `data/local.json`.
  - Compass : lit `MONGODB_URI` dans le `.env.local` du projet `books`, jamais envoye au navigateur.
- `src/` : un dossier par composant (`Composant.tsx`, `index.ts`, `types.ts`, `constants.ts`, `helpers.ts`), partages dans `src/components/ui`, `types`, `constants`, `helpers`, `hooks`. Alias `@` = `src`. Imports via barrels.

## Mode GitHub Pages

- `vite build --mode pages` => `IS_STATIC` (`src/constants`) vaut `true`.
- `scripts/build-public-data.mjs` ecrit `public/projects.static.json` (git-ignore) avec une **liste blanche** de champs : rien de local ne peut fuiter.
- `src/helpers/api.ts` : en static, `projects()` lit ce JSON, `runs()` renvoie `[]`, toute action leve `LocalOnlyError`; `App.tsx` l'attrape et ouvre `LocalOnlyDialog` ("Disponible uniquement en local").
- Deploiement : `.github/workflows/pages.yml` a chaque push sur `main`. Site : https://mathieujullien77190.github.io/all/

## Regles

- Commits en anglais, Conventional Commits, auteur = utilisateur git seul (pas de Co-Authored-By).
- Ajouter un projet : entree dans `data/projects.json` (`id`, `repo`, `packages`...), pas de `dir`.
- Toute nouvelle action locale doit passer par `api.ts` pour etre bloquee proprement en static.
