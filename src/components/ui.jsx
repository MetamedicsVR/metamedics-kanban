import { useState, useEffect, useMemo, useRef } from 'react'

// ─── Icon ─────────────────────────────────────────────────────────────────────
export const Icon = ({ d, className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
)

export const I = {
  plus:    'M12 5v14M5 12h14',
  x:       'M6 6l12 12M18 6L6 18',
  trash:   'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m1 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z',
  arrowL:  'M15 18l-6-6 6-6',
  arrowR:  'M9 6l6 6-6 6',
  search:  'M21 21l-4.3-4.3M11 19a8 8 0 110-16 8 8 0 010 16z',
  filter:  'M22 3H2l8 9.5V19l4 2v-8.5L22 3z',
  calendar:'M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18',
  link:    'M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1 1M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1-1',
  chat:    'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z',
  check:   'M20 6L9 17l-5-5',
  user:    'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  info:    'M12 16v-4M12 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  list:    'M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01',
  flag:    'M4 22V4M4 4h12l-2 4 2 4H4',
  layers:  'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  archive: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4',
  history: 'M3 12a9 9 0 109-9 9.74 9.74 0 00-7 3.5L3 8M3 3v5h5M12 7v5l3 2',
  bug:     'M8 2l1.88 1.88M14.12 3.88L16 2M9 7h6M16 13a4 4 0 11-8 0V9a4 4 0 018 0v4zM4 14H2M4 18l2-2M22 14h-2M20 18l-2-2',
  wifi:    'M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01',
}

// ─── Button ───────────────────────────────────────────────────────────────────
export const Btn = ({ children, onClick, variant = 'ghost', size = 'md', className = '', title, disabled, type = 'button' }) => {
  const s = { sm: 'px-2 py-1 text-xs gap-1.5', md: 'px-3 py-1.5 text-sm gap-2', lg: 'px-4 py-2 text-sm gap-2' }[size]
  const v = {
    primary: 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-sm shadow-indigo-500/20',
    ghost:   'bg-transparent hover:bg-zinc-800 text-zinc-300',
    soft:    'bg-zinc-800/70 hover:bg-zinc-700/70 text-zinc-200 border border-zinc-700/60',
    danger:  'bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30',
    outline: 'bg-transparent hover:bg-zinc-800 text-zinc-300 border border-zinc-800',
  }[variant]
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ring-focus disabled:opacity-40 disabled:cursor-not-allowed ${s} ${v} ${className}`}>
      {children}
    </button>
  )
}

// ─── Form atoms ───────────────────────────────────────────────────────────────
export const Field = ({ label, children, hint }) => (
  <label className="block">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">{label}</span>
      {hint && <span className="text-[11px] text-zinc-600">{hint}</span>}
    </div>
    {children}
  </label>
)

export const Input = (p) => (
  <input {...p} className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 ring-focus ${p.className || ''}`} />
)

