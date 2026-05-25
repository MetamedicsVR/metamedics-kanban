import { useRef, useState, useEffect, useCallback } from 'react'

function ToolbarBtn({ onMouseDown, title, active, children }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={onMouseDown}
      title={title}
      className={`h-7 px-2 flex items-center justify-center rounded text-sm transition-colors select-none ${
        active
          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const rafRef = useRef(null)
  const [fmts, setFmts] = useState({ b: false, i: false, u: false, code: false })
  const [isEmpty, setIsEmpty] = useState(!value)
  const [copyLabel, setCopyLabel] = useState('Copiar bloque')

  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  // Set initial HTML once on mount
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (value) el.innerHTML = value
    setIsEmpty(!el.textContent.trim() && !el.querySelector('pre, ul, ol'))
  }, []) // eslint-disable-line

  // selectionchange fires on every cursor move/keypress — debounce with rAF
  const updateFmts = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const sel = window.getSelection()
      if (!sel || !editorRef.current?.contains(sel.anchorNode)) return

      let inCode = false
      let node = sel.anchorNode?.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode
      while (node && node !== editorRef.current) {
        if (node.tagName === 'PRE') { inCode = true; break }
        node = node.parentElement
      }

      try {
        setFmts({
          b: document.queryCommandState('bold'),
          i: document.queryCommandState('italic'),
          u: document.queryCommandState('underline'),
          code: inCode,
        })
      } catch { /* ignore */ }
    })
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', updateFmts)
    return () => {
      document.removeEventListener('selectionchange', updateFmts)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updateFmts])

  const emit = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    const empty = !el.textContent.trim() && !el.querySelector('pre, ul, ol, img')
    setIsEmpty(empty)
    onChangeRef.current(empty ? '' : el.innerHTML)
  }, [])

  // No focus() call here — preventDefault on mousedown keeps selection intact
  const exec = useCallback((cmd) => (e) => {
    e.preventDefault()
    document.execCommand(cmd, false, null)
    emit()
  }, [emit])

  const insertCode = useCallback((e) => {
    e.preventDefault()
    const sel = window.getSelection()
    if (!sel || !sel.rangeCount || !editorRef.current) return

    const range = sel.getRangeAt(0)
    if (!editorRef.current.contains(range.commonAncestorContainer)) {
      editorRef.current.focus()
      return
    }

    const selectedText = sel.toString()

    const pre = document.createElement('pre')
    pre.className = 'rich-pre'
    pre.textContent = selectedText || ' '

    const after = document.createElement('p')
    after.innerHTML = '<br>'

    range.deleteContents()
    range.insertNode(after)
    range.insertNode(pre)

    // Move cursor into the paragraph after the code block
    const newRange = document.createRange()
    newRange.setStart(after, 0)
    newRange.collapse(true)
    sel.removeAllRanges()
    sel.addRange(newRange)

    emit()
  }, [emit])

  const copyCode = useCallback((e) => {
    e.preventDefault()
    const sel = window.getSelection()
    if (!sel?.anchorNode) return
    let el = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode
    while (el && el !== editorRef.current) {
      if (el.tagName === 'PRE') {
        navigator.clipboard.writeText(el.textContent || '').then(() => {
          setCopyLabel('✓ Copiado')
          setTimeout(() => setCopyLabel('Copiar bloque'), 2000)
        })
        return
      }
      el = el.parentElement
    }
  }, [])

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-md overflow-hidden focus-within:shadow-[0_0_0_2px_#0a0a0b,0_0_0_4px_rgba(129,140,248,.45)]">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-zinc-800/80 bg-zinc-900/50 flex-wrap">
        <ToolbarBtn onMouseDown={exec('bold')} active={fmts.b} title="Negrita (Ctrl+B)">
          <strong className="text-[13px]">B</strong>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={exec('italic')} active={fmts.i} title="Cursiva (Ctrl+I)">
          <span className="italic text-[13px]">I</span>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={exec('underline')} active={fmts.u} title="Subrayado (Ctrl+U)">
          <span className="underline text-[13px]">U</span>
        </ToolbarBtn>

        <div className="w-px h-4 bg-zinc-700/60 mx-1" />

        <ToolbarBtn onMouseDown={exec('insertUnorderedList')} title="Lista de puntos">
          <span className="text-[15px] leading-none">≡</span>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={exec('insertOrderedList')} title="Lista numerada">
          <span className="text-[11px] font-mono">1.</span>
        </ToolbarBtn>

        <div className="w-px h-4 bg-zinc-700/60 mx-1" />

        <ToolbarBtn onMouseDown={insertCode} active={fmts.code} title="Insertar bloque de código">
          <span className="text-[11px] font-mono tracking-tighter">&lt;/&gt;</span>
        </ToolbarBtn>

        {fmts.code && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={copyCode}
            className="ml-1 text-[11px] px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            {copyLabel}
          </button>
        )}
      </div>

      {/* Editor area */}
      <div className="relative">
        {isEmpty && (
          <p className="absolute top-2.5 left-3 text-sm text-zinc-600 pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          className="rich-editor min-h-[100px] px-3 py-2.5 text-sm text-zinc-100 focus:outline-none"
        />
      </div>
    </div>
  )
}
