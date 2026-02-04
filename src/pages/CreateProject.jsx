import { useState } from 'react'
import { createProject } from '../services/projectService'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

const CreateProject = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await createProject({ name, description })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Create Project</h1>

     {error && (
  <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
    {error}
  </div>
)}

      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          className="w-full p-2 mb-4 rounded dark:text-black"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 mb-4 rounded dark:text-black"
          placeholder="Project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">
          Create
        </button>
      </form>
    </div>
    </DashboardLayout>
  )
}

export default CreateProject
