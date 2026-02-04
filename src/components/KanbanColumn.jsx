import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TicketCard from './TicketCard'

const KanbanColumn = ({title, tickets }) => {
  return (
    <div className="bg-slate-800 rounded p-4 w-full min-h-[300px]">
      <h2 className="font-semibold mb-4">{title}</h2>
      {tickets.length === 0 && (
  <p className="text-sm text-slate-500 italic">
    No tickets here
  </p>
)}


      <SortableContext
        items={tickets.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export default KanbanColumn
