import { useEffect, useState } from 'react'
import { ProjectContext } from './ProjectContext'
import { supabase } from '../lib/supabase'

const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null)
  const [myRole, setMyRole] = useState(null)
  const [loadingRole, setLoadingRole] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadMyProjectRole = async () => {
      if (!currentProject?.id) {
        setMyRole(null)
        return
      }

      setLoadingRole(true)

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user || !isMounted) return

        const { data, error } = await supabase
          .schema('bug_tracker')
          .from('project_members')
          .select('role')
          .eq('project_id', currentProject.id)
          .eq('user_id', user.id)
          .single()

        if (!isMounted) return

        if (!error && data) {
          setMyRole(data.role)
        } else {
          setMyRole(null)
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Role load aborted (safe):', err.message)
          setMyRole(null)
        }
      } finally {
        if (isMounted) setLoadingRole(false)
      }
    }

    loadMyProjectRole()

    return () => {
      isMounted = false
    }
  }, [currentProject])

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        myRole,
        loadingRole,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectProvider
