import { useState, useEffect, useRef } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Image from '@tiptap/extension-image'
import { Bold, Italic, Strikethrough, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, ListTodo, FileText, Lock, ShieldAlert, Loader2, Eye, EyeOff, Image as ImageIcon, Menu } from "lucide-react"
import { ItemType, FolderType } from "../../pages/Dashboard"
import { useTheme } from "../ThemeProvider"
import { PomodoroView } from "../pomodoro/PomodoroView"
import { supabase } from "../../lib/supabase"

interface MainContentProps {
  activeItem?: ItemType | null;
  activeFolder?: FolderType | null;
  onUpdateItem?: (id: string, title: string, content: string) => void;
  onToggleMobileMenu?: () => void;
}

const highlightColors = [
  { color: 'var(--hl-yellow)', bg: 'bg-yellow-400' },
  { color: 'var(--hl-green)', bg: 'bg-green-400' },
  { color: 'var(--hl-blue)', bg: 'bg-blue-400' },
  { color: 'var(--hl-purple)', bg: 'bg-purple-400' }
]

const accentHexMap: Record<string, string> = {
  indigo: '#6366f1',
  purple: '#a855f7',
  pink: '#ec4899',
  rose: '#f43f5e',
  orange: '#f97316',
  amber: '#fbbf24',
  emerald: '#10b981',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  slate: '#64748b'
}

const fontClassMap: Record<string, string> = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono'
}

