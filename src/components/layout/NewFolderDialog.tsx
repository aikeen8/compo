import { useState } from "react"
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
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-[#1A1A1E] dark:text-slate-400 dark:hover:bg-[#222327] dark:hover:text-slate-300 transition-colors duration-200"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-[92vw] max-w-md bg-white dark:bg-[#222327] border border-slate-200 dark:border-[#121214] rounded-[24px] p-6 shadow-2xl transition-colors" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">New Folder</h3>
            <div className="py-4 flex flex-col gap-5">
              <input
                placeholder="Folder name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="w-full h-11 px-3 bg-slate-50 dark:bg-[#1A1A1E] border border-slate-200 dark:border-[#121214] rounded-xl dark:text-white dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              />
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-8 h-8 rounded-full ${color.bg} transition-all ${selectedColor === color.id ? 'ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-[#222327] scale-110 shadow-md' : 'hover:scale-110'}`}
                  />
                ))}
              </div>
            </div>
            <button onClick={handleCreate} className="w-full h-11 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-900 dark:text-white font-medium transition-colors">
              Create
            </button>
          </div>
        </div>
      )}
    </>
  )
}