export const uid = () => crypto.randomUUID()

export function formatShortDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export function formatRelative(ts) {
  if (!ts) return ''
  const diff = Date.now() - (typeof ts === 'number' ? ts : new Date(ts).getTime())
  const m = 60_000, h = 60 * m, day = 24 * h
  if (diff < m) return 'ahora'
  if (diff < h) return `hace ${Math.floor(diff / m)} min`
  if (diff < day) return `hace ${Math.floor(diff / h)} h`
  if (diff < 7 * day) return `hace ${Math.floor(diff / day)} d`
  return new Date(ts).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
}

export function fromDb(row) {
  return {
    id: row.id,
    column: row.column_id,
    title: row.title || '',
    description: row.description || '',
    type: row.type || 'task',
    priority: row.priority || 'medium',
    assignees: row.assignees || [],
    size: row.size || '',
    version: row.version || '',
    module: row.module || '',
    dueDate: row.due_date || '',
    links: row.links || [],
    checklist: row.checklist || [],
    comments: row.comments || [],
    archived: !!row.archived,
    archivedAt: row.archived_at ? new Date(row.archived_at).getTime() : null,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  }
}

export function toDb(card) {
  return {
    id: card.id,
    column_id: card.column,
    title: card.title,
    description: card.description || '',
    type: card.type,
    priority: card.priority,
    assignees: card.assignees || [],
    size: card.size || '',
    version: card.version || '',
    module: card.module || '',
    due_date: card.dueDate || null,
    links: card.links || [],
    checklist: card.checklist || [],
    comments: card.comments || [],
    archived: !!card.archived,
    archived_at: card.archivedAt ? new Date(card.archivedAt).toISOString() : null,
    updated_at: new Date().toISOString(),
  }
}

export function activityFromDb(row) {
  return {
    id: row.id,
    action: row.action,
    cardId: row.card_id,
    cardTitle: row.card_title,
    who: row.who || '',
    from: row.from_column,
    to: row.to_column,
    fromTitle: row.from_title,
    toTitle: row.to_title,
    at: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  }
}
