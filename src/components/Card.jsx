import { TYPES } from '../constants'
import { formatShortDate } from '../utils'
import { Icon, I, TypeChip, PriorityChip, SizeChip, AssigneeStack } from './ui'

export default function Card({ card, onOpen, onMove, onArchive, onDelete, dragHandlers, isDragging, allowMoveLeft, allowMoveRight }) {
  const checklistDone = card.checklist?.filter(c => c.done).length || 0
  const checklistTotal = card.checklist?.length || 0
  const overdue = card.dueDate && card.column !== 'done' && new Date(card.dueDate).getTime() < Date.now() - 86400000
  const dueSoon = card.dueDate && !overdue && card.column !== 'done' && new Date(card.dueDate).getTime() < Date.now() + 86400000 * 3

  return (
    <div draggable {...dragHandlers} onClick={() => onOpen(card)}
      className={`card group relative bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 cursor-pointer select-none anim-up ${isDragging ? 'card-dragging' : ''}`}>
      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
        style={{ background: TYPES[card.type]?.strip || '#71717a' }} />

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <TypeChip type={card.type} size="sm" />
          {card.module && (
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 bg-zinc-800/60 border border-zinc-800 rounded px-1.5 py-0.5">
              <Icon d={I.layers} className="w-2.5 h-2.5" />{card.module}
            </span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); card.column === 'done' ? onArchive(card.id) : onDelete(card.id) }}
          className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity p-1 -m-1"
          title={card.column === 'done' ? 'Archivar' : 'Eliminar'}>
          <Icon d={card.column === 'done' ? I.archive : I.trash} className="w-3.5 h-3.5" />
        </button>
      </div>

      <h4 className="text-[13.5px] font-medium text-zinc-100 leading-snug mb-2 text-balance">{card.title}</h4>
      {card.description && (
        <div className="card-description text-[12px] text-zinc-400 leading-snug mb-2 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: card.description }} />
      )}

      <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
        <PriorityChip priority={card.priority} />
        <SizeChip size={card.size} />
        {card.version && (
          <span className="mono text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5">{card.version}</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          {checklistTotal > 0 && (
            <span className={`inline-flex items-center gap-1 ${checklistDone === checklistTotal ? 'text-emerald-400' : ''}`} title="Checklist">
              <Icon d={I.list} className="w-3 h-3" />{checklistDone}/{checklistTotal}
            </span>
          )}
          {card.comments?.length > 0 && (
            <span className="inline-flex items-center gap-1" title="Comentarios">
              <Icon d={I.chat} className="w-3 h-3" />{card.comments.length}
            </span>
          )}
          {card.links?.length > 0 && (
            <span className="inline-flex items-center gap-1" title="Links">
              <Icon d={I.link} className="w-3 h-3" />{card.links.length}
            </span>
          )}
          {card.dueDate && (
            <span className={`inline-flex items-center gap-1 ${overdue ? 'text-red-400' : dueSoon ? 'text-amber-300' : 'text-zinc-500'}`} title="Fecha límite">
              <Icon d={I.calendar} className="w-3 h-3" />{formatShortDate(card.dueDate)}
            </span>
          )}
        </div>
        <AssigneeStack names={card.assignees} max={3} />
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2.5 right-2 flex bg-zinc-950 border border-zinc-800 rounded-md shadow-lg">
        <button onClick={e => { e.stopPropagation(); onMove(card.id, -1) }} disabled={!allowMoveLeft}
          className="p-1 text-zinc-400 hover:text-indigo-300 hover:bg-zinc-800 rounded-l-md disabled:opacity-30 disabled:hover:bg-transparent" title="Mover izquierda">
          <Icon d={I.arrowL} className="w-3.5 h-3.5" />
        </button>
        <div className="w-px bg-zinc-800"></div>
        <button onClick={e => { e.stopPropagation(); onMove(card.id, 1) }} disabled={!allowMoveRight}
          className="p-1 text-zinc-400 hover:text-indigo-300 hover:bg-zinc-800 rounded-r-md disabled:opacity-30 disabled:hover:bg-transparent" title="Mover derecha">
          <Icon d={I.arrowR} className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
