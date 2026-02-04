import {
  DndContext,
  closestCorners,
} from '@dnd-kit/core'

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import KanbanColumn from '../components/KanbanColumn'
import { STATUS_ORDER, TICKET_STATUS } from '../constants/ticketStatus'
import { getTicketsByProject, updateTicketStatus } from '../services/ticketService'

const KanbanBoard = () => {
  const { projectId } = useParams()
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    getTicketsByProject(projectId).then(setTickets)
  }, [projectId])

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return

    const activeTicket = tickets.find((t) => t.id === active.id)
    const newStatus = over.id

    if (activeTicket.status === newStatus) return

    // Update DB
    await updateTicketStatus(active.id, newStatus)

    // Update UI
    setTickets((prev) =>
      prev.map((t) =>
        t.id === active.id
          ? { ...t, status: newStatus }
          : t
      )
    )
  }

  return (
    <DashboardLayout>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATUS_ORDER.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              title={TICKET_STATUS[status]}
              tickets={tickets.filter(
                (t) => t.status === status
              )}
            />
          ))}
        </div>
      </DndContext>
    </DashboardLayout>
  )
}

export default KanbanBoard
