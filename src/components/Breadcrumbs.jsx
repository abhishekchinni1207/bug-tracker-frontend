import { useLocation, Link } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'

const format = (text) =>
  text
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

const Breadcrumbs = () => {
  const location = useLocation()
  const parts = location.pathname.split('/').filter(Boolean)
  const { currentProject } = useProject()

  return (
    <nav className="text-sm text-slate-400">
      <Link to="/dashboard" className="hover:underline">
        Home
      </Link>

      {parts.map((part, index) => {
        const isProjectId =
          parts[index - 1] === 'projects' && currentProject

        const label = isProjectId
          ? currentProject.name
          : format(part)

        const path =
          '/' + parts.slice(0, index + 1).join('/')

        return (
          <span key={path}>
            {' / '}
            <Link to={path} className="hover:underline">
              {label}
            </Link>
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumbs
