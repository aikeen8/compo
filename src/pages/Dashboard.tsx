import { SidebarLeft } from "../components/layout/SidebarLeft"

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-white font-sans">
      <SidebarLeft />
      
      {/* we will add the second sidebar and main content here later */}
      <main className="flex-1 bg-slate-50">
      </main>
    </div>
  )
}