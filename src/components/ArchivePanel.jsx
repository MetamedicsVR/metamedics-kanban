import { formatRelative } from '../utils'
import { Drawer, Icon, I, TypeChip, AssigneeStack } from './ui'

export default function ArchivePanel({ cards, onRestore, onDelete, onOpen, onClose }) {
  const archived = cards.filter(c => c.archived).sort((a, b) => (b.archivedAt || 0) - (a.archivedAt || 0))

  return (
    <Drawer open={true} onClose={onClose} title={`Archivo · ${archived.length}`} icon={I.archive}>
      {archived.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-zinc-500">No hay tarjetas archivadas.</p>
          <p className="text-[11px] text-zinc-600 mt-1">Las tarjetas completadas quedan aquí como histórico.</p>
        </div>
      ) : (
        <div className="p-3 space-y-2">
          {archived.map(c => (
            <div key={c.id} className="group bg-zinc-900/60 border border-zinc-800 rounded-md p-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <TypeChip type={c.type} size="sm" />
                  {c.version && (
                    <span className="mono text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5">{c.version}</span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500 mono shrink-0">{formatRelative(c.archivedAt)}</span>
              </div>
              <button onClick={() => onOpen(c)} className="text-[13px] font-medium text-zinc-100 leading-snug text-left hover:text-indigo-300">
                {c.title}
              </button>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/80">
                <AssigneeStack names={c.assignees} max={3} />
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onRestore(c.id)} className="text-[11px] text-indigo-400 hover:text-indigo-300 px-2 py-0.5">Restaurar</button>
                  <button onClick={() => { if (confirm('¿Eliminar permanentemente?')) onDelete(c.id) }} className="text-[11px] text-red-400 hover:text-red-300 px-2 py-0.5">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}
