import { useState } from "react"
import { SidebarLeft } from "../components/layout/SidebarLeft"
import { SidebarInner } from "../components/layout/SidebarInner"
import { MainContent } from "../components/layout/MainContent"

export type ItemType = {
  id: string;
  name: string;
  type: 'note' | 'todo' | 'pomodoro';
  isPrivate: boolean;
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
  isPrivate: boolean; // added privacy state
  categories: CategoryType[];
}

export default function Dashboard() {
  const [folders, setFolders] = useState<FolderType[]>([])
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null)
  const [activeItemId, setActiveItemId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleFolderClick = (id: string) => {
    if (activeFolderId === id) {
      setIsSidebarOpen(!isSidebarOpen)
    } else {
      setActiveFolderId(id)
      setIsSidebarOpen(true)
    }
  }

  const handleAddFolder = (name: string, color: string) => {
    const defaultCategory: CategoryType = {
      id: Date.now().toString() + '-cat',
      name: 'MAIN',
      items: [
        { id: Date.now().toString() + '-i1', name: 'notes', type: 'note', isPrivate: false },
        { id: Date.now().toString() + '-i2', name: 'to-do-list', type: 'todo', isPrivate: false },
        { id: Date.now().toString() + '-i3', name: 'pomodoro', type: 'pomodoro', isPrivate: false },
      ]
    }

    const newFolder: FolderType = { 
      id: Date.now().toString(), 
      name, 
      color,
      isPrivate: false,
      categories: [defaultCategory]
    }
    
    setFolders([...folders, newFolder])
    setActiveFolderId(newFolder.id)
    setIsSidebarOpen(true)
  }

  // new handlers for the dropdown menu
  const handleRenameFolder = (folderId: string, newName: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId ? { ...folder, name: newName } : folder
    ))
  }

  const handleUpdateFolderPrivacy = (folderId: string, isPrivate: boolean) => {
    setFolders(folders.map(folder => 
      folder.id === folderId ? { ...folder, isPrivate } : folder
    ))
  }

  const handleAddCategory = (folderId: string, categoryName: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          categories: [...folder.categories, { id: Date.now().toString(), name: categoryName, items: [] }]
        }
      }
      return folder;
    }))
  }

  const handleDeleteCategory = (folderId: string, categoryId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return { ...folder, categories: folder.categories.filter(c => c.id !== categoryId) }
      }
      return folder;
    }))
  }

  const handleAddItem = (folderId: string, categoryId: string, name: string, type: 'note' | 'todo' | 'pomodoro', isPrivate: boolean) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          categories: folder.categories.map(cat => {
            if (cat.id === categoryId) {
              return { ...cat, items: [...cat.items, { id: Date.now().toString(), name, type, isPrivate }] }
            }
            return cat;
          })
        }
      }
      return folder;
    }))
  }

  const handleDeleteItem = (folderId: string, categoryId: string, itemId: string) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          categories: folder.categories.map(cat => {
            if (cat.id === categoryId) {
              return { ...cat, items: cat.items.filter(item => item.id !== itemId) }
            }
            return cat;
          })
        }
      }
      return folder;
    }))
  }

  const activeFolder = folders.find(f => f.id === activeFolderId)

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#222327] font-sans overflow-hidden">
      <SidebarLeft 
        folders={folders}
        activeFolderId={activeFolderId}
        isSidebarOpen={isSidebarOpen}
        onFolderClick={handleFolderClick} 
        onAddFolder={handleAddFolder}
      />
      
      <SidebarInner 
        isOpen={isSidebarOpen && activeFolderId !== null} 
        folder={activeFolder}
        activeItemId={activeItemId}
        onSelectItem={setActiveItemId}
        onRenameFolder={handleRenameFolder}
        onUpdateFolderPrivacy={handleUpdateFolderPrivacy}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddItem={handleAddItem}
        onDeleteItem={handleDeleteItem}
      />
      
      <MainContent />
    </div>
  )
}