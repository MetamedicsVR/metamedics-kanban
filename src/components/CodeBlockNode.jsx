import { useState } from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

export default function CodeBlockNode({ node }) {
  const [copied, setCopied] = useState(false)

  const copy = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(node.textContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <NodeViewWrapper className="relative my-2 group/codeblock">
      <pre className="bg-zinc-950 border border-zinc-800 rounded-md p-3 overflow-x-auto">
        <NodeViewContent as="code" className="text-[12.5px] font-mono text-zinc-300 leading-relaxed whitespace-pre" />
      </pre>
      <button
        type="button"
        contentEditable={false}
        onMouseDown={copy}
        className={`absolute top-2 right-2 text-[11px] px-2 py-0.5 rounded border transition-all
          ${copied
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 opacity-0 group-hover/codeblock:opacity-100'
          }`}
      >
        {copied ? '✓ Copiado' : 'Copiar'}
      </button>
    </NodeViewWrapper>
  )
}
