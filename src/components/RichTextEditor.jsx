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
  const [selState, setSelState] = useState({ bold: false, italic: false, underline: false, inCode: false })
  const [copyLabel, setCopyLabel] = useState('Copiar bloque')

  // Set initial HTML once on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value || ''
    }
  }, []) // eslint-disable-line

  const emit = useCallback(() => {
    const html = editorRef.current?.innerHTML || ''
    const empty = html === '' || html === '<br>' || html === '<div><br></div>'
    onChange(empty ? '' : html)
  }, [onChange])

  // Track selection state for toolbar active indicators
  const updateSelState = useCallback(() => {
    try {
      const bold = document.queryCommandState('bold')
      const italic = document.queryCommandState('italic')
      const underline = document.queryCommandState('underline')
      const sel = window.getSelection()
      let inCode = false
      if (sel && sel.anchorNode) {
        let el = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode
        while (el && el !== editorRef.current) {
          if (el.tagName === 'PRE') { inCode = true; break }
          el = el.parentElement
        }
      }
      setSelState({ bold, italic, underline, inCode })
    } catch { /* ignore */ }
  }, [])

  const fmt = useCallback((command) => (e) => {
    e.preventDefault()
    editorRef.current?.focus()
    document.execCommand(command, false, null)
    emit()
    updateSelState()
  }, [emit, updateSelState])

  const insertCodeBlock = useCallback((e) => {
    e.preventDefault()
    editorRef.current?.focus()
    const sel = window.getSelection()
    const selected = sel?.toString() || ''
    document.execCommand(
      'insertHTML', false,
      `<pre class="rich-pre">${selected || ' '}</pre><p><br></p>`
    )
    emit()
  }, [emit])

  const copyCodeBlock = useCallback((e) => {
    e.preventDefault()
    const sel = window.getSelection()
    if (!sel || !sel.anchorNode) return
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

  const isEmpty = !editorRef.current?.textContent?.trim() && !editorRef.current?.querySelector('pre')

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-md overflow-hidden focus-within:shadow-[0_0_0_2px_#0a0a0b,0_0_0_4px_rgba(129,140,248,.45)]">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-zinc-800/80 bg-zinc-900/50 flex-wrap">
        <ToolbarBtn onMouseDown={fmt('bold')} active={selState.bold} title="Negrita (Ctrl+B)">
          <strong className="text-[13px]">B</strong>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={fmt('italic')} active={selState.italic} title="Cursiva (Ctrl+I)">
          <span className="italic text-[13px]">I</span>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={fmt('underline')} active={selState.underline} title="Subrayado (Ctrl+U)">
          <span className="underline text-[13px]">U</span>
        </ToolbarBtn>

        <div className="w-px h-4 bg-zinc-700/60 mx-1" />

        <ToolbarBtn onMouseDown={fmt('insertUnorderedList')} title="Lista de puntos">
          <span className="text-[15px] leading-none">≡</span>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={fmt('insertOrderedList')} title="Lista numerada">
          <span className="text-[11px] font-mono">1.</span>
        </ToolbarBtn>

        <div className="w-px h-4 bg-zinc-700/60 mx-1" />

        <ToolbarBtn onMouseDown={insertCodeBlock} active={selState.inCode} title="Insertar bloque de código/prompt">
          <span className="text-[11px] font-mono tracking-tighter">&lt;/&gt;</span>
        </ToolbarBtn>

        {selState.inCode && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={copyCodeBlock}
            className="ml-1 text-[11px] px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            {copyLabel}
          </button>
        )}
      </div>

      {/* Editor area */}
      <div className="relative">
        {isEmpty && (
          <p className="absolute top-3 left-3 text-sm text-zinc-600 pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onKeyUp={updateSelState}
          onMouseUp={updateSelState}
          onFocus={updateSelState}
          className="rich-editor min-h-[100px] px-3 py-2.5 text-sm text-zinc-100 focus:outline-none"
        />
      </div>
    </div>
  )
}
