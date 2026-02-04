import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(
        'Signup successful! Please confirm your email before logging in.'
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleSignup}
        className="bg-slate-800 p-8 rounded-lg w-full max-w-md"
      >
        <h2 className="text-white text-2xl mb-6 font-bold">
          Create Account
        </h2>

        {error && (
  <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-2 rounded mb-4">
    {error}
  </div>
)}

        {success && <p className="text-green-400 mb-4">{success}</p>}

        {/* Name */}
        <input
          className="w-full p-2 mb-4 rounded"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={loading}
        />

        {/* Email */}
        <input
          className="w-full p-2 mb-4 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        {/* Password */}
        <input
          className="w-full p-2 mb-4 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {/* Confirm Password */}
        <input
          className="w-full p-2 mb-6 rounded"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-gray-300 text-sm mt-4 text-center">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup
