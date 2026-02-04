import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleResetPassword}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-white text-2xl mb-6 font-bold">
          Reset Password
        </h2>

        {error && <p className="text-red-400 mb-4">{error}</p>}
        {message && <p className="text-green-400 mb-4">{message}</p>}

        <input
          className="w-full p-2 mb-4 rounded"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Update Password
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
