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
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors mb-6">
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border-0 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-800 font-semibold text-base mb-2">New Folder</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-5">
          <Input
            placeholder="Folder name"
            className="rounded-xl border-slate-200 h-11 text-sm focus-visible:ring-indigo-500 focus-visible:ring-offset-0"
          />
          
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full ${color} transition-all ${
                  selectedColor === color ? "ring-2 ring-offset-2 ring-indigo-500 scale-110" : "hover:scale-110"
                }`}
              />
            ))}
          </div>
          
          <Button className="w-full h-11 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium mt-2 shadow-none">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}