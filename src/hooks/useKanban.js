import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { fromDb, toDb, activityFromDb } from '../utils'
import { COLUMNS, ME_KEY } from '../constants'

const colTitle = (id) => COLUMNS.find(c => c.id === id)?.title || id
const getMe = () => localStorage.getItem(ME_KEY) || ''

async function logActivity(entry) {
  await supabase.from('activity_log').insert({
    action: entry.action,
    card_id: entry.cardId || null,
    card_title: entry.cardTitle || '',
    who: getMe(),
    from_column: entry.from || null,
    to_column: entry.to || null,
    from_title: entry.fromTitle || null,
    to_title: entry.toTitle || null,
  })
}

export function useKanban() {
  const [cards, setCards] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initial load
  useEffect(() => {
    async function load() {
      try {
        const [{ data: cardsData, error: ce }, { data: activityData, error: ae }] = await Promise.all([
          supabase.from('cards').select('*').order('created_at', { ascending: false }),
          supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(200),
        ])
        if (ce) throw ce
        if (ae) throw ae
        setCards((cardsData || []).map(fromDb))
        setActivity((activityData || []).map(activityFromDb))
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Real-time subscriptions
  useEffect(() => {
    const cardsChannel = supabase.channel('cards-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, ({ eventType, new: n, old: o }) => {
        if (eventType === 'INSERT') {
          setCards(prev => [fromDb(n), ...prev.filter(c => c.id !== n.id)])
        } else if (eventType === 'UPDATE') {
          setCards(prev => prev.map(c => c.id === n.id ? fromDb(n) : c))
        } else if (eventType === 'DELETE') {
          setCards(prev => prev.filter(c => c.id !== o.id))
        }
      })
      .subscribe()

    const activityChannel = supabase.channel('activity-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, ({ new: n }) => {
        setActivity(prev => [activityFromDb(n), ...prev].slice(0, 200))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(cardsChannel)
      supabase.removeChannel(activityChannel)
    }
  }, [])

  const createCard = useCallback(async (card) => {
    // Optimistic insert
    setCards(prev => [card, ...prev])
    const { error } = await supabase.from('cards').insert(toDb(card))
    if (error) {
      setCards(prev => prev.filter(c => c.id !== card.id))
      throw error
    }
    await logActivity({ action: 'create', cardId: card.id, cardTitle: card.title, to: card.column, toTitle: colTitle(card.column) })
  }, [])

  const updateCard = useCallback(async (card, prevColumn) => {
    // Optimistic update
    setCards(prev => prev.map(c => c.id === card.id ? card : c))
    const { error } = await supabase.from('cards').update(toDb(card)).eq('id', card.id)
    if (error) throw error
    if (prevColumn && prevColumn !== card.column) {
      await logActivity({
        action: 'move', cardId: card.id, cardTitle: card.title,
        from: prevColumn, to: card.column,
        fromTitle: colTitle(prevColumn), toTitle: colTitle(card.column),
      })
    }
  }, [])

  const archiveCard = useCallback(async (id) => {
    setCards(prev => prev.map(c => {
      if (c.id !== id) return c
      const updated = { ...c, archived: true, archivedAt: Date.now() }
      logActivity({ action: 'archive', cardId: id, cardTitle: c.title })
      return updated
    }))
    await supabase.from('cards').update({
      archived: true,
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', id)
  }, [])

  const restoreCard = useCallback(async (id) => {
    setCards(prev => prev.map(c => {
      if (c.id !== id) return c
      const updated = { ...c, archived: false, archivedAt: null }
      logActivity({ action: 'restore', cardId: id, cardTitle: c.title })
      return updated
    }))
    await supabase.from('cards').update({
      archived: false,
      archived_at: null,
      updated_at: new Date().toISOString(),
    }).eq('id', id)
  }, [])

  const deleteCard = useCallback(async (id) => {
    setCards(prev => {
      const c = prev.find(x => x.id === id)
      if (c) logActivity({ action: 'delete', cardId: id, cardTitle: c.title })
      return prev.filter(x => x.id !== id)
    })
    await supabase.from('cards').delete().eq('id', id)
  }, [])

  const moveCard = useCallback(async (id, delta, flowColumns) => {
    setCards(prev => {
      const card = prev.find(c => c.id === id)
      if (!card || card.column === 'bugs') return prev
      const idx = flowColumns.indexOf(card.column)
      if (idx < 0) return prev
      const next = Math.max(0, Math.min(flowColumns.length - 1, idx + delta))
      if (flowColumns[next] === card.column) return prev
      const newCol = flowColumns[next]
      logActivity({
        action: 'move', cardId: id, cardTitle: card.title,
        from: card.column, to: newCol,
        fromTitle: colTitle(card.column), toTitle: colTitle(newCol),
      })
      const updated = { ...card, column: newCol }
      supabase.from('cards').update({ column_id: newCol, updated_at: new Date().toISOString() }).eq('id', id)
      return prev.map(c => c.id === id ? updated : c)
    })
  }, [])

  const dropCard = useCallback(async (id, toColumnId) => {
    setCards(prev => {
      const card = prev.find(c => c.id === id)
      if (!card || card.column === toColumnId) return prev
      logActivity({
        action: 'move', cardId: id, cardTitle: card.title,
        from: card.column, to: toColumnId,
        fromTitle: colTitle(card.column), toTitle: colTitle(toColumnId),
      })
      const updated = { ...card, column: toColumnId }
      supabase.from('cards').update({ column_id: toColumnId, updated_at: new Date().toISOString() }).eq('id', id)
      return prev.map(c => c.id === id ? updated : c)
    })
  }, [])

  return {
    cards, activity, loading, error,
    createCard, updateCard, archiveCard, restoreCard, deleteCard, moveCard, dropCard,
  }
}
