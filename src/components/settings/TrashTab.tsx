import { useState, useEffect, useCallback } from "react"
import { supabase } from "../../lib/supabase"
import { Loader2, RotateCcw, Trash2, FileText, Folder, List } from "lucide-react"

type TrashItem = {
  id: string;
  name: string;
}

export function TrashTab() {
  const [deletedItems, setDeletedItems] = useState<TrashItem[]>([])
  const [deletedCategories, setDeletedCategories] = useState<TrashItem[]>([])
  const [deletedFolders, setDeletedFolders] = useState<TrashItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTrash = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [foldersRes, categoriesRes, itemsRes] = await Promise.all([
      supabase.from('folders').select('*').eq('user_id', user.id).eq('is_deleted', true),
      supabase.from('categories').select('*').eq('user_id', user.id).eq('is_deleted', true),
      supabase.from('items').select('*').eq('user_id', user.id).eq('is_deleted', true)
    ])

    setDeletedFolders(foldersRes.data || [])
    setDeletedCategories(categoriesRes.data || [])
    setDeletedItems(itemsRes.data || [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchTrash() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchTrash])

  const handleRestoreFolder = async (id: string) => {
    await supabase.from('folders').update({ is_deleted: false }).eq('id', id)
    fetchTrash()
    window.location.reload()
  }

  const handleRestoreCategory = async (id: string) => {
    await supabase.from('categories').update({ is_deleted: false }).eq('id', id)
    fetchTrash()
    window.location.reload()
  }

  const handleRestoreItem = async (id: string) => {
    await supabase.from('items').update({ is_deleted: false }).eq('id', id)
    fetchTrash()
    window.location.reload()
  }

  const handlePermanentDeleteFolder = async (id: string) => {
    setIsLoading(true)
    const { data: categories } = await supabase.from('categories').select('id').eq('folder_id', id)
    if (categories && categories.length > 0) {
      const categoryIds = categories.map(c => c.id)
      await supabase.from('items').delete().in('category_id', categoryIds)
      await supabase.from('categories').delete().in('id', categoryIds)
    }
    await supabase.from('folders').delete().eq('id', id)
    fetchTrash()
  }

  const handlePermanentDeleteCategory = async (id: string) => {
    setIsLoading(true)
    await supabase.from('items').delete().eq('category_id', id)
    await supabase.from('categories').delete().eq('id', id)
    fetchTrash()
  }

  const handlePermanentDeleteItem = async (id: string) => {
    setIsLoading(true)
    await supabase.from('items').delete().eq('id', id)
    fetchTrash()
  }

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-400" /></div>
  }

  const isEmpty = deletedFolders.length === 0 && deletedCategories.length === 0 && deletedItems.length === 0

  return (
    <div className="max-w-xl pr-2">
      <h3 className="text-xl font-semibold mb-6 dark:text-white">Trash Bin</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
        Items here will be permanently deleted after 30 days. You can restore them or delete them immediately.
      </p>

      {isEmpty ? (
        <div className="text-center py-10 bg-slate-50 dark:bg-[#1A1A1E] rounded-2xl border border-dashed border-slate-200 dark:border-[#222327]">
          <p className="text-slate-400 dark:text-slate-500 text-sm">Your trash is empty.</p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {deletedFolders.map(folder => (
            <div key={folder.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1E] rounded-xl border border-slate-100 dark:border-[#222327]">
              <div className="flex items-center gap-3">
                <Folder className="text-slate-400" size={20} />
                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{folder.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRestoreFolder(folder.id)} className="p-2 text-slate-400 hover:text-brand-500 bg-white dark:bg-[#222327] rounded-lg shadow-sm transition-colors border border-slate-100 dark:border-[#121214]" title="Restore">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => handlePermanentDeleteFolder(folder.id)} className="p-2 text-slate-400 hover:text-rose-500 bg-white dark:bg-[#222327] rounded-lg shadow-sm transition-colors border border-slate-100 dark:border-[#121214]" title="Permanently Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {deletedCategories.map(category => (
            <div key={category.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1E] rounded-xl border border-slate-100 dark:border-[#222327]">
              <div className="flex items-center gap-3">
                <List className="text-slate-400" size={20} />
                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{category.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRestoreCategory(category.id)} className="p-2 text-slate-400 hover:text-brand-500 bg-white dark:bg-[#222327] rounded-lg shadow-sm transition-colors border border-slate-100 dark:border-[#121214]" title="Restore">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => handlePermanentDeleteCategory(category.id)} className="p-2 text-slate-400 hover:text-rose-500 bg-white dark:bg-[#222327] rounded-lg shadow-sm transition-colors border border-slate-100 dark:border-[#121214]" title="Permanently Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {deletedItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1A1A1E] rounded-xl border border-slate-100 dark:border-[#222327]">
              <div className="flex items-center gap-3">
                <FileText className="text-slate-400" size={20} />
                <span className="font-medium text-slate-700 dark:text-slate-200 text-sm">{item.name}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleRestoreItem(item.id)} className="p-2 text-slate-400 hover:text-brand-500 bg-white dark:bg-[#222327] rounded-lg shadow-sm transition-colors border border-slate-100 dark:border-[#121214]" title="Restore">
                  <RotateCcw size={16} />
                </button>
                <button onClick={() => handlePermanentDeleteItem(item.id)} className="p-2 text-slate-400 hover:text-rose-500 bg-white dark:bg-[#222327] rounded-lg shadow-sm transition-colors border border-slate-100 dark:border-[#121214]" title="Permanently Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}