import { useState } from "react"

export function MainContent() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  return (
    <main className="flex-1 h-screen bg-white dark:bg-[#222327] transition-colors duration-200 overflow-y-auto">
      <div className="max-w-4xl w-full mx-auto p-12 md:p-20 flex flex-col min-h-full">
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-4xl font-bold bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 mb-6 w-full transition-colors"
        />
        
        <textarea
          placeholder="Start typing your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full bg-transparent border-none outline-none text-base leading-relaxed text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-colors"
          spellCheck="false"
        />
      </div>
    </main>
  )
}