import { FLOW_COLUMNS } from '../constants'
import { Icon, I, InfoButton } from './ui'
import Card from './Card'

export default function Column({ col, cards, onAdd, onOpen, onMove, onDelete, onArchive, dragState, onDragOver, onDrop, onDragStart, onDragEnd, columnIndex }) {
  const isOver = dragState.overCol === col.id
  const isBugs = col.id === 'bugs'

  return (
    <div className={`flex flex-col min-w-[300px] w-[300px] bg-zinc-950/40 border ${isBugs ? 'border-rose-500/15 bugs-col' : 'border-zinc-900'} rounded-xl ${isOver ? 'col-drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); onDragOver(col.id) }}
      onDrop={e => { e.preventDefault(); onDrop(col.id) }}>

      <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-900">
        <div className="flex items-center gap-2 min-w-0">
          {isBugs
            ? <Icon d={I.bug} className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            : <span className="w-2 h-2 rounded-full shrink-0" style={{ background: col.dot }}></span>}
          <h3 className={`text-[13px] font-semibold tracking-tight truncate ${isBugs ? 'text-rose-200' : 'text-zinc-200'}`}>{col.title}</h3>
          <span className="mono text-[11px] text-zinc-500 bg-zinc-900 border border-zinc-800 rounded px-1.5 py-0.5 shrink-0">{cards.length}</span>
          <InfoButton text={col.info} />
        </div>
        <button onClick={() => onAdd(col.id)} className="text-zinc-500 hover:text-indigo-300 hover:bg-zinc-900 rounded p-1 transition-colors" title="Nueva tarjeta">
          <Icon d={I.plus} className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
        {cards.length === 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-[11px] text-zinc-600 mono">vacío</p>
          </div>
        )}
        {cards.map(card => {
          const flowIdx = FLOW_COLUMNS.indexOf(card.column)
          const allowL = isBugs ? false : flowIdx > 0
          const allowR = isBugs ? false : flowIdx >= 0 && flowIdx < FLOW_COLUMNS.length - 1
          return (
            <Card key={card.id} card={card} columnIndex={columnIndex}
              onOpen={onOpen} onMove={onMove} onDelete={onDelete} onArchive={onArchive}
              isDragging={dragState.id === card.id}
              allowMoveLeft={allowL} allowMoveRight={allowR}
              dragHandlers={{
                onDragStart: e => { e.dataTransfer.effectAllowed = 'move'; onDragStart(card.id) },
                onDragEnd: onDragEnd,
              }} />
          )
        })}
      </div>

      <button onClick={() => onAdd(col.id)}
        className="m-2 mt-0 px-3 py-2 text-[12px] text-zinc-500 hover:text-indigo-300 hover:bg-zinc-900 border border-dashed border-zinc-800 hover:border-indigo-500/30 rounded-md transition-colors flex items-center justify-center gap-1.5">
        <Icon d={I.plus} className="w-3.5 h-3.5" /> Añadir tarjeta
      </button>
    </div>
  )
}
