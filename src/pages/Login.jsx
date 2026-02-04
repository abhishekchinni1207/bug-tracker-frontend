import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link, } from 'react-router-dom'
import { ENV } from '../config/env'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setMessage('')

    if (!email) {
      setError('Please enter your email first')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${ENV.APP_URL}/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password reset link sent to your email')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-white text-2xl mb-6 font-bold">Login</h2>

        {error && (
  <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
    {error}
  </div>
)}

        {message && <p className="text-green-400 mb-4">{message}</p>}

        <input
          className="w-full p-2 mb-4 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full p-2 mb-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="text-right mb-4">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-indigo-400 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Login
        </button>

        <p className="text-gray-300 text-sm mt-4 text-center">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-indigo-400 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
