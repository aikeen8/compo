import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, FileText, CheckSquare, Timer, Lock } from "lucide-react"

interface CreateItemModalProps {
  categoryName: string;
  onAddItem: (name: string, type: 'note' | 'todo' | 'pomodoro', isPrivate: boolean) => void;
}

export function CreateItemModal({ categoryName, onAddItem }: CreateItemModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<'note' | 'todo' | 'pomodoro'>('note')
  const [isPrivate, setIsPrivate] = useState(false)

  const handleCreate = () => {
    if (!name.trim()) return;
    onAddItem(name.trim().toLowerCase().replace(/\s+/g, '-'), type, isPrivate)
    setName("")
    setType('note')
    setIsPrivate(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1">
          <Plus size={14} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md dark:bg-[#222327] dark:text-slate-100 border-0 dark:border-[#121214] rounded-2xl shadow-xl transition-colors p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">Create Item</DialogTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase">in {categoryName}</p>
        </DialogHeader>
        
        <div className="px-6 py-2 flex flex-col gap-6">
          
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-3 block">Item Type</label>
            <div className="flex flex-col gap-2">
              
              <button 
                onClick={() => setType('note')}
                className={`flex items-start gap-4 p-3 rounded-lg w-full text-left transition-colors ${type === 'note' ? 'bg-slate-100 dark:bg-[#1A1A1E]' : 'hover:bg-slate-50 dark:hover:bg-[#1A1A1E]/50'}`}
              >
                <div className="mt-0.5 text-slate-500 dark:text-slate-400">
                  {type === 'note' ? <div className="w-5 h-5 rounded-full border-[5px] border-brand-500 dark:border-brand-400"></div> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-500"></div>}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                    <FileText size={18} className="text-slate-500 dark:text-slate-400" /> Note
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Write notes, documents, and save important text</p>
                </div>
              </button>

              <button 
                onClick={() => setType('todo')}
                className={`flex items-start gap-4 p-3 rounded-lg w-full text-left transition-colors ${type === 'todo' ? 'bg-slate-100 dark:bg-[#1A1A1E]' : 'hover:bg-slate-50 dark:hover:bg-[#1A1A1E]/50'}`}
              >
                <div className="mt-0.5 text-slate-500 dark:text-slate-400">
                  {type === 'todo' ? <div className="w-5 h-5 rounded-full border-[5px] border-brand-500 dark:border-brand-400"></div> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-500"></div>}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                    <CheckSquare size={18} className="text-slate-500 dark:text-slate-400" /> To-do List
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Track tasks, set deadlines, and check things off</p>
                </div>
              </button>

              <button 
                onClick={() => setType('pomodoro')}
                className={`flex items-start gap-4 p-3 rounded-lg w-full text-left transition-colors ${type === 'pomodoro' ? 'bg-slate-100 dark:bg-[#1A1A1E]' : 'hover:bg-slate-50 dark:hover:bg-[#1A1A1E]/50'}`}
              >
                <div className="mt-0.5 text-slate-500 dark:text-slate-400">
                  {type === 'pomodoro' ? <div className="w-5 h-5 rounded-full border-[5px] border-brand-500 dark:border-brand-400"></div> : <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-500"></div>}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                    <Timer size={18} className="text-slate-500 dark:text-slate-400" /> Pomodoro
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create a focus timer space for deep work</p>
                </div>
              </button>

            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Item Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                {type === 'note' && <FileText size={18} />}
                {type === 'todo' && <CheckSquare size={18} />}
                {type === 'pomodoro' && <Timer size={18} />}
              </span>
              <Input 
                placeholder="new-item" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="pl-10 bg-slate-50 dark:bg-[#1A1A1E] border-slate-200 dark:border-[#121214] dark:text-white dark:placeholder-slate-500 focus-visible:ring-brand-500 h-11 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                <Lock size={16} /> Private Item
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[280px]">
                Require authentication to open and view the contents of this item.
              </p>
            </div>
            
            <button 
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-10 h-6 rounded-full transition-colors relative flex items-center px-1 ${isPrivate ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isPrivate ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

        </div>
        
        <div className="bg-slate-50 dark:bg-[#1A1A1E] px-6 py-4 flex justify-end gap-3 mt-2 border-t border-slate-100 dark:border-[#121214]">
          <Button variant="ghost" onClick={() => setOpen(false)} className="dark:hover:bg-[#222327] dark:text-slate-300">
            Cancel
          </Button>
          <Button onClick={handleCreate} className="bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white dark:bg-brand-500 dark:hover:bg-brand-600 transition-colors">
            Create Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}