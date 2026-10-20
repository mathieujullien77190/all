// Local-only helper API: runs npm scripts, opens folders, launches Mongo Compass.
// Bound to 127.0.0.1 and restricted to the projects/scripts declared in data/projects.json.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { spawn, execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ROOT = path.resolve(process.env.PROJECTS_ROOT ?? path.join(APP_DIR, '..'))
const PORT = Number(process.env.PORT ?? 4777)
const MAX_LOG_LINES = 300
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/
const SCRIPT_NAME = /^[\w:.-]+$/

const runs = new Map()

class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const readData = () => JSON.parse(fs.readFileSync(path.join(APP_DIR, 'data', 'projects.json'), 'utf8'))
const ANSI = new RegExp(`${String.fromCharCode(27)}\\[[0-9;?]*[ -/]*[@-~]`, 'g')
const stripAnsi = (s) => s.replace(ANSI, '')

function resolveInside(rel) {
  const abs = path.resolve(ROOT, rel)
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) throw new HttpError(400, 'Path outside projects root')
  return abs
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function readEnvKey(file, key) {
  try {
    const line = fs
      .readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .find((l) => l.startsWith(`${key}=`))
    return line ? line.slice(key.length + 1).trim().replace(/^["']|["']$/g, '') : null
  } catch {
    return null
  }
}

function findProject(data, id) {
  const project = data.projects.find((p) => p.id === id)
  if (!project) throw new HttpError(404, `Unknown project: ${id}`)
  return project
}

function projectDir(project) {
  if (!project.dir) throw new HttpError(400, `${project.id} has no local folder`)
  const dir = resolveInside(project.dir)
  if (!fs.existsSync(dir)) throw new HttpError(404, `Folder not found: ${dir}`)
  return dir
}

function packageDir(project, pkgPath) {
  const pkg = project.packages.find((p) => p.path === pkgPath)
  if (!pkg) throw new HttpError(404, `Unknown package: ${pkgPath}`)
  const dir = path.resolve(projectDir(project), pkg.path)
  if (!dir.startsWith(projectDir(project))) throw new HttpError(400, 'Path outside project')
  return dir
}

function compassPath() {
  const candidates = [
    process.env.MONGO_COMPASS_PATH,
    path.join(process.env.LOCALAPPDATA ?? '', 'MongoDBCompass', 'MongoDBCompass.exe'),
  ]
  return candidates.find((p) => p && fs.existsSync(p)) ?? null
}

function describe(data) {
  const projects = data.projects.map((project) => {
    const dir = project.dir ? resolveInside(project.dir) : null
    const exists = Boolean(dir && fs.existsSync(dir))
    const packages = exists
      ? project.packages.map((pkg) => {
          const pkgDir = path.resolve(dir, pkg.path)
          const json = readJson(path.join(pkgDir, 'package.json'))
          return {
            ...pkg,
            name: json?.name,
            scripts: json?.scripts ?? {},
            installed: fs.existsSync(path.join(pkgDir, 'node_modules')),
          }
        })
      : []
    return { ...project, local: Boolean(project.dir), exists, packages }
  })
  return {
    github: data.github,
    root: ROOT,
    links: data.links,
    resources: data.resources,
    tools: [{ id: 'compass', label: 'MongoDB Compass', available: Boolean(compassPath()) }],
    projects,
  }
}

function listRuns() {
  return [...runs.values()]
}

function pushLog(run, chunk) {
  run.log.push(...stripAnsi(chunk.toString()).split(/\r?\n/).filter(Boolean))
  if (run.log.length > MAX_LOG_LINES) run.log.splice(0, run.log.length - MAX_LOG_LINES)
}

function startRun({ project: projectId, pkg: pkgPath, script }) {
  const data = readData()
  const project = findProject(data, projectId)
  const cwd = packageDir(project, pkgPath)
  if (typeof script !== 'string' || !SCRIPT_NAME.test(script)) throw new HttpError(400, 'Invalid script name')

  const args = script === 'install' ? ['install'] : ['run', script]
  if (script !== 'install' && !readJson(path.join(cwd, 'package.json'))?.scripts?.[script]) {
    throw new HttpError(404, `Script not found: ${script}`)
  }

  const id = `${projectId}|${pkgPath}|${script}`
  if (runs.get(id)?.status === 'running') throw new HttpError(409, 'Already running')

  const run = { id, project: projectId, pkg: pkgPath, script, status: 'running', stopped: false, code: null, pid: null, startedAt: Date.now(), log: [] }
  const push = (chunk) => pushLog(run, chunk)
  const child = spawn('npm', args, { cwd, shell: true, env: { ...process.env, FORCE_COLOR: '0' } })
  run.pid = child.pid ?? null
  child.stdout.on('data', push)
  child.stderr.on('data', push)
  child.on('error', (err) => push(`spawn error: ${err.message}`))
  child.on('close', (code) => {
    run.status = 'exited'
    run.code = code
    push(run.stopped ? '■ Arrêté' : `■ Terminé (code ${code})`)
  })
  runs.set(id, Object.defineProperty(run, 'child', { value: child, enumerable: false }))
  return { id }
}

function killTree(pid) {
  execFile('taskkill', ['/pid', String(pid), '/T', '/F'], () => {})
}

function stopRun({ id }) {
  const run = runs.get(id)
  if (!run) throw new HttpError(404, 'Unknown run')
  if (run.status === 'running' && run.pid) {
    run.stopped = true
    pushLog(run, '■ Arrêt demandé…')
    killTree(run.pid)
  }
  return { ok: true }
}

function detached(cmd, args, options = {}) {
  const child = spawn(cmd, args, { detached: true, stdio: 'ignore', ...options })
  child.on('error', () => {})
  child.unref()
}

function openTarget({ project: projectId, target }) {
  const dir = projectId ? projectDir(findProject(readData(), projectId)) : ROOT
  if (target === 'explorer') detached('explorer.exe', [dir])
  else if (target === 'code') detached('code', [dir], { shell: true })
  else if (target === 'terminal') {
    const safe = dir.replace(/'/g, "''")
    detached('cmd.exe', ['/c', 'start', 'powershell', '-NoExit', '-Command', `Set-Location -LiteralPath '${safe}'`])
  } else throw new HttpError(400, 'Unknown target')
  return { ok: true }
}

function launchTool({ tool }) {
  if (tool !== 'compass') throw new HttpError(400, 'Unknown tool')
  const exe = compassPath()
  if (!exe) throw new HttpError(404, 'MongoDB Compass not found (set MONGO_COMPASS_PATH)')
  const cfg = readData().tools?.mongoCompass
  const uri = cfg ? readEnvKey(resolveInside(cfg.envFile), cfg.envKey) : null
  detached(exe, uri ? [uri] : [])
  return { ok: true, withConnection: Boolean(uri) }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => {
      raw += c
      if (raw.length > 10_000) reject(new HttpError(413, 'Body too large'))
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new HttpError(400, 'Invalid JSON'))
      }
    })
  })
}

