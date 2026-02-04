import { supabase } from '../lib/supabase'

export const createProject = async ({ name, description }) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .schema('bug_tracker')
    .from('projects')
    .insert([
      {
        name,
        description,
        created_by: user.id,
      },
    ])

  if (error) {
    throw new Error(error.message)
  }
}

export const getMyProjects = async () => {
  const { data, error } = await supabase
    .schema('bug_tracker')
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const getProjectById = async (projectId) => {
  const { data, error } = await supabase
    .schema('bug_tracker')
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()
    
  if (!data) {
    throw new Error('Project not accessible')
  }
  if (error) throw new Error(error.message)
  return data
}

// projectService.js
export const addProjectMember = async (projectId, email) => {
  // 1. find user via profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (profileError || !profile) {
    throw new Error('User not found')
  }

  // 2. insert member
  const { error } = await supabase
    .schema('bug_tracker')
    .from('project_members')
    .insert({
      project_id: projectId,
      user_id: profile.id,
      role: 'member',
    })

  if (error) throw new Error(error.message)
}
