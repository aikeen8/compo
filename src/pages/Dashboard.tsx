import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { User } from "@supabase/supabase-js"
import { SidebarLeft } from "../components/layout/SidebarLeft"
import { SidebarInner } from "../components/layout/SidebarInner"
import { MainContent } from "../components/layout/MainContent"
import { Loader2 } from "lucide-react"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"

export type ItemType = {
  id: string;
  name: string;
  type: 'note' | 'todo' | 'pomodoro';
  isPrivate: boolean;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type CategoryType = {
  id: string;
  name: string;
  items: ItemType[];
}

export type FolderType = {
  id: string;
  name: string;
  color: string;
  isPrivate: boolean;
  categories: CategoryType[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [folders, setFolders] = useState<FolderType[]>([])
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const fetchWorkspace = useCallback(async (userId: string) => {
    let [foldersRes, categoriesRes, itemsRes] = await Promise.all([
      supabase.from('folders').select('*').eq('user_id', userId).neq('is_deleted', true).order('position', { ascending: true }).order('created_at', { ascending: true }),
      supabase.from('categories').select('*').eq('user_id', userId).neq('is_deleted', true).order('position', { ascending: true }).order('created_at', { ascending: true }),
      supabase.from('items').select('*').eq('user_id', userId).neq('is_deleted', true).order('position', { ascending: true }).order('created_at', { ascending: true })
    ])

    if (foldersRes.error || categoriesRes.error || itemsRes.error) {
      console.error("Error fetching workspace data")
      return
    }

    if (foldersRes.data.length === 0) {
      const { data: fData } = await supabase.from('folders')
        .insert({ user_id: userId, name: 'Welcome', color: 'indigo', is_private: false })
        .select().single()
      
      const { data: cData } = await supabase.from('categories')
        .insert({ user_id: userId, folder_id: fData.id, name: 'Getting Started' })
        .select().single()

      const guideHTML = `<h2>welcome to compo! 🎉</h2>` 

      await supabase.from('items').insert([
        { user_id: userId, category_id: cData.id, name: 'how to use compo', type: 'note', title: 'Welcome to compo', content: guideHTML },
        { user_id: userId, category_id: cData.id, name: 'my tasks', type: 'todo' },
        { user_id: userId, category_id: cData.id, name: 'focus timer', type: 'pomodoro' }
      ])

      const newFetch = await Promise.all([
        supabase.from('folders').select('*').eq('user_id', userId).neq('is_deleted', true).order('position', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('categories').select('*').eq('user_id', userId).neq('is_deleted', true).order('position', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('items').select('*').eq('user_id', userId).neq('is_deleted', true).order('position', { ascending: true }).order('created_at', { ascending: true })
      ])
      
      foldersRes = newFetch[0]
      categoriesRes = newFetch[1]
      itemsRes = newFetch[2]
    }

    const safeFolders = foldersRes.data || []
    const safeCategories = categoriesRes.data || []
    const safeItems = itemsRes.data || []

    const formattedFolders: FolderType[] = safeFolders.map(f => {
      const fCats = safeCategories.filter(c => c.folder_id === f.id)
      const categories: CategoryType[] = fCats.map(c => {
        const cItems = safeItems.filter(i => i.category_id === c.id)
        const items: ItemType[] = cItems.map(i => ({
          id: i.id,
          name: i.name,
          type: i.type as 'note' | 'todo' | 'pomodoro',
          isPrivate: i.is_private,
          title: i.title || '',
          content: i.content || '',
          createdAt: new Date(i.created_at).getTime(),
          updatedAt: new Date(i.updated_at).getTime()
        }))
        return { id: c.id, name: c.name, items }
      })
      return {
        id: f.id,
        name: f.name,
        color: f.color,
        isPrivate: f.is_private,
        categories
      }
    })

    setFolders(formattedFolders)
    
    if (formattedFolders.length > 0 && !activeFolderId) {
      setActiveFolderId(formattedFolders[0].id)
      setIsSidebarOpen(true)
    }
  }, [activeFolderId])

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        navigate('/login')
        return
      }

      setUser(session.user)
      await fetchWorkspace(session.user.id)
      setIsLoading(false)
    }

    checkUserAndFetchData()
  }, [navigate, fetchWorkspace])

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'FOLDER') {
      const newFolders = Array.from(folders);
      const [movedFolder] = newFolders.splice(source.index, 1);
      newFolders.splice(destination.index, 0, movedFolder);

      const updatedFolders = newFolders.map((f, index) => ({ ...f, position: index }));
      setFolders(updatedFolders);

      updatedFolders.forEach((f) => {
        supabase.from('folders').update({ position: f.position }).eq('id', f.id).then();
      });
    }

    if (type === 'CATEGORY') {
      const newFolders = [...folders];
      const folderIndex = newFolders.findIndex(f => `folder-${f.id}` === destination.droppableId);
      if (folderIndex === -1) return;

      const newCategories = Array.from(newFolders[folderIndex].categories);
      const [movedCat] = newCategories.splice(source.index, 1);
      newCategories.splice(destination.index, 0, movedCat);

      newFolders[folderIndex].categories = newCategories;
      setFolders(newFolders);

      newCategories.forEach((cat, index) => {
        supabase.from('categories').update({ position: index }).eq('id', cat.id).then();
      });
    }

    if (type === 'ITEM') {
      const sourceCatId = source.droppableId.replace('category-', '');
      const destCatId = destination.droppableId.replace('category-', '');

      const newFolders = [...folders];
      const folderIndex = newFolders.findIndex(f => f.id === activeFolderId);
      if (folderIndex === -1) return;

      const sourceCatIndex = newFolders[folderIndex].categories.findIndex(c => c.id === sourceCatId);
      const destCatIndex = newFolders[folderIndex].categories.findIndex(c => c.id === destCatId);

      if (sourceCatIndex === -1 || destCatIndex === -1) return;

      const sourceItems = Array.from(newFolders[folderIndex].categories[sourceCatIndex].items);
      const destItems = sourceCatId === destCatId ? sourceItems : Array.from(newFolders[folderIndex].categories[destCatIndex].items);

      const [movedItem] = sourceItems.splice(source.index, 1);

      if (sourceCatId === destCatId) {
        sourceItems.splice(destination.index, 0, movedItem);
        newFolders[folderIndex].categories[sourceCatIndex].items = sourceItems;
        setFolders(newFolders);

        sourceItems.forEach((item, index) => {
          supabase.from('items').update({ position: index }).eq('id', item.id).then();
        });
      } else {
        destItems.splice(destination.index, 0, movedItem);
        newFolders[folderIndex].categories[sourceCatIndex].items = sourceItems;
        newFolders[folderIndex].categories[destCatIndex].items = destItems;
        setFolders(newFolders);

        supabase.from('items').update({ category_id: destCatId, position: destination.index }).eq('id', movedItem.id).then();

        sourceItems.forEach((item, index) => {
          supabase.from('items').update({ position: index }).eq('id', item.id).then();
        });
        destItems.forEach((item, index) => {
          supabase.from('items').update({ position: index }).eq('id', item.id).then();
        });
      }
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const handleFolderClick = (id: string) => {
    if (activeFolderId === id) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setActiveFolderId(id)
      setIsSidebarOpen(true)
    }
  }

  const handleAddFolder = async (name: string, color: string) => {
    if (!user) return

    const { data: fData, error: fErr } = await supabase.from('folders')
      .insert({ user_id: user.id, name, color, is_private: false })
      .select().single()
    if (fErr || !fData) return

    const { data: cData, error: cErr } = await supabase.from('categories')
      .insert({ user_id: user.id, folder_id: fData.id, name: 'MAIN' })
      .select().single()
    if (cErr || !cData) return

    const { data: iData, error: iErr } = await supabase.from('items')
      .insert([
        { user_id: user.id, category_id: cData.id, name: 'notes', type: 'note' },
        { user_id: user.id, category_id: cData.id, name: 'to-do-list', type: 'todo' },
        { user_id: user.id, category_id: cData.id, name: 'pomodoro', type: 'pomodoro' }
      ]).select()
    if (iErr || !iData) return

    await fetchWorkspace(user.id)
    setActiveFolderId(fData.id)
    setIsSidebarOpen(true)
  }

  const handleRenameFolder = async (folderId: string, newName: string) => {
    setFolders(folders.map(f => f.id === folderId ? { ...f, name: newName } : f))
    await supabase.from('folders').update({ name: newName }).eq('id', folderId)
  }

  const handleUpdateFolderPrivacy = async (folderId: string, isPrivate: boolean) => {
    setFolders(folders.map(f => f.id === folderId ? { ...f, isPrivate } : f))
    await supabase.from('folders').update({ is_private: isPrivate }).eq('id', folderId)
  }

  const handleDeleteFolder = async (folderId: string) => {
    setFolders(folders.filter(f => f.id !== folderId))
    if (activeFolderId === folderId) {
      setActiveFolderId(null)
      setActiveItemId(null)
      setIsSidebarOpen(false)
    }
    await supabase.from('folders').update({ is_deleted: true }).eq('id', folderId)
  }

  const handleAddCategory = async (folderId: string, categoryName: string) => {
    if (!user) return
    const { data, error } = await supabase.from('categories')
      .insert({ user_id: user.id, folder_id: folderId, name: categoryName })
      .select().single()
    
    if (error || !data) return
    
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, categories: [...folder.categories, { id: data.id, name: data.name, items: [] }] }
      }
      return folder
    }))
  }

  const handleDeleteCategory = async (folderId: string, categoryId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, categories: folder.categories.filter(c => c.id !== categoryId) }
      }
      return folder
    }))
    // Soft delete na ito para pumasok sa trash tab
    await supabase.from('categories').update({ is_deleted: true }).eq('id', categoryId)
  }

  const handleAddItem = async (folderId: string, categoryId: string, name: string, type: 'note' | 'todo' | 'pomodoro', isPrivate: boolean) => {
    if (!user) return
    const { data, error } = await supabase.from('items')
      .insert({ user_id: user.id, category_id: categoryId, name, type, is_private: isPrivate })
      .select().single()

    if (error || !data) return

    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          categories: folder.categories.map(cat => {
            if (cat.id === categoryId) {
              return { 
                ...cat, 
                items: [...cat.items, { 
                  id: data.id, 
                  name: data.name, 
                  type: data.type as 'note' | 'todo' | 'pomodoro', 
                  isPrivate: data.is_private, 
                  title: '', 
                  content: '', 
                  createdAt: new Date(data.created_at).getTime(), 
                  updatedAt: new Date(data.updated_at).getTime() 
                }] 
              }
            }
            return cat
          })
        }
      }
      return folder
    }))
  }

  const handleDeleteItem = async (folderId: string, categoryId: string, itemId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          categories: folder.categories.map(cat => {
            if (cat.id === categoryId) {
              return { ...cat, items: cat.items.filter(item => item.id !== itemId) }
            }
            return cat
          })
        }
      }
      return folder
    }))
    await supabase.from('items').update({ is_deleted: true }).eq('id', itemId)
  }

  const handleUpdateItemContent = async (itemId: string, title: string, content: string) => {
    const now = Date.now()
    
    setFolders(folders => folders.map(folder => ({
      ...folder,
      categories: folder.categories.map(cat => ({
        ...cat,
        items: cat.items.map(item => item.id === itemId ? { ...item, title, content, updatedAt: now } : item)
      }))
    })))

    await supabase.from('items')
      .update({ title, content, updated_at: new Date(now).toISOString() })
      .eq('id', itemId)
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#121214]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  const activeFolder = folders.find(f => f.id === activeFolderId)
  
  let activeItem: ItemType | null = null;
  if (activeFolder && activeItemId) {
    for (const cat of activeFolder.categories) {
      const found = cat.items.find(i => i.id === activeItemId);
      if (found) {
        activeItem = found;
        break;
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-full bg-white dark:bg-[#222327] font-sans overflow-hidden">
        <SidebarLeft 
          folders={folders}
          activeFolderId={activeFolderId}
          isSidebarOpen={isSidebarOpen}
          onFolderClick={handleFolderClick} 
          onAddFolder={handleAddFolder}
          onLogout={handleLogout}
        />
        
        <SidebarInner 
          isOpen={isSidebarOpen && activeFolderId !== null} 
          folder={activeFolder}
          activeItemId={activeItemId}
          onSelectItem={setActiveItemId}
          onRenameFolder={handleRenameFolder}
          onUpdateFolderPrivacy={handleUpdateFolderPrivacy}
          onDeleteFolder={handleDeleteFolder}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddItem={handleAddItem}
          onDeleteItem={handleDeleteItem}
        />
        
        <MainContent 
          activeItem={activeItem} 
          activeFolder={activeFolder}
          onUpdateItem={handleUpdateItemContent} 
        />
      </div>
    </DragDropContext>
  )
}