export const TextArea = (p) => (
  <textarea {...p} className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 ring-focus ${p.className || ''}`} />
)

export const Select = ({ children, ...p }) => (
  <select {...p}
    className={`w-full appearance-none bg-zinc-900/60 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 ring-focus pr-8 ${p.className || ''}`}
    style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.6rem center' }}>
    {children}
  </select>
)

// ─── AutoInput ────────────────────────────────────────────────────────────────
export function AutoInput({ value, onChange, suggestions = [], placeholder, className = '', mono = false }) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const ref = useRef(null)

  const filtered = useMemo(() => {
    const q = (value || '').trim().toLowerCase()
    const base = suggestions.filter(s => s && s.toLowerCase() !== q)
    if (!q) return base.slice(0, 8)
    return base.filter(s => s.toLowerCase().includes(q)).slice(0, 8)
  }, [value, suggestions])

  useEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  useEffect(() => { setHighlight(0) }, [value])

  const choose = (s) => { onChange(s); setOpen(false) }
  const onKey = (e) => {
    if (!open || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => (h + 1) % filtered.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => (h - 1 + filtered.length) % filtered.length) }
    else if (e.key === 'Enter' && filtered[highlight]) { e.preventDefault(); choose(filtered[highlight]) }
    else if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <input value={value || ''} onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)} onKeyDown={onKey} placeholder={placeholder}
        className={`w-full bg-zinc-900/60 border border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 ring-focus ${mono ? 'mono' : ''} ${className}`}
      />
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-zinc-950 border border-zinc-800 rounded-md shadow-xl py-1 max-h-56 overflow-y-auto anim-up">
          {filtered.map((s, i) => (
            <button key={s} type="button" onMouseDown={e => { e.preventDefault(); choose(s) }}
              onMouseEnter={() => setHighlight(i)}
              className={`w-full text-left px-3 py-1.5 text-xs ${mono ? 'mono' : ''} ${i === highlight ? 'bg-zinc-900 text-indigo-300' : 'text-zinc-300'}`}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── TagInput ─────────────────────────────────────────────────────────────────
export function TagInput({ values = [], onChange, suggestions = [], placeholder }) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const ref = useRef(null)

  const filtered = useMemo(() => {
    const q = draft.trim().toLowerCase()
    const base = suggestions.filter(s => s && !values.includes(s))
    if (!q) return base.slice(0, 8)
    return base.filter(s => s.toLowerCase().includes(q)).slice(0, 8)
  }, [draft, suggestions, values])

  useEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  useEffect(() => { setHighlight(0) }, [draft])

  const commit = (raw) => {
    const v = raw.trim()
    if (!v || values.includes(v)) { setDraft(''); return }
    onChange([...values, v])
    setDraft('')
  }
  const remove = (v) => onChange(values.filter(x => x !== v))

  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit(open && filtered[highlight] ? filtered[highlight] : draft)
    } else if (e.key === 'Backspace' && !draft && values.length) {
      remove(values[values.length - 1])
    } else if (open && filtered.length) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => (h + 1) % filtered.length) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => (h - 1 + filtered.length) % filtered.length) }
      else if (e.key === 'Escape') setOpen(false)
    }
  }

  return (
    <div ref={ref} className="relative">
      <div className="flex flex-wrap items-center gap-1 bg-zinc-900/60 border border-zinc-800 rounded-md px-2 py-1.5 focus-within:shadow-[0_0_0_2px_#0a0a0b,0_0_0_4px_rgba(129,140,248,.45)]">
        {values.map(v => (
          <span key={v} className="inline-flex items-center gap-1 rounded bg-zinc-800 border border-zinc-700/60 text-[11.5px] text-zinc-200 pl-1.5 pr-1 py-0.5">
            <AvatarDot name={v} size={4} />
            <span>{v}</span>
            <button type="button" onClick={() => remove(v)} className="text-zinc-500 hover:text-red-400 -mr-0.5">
              <Icon d={I.x} className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input value={draft} onChange={e => { setDraft(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => { if (draft.trim()) commit(draft) }}
          onKeyDown={onKey}
          placeholder={values.length ? '' : placeholder}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 outline-none px-1 py-0.5"
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-zinc-950 border border-zinc-800 rounded-md shadow-xl py-1 max-h-56 overflow-y-auto anim-up">
          {filtered.map((s, i) => (
            <button key={s} type="button" onMouseDown={e => { e.preventDefault(); commit(s) }}
              onMouseEnter={() => setHighlight(i)}
              className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 ${i === highlight ? 'bg-zinc-900 text-indigo-300' : 'text-zinc-300'}`}>
              <AvatarDot name={s} size={5} />{s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Avatars ──────────────────────────────────────────────────────────────────
function hueFromName(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360
  return h
}

function initialsOf(name) {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '·'
}

export function AvatarDot({ name, size = 5 }) {
  const px = size * 4
  return (
    <span className="inline-flex items-center justify-center rounded-full text-[9px] font-semibold text-zinc-50"
      style={{ width: px, height: px, background: `oklch(0.45 0.09 ${hueFromName(name)})`, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
      {initialsOf(name)}
    </span>
  )
}

export function AssigneeStack({ names = [], max = 3 }) {
  if (!names.length) return null
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  return (
    <div className="inline-flex items-center">
      <div className="flex -space-x-1.5">
        {shown.map(n => (
          <span key={n} title={n} className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-semibold text-zinc-50 border border-zinc-950"
            style={{ background: `oklch(0.45 0.09 ${hueFromName(n)})` }}>{initialsOf(n)}</span>
        ))}
        {rest > 0 && (
          <span title={names.slice(max).join(', ')} className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-zinc-800 border border-zinc-950 text-[9px] font-medium text-zinc-300">+{rest}</span>
        )}
      </div>
      {names.length === 1 && <span className="ml-1.5 text-[11px] text-zinc-300 truncate max-w-[80px]">{names[0]}</span>}
    </div>
  )
}

// ─── Chips ────────────────────────────────────────────────────────────────────
import { TYPES, PRIORITIES } from '../constants'

export const TypeChip = ({ type, size = 'md' }) => {
  const t = TYPES[type] || TYPES.task
  const s = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border ${t.bg} ${t.bd} ${t.fg} ${s} font-medium`}>
      <span>{t.icon}</span><span>{t.label}</span>
    </span>
  )
}

export const PriorityChip = ({ priority }) => {
  const p = PRIORITIES[priority] || PRIORITIES.medium
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border ${p.bg} ${p.bd} ${p.text} text-[11px] px-2 py-0.5 font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>{p.label}
    </span>
  )
}

export const SizeChip = ({ size }) => size
  ? <span className="mono text-[10px] font-medium text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 rounded px-1.5 py-0.5">{size}</span>
  : null

export const ModuleChip = ({ module, size = 'sm' }) => {
  if (!module) return null
  const hue = hueFromName(module)
  const s = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border font-medium ${s}`}
      style={{
        color: `oklch(0.82 0.11 ${hue})`,
        background: `oklch(0.82 0.11 ${hue} / 0.10)`,
        borderColor: `oklch(0.82 0.11 ${hue} / 0.25)`,
      }}
    >
      <Icon d={I.layers} className="w-2.5 h-2.5" />
      {module}
    </span>
  )
}

// ─── InfoButton ───────────────────────────────────────────────────────────────
export function InfoButton({ text }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`p-1 rounded transition-colors ${open ? 'bg-zinc-800 text-indigo-300' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
        title="Propósito de la columna">
        <Icon d={I.info} className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-30 w-64 bg-zinc-950 border border-zinc-800 rounded-md shadow-xl p-3 anim-up">
          <p className="text-[12px] text-zinc-300 leading-snug">{text}</p>
        </div>
      )}
    </div>
  )
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
export function Dropdown({ label, active, icon, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-colors ${active ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'}`}>
        {icon && <Icon d={icon} className="w-3 h-3" />}{label}<Icon d="M6 9l6 6 6-6" className="w-3 h-3 opacity-60" />
      </button>
      {open && (
        <div className="absolute z-30 left-0 mt-1 min-w-[180px] max-h-72 overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-md shadow-xl py-1 anim-up">
          {children}
        </div>
      )}
    </div>
  )
}

export function DropItem({ children, selected, onClick }) {
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-zinc-900 ${selected ? 'text-indigo-300' : 'text-zinc-300'}`}>
      <span className="inline-flex items-center">{children}</span>
      {selected && <Icon d={I.check} className="w-3 h-3" />}
    </button>
  )
}

// ─── Drawer ───────────────────────────────────────────────────────────────────
export function Drawer({ open, onClose, title, icon, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] anim-fade"></div>
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 anim-slide-right flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-900">
          <div className="flex items-center gap-2">
            <Icon d={icon} className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 p-1"><Icon d={I.x} className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  )
}
