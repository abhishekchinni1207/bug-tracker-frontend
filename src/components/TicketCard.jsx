import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TicketCard = ({ ticket }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: ticket.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-slate-700 p-3 rounded cursor-grab active:cursor-grabbing hover:bg-slate-600 transition"

    >
      <h3 className="font-medium">{ticket.title}</h3>
      <p className="text-xs text-slate-300">
        Priority: {ticket.priority}
      </p>
    </div>
  )
}

export default TicketCard
