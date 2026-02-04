import { createContext, useContext } from 'react'

export const ProjectContext = createContext(null)

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}
