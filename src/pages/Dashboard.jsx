import { useEffect, useState } from 'react'
import { getMyProjects } from '../services/projectService'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

const Dashboard = () => {
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout>
    <div className="min-h-screen max-w-3xl bg-slate-900 p-8 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Link
          to="/create-project"
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          + New Project
        </Link>
      </div>

      {error && (
  <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
    {error}
  </div>
)}

      {loading ? (
        <p className='text-slate-400'>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-slate-400 italic">No projects yet. Click "New Project" to get Started</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
  <Link
    key={project.id}
    to={`/projects/${project.id}`}
    className="block bg-slate-800 p-4 rounded hover:bg-slate-700 transition"
  >
    <h2 className="text-lg font-semibold">
      {project.name}
    </h2>
    <p className="text-gray-400">
      {project.description}
    </p>
  </Link>
))}


        </div>
      )}
    </div>
    </DashboardLayout>
  )
}

export default Dashboard

