import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
