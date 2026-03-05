import { useState } from "react"
import { SidebarLeft } from "../components/layout/SidebarLeft"
import { SidebarInner } from "../components/layout/SidebarInner"
import { MainContent } from "../components/layout/MainContent"

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleFolderClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      <SidebarLeft onFolderClick={handleFolderClick} />
      
      <SidebarInner folderName="aikeen's Folder" isOpen={isSidebarOpen} />
      
      <MainContent />
    </div>
  )
}