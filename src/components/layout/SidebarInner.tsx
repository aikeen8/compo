import { FileText, CheckSquare, Timer, Plus } from "lucide-react"

export function SidebarInner() {
  return (
    <aside className="w-64 h-screen flex flex-col bg-slate-50/50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 transition-colors">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-brand-500"></div>
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">aikeen's Folder</h2>
        </div>

        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 font-medium text-sm transition-colors">
            <FileText size={18} />
            Notes
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 font-medium text-sm transition-colors">
            <CheckSquare size={18} />
            To-do List
          </button>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 font-medium text-sm transition-colors">
            <Timer size={18} />
            Pomodoro
          </button>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <button className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors">
          <Plus size={18} />
          New Note
        </button>
      </div>
    </aside>
  )
}