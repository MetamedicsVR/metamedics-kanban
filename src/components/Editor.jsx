import { useState, useEffect, useRef } from 'react'
import { COLUMNS, TYPES, PRIORITIES, SIZES, ME_KEY } from '../constants'
import { uid, formatRelative } from '../utils'
import { Btn, Field, Input, TextArea, Select, AutoInput, TagInput, Icon, I, AvatarDot } from './ui'
import RichTextEditor from './RichTextEditor'

export default function Editor({ card, suggestions, onClose, onSave, onArchive, onDelete }) {
  const [draft, setDraft] = useState(card)
  const [commentText, setCommentText] = useState('')
  const [commentAuthor, setCommentAuthor] = useState(localStorage.getItem(ME_KEY) || '')
  const [newCheck, setNewCheck] = useState('')
  const titleRef = useRef(null)
  const isNew = card.__isNew

  useEffect(() => {
    if (isNew) titleRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) doSave()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const update = (patch) => setDraft(d => ({ ...d, ...patch }))
  const doSave = () => {
    if (!draft.title.trim()) { titleRef.current?.focus(); return }
    onSave(draft)
  }

  const addCheck = () => {
    if (!newCheck.trim()) return
    update({ checklist: [...(draft.checklist || []), { id: uid(), text: newCheck.trim(), done: false }] })
    setNewCheck('')
  }
  const toggleCheck = (id) => update({ checklist: draft.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c) })
  const delCheck = (id) => update({ checklist: draft.checklist.filter(c => c.id !== id) })

  const addComment = () => {
    if (!commentText.trim()) return
    const author = commentAuthor.trim() || 'Yo'
    localStorage.setItem(ME_KEY, author)
    update({ comments: [...(draft.comments || []), { id: uid(), author, text: commentText.trim(), at: Date.now() }] })
    setCommentText('')
  }
  const delComment = (id) => update({ comments: draft.comments.filter(c => c.id !== id) })

  const addLink = () => update({ links: [...(draft.links || []), { label: '', url: '' }] })
  const updLink = (i, patch) => update({ links: draft.links.map((l, idx) => idx === i ? { ...l, ...patch } : l) })
  const delLink = (i) => update({ links: draft.links.filter((_, idx) => idx !== i) })

  const checklistDone = draft.checklist?.filter(c => c.done).length || 0
  const checklistTotal = draft.checklist?.length || 0

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8 bg-black/60 backdrop-blur-sm anim-fade" onClick={onClose}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl w-full max-w-3xl my-auto anim-pop" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-900">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="mono">{isNew ? 'Nueva tarjeta' : 'Editando'}</span>
            <span className="text-zinc-700">·</span>
            <span>{COLUMNS.find(c => c.id === draft.column)?.title}</span>
            {!isNew && <><span className="text-zinc-700">·</span><span>creado {formatRelative(draft.createdAt)}</span></>}
            {draft.archived && <><span className="text-zinc-700">·</span><span className="text-amber-300">archivada</span></>}
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 p-1">
            <Icon d={I.x} className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px]">
          {/* Left: main content */}
          <div className="p-5 space-y-5">
            <input ref={titleRef} value={draft.title} onChange={e => update({ title: e.target.value })}
              placeholder="Título de la tarjeta"
              className="w-full bg-transparent border-0 outline-none text-xl font-semibold text-zinc-100 placeholder:text-zinc-700 ring-focus rounded px-1 -ml-1" />

            <Field label="Descripción">
              <RichTextEditor
                key={draft.id}
                value={draft.description}
                onChange={v => update({ description: v })}
                placeholder="Contexto, pasos de reproducción, criterios de aceptación…"
              />
            </Field>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon d={I.list} className="w-4 h-4 text-zinc-500" />
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Checklist</span>
                </div>
                {checklistTotal > 0 && <span className="mono text-[11px] text-zinc-500">{checklistDone}/{checklistTotal}</span>}
              </div>
              {checklistTotal > 0 && (
                <div className="mb-2 h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500/70 transition-all" style={{ width: `${(checklistDone / checklistTotal) * 100}%` }} />
                </div>
              )}
              <div className="space-y-1.5">
                {(draft.checklist || []).map(item => (
                  <div key={item.id} className="group flex items-center gap-2 px-2 py-1 rounded-md hover:bg-zinc-900/50">
                    <button onClick={() => toggleCheck(item.id)}
                      className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${item.done ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-700 hover:border-zinc-500'}`}>
                      {item.done && <Icon d={I.check} className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`flex-1 text-sm ${item.done ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{item.text}</span>
                    <button onClick={() => delCheck(item.id)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-0.5">
                      <Icon d={I.x} className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input value={newCheck} onChange={e => setNewCheck(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCheck() } }}
                  placeholder="Añadir paso…" className="text-sm" />
                <Btn onClick={addCheck} variant="soft" size="sm">Añadir</Btn>
              </div>
            </div>

            {/* Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon d={I.link} className="w-4 h-4 text-zinc-500" />
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Adjuntos / Links</span>
                </div>
                <button onClick={addLink} className="text-[11px] text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1">
                  <Icon d={I.plus} className="w-3 h-3" />añadir
                </button>
              </div>
              <div className="space-y-1.5">
                {(draft.links || []).map((link, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Input value={link.label} onChange={e => updLink(i, { label: e.target.value })} placeholder="Figma, Loom…" className="w-32 text-xs" />
                    <Input value={link.url} onChange={e => updLink(i, { url: e.target.value })} placeholder="https://…" className="flex-1 text-xs mono" />
                    <button onClick={() => delLink(i)} className="text-zinc-500 hover:text-red-400 p-1">
                      <Icon d={I.x} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {!(draft.links || []).length && <p className="text-[11px] text-zinc-600 italic">Sin links · solo URLs (Figma, Loom, docs)</p>}
              </div>
            </div>

            {/* Comments */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icon d={I.chat} className="w-4 h-4 text-zinc-500" />
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Comentarios</span>
                {(draft.comments || []).length > 0 && <span className="mono text-[11px] text-zinc-500">· {draft.comments.length}</span>}
              </div>
              <div className="space-y-2 mb-3">
                {(draft.comments || []).map(c => (
                  <div key={c.id} className="group flex gap-2.5 text-sm">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300 shrink-0">
                      <AvatarDot name={c.author} />{c.author}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] text-zinc-500 mono">{formatRelative(c.at)}</span>
                        <button onClick={() => delComment(c.id)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 text-[10px]">eliminar</button>
                      </div>
                      <p className="text-[13px] text-zinc-300 leading-snug mt-0.5 whitespace-pre-wrap break-words">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-md p-2 space-y-2">
                <div className="flex gap-2">
                  <input value={commentAuthor} onChange={e => setCommentAuthor(e.target.value)} placeholder="Quién eres"
                    className="w-24 bg-transparent text-[11px] text-zinc-300 placeholder:text-zinc-600 border-b border-zinc-800 px-1 py-1 ring-focus" />
                  <span className="text-[11px] text-zinc-600 self-end pb-1">· comentando</span>
                </div>
                <TextArea value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="Escribe un comentario…" rows={2} className="border-0 bg-transparent text-sm"
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addComment() }} />
                <div className="flex justify-end">
                  <Btn onClick={addComment} variant="primary" size="sm" disabled={!commentText.trim()}>Comentar</Btn>
                </div>
              </div>
            </div>
          </div>

          {/* Right: metadata */}
          <div className="bg-zinc-950 md:border-l border-t md:border-t-0 border-zinc-900 p-5 space-y-4">
            <Field label="Estado">
              <Select value={draft.column} onChange={e => update({ column: e.target.value })}>
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
            </Field>
            <Field label="Tipo">
              <Select value={draft.type} onChange={e => update({ type: e.target.value })}>
                {Object.entries(TYPES).map(([id, t]) => <option key={id} value={id}>{t.icon} {t.label}</option>)}
              </Select>
            </Field>
            <Field label="Prioridad">
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(PRIORITIES).map(([id, p]) => (
                  <button key={id} onClick={() => update({ priority: id })}
                    className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md border text-xs transition-colors ${draft.priority === id ? `${p.bg} ${p.bd} ${p.text}` : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>{p.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Responsables" hint="múltiples">
              <TagInput values={draft.assignees || []} onChange={v => update({ assignees: v })}
                suggestions={suggestions.assignees} placeholder="David, Beatriz, Dev…" />
            </Field>
            <Field label="Esfuerzo" hint="talla de camiseta">
              <div className="grid grid-cols-5 gap-1">
                {SIZES.map(s => (
                  <button key={s} onClick={() => update({ size: draft.size === s ? '' : s })}
                    className={`mono text-xs py-1.5 rounded border transition-colors ${draft.size === s ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Versión" hint="V3, v4.1…">
              <AutoInput value={draft.version} onChange={v => update({ version: v })}
                suggestions={suggestions.versions} placeholder="V4, v4.1…" mono />
            </Field>
            <Field label="Módulo / área">
              <AutoInput value={draft.module} onChange={v => update({ module: v })}
                suggestions={suggestions.modules} placeholder="Simulaciones, LMS…" />
            </Field>
            <Field label="Fecha límite" hint="opcional">
              <Input type="date" value={draft.dueDate || ''} onChange={e => update({ dueDate: e.target.value })} className="mono" />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-900 bg-zinc-950/50 rounded-b-xl">
          <div className="flex items-center gap-2">
            {!isNew && !draft.archived && (
              <Btn variant="outline" size="sm" onClick={() => { if (confirm('¿Archivar esta tarjeta? Quedará en el histórico.')) onArchive(draft.id) }}>
                <Icon d={I.archive} className="w-3.5 h-3.5" /> Archivar
              </Btn>
            )}
            {!isNew && (
              <Btn variant="danger" size="sm" onClick={() => { if (confirm('¿Eliminar permanentemente esta tarjeta?')) onDelete(draft.id) }}>
                <Icon d={I.trash} className="w-3.5 h-3.5" /> Eliminar
              </Btn>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-600 mono mr-2 hidden sm:inline">⌘+Enter para guardar</span>
            <Btn variant="ghost" size="md" onClick={onClose}>Cancelar</Btn>
            <Btn variant="primary" size="md" onClick={doSave}>Guardar</Btn>
          </div>
        </div>
      </div>
    </div>
  )
}
