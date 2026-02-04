import { useState } from 'react'
import { createTicket } from '../services/ticketService'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'

const CreateTicket = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await createTicket({
        projectId,
        title,
        description,
        priority,
      })
      navigate(`/projects/${projectId}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Create Ticket</h1>

      {error && (
  <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
    {error}
  </div>
)}


      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          className="w-full p-2 mb-4 rounded dark:text-black"
          placeholder="Ticket title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 mb-4 rounded dark:text-black"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="w-full p-2 mb-4 rounded text-black"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700">
          Create Ticket
        </button>
      </form>
    </div>
    </DashboardLayout>
  )
}

export default CreateTicket
