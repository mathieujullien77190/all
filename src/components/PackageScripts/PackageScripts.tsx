import ScriptButton from '@/components/ScriptButton'
import { INSTALL_SCRIPT } from '@/constants'
import { findRun } from '@/helpers'
import { NOT_INSTALLED_LABEL } from './constants'
import type { PackageScriptsProps } from './types'

export const PackageScripts = ({ projectId, pkg, runs, onRun, onStop }: PackageScriptsProps) => (
  <div className="space-y-1.5 border-t border-slate-800 pt-2">
    <div className="text-xs text-slate-500">
      {pkg.label} {!pkg.installed && <span className="text-amber-400">{NOT_INSTALLED_LABEL}</span>}
    </div>
    <div className="flex flex-wrap gap-1.5">
      {!pkg.installed && (
        <ScriptButton
          label={INSTALL_SCRIPT}
          run={findRun(runs, projectId, pkg.path, INSTALL_SCRIPT)}
          onRun={() => onRun(projectId, pkg.path, INSTALL_SCRIPT)}
          onStop={onStop}
        />
      )}
      {Object.entries(pkg.scripts).map(([script, command]) => (
        <ScriptButton
          key={script}
          label={script}
          title={command}
          run={findRun(runs, projectId, pkg.path, script)}
          onRun={() => onRun(projectId, pkg.path, script)}
          onStop={onStop}
        />
      ))}
    </div>
  </div>
)
