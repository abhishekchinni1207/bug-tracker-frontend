import { useEffect, useState, useCallback } from 'react'
import {
  getCommentsByTicket,
  addComment,
} from '../services/commentService'
import { deleteComment } from '../services/commentService'
import { supabase } from '../lib/supabase'

const TicketComments = ({ ticketId }) => {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUserId(data.user?.id)
  })
}, [])


  // ✅ Stable function
  const loadComments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getCommentsByTicket(ticketId)
      setComments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  // ✅ useEffect uses it
  useEffect(() => {
    loadComments()
  }, [loadComments])

  // ✅ handleSubmit uses it
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    try {
      await addComment(ticketId, content)
      setContent('')
      loadComments()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mt-6 bg-slate-800 p-4 rounded">
      <h3 className="font-semibold mb-3">Comments</h3>

      {error && (
        <div className="text-red-400 text-sm mb-2">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-slate-400 italic">
          No comments yet
        </p>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.map((comment) => (
  <div
    key={comment.id}
    className="bg-slate-900 border border-slate-700 rounded p-3"
  >
    <div className="flex justify-between items-center mb-1">
      <p className="text-sm text-slate-300">
        {comment.profiles?.email ?? 'Unknown'}
      </p>

      {comment.user_id === userId && (
        <button
          onClick={async () => {
            await deleteComment(comment.id)
            loadComments()
          }}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Delete
        </button>
      )}
    </div>

    <p className="text-slate-200">{comment.content}</p>

    <p className="text-xs text-slate-500 mt-1">
      {new Date(comment.created_at).toLocaleString()}
    </p>
  </div>
))}

    
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-slate-900 text-white p-2 rounded mb-2"
          placeholder="Explain or discuss this issue..."
        />
        <button
          type="submit"
          className="bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
        >
          Add Comment
        </button>
      </form>
    </div>
  )
}

export default TicketComments
