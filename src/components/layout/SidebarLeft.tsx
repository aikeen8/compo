import { Plus, Folder, Settings, LogOut } from "lucide-react"

interface SidebarLeftProps {
  onFolderClick: () => void;
}

export function SidebarLeft({ onFolderClick }: SidebarLeftProps) {
  return (
    <aside className="w-[80px] h-screen flex flex-col items-center py-6 bg-slate-50 border-r border-slate-100 flex-shrink-0 z-10 relative">
      <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors mb-6">
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <div className="flex flex-col gap-4 flex-1 w-full items-center">
        <button 
          onClick={onFolderClick}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition-colors"
        >
          <Folder size={24} fill="currentColor" strokeWidth={0} />
        </button>
        
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors">
          <Folder size={24} strokeWidth={2} />
        </button>
      </div>

      <div className="flex flex-col gap-5 items-center w-full mt-auto">
        <div className="w-8 h-px bg-slate-200"></div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <Settings size={22} />
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <LogOut size={22} />
        </button>
      </div>
    </aside>
  )
}