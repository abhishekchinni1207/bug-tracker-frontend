import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { supabase } from '../lib/supabase'
import { addProjectMember } from '../services/projectService'
import { useProject } from '../context/ProjectContext'

const ProjectMembers = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { myRole, loadingRole } = useProject()

  const [email, setEmail] = useState('')
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  /* =============================
     Redirect non-owners
     ============================= */
  useEffect(() => {
    if (!loadingRole && myRole && myRole !== 'owner') {
      navigate(`/projects/${projectId}`, { replace: true })
    }
  }, [myRole, loadingRole, navigate, projectId])

  /* =============================
     Load members (NO profiles join)
     ============================= */
  const loadMembers = useCallback(async () => {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .schema('bug_tracker')
      .from('project_members')
      .select('user_id, role')
      .eq('project_id', projectId)
      .order('role', { ascending: false }) // owner first

    if (error) {
      setError(error.message)
    } else {
      setMembers(data || [])
    }

    setLoading(false)
  }, [projectId])

  /* =============================
     Fetch members if owner
     ============================= */
  useEffect(() => {
    if (!loadingRole && myRole === 'owner') {
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadMembers()
    }
  }, [myRole, loadingRole, loadMembers])

  /* =============================
     Add member
     ============================= */
  const handleAddMember = async () => {
    setError('')
    setSuccess('')

    try {
      await addProjectMember(projectId, email)
      setSuccess('Member added successfully')
      setEmail('')
      loadMembers()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 text-white">
        <h1 className="text-2xl font-bold mb-4">Project Members</h1>

        {myRole === 'owner' && (
          <div className="flex gap-2 mb-4">
            <input
              type="email"
              placeholder="User email"
              className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleAddMember}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Member
            </button>
          </div>
        )}

        {error && <p className="text-red-400 mb-3">{error}</p>}
        {success && <p className="text-green-400 mb-3">{success}</p>}

        <h2 className="text-lg font-semibold mt-6 mb-2">Team Members</h2>

        {loading ? (
          <p className="text-slate-400">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-slate-400 italic">No members found</p>
        ) : (
          <ul className="space-y-2">
            {members.map((m) => (
              <li
                key={m.user_id}
                className="bg-slate-800 rounded px-4 py-2 flex justify-between"
              >
                <span className="text-slate-300">
                  User ID: {m.user_id}
                </span>
                <span className="text-slate-400">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ProjectMembers
