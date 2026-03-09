import { useState, useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { Bold, Italic, Strikethrough, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, ListTodo, FileText } from "lucide-react"
import { ItemType } from "../../pages/Dashboard"

interface MainContentProps {
  activeItem?: ItemType | null;
  onUpdateItem?: (id: string, title: string, content: string) => void;
}

const highlightColors = [
  { color: 'rgba(250, 204, 21, 0.35)', bg: 'bg-yellow-400' },
  { color: 'rgba(74, 222, 128, 0.35)', bg: 'bg-green-400' },
  { color: 'rgba(96, 165, 250, 0.35)', bg: 'bg-blue-400' },
  { color: 'rgba(192, 132, 252, 0.35)', bg: 'bg-purple-400' }
]

export function MainContent({ activeItem, onUpdateItem }: MainContentProps) {
  const [localTitle, setLocalTitle] = useState("")
  const [prevItemId, setPrevItemId] = useState(activeItem?.id)

  if (activeItem?.id !== prevItemId) {
    setPrevItemId(activeItem?.id);
    setLocalTitle(activeItem?.title || "");
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      if (activeItem && onUpdateItem) {
        onUpdateItem(activeItem.id, localTitle, editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px] text-base leading-relaxed text-slate-700 dark:text-slate-300',
      },
    },
  })

  useEffect(() => {
    if (activeItem && editor) {
      if (editor.getHTML() !== activeItem.content) {
        editor.commands.setContent(activeItem.content || "");
      }
    }
  }, [activeItem, editor])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    if (activeItem && onUpdateItem && editor) {
      onUpdateItem(activeItem.id, newTitle, editor.getHTML());
    }
  }

  const formatDateTime = (timestamp: number) => {
    if (!timestamp) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    }).format(new Date(timestamp))
  }

  if (!activeItem) {
    return (
      <main className="flex-1 h-screen bg-white dark:bg-[#222327] transition-colors duration-200 flex items-center justify-center">
        <div className="flex flex-col items-center text-slate-400 dark:text-slate-500">
          <FileText size={48} strokeWidth={1.5} className="mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-sm">Select or create an item to get started</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 h-screen bg-white dark:bg-[#222327] transition-colors duration-200 overflow-y-auto flex flex-col">
      <style>{`
        .tiptap ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
        }
        .tiptap ul[data-type="taskList"] p {
          margin: 0;
        }
        .tiptap ul[data-type="taskList"] li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        .tiptap ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.75rem;
          margin-top: 0.15rem;
          user-select: none;
        }
        .tiptap ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        
        .tiptap ul[data-type="taskList"] input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          background-color: transparent;
          margin: 0;
          font: inherit;
          color: currentColor;
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid #cbd5e1;
          border-radius: 0.35rem;
          display: grid;
          place-content: center;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .dark .tiptap ul[data-type="taskList"] input[type="checkbox"] {
          border-color: #475569;
        }
        .tiptap ul[data-type="taskList"] input[type="checkbox"]::before {
          content: "";
          width: 0.75rem;
          height: 0.75rem;
          clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
          transform: scale(0);
          transform-origin: bottom left;
          transition: 120ms transform ease-in-out;
          background-color: white;
        }
        .tiptap ul[data-type="taskList"] input[type="checkbox"]:checked {
          background-color: #6366f1;
          border-color: #6366f1;
        }
        .tiptap ul[data-type="taskList"] input[type="checkbox"]:checked::before {
          transform: scale(1);
        }
        .tiptap ul[data-type="taskList"] li[data-checked="true"] > div > p {
          color: #94a3b8;
          text-decoration: line-through;
          transition: all 0.2s ease-in-out;
        }
        .dark .tiptap ul[data-type="taskList"] li[data-checked="true"] > div > p {
          color: #64748b;
        }

        .tiptap mark {
          border-radius: 0.25rem;
          padding: 0.125rem 0.25rem;
          color: inherit;
        }
      `}</style>
      
      <div className="h-14 border-b border-slate-200 dark:border-[#121214] flex items-center px-6 gap-1 flex-shrink-0 bg-white/50 dark:bg-[#222327]/50 backdrop-blur-sm sticky top-0 z-10">
        {editor && (
          <>
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <Bold size={16} /> </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <Italic size={16} /> </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('strike') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <Strikethrough size={16} /> </button>
            
            <div className="flex items-center gap-1.5 ml-1 mr-1">
              <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('highlight') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <Highlighter size={16} /> </button>
              <div className="flex items-center gap-1.5 px-1">
                {highlightColors.map(c => (
                  <button 
                    key={c.color} 
                    onClick={() => editor.chain().focus().setHighlight({ color: c.color }).run()} 
                    className={`w-3.5 h-3.5 rounded-full ${c.bg} hover:scale-125 transition-transform ${editor.isActive('highlight', { color: c.color }) ? 'ring-2 ring-offset-1 ring-slate-400 dark:ring-slate-500 dark:ring-offset-[#222327]' : ''}`} 
                  />
                ))}
              </div>
            </div>
            
            <div className="w-px h-6 bg-slate-200 dark:bg-[#121214] mx-2"></div>
            
            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <AlignLeft size={16} /> </button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <AlignCenter size={16} /> </button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <AlignRight size={16} /> </button>
            <button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-2 rounded-lg transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <AlignJustify size={16} /> </button>
            
            <div className="w-px h-6 bg-slate-200 dark:bg-[#121214] mx-2"></div>

            <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('taskList') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <ListTodo size={16} /> </button>
          </>
        )}
      </div>

      <div className="max-w-4xl w-full mx-auto p-12 md:p-20 flex flex-col flex-1">
        <input
          type="text"
          placeholder="Note Title"
          value={localTitle}
          onChange={handleTitleChange}
          className="text-4xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 mb-2 w-full transition-colors pb-1 leading-normal"
        />
        
        <div className="flex items-center justify-between text-[11px] font-medium tracking-wide uppercase text-slate-400 dark:text-slate-500 mb-8 px-1">
          <span>Created {formatDateTime(activeItem.createdAt)}</span>
          <span>Last edited {formatDateTime(activeItem.updatedAt)}</span>
        </div>
        
        <EditorContent editor={editor} className="flex-1 w-full" />
      </div>
    </main>
  )
}