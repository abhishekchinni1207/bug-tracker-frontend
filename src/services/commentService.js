import { supabase } from '../lib/supabase'

export const getCommentsByTicket = async (ticketId) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles!comments_user_id_fkey (
        email
      )
    `)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export const addComment = async (ticketId, content) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase.from('comments').insert({
    ticket_id: ticketId,
    user_id: user.id,
    content,
  })

  if (error) throw new Error(error.message)
}

export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw new Error(error.message)
}
