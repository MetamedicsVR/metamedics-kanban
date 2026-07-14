import { useEffect, useRef, useState, useCallback, memo } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.core.css'

// El div que aloja Quill se monta UNA vez y nunca se vuelve a renderizar.
// Así los re-renders de la toolbar (estado de negrita/cursiva/etc.) no tocan
// el DOM imperativo de Quill, que si no perdería el foco al escribir.
const QuillMount = memo(function QuillMount({ innerRef }) {
  return <div ref={innerRef} className="rte-quill" />
}, () => true)

function ToolbarBtn({ onMouseDown, title, active, children }) {
  return (
    <button type="button" tabIndex={-1} onMouseDown={onMouseDown} title={title}
      className={`h-7 px-2 flex items-center justify-center rounded text-sm transition-colors select-none ${
        active ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
               : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
      }`}>
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange, placeholder }) {
  const mountRef = useRef(null)
  const quillRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const [fmts, setFmts] = useState({ bold: false, italic: false, underline: false, code: false })
  const [copyLabel, setCopyLabel] = useState('Copiar bloque')

  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // Arranque limpio: crea un div fresco para Quill dentro del contenedor.
    // Si por cualquier motivo hubiera un montaje previo (StrictMode, remount),
    // lo eliminamos primero para no acabar con dos editores superpuestos.
    container.innerHTML = ''
    const editorEl = document.createElement('div')
    container.appendChild(editorEl)

    const q = new Quill(editorEl, {
      formats: ['bold', 'italic', 'underline', 'list', 'code-block'],
      placeholder,
      modules: { toolbar: false },
    })

    // Contenido inicial (sin robar el foco ni hacer scroll).
    if (value) q.clipboard.dangerouslyPasteHTML(value, 'silent')

    q.on('text-change', () => {
      const editorNode = editorEl.querySelector('.ql-editor')
      if (!editorNode) return
      const empty = q.getText().trim() === ''
      onChangeRef.current(empty ? '' : editorNode.innerHTML)
    })

    q.on('selection-change', (range) => {
      if (!range) return
      const f = q.getFormat(range)
      setFmts({ bold: !!f.bold, italic: !!f.italic, underline: !!f.underline, code: !!f['code-block'] })
    })

    quillRef.current = q

    return () => {
      quillRef.current = null
      // Desmontaje total: elimina el editor y todos sus listeners del DOM.
      container.innerHTML = ''
    }
  }, []) // eslint-disable-line

  const focusEditor = (q) => {
    if (!q.hasFocus()) {
      const len = q.getLength()
      q.setSelection(Math.max(0, len - 1), 0)
    }
  }

  const applyFmt = useCallback((name) => (e) => {
    e.preventDefault()
    const q = quillRef.current
    if (!q) return
    focusEditor(q)
    const range = q.getSelection()
    if (!range) return
    q.format(name, !q.getFormat(range)[name])
  }, [])

  const applyList = useCallback((type) => (e) => {
    e.preventDefault()
    const q = quillRef.current
    if (!q) return
    focusEditor(q)
    const range = q.getSelection()
    if (!range) return
    const f = q.getFormat(range)
    q.format('list', f.list === type ? false : type)
  }, [])

  const applyCode = useCallback((e) => {
    e.preventDefault()
    const q = quillRef.current
    if (!q) return
    focusEditor(q)
    const range = q.getSelection()
    if (!range) return
    q.format('code-block', !q.getFormat(range)['code-block'])
  }, [])

  const copyCode = useCallback((e) => {
    e.preventDefault()
    const sel = window.getSelection()
    if (!sel?.anchorNode) return
    let node = sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode
    const root = mountRef.current?.querySelector('.ql-editor')
    while (node && node !== root) {
      if (node.classList?.contains('ql-code-block-container')) {
        navigator.clipboard.writeText(node.textContent || '').then(() => {
          setCopyLabel('✓ Copiado')
          setTimeout(() => setCopyLabel('Copiar bloque'), 2000)
        })
        return
      }
      node = node.parentElement
    }
  }, [])

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-md overflow-hidden focus-within:shadow-[0_0_0_2px_#0a0a0b,0_0_0_4px_rgba(129,140,248,.45)]">
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-zinc-800/80 bg-zinc-900/50 flex-wrap">
        <ToolbarBtn onMouseDown={applyFmt('bold')} active={fmts.bold} title="Negrita (Ctrl+B)">
          <strong className="text-[13px]">B</strong>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={applyFmt('italic')} active={fmts.italic} title="Cursiva (Ctrl+I)">
          <span className="italic text-[13px]">I</span>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={applyFmt('underline')} active={fmts.underline} title="Subrayado (Ctrl+U)">
          <span className="underline text-[13px]">U</span>
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-700/60 mx-1" />
        <ToolbarBtn onMouseDown={applyList('bullet')} title="Lista de puntos">
          <span className="text-[15px] leading-none">≡</span>
        </ToolbarBtn>
        <ToolbarBtn onMouseDown={applyList('ordered')} title="Lista numerada">
          <span className="text-[11px] font-mono">1.</span>
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-700/60 mx-1" />
        <ToolbarBtn onMouseDown={applyCode} active={fmts.code} title="Bloque de código">
          <span className="text-[11px] font-mono tracking-tighter">&lt;/&gt;</span>
        </ToolbarBtn>
        {fmts.code && (
          <button type="button" tabIndex={-1} onMouseDown={copyCode}
            className="ml-1 text-[11px] px-2 py-0.5 rounded border border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-zinc-100 transition-colors">
            {copyLabel}
          </button>
        )}
      </div>
      <QuillMount innerRef={mountRef} />
    </div>
  )
}
