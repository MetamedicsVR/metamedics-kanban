import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

function ToolbarBtn({ onMouseDown, active, title, children }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={onMouseDown}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors select-none ${
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
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || '',
    autofocus: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
    editorProps: {
      attributes: {
        class: 'rich-editor focus:outline-none min-h-[80px] text-sm text-zinc-100 px-3 py-2',
      },
    },
  })

  if (!editor) return null

  const cmd = (action) => (e) => {
    e.preventDefault()
    action()
  }

  return (
    <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-md overflow-hidden focus-within:shadow-[0_0_0_2px_#0a0a0b,0_0_0_4px_rgba(129,140,248,.45)]">
      <div className="flex items-center gap-0.5 px-2 py-1 border-b border-zinc-800/80 bg-zinc-900/40">
        <ToolbarBtn
          onMouseDown={cmd(() => editor.chain().focus().toggleBold().run())}
          active={editor.isActive('bold')}
          title="Negrita (Ctrl+B)">
          <strong className="text-[13px]">B</strong>
        </ToolbarBtn>
        <ToolbarBtn
          onMouseDown={cmd(() => editor.chain().focus().toggleItalic().run())}
          active={editor.isActive('italic')}
          title="Cursiva (Ctrl+I)">
          <span className="text-[13px] italic">I</span>
        </ToolbarBtn>
        <ToolbarBtn
          onMouseDown={cmd(() => editor.chain().focus().toggleUnderline().run())}
          active={editor.isActive('underline')}
          title="Subrayado (Ctrl+U)">
          <span className="text-[13px] underline">U</span>
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-700/60 mx-1" />
        <ToolbarBtn
          onMouseDown={cmd(() => editor.chain().focus().toggleBulletList().run())}
          active={editor.isActive('bulletList')}
          title="Lista de puntos">
          <span className="text-[15px] leading-none">≡</span>
        </ToolbarBtn>
        <ToolbarBtn
          onMouseDown={cmd(() => editor.chain().focus().toggleOrderedList().run())}
          active={editor.isActive('orderedList')}
          title="Lista numerada">
          <span className="text-[11px] font-mono">1.</span>
        </ToolbarBtn>
      </div>

      <div className="relative">
        {!editor.getText().trim() && (
          <p className="absolute top-2 left-3 text-sm text-zinc-600 pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
