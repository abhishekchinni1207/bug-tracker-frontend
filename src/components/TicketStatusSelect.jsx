const TicketStatusSelect = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-700 text-white text-sm px-2 py-1 rounded"
    >
      <option value="todo">To Do</option>
      <option value="in_progress">In Progress</option>
      <option value="done">Done</option>
    </select>
  )
}

export default TicketStatusSelect
