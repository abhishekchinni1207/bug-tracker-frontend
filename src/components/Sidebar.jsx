import { Link, useLocation } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { useAuth } from '../hooks/useAuth'

const Sidebar = () => {
  const location = useLocation()
  const { currentProject, myRole } = useProject()
  const { logout } = useAuth()
  
  

  const isActive = (path) =>
    location.pathname.startsWith(path)


  return (
    <aside className="relative w-64 hidden md:flex flex-col border-r border-slate-700 p-4">
      <h1 className="text-xl font-bold mb-8">
        🐛 Bug Tracker
      </h1>

      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className={`block px-4 py-2 rounded ${
            isActive('/dashboard')
              ? 'bg-slate-700'
              : 'hover:bg-slate-800'
          }`}
        >
          Projects
        </Link>

        {currentProject?.id && (
          <>
            <Link
              to={`/projects/${currentProject.id}`}
              className={`block px-4 py-2 rounded ${
                isActive(`/projects/${currentProject.id}`)
                  ? 'bg-slate-700'
                  : 'hover:bg-slate-800'
              }`}
            >
              Tickets
            </Link>

            <Link
              to={`/projects/${currentProject.id}/kanban`}
              className={`block px-4 py-2 rounded ${
                isActive(
                  `/projects/${currentProject.id}/kanban`
                )
                  ? 'bg-slate-700'
                  : 'hover:bg-slate-800'
              }`}
            >
              Kanban
            </Link>

            {myRole === 'owner' && (
              <Link
                to={`/projects/${currentProject.id}/members`}
                className={`block px-4 py-2 rounded ${
                  isActive(
                    `/projects/${currentProject.id}/members`
                  )
                    ? 'bg-slate-700'
                    : 'hover:bg-slate-800'
                } text-indigo-400`}
              >
                Members
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Bottom-left logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="w-full rounded bg-red-600 px-4 py-2 hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