const routes = {
  'GET /api/projects': () => describe(readData()),
  'GET /api/runs': () => listRuns(),
  'POST /api/run': startRun,
  'POST /api/stop': stopRun,
  'POST /api/open': openTarget,
  'POST /api/tool': launchTool,
}

const server = http.createServer(async (req, res) => {
  const send = (status, body) => {
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(body))
  }
  try {
    // Guards against DNS rebinding and cross-site requests hitting a localhost API.
    if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host ?? '')) throw new HttpError(403, 'Bad host')
    if (req.method === 'POST' && !LOCAL_ORIGIN.test(req.headers.origin ?? '')) throw new HttpError(403, 'Bad origin')

    const handler = routes[`${req.method} ${new URL(req.url, 'http://x').pathname}`]
    if (!handler) throw new HttpError(404, 'Not found')
    send(200, await handler(req.method === 'POST' ? await readBody(req) : undefined))
  } catch (err) {
    send(err.status ?? 500, { error: err.message })
  }
})

const stopAll = () => runs.forEach((r) => r.status === 'running' && r.pid && killTree(r.pid))
process.on('SIGINT', () => {
  stopAll()
  process.exit(0)
})
process.on('exit', stopAll)

server.listen(PORT, '127.0.0.1', () => console.log(`api on http://127.0.0.1:${PORT} (root: ${ROOT})`))