export function MainContent({ activeItem, activeFolder, onUpdateItem, onToggleMobileMenu }: MainContentProps) {
  const { accent, customColor, font = 'sans', setFont } = useTheme()
  const activeColor = accent === 'custom' ? customColor : (accentHexMap[accent] || '#6366f1')
  const activeFontClass = fontClassMap[font] || 'font-sans'

  const [localTitle, setLocalTitle] = useState("")
  const [prevItemId, setPrevItemId] = useState(activeItem?.id)
  const [isUploading, setIsUploading] = useState(false)

  const [unlockedId, setUnlockedId] = useState<string | null>(null)
  const [savedPin, setSavedPin] = useState<string | null>(null)
  const [isFetchingPin, setIsFetchingPin] = useState(false)
  const [pinInput, setPinInput] = useState("")
  const [showPin, setShowPin] = useState(false)
  
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const fontMenuRef = useRef<HTMLDivElement>(null)
  
  const stateRef = useRef({ id: activeItem?.id, title: localTitle })

  const needsPin = activeItem?.isPrivate || activeFolder?.isPrivate;
  
  const isUnlocked =
    (!activeFolder?.isPrivate || unlockedId === activeFolder?.id) &&
    (!activeItem?.isPrivate || unlockedId === activeItem?.id || unlockedId === activeFolder?.id);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target as Node)) {
        setIsFontMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    stateRef.current = { id: activeItem?.id, title: localTitle }
  }, [activeItem?.id, localTitle])

  useEffect(() => {
    setPinInput("")
    setShowPin(false)
    
    if (needsPin) {
      setIsFetchingPin(true)
      const fetchPin = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase.from('user_settings').select('pin').eq('user_id', user.id).single()
          setSavedPin(data?.pin || null)
        }
        setIsFetchingPin(false)
      }
      fetchPin()
    }
  }, [activeItem?.id, activeFolder?.id, needsPin])

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
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full h-auto border border-slate-200 dark:border-[#222327] my-4',
        },
      }),
    ],
    content: "",
    onUpdate: ({ editor, transaction }) => {
      if (transaction.docChanged && stateRef.current.id && onUpdateItem) {
        onUpdateItem(stateRef.current.id, stateRef.current.title, editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px] text-base leading-relaxed text-slate-700 dark:text-slate-300',
      },
    },
  })

  useEffect(() => {
    if (activeItem && editor && isUnlocked !== false) {
      if (editor.getHTML() !== activeItem.content) {
        if (activeItem.type === 'todo' && !activeItem.content) {
          editor.commands.setContent('<ul data-type="taskList"><li data-type="taskItem" data-checked="false"><p></p></li></ul>', { emitUpdate: false });
        } else {
          editor.commands.setContent(activeItem.content || "", { emitUpdate: false });
        }
      }
    }
  }, [activeItem, editor, isUnlocked])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    if (activeItem && onUpdateItem && editor) {
      onUpdateItem(activeItem.id, newTitle, editor.getHTML());
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      editor.chain().focus().setImage({ src: data.publicUrl }).run()
    } catch (error) {
      console.error('error uploading image:', error)
      alert('failed to upload image.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const formatDateTime = (timestamp: number) => {
    if (!timestamp) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    }).format(new Date(timestamp))
  }

  if (needsPin && !isUnlocked) {
    if (isFetchingPin) {
      return (
        <main className="flex-1 h-screen bg-white dark:bg-[#222327] flex items-center justify-center">
          <Loader2 className="animate-spin text-slate-400 w-8 h-8" />
        </main>
      )
    }

    if (!savedPin) {
      return (
        <main className="flex-1 h-screen bg-white dark:bg-[#222327] flex flex-col items-center justify-center p-6 text-center relative">
          <button onClick={onToggleMobileMenu} className="absolute top-4 left-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] md:hidden z-10">
            <Menu size={24} />
          </button>
          <ShieldAlert size={48} strokeWidth={1.5} className="text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">PIN Required</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed">
            this item is private, but you haven't set up a security PIN yet. please go to settings {'>'} data & privacy to set your 4-digit PIN.
          </p>
        </main>
      )
    }

    return (
      <main className="flex-1 h-screen bg-white dark:bg-[#222327] flex flex-col items-center justify-center relative">
        <button onClick={onToggleMobileMenu} className="absolute top-4 left-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] md:hidden z-10">
          <Menu size={24} />
        </button>
        <div className="flex flex-col items-center bg-slate-50 dark:bg-[#1A1A1E] px-12 py-10 rounded-[2rem] border border-slate-200 dark:border-[#222327] shadow-sm">
          <Lock size={40} strokeWidth={1.5} className="text-brand-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Enter PIN</h2>
          <div className="relative">
            <input
              type={showPin ? "text" : "password"}
              maxLength={4}
              autoFocus
              value={pinInput}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                setPinInput(val)
                if (val.length === 4) {
                  if (val === savedPin) {
                    let newUnlockId = null;
                    if (activeFolder?.isPrivate) newUnlockId = activeFolder.id;
                    else if (activeItem?.isPrivate) newUnlockId = activeItem.id;
                    setUnlockedId(newUnlockId)
                  } else {
                    setTimeout(() => setPinInput(""), 300)
                  }
                }
              }}
              className="text-center text-3xl font-bold tracking-[0.3em] w-48 py-4 pl-8 pr-12 bg-white dark:bg-[#222327] border border-slate-200 dark:border-[#222327] rounded-2xl focus:outline-none focus:border-brand-500 text-slate-900 dark:text-white shadow-inner [&::-ms-reveal]:hidden [&::-webkit-reveal]:hidden"
            />
            <button
              onClick={() => setShowPin(!showPin)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1"
            >
              {showPin ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (!activeItem) {
    return (
      <main className="flex-1 h-screen bg-white dark:bg-[#222327] transition-colors duration-200 flex flex-col relative">
        <button onClick={onToggleMobileMenu} className="absolute top-4 left-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] md:hidden z-10">
          <Menu size={24} />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
          <FileText size={48} strokeWidth={1.5} className="mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-sm">Select or create an item to get started</p>
        </div>
      </main>
    )
  }

  if (activeItem.type === 'pomodoro') {
    return (
      <div className="flex-1 h-screen flex flex-col relative overflow-hidden bg-white dark:bg-[#222327]">
        <button onClick={onToggleMobileMenu} className="absolute top-4 left-4 p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] md:hidden z-10">
          <Menu size={24} />
        </button>
        <PomodoroView />
      </div>
    )
  }

  const isTodo = activeItem.type === 'todo';

  return (
    <main className="flex-1 h-screen bg-white dark:bg-[#222327] transition-colors duration-200 overflow-hidden flex flex-col">
      <style>{`
        :root {
          --hl-yellow: rgba(250, 204, 21, 0.4);
          --hl-green: rgba(74, 222, 128, 0.4);
          --hl-blue: rgba(96, 165, 250, 0.4);
          --hl-purple: rgba(192, 132, 252, 0.4);
        }
        .dark {
          --hl-yellow: rgba(250, 204, 21, 0.25);
          --hl-green: rgba(74, 222, 128, 0.25);
          --hl-blue: rgba(96, 165, 250, 0.25);
          --hl-purple: rgba(192, 132, 252, 0.25);
        }
        
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
          background-color: ${activeColor};
          border-color: ${activeColor};
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
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        }
      `}</style>
      
      <div className="h-14 border-b border-slate-200 dark:border-[#121214] flex flex-wrap items-center px-4 sm:px-6 gap-1 flex-none bg-white dark:bg-[#222327] z-20 font-sans relative">
        <button onClick={onToggleMobileMenu} className="p-2 mr-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300 md:hidden flex-shrink-0">
          <Menu size={20} />
        </button>
        
        {editor && (
          <>
            <div className="relative flex-shrink-0 mr-1" ref={fontMenuRef}>
              <button
                onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
                className={`p-2 w-16 rounded-lg transition-colors text-sm font-medium capitalize text-center ${isFontMenuOpen ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}
              >
                {font}
              </button>

              {isFontMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-28 bg-white dark:bg-[#1A1A1E] border border-slate-200 dark:border-[#222327] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button 
                    onClick={() => { setFont('sans'); setIsFontMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm font-sans hover:bg-slate-50 dark:hover:bg-[#222327] transition-colors ${font === 'sans' ? 'text-brand-500 font-bold bg-slate-50 dark:bg-[#222327]' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    Sans
                  </button>
                  <button 
                    onClick={() => { setFont('serif'); setIsFontMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm font-serif hover:bg-slate-50 dark:hover:bg-[#222327] transition-colors ${font === 'serif' ? 'text-brand-500 font-bold bg-slate-50 dark:bg-[#222327]' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    Serif
                  </button>
                  <button 
                    onClick={() => { setFont('mono'); setIsFontMenuOpen(false); }} 
                    className={`w-full text-left px-4 py-2 text-sm font-mono hover:bg-slate-50 dark:hover:bg-[#222327] transition-colors ${font === 'mono' ? 'text-brand-500 font-bold bg-slate-50 dark:bg-[#222327]' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    Mono
                  </button>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-[#121214] mx-2 flex-shrink-0"></div>

            <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${editor.isActive('bold') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <Bold size={16} /> </button>
            <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${editor.isActive('italic') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <Italic size={16} /> </button>
            <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${editor.isActive('strike') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <Strikethrough size={16} /> </button>
            
            <div className="flex items-center gap-1.5 px-1 ml-1 flex-shrink-0">
              <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleHighlight().run()} className={`p-2 rounded-lg transition-colors ${editor.isActive('highlight') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <Highlighter size={16} /> </button>
              <div className="hidden sm:flex items-center gap-1.5 px-1">
                {highlightColors.map(c => (
                  <button 
                    key={c.color} 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => editor.chain().focus().setHighlight({ color: c.color }).run()} 
                    className={`w-3.5 h-3.5 rounded-full ${c.bg} hover:scale-125 transition-transform ${editor.isActive('highlight', { color: c.color }) ? 'ring-2 ring-offset-1 ring-slate-400 dark:ring-slate-500 dark:ring-offset-[#222327]' : ''}`} 
                  />
                ))}
              </div>
            </div>
            
            {!isTodo && (
              <>
                <div className="w-px h-6 bg-slate-200 dark:bg-[#121214] mx-2 flex-shrink-0"></div>
                
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <AlignLeft size={16} /> </button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <AlignCenter size={16} /> </button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <AlignRight size={16} /> </button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <AlignJustify size={16} /> </button>
                
                <div className="w-px h-6 bg-slate-200 dark:bg-[#121214] mx-2 flex-shrink-0"></div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isUploading}
                  className="p-2 rounded-lg transition-colors flex-shrink-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300 disabled:opacity-50"
                  title="Upload Image"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                </button>
              </>
            )}
            
            <div className="w-px h-6 bg-slate-200 dark:bg-[#121214] mx-2 flex-shrink-0"></div>

            <button onMouseDown={(e) => e.preventDefault()} onClick={() => editor.chain().focus().toggleTaskList().run()} className={`p-2 rounded-lg transition-colors flex-shrink-0 ${editor.isActive('taskList') ? 'bg-slate-200 dark:bg-[#1A1A1E] text-slate-900 dark:text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-[#1A1A1E] dark:hover:text-slate-300'}`}> <ListTodo size={16} /> </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto w-full transform-gpu">
        <div className={`max-w-4xl w-full mx-auto px-6 pt-8 pb-32 md:px-20 md:pt-12 block ${activeFontClass}`}>
          <input
            type="text"
            placeholder={isTodo ? "To-do List Title" : "Note Title"}
            value={localTitle}
            onChange={handleTitleChange}
            style={{ WebkitFontSmoothing: 'antialiased', backfaceVisibility: 'hidden' }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 mb-2 w-full transition-colors pb-3 transform-gpu"
          />
          
          <div className="flex items-center justify-between text-[11px] font-medium tracking-wide uppercase text-slate-400 dark:text-slate-500 mb-8 px-1 font-sans">
            <span>Created {formatDateTime(activeItem.createdAt)}</span>
            <span className="hidden sm:inline">Last edited {formatDateTime(activeItem.updatedAt)}</span>
          </div>

          <EditorContent editor={editor} className="w-full" />
        </div>
      </div>

    </main>
  )
}