import { useMemo } from 'react'
import { formatRelative } from '../utils'
import { Drawer, Icon, I, AvatarDot } from './ui'

export default function ActivityPanel({ activity, onClose }) {
  const byDay = useMemo(() => {
    const groups = {}
    for (const e of activity) {
      const d = new Date(e.at)
      const key = d.toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long' })
      ;(groups[key] = groups[key] || []).push(e)
    }
    return groups
  }, [activity])

  return (
    <Drawer open={true} onClose={onClose} title="Log de actividad" icon={I.history}>
      {activity.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-zinc-500">Sin actividad reciente.</p>
          <p className="text-[11px] text-zinc-600 mt-1">Los movimientos entre columnas aparecerán aquí.</p>
        </div>
      ) : (
        <div className="p-5 space-y-5">
          {Object.entries(byDay).map(([day, entries]) => (
            <div key={day}>
              <h3 className="text-[10px] uppercase tracking-wider text-zinc-500 font-medium mb-2">{day}</h3>
              <ul className="relative space-y-2 border-l border-zinc-900 pl-4">
                {entries.map(e => (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[1.1rem] top-1.5 w-2 h-2 rounded-full bg-zinc-700"></span>
                    <div className="flex items-start gap-2 text-[12px] leading-snug">
                      <AvatarDot name={e.who || 'Sistema'} size={4} />
                      <div className="flex-1 min-w-0">
                        <div className="text-zinc-300">
                          <span className="font-medium text-zinc-100">{e.who || 'Sistema'}</span>{' '}
                          {e.action === 'move' && <>movió <span className="text-zinc-200">"{e.cardTitle}"</span> de <span className="text-zinc-400">{e.fromTitle}</span> a <span className="text-indigo-300">{e.toTitle}</span></>}
                          {e.action === 'create' && <>creó <span className="text-zinc-200">"{e.cardTitle}"</span> en <span className="text-zinc-400">{e.toTitle}</span></>}
                          {e.action === 'archive' && <>archivó <span className="text-zinc-200">"{e.cardTitle}"</span></>}
                          {e.action === 'restore' && <>restauró <span className="text-zinc-200">"{e.cardTitle}"</span></>}
                          {e.action === 'delete' && <>eliminó <span className="text-zinc-200">"{e.cardTitle}"</span></>}
                        </div>
                        <div className="text-[10px] text-zinc-500 mono mt-0.5">
                          {formatRelative(e.at)} · {new Date(e.at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}
