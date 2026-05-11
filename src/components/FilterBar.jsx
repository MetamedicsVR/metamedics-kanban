import { TYPES, PRIORITIES } from '../constants'
import { Icon, I, AvatarDot, Dropdown, DropItem } from './ui'

export default function FilterBar({ suggestions, filters, setFilters }) {
  const activeCount =
    (filters.assignee ? 1 : 0) + filters.types.length +
    (filters.priority ? 1 : 0) + (filters.version ? 1 : 0) +
    (filters.module ? 1 : 0) + (filters.search ? 1 : 0)

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Icon d={I.search} className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
          placeholder="Buscar…"
          className="bg-zinc-900/60 border border-zinc-800 rounded-md pl-7 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 w-44 ring-focus" />
      </div>

      <Dropdown label={filters.assignee || 'Responsable'} active={!!filters.assignee} icon={I.user}>
        <DropItem selected={!filters.assignee} onClick={() => setFilters({ ...filters, assignee: '' })}>Todos</DropItem>
        <div className="h-px bg-zinc-800 my-1" />
        {suggestions.assignees.map(a => (
          <DropItem key={a} selected={filters.assignee === a} onClick={() => setFilters({ ...filters, assignee: a })}>
            <span className="inline-flex items-center gap-1.5"><AvatarDot name={a} size={4} />{a}</span>
          </DropItem>
        ))}
        {suggestions.assignees.length === 0 && <div className="px-3 py-2 text-xs text-zinc-600 italic">Sin responsables aún</div>}
      </Dropdown>

      <Dropdown label={filters.types.length ? `Tipo · ${filters.types.length}` : 'Tipo'} active={filters.types.length > 0} icon={I.filter}>
        {Object.entries(TYPES).map(([id, t]) => {
          const checked = filters.types.includes(id)
          return (
            <DropItem key={id} selected={checked} onClick={() => {
              const next = checked ? filters.types.filter(x => x !== id) : [...filters.types, id]
              setFilters({ ...filters, types: next })
            }}>
              <span className="mr-1.5">{t.icon}</span>{t.label}
            </DropItem>
          )
        })}
      </Dropdown>

      <Dropdown label={filters.priority ? `Prioridad: ${PRIORITIES[filters.priority].label}` : 'Prioridad'} active={!!filters.priority} icon={I.flag}>
        <DropItem selected={!filters.priority} onClick={() => setFilters({ ...filters, priority: '' })}>Todas</DropItem>
        <div className="h-px bg-zinc-800 my-1" />
        {Object.entries(PRIORITIES).map(([id, p]) => (
          <DropItem key={id} selected={filters.priority === id} onClick={() => setFilters({ ...filters, priority: id })}>
            <span className={`w-1.5 h-1.5 rounded-full ${p.dot} mr-2 inline-block`}></span>{p.label}
          </DropItem>
        ))}
      </Dropdown>

      <Dropdown label={filters.version || 'Versión'} active={!!filters.version} icon={I.layers}>
        <DropItem selected={!filters.version} onClick={() => setFilters({ ...filters, version: '' })}>Todas</DropItem>
        {suggestions.versions.length > 0 && <div className="h-px bg-zinc-800 my-1" />}
        {suggestions.versions.map(v => (
          <DropItem key={v} selected={filters.version === v} onClick={() => setFilters({ ...filters, version: v })}>
            <span className="mono">{v}</span>
          </DropItem>
        ))}
        {suggestions.versions.length === 0 && <div className="px-3 py-2 text-xs text-zinc-600 italic">Sin versiones aún</div>}
      </Dropdown>

      <Dropdown label={filters.module || 'Módulo'} active={!!filters.module} icon={I.layers}>
        <DropItem selected={!filters.module} onClick={() => setFilters({ ...filters, module: '' })}>Todos</DropItem>
        {suggestions.modules.length > 0 && <div className="h-px bg-zinc-800 my-1" />}
        {suggestions.modules.map(m => (
          <DropItem key={m} selected={filters.module === m} onClick={() => setFilters({ ...filters, module: m })}>{m}</DropItem>
        ))}
        {suggestions.modules.length === 0 && <div className="px-3 py-2 text-xs text-zinc-600 italic">Sin módulos aún</div>}
      </Dropdown>

      {activeCount > 0 && (
        <button onClick={() => setFilters({ search: '', assignee: '', types: [], priority: '', version: '', module: '' })}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 inline-flex items-center gap-1 px-2 py-1.5">
          <Icon d={I.x} className="w-3 h-3" /> Limpiar
        </button>
      )}
    </div>
  )
}
