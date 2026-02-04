import { useEffect, useState } from 'react'
import { getMyProjects } from '../services/projectService'
import { useNavigate} from 'react-router-dom'
import {useProject} from '../context/ProjectContext.jsx'

const ProjectSelector = () => {
  const [projects, setProjects] = useState([])
  const navigate = useNavigate()
  const { currentProject, setCurrentProject } = useProject()
  useEffect(() => {
    getMyProjects().then(setProjects)
  }, [])

  return (
    <select
    disabled={projects.length === 0}
      className="bg-slate-800 text-white text-sm px-2 py-1 rounded disabled: opacity-50"
      value={currentProject?.id || ''}
      onChange={(e) => {
        const selected = projects.find(p => p.id === e.target.value)
        if (selected) {
          setCurrentProject(selected)
          navigate(`/projects/${selected.id}`)
        }
      }}
    >
      <option value="" disabled>Switch Project</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  )
}

export default ProjectSelector
