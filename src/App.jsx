import { useState, useMemo, lazy, Suspense } from 'react'
import { COLUMNS, FLOW_COLUMNS, ME_KEY } from './constants'
import { uid } from './utils'
import { useKanban } from './hooks/useKanban'
import { supabaseConfigured } from './lib/supabase'
import Column from './components/Column'
import FilterBar from './components/FilterBar'
import ActivityPanel from './components/ActivityPanel'
import ArchivePanel from './components/ArchivePanel'
import { Btn, Icon, I } from './components/ui'

const Editor = lazy(() => import('./components/Editor'))

function Stat({ label, value, accent }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`mono text-sm font-semibold ${accent || 'text-zinc-200'}`}>{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
    </div>
  )
}

export default function App() {
  const kanban = useKanban()
  const [editing, setEditing] = useState(null)
  const [showActivity, setShowActivity] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const [me, setMe] = useState(localStorage.getItem(ME_KEY) || '')
  const [filters, setFilters] = useState({ search: '', assignee: '', types: [], priority: '', version: '', module: '' })
  const [drag, setDrag] = useState({ id: null, overCol: null })

  const onMeChange = (v) => { setMe(v); localStorage.setItem(ME_KEY, v) }

  // Autocomplete suggestions derived from all cards
  const suggestions = useMemo(() => {
    const asSet = new Set(), vSet = new Set(), mSet = new Set()
    for (const c of kanban.cards) {
      (c.assignees || []).forEach(a => a && asSet.add(a))
      if (c.version) vSet.add(c.version)
      if (c.module) mSet.add(c.module)
    }
    const sortVersions = (arr) => arr.sort((a, b) => {
      const pa = a.replace(/^v/i, '').split('.').map(Number)
      const pb = b.replace(/^v/i, '').split('.').map(Number)
      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0)
      }
      return 0
    })
    return {
      assignees: [...asSet].sort((a, b) => a.localeCompare(b, 'es')),
      versions: sortVersions([...vSet]),
      modules: [...mSet].sort((a, b) => a.localeCompare(b, 'es')),
    }
  }, [kanban.cards])

  const visibleCards = useMemo(() => kanban.cards.filter(c => !c.archived), [kanban.cards])

  const filtered = useMemo(() => visibleCards.filter(c => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const blob = `${c.title} ${c.description} ${(c.assignees || []).join(' ')} ${c.module} ${c.version}`.toLowerCase()
      if (!blob.includes(q)) return false
    }
    if (filters.assignee && !(c.assignees || []).includes(filters.assignee)) return false
    if (filters.types.length && !filters.types.includes(c.type)) return false
    if (filters.priority && c.priority !== filters.priority) return false
    if (filters.version && c.version !== filters.version) return false
    if (filters.module && c.module !== filters.module) return false
    return true
  }), [visibleCards, filters])

  const cardsByCol = useMemo(() => {
    const m = Object.fromEntries(COLUMNS.map(c => [c.id, []]))
    for (const c of filtered) (m[c.column] || m.defined).push(c)
    return m
  }, [filtered])

  const totals = useMemo(() => ({
    total: visibleCards.length,
    active: visibleCards.filter(c => c.column !== 'done').length,
    bugs: visibleCards.filter(c => c.column === 'bugs').length,
    overdue: visibleCards.filter(c => c.dueDate && c.column !== 'done' && new Date(c.dueDate).getTime() < Date.now() - 86400000).length,
    archived: kanban.cards.filter(c => c.archived).length,
  }), [kanban.cards, visibleCards])

  const addCard = (columnId) => {
    setEditing({
      id: uid(), column: columnId, title: '', description: '',
      type: columnId === 'bugs' ? 'bug' : 'task',
      priority: 'medium', assignees: [], size: '', version: '', module: '',
      dueDate: '', links: [], checklist: [], comments: [],
      createdAt: Date.now(), archived: false, archivedAt: null,
      __isNew: true,
    })
  }

  const saveCard = async (draft) => {
    const { __isNew, ...clean } = draft
    try {
      if (__isNew) {
        await kanban.createCard(clean)
      } else {
        const prev = kanban.cards.find(c => c.id === clean.id)
        await kanban.updateCard(clean, prev?.column)
      }
    } catch (e) {
      console.error('Error saving card:', e)
    }
    setEditing(null)
  }

  const archiveCard = async (id) => {
    await kanban.archiveCard(id)
    setEditing(null)
  }

  const deleteCard = async (id) => {
    await kanban.deleteCard(id)
    setEditing(null)
  }

  const moveCard = (id, delta) => kanban.moveCard(id, delta, FLOW_COLUMNS)

  const onDragStart = (id) => setDrag({ id, overCol: null })
  const onDragOver = (colId) => setDrag(d => d.overCol === colId ? d : { ...d, overCol: colId })
  const onDragEnd = () => setDrag({ id: null, overCol: null })
  const onDrop = (colId) => {
    if (drag.id) kanban.dropCard(drag.id, colId)
    setDrag({ id: null, overCol: null })
  }

  if (kanban.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-zinc-500">Cargando tablero…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Setup banner */}
      {!supabaseConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-2 text-[12px] text-amber-300 flex items-center gap-2">
          <Icon d={I.info} className="w-3.5 h-3.5 shrink-0" />
          Supabase no configurado. Copia <code className="mono bg-amber-500/10 px-1 rounded">.env.example</code> a <code className="mono bg-amber-500/10 px-1 rounded">.env</code> y añade tus credenciales para activar la sincronización en tiempo real.
        </div>
      )}
      {kanban.error && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-5 py-2 text-[12px] text-red-300 flex items-center gap-2">
          <Icon d={I.x} className="w-3.5 h-3.5 shrink-0" />
          Error de conexión: {kanban.error}
        </div>
      )}

      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
        <div className="px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-500/30">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 4v16M14 4v10M18 4v16M10 4v6" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-zinc-100 tracking-tight leading-none">Task Manager</h1>
              <p className="text-[11px] text-zinc-500 mt-0.5 leading-none">Producto &amp; Desarrollo · MetaMedics</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-500 flex-wrap">
            <Stat label="Total" value={totals.total} />
            <Stat label="Activas" value={totals.active} />
            <Stat label="Bugs" value={totals.bugs} accent={totals.bugs > 0 ? 'text-rose-300' : ''} />
            <Stat label="Vencidas" value={totals.overdue} accent={totals.overdue > 0 ? 'text-red-300' : ''} />
            <Stat label="Archivadas" value={totals.archived} />
            <div className="flex items-center gap-1.5">
              <span className="w-px h-4 bg-zinc-800"></span>
              <input value={me} onChange={e => onMeChange(e.target.value)} placeholder="Soy…"
                className="w-24 bg-zinc-900/60 border border-zinc-800 rounded px-2 py-1 text-[11px] text-zinc-200 placeholder:text-zinc-600 ring-focus"
                title="Tu identidad para el log de actividad" />
            </div>
          </div>
        </div>
        <div className="px-5 pb-3 flex items-center justify-between gap-3 flex-wrap">
          <FilterBar suggestions={suggestions} filters={filters} setFilters={setFilters} />
          <div className="flex items-center gap-2">
            <Btn variant="outline" size="md" onClick={() => setShowActivity(true)} title="Log de actividad">
              <Icon d={I.history} className="w-4 h-4" /><span className="hidden sm:inline">Actividad</span>
            </Btn>
            <Btn variant="outline" size="md" onClick={() => setShowArchive(true)} title="Archivo">
              <Icon d={I.archive} className="w-4 h-4" /><span className="hidden sm:inline">Archivo</span>
              {totals.archived > 0 && <span className="mono text-[10px] bg-zinc-800 rounded px-1 ml-0.5">{totals.archived}</span>}
            </Btn>
            <Btn variant="primary" size="md" onClick={() => addCard('defined')}>
              <Icon d={I.plus} className="w-4 h-4" /> Nueva tarjeta
            </Btn>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-x-auto p-5">
        <div className="flex gap-4 h-full min-h-[600px]">
          {COLUMNS.map((col, idx) => (
            <Column key={col.id} col={col} columnIndex={idx}
              cards={cardsByCol[col.id] || []}
              onAdd={addCard} onOpen={setEditing} onMove={moveCard}
              onDelete={deleteCard} onArchive={archiveCard}
              dragState={drag}
              onDragStart={onDragStart} onDragOver={onDragOver}
              onDragEnd={onDragEnd} onDrop={onDrop} />
          ))}
        </div>
      </main>

      <footer className="border-t border-zinc-900 px-5 py-2 text-[10px] text-zinc-600 mono flex justify-between">
        <span>
          {supabaseConfigured
            ? <span className="text-emerald-500/70">● tiempo real</span>
            : <span className="text-zinc-600">○ sin conexión</span>
          }
          {' '}· {visibleCards.length} activas · {totals.archived} archivadas
        </span>
        <span>drag &amp; drop · ↑↓ mover · clic para editar</span>
      </footer>

      {editing && (
        <Suspense fallback={null}>
          <Editor card={editing} suggestions={suggestions}
            onClose={() => setEditing(null)} onSave={saveCard}
            onArchive={archiveCard} onDelete={deleteCard} />
        </Suspense>
      )}
      {showActivity && <ActivityPanel activity={kanban.activity} onClose={() => setShowActivity(false)} />}
      {showArchive && (
        <ArchivePanel cards={kanban.cards}
          onRestore={kanban.restoreCard}
          onDelete={deleteCard}
          onOpen={c => { setShowArchive(false); setEditing(c) }}
          onClose={() => setShowArchive(false)} />
      )}
    </div>
  )
}
