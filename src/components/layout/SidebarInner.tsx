import { FileText, CheckSquare, Timer, Plus } from "lucide-react"

interface SidebarInnerProps {
  folderName: string;
  isOpen: boolean;
}

export function SidebarInner({ folderName, isOpen }: SidebarInnerProps) {
  return (
    <aside 
      className={`h-screen bg-white flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "w-[240px] border-r border-slate-100 opacity-100" : "w-0 border-r-0 opacity-0"
      }`}
    >
      <div className="w-[240px] h-full flex flex-col py-6 px-4">
        
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
          <h2 className="font-semibold text-slate-800 text-sm">{folderName}</h2>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <button className="flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium transition-colors">
            <FileText size={18} />
            Notes
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg text-sm font-medium transition-colors">
            <CheckSquare size={18} />
            To-do List
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-lg text-sm font-medium transition-colors">
            <Timer size={18} />
            Pomodoro
          </button>
        </nav>

        <button className="mt-auto w-full flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors">
          <Plus size={18} />
          New Note
        </button>
        
      </div>
    </aside>
  )
}