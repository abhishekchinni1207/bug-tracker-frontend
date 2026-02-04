import { useState } from 'react'

const EditTicketModal = ({ ticket, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
  })

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Edit Ticket</h2>

        <input
          className="w-full mb-3 bg-slate-800 p-2 rounded"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          className="w-full mb-3 bg-slate-800 p-2 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <select
          className="w-full mb-3 bg-slate-800 p-2 rounded"
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>low</option>
          <option>medium</option>
          <option>high</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-slate-400">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditTicketModal
