import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'


import { getProjectById } from '../services/projectService'
import {
  updateTicketStatus,
  deleteTicket,
  getFilteredTickets,
  updateTicket,
} from '../services/ticketService'

import DashboardLayout from '../layouts/DashboardLayout'
import { useProject } from '../context/ProjectContext'

import TicketStatusSelect from '../components/TicketStatusSelect'
import TicketComments from '../components/TicketComments'
import EditTicketModal from '../components/EditTicketModal'

const ProjectDetails = () => {
  const { projectId } = useParams()
  const { setCurrentProject, myRole, loadingRole } = useProject()

  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  const [editingTicket, setEditingTicket] = useState(null)

  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
  })

  /* =========================
     Load project + tickets
     ========================= */
  useEffect(() => {
    const loadProjectData = async () => {
      setLoading(true)
      try {
        const project = await getProjectById(projectId)
        if (!project?.id) {
          throw new Error('project not accessible')
        }
        setCurrentProject(project)

        const data = await getFilteredTickets(projectId, filters)
        setTickets(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProjectData()
  }, [projectId, filters, setCurrentProject])

  /* =========================
     Role-based permission
     ========================= */
  const canModify = myRole === 'owner'

  if (!projectId) {
  return (
    <DashboardLayout>
      <div className="p-8 text-red-400">
        Invalid project
      </div>
    </DashboardLayout>
  )
}


  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-900 p-8 text-white">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tickets</h1>

          <div className="flex gap-3">
            <Link
              to={`/projects/${projectId}/create-ticket`}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              + New Ticket
            </Link>

            <Link
              to={`/projects/${projectId}/kanban`}
              className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
            >
              Kanban Board
            </Link>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="text"
            placeholder="Search tickets..."
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 w-64"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <p className="text-slate-400">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-slate-400 italic">
            No tickets match your filters
          </p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-slate-800 p-4 rounded">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">{ticket.title}</h2>

                  <TicketStatusSelect
                    value={ticket.status}
                    onChange={async (newStatus) => {
                      await updateTicketStatus(ticket.id, newStatus)
                      setTickets((prev) =>
                        prev.map((t) =>
                          t.id === ticket.id
                            ? { ...t, status: newStatus }
                            : t
                        )
                      )
                    }}
                  />
                </div>

                <p className="text-gray-400 mt-1">
                  {ticket.description}
                </p>

                <div className="mt-3 text-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Status: {ticket.status}</span>

                    {!loadingRole && canModify && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setEditingTicket(ticket)}
                          className="text-indigo-400 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          disabled={actionLoading === ticket.id}
                          onClick={async () => {
                            const confirmed =
                              window.confirm('Delete this ticket?')
                            if (!confirmed) return

                            setActionLoading(ticket.id)
                            await deleteTicket(ticket.id)
                            setTickets((prev) =>
                              prev.filter((t) => t.id !== ticket.id)
                            )
                            setActionLoading(null)
                          }}
                          className="text-red-400 hover:underline disabled:opacity-50"
                        >
                          {actionLoading === ticket.id
                            ? 'Deleting...'
                            : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-slate-400">
                    <span>Priority: {ticket.priority}</span>
                    <span>
                      Assigned:{' '}
                      {ticket.assigned_to || 'Unassigned'}
                    </span>
                    <span>
                      Created:{' '}
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <TicketComments ticketId={ticket.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editingTicket && (
        <EditTicketModal
          ticket={editingTicket}
          onClose={() => setEditingTicket(null)}
          onSave={async (updates) => {
            await updateTicket(editingTicket.id, updates)
            setTickets((prev) =>
              prev.map((t) =>
                t.id === editingTicket.id
                  ? { ...t, ...updates }
                  : t
              )
            )
            setEditingTicket(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}


export default ProjectDetails
