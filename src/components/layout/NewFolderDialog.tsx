import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const colors = [
  "bg-indigo-500", "bg-purple-500", "bg-pink-500", "bg-rose-500",
  "bg-orange-500", "bg-amber-400", "bg-emerald-500", "bg-cyan-500",
  "bg-blue-500", "bg-slate-500"
]

export function NewFolderDialog() {
  const [selectedColor, setSelectedColor] = useState(colors[0])

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* added dark mode classes to the plus button here */}
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors">
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </DialogTrigger>
      
      {/* added dark:bg-slate-800 to fix the pitch black background */}
      <DialogContent className="sm:max-w-md dark:bg-slate-800 dark:text-slate-100 border-0 dark:border-slate-700 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-slate-100">New Folder</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 flex flex-col gap-5">
          <Input 
            placeholder="Folder name" 
            className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 dark:text-white dark:placeholder-slate-500 focus-visible:ring-brand-500 h-11"
          />
          
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full ${color} transition-all ${
                  selectedColor === color 
                    ? 'ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-slate-800 scale-110 shadow-md' 
                    : 'hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
        
        <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-500 dark:hover:bg-brand-600 h-11 rounded-xl">
          Create
        </Button>
      </DialogContent>
    </Dialog>
  )
}