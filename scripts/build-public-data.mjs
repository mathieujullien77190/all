// Writes public/projects.static.json, the data served by the GitHub Pages build.
// Fields are whitelisted so nothing local (folders, env files, scripts) can leak into the site.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const data = JSON.parse(fs.readFileSync(path.join(APP_DIR, 'data', 'projects.json'), 'utf8'))

const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]))

const payload = {
  github: data.github,
  root: '',
  links: data.links.map((l) => pick(l, ['label', 'url'])),
  resources: data.resources.map((r) => pick(r, ['id', 'label', 'kind', 'url', 'note'])),
  tools: [{ id: 'compass', label: 'MongoDB Compass', available: true }],
  projects: data.projects.map((p) => ({
    ...pick(p, ['id', 'name', 'description', 'tags', 'repo', 'live', 'resources']),
    local: false,
    exists: false,
    packages: [],
  })),
}

fs.writeFileSync(path.join(APP_DIR, 'public', 'projects.static.json'), JSON.stringify(payload, null, 2) + '\n')
console.log(`public/projects.static.json: ${payload.projects.length} projects`)
