import { supabase } from '../lib/supabase'

export const createTicket = async ({
  projectId,
  title,
  description,
  priority,
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .schema('bug_tracker')
    .from('tickets')
    .insert([
      {
        project_id: projectId,
        title,
        description,
        priority,
        status: 'todo',
        created_by: user.id,
      },
    ])

  if (error) throw new Error(error.message)
}

export const getTicketsByProject = async (projectId) => {
  const { data, error } = await supabase
    .schema('bug_tracker')
    .from('tickets')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export const updateTicketStatus = async (ticketId, status) => {
  const { error } = await supabase
    .schema('bug_tracker')
    .from('tickets')
    .update({ status })
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
}

export const updateTicket = async (ticketId, updates) => {
  const { error } = await supabase
    .schema('bug_tracker')
    .from('tickets')
    .update(updates)
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
}

export const deleteTicket = async (ticketId) => {
  const { error } = await supabase
    .schema('bug_tracker')
    .from('tickets')
    .delete()
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
}


export const assignTicketToMe = async (ticketId, userId) => {
  const { error } = await supabase
    .schema('bug_tracker')
    .from('tickets')
    .update({ assigned_to: userId })
    .eq('id', ticketId)

  if (error) throw new Error(error.message)
}


export const getFilteredTickets = async (
  projectId,
  { status, priority, search }
) => {
  let query = supabase
    .schema('bug_tracker')
    .from('tickets')
    .select('*')
    .eq('project_id', projectId)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (priority && priority !== 'all') {
    query = query.eq('priority', priority)
  }

  if (search && search.trim() !== '') {
    query = query.ilike('title', `%${search}%`)
  }

  const { data, error } = await query.order('created_at', {
    ascending: false,
  })

  if (error) throw new Error(error.message)
  return data
}


