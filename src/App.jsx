import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateProject from './pages/CreateProject'
import CreateTicket from './pages/CreateTicket'
import ResetPassword from './pages/ResetPassword'
import ProjectDetails from './pages/ProjectDetails'
import KanbanBoard from './pages/KanbanBoard'
import ProjectMembers from './pages/ProjectMembers'
import { useAuth } from './hooks/useAuth'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject />
            </ProtectedRoute>
          }
        />
        <Route path="/projects/:projectId" 
        element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        } 
        />

        <Route
          path="/projects/:projectId/create-ticket"
          element={
            <ProtectedRoute>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId/kanban"
          element={
            <ProtectedRoute>
              <KanbanBoard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/projects/:projectId/members"
  element={<ProjectMembers />}
/>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    
  )
}

export default App
