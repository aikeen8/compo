import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const colorOptions = [
  { id: "indigo", bg: "bg-indigo-500" },
  { id: "purple", bg: "bg-purple-500" },
  { id: "pink", bg: "bg-pink-500" },
  { id: "rose", bg: "bg-rose-500" },
  { id: "orange", bg: "bg-orange-500" },
  { id: "amber", bg: "bg-amber-400" },
  { id: "emerald", bg: "bg-emerald-500" },
  { id: "cyan", bg: "bg-cyan-500" },
  { id: "blue", bg: "bg-blue-500" },
  { id: "slate", bg: "bg-slate-500" }
]

interface NewFolderDialogProps {
  onAddFolder: (name: string, color: string) => void;
}

export function NewFolderDialog({ onAddFolder }: NewFolderDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].id)

  const handleCreate = () => {
    if (!name.trim()) return;
    onAddFolder(name.trim(), selectedColor)
    
    setName("")
    setSelectedColor(colorOptions[0].id)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-[#1A1A1E] dark:text-slate-400 dark:hover:bg-[#222327] dark:hover:text-slate-300 transition-colors duration-200">
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md dark:bg-[#222327] dark:text-slate-100 border-0 dark:border-[#121214] rounded-2xl shadow-xl transition-colors">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-slate-100">New Folder</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 flex flex-col gap-5">
          <Input 
            placeholder="Folder name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="bg-slate-50 dark:bg-[#1A1A1E] border-slate-200 dark:border-[#121214] dark:text-white dark:placeholder-slate-500 focus-visible:ring-brand-500 h-11 transition-colors"
          />
          
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`w-8 h-8 rounded-full ${color.bg} transition-all ${
                  selectedColor === color.id 
                    ? 'ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-[#222327] scale-110 shadow-md' 
                    : 'hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
        
        <Button 
          onClick={handleCreate}
          className="w-full bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white dark:bg-brand-500 dark:hover:bg-brand-600 h-11 rounded-xl transition-colors"
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  )
}