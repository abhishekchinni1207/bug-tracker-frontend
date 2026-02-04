import { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { AuthContext } from './AuthContext'


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      const {data} = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }
    loadUser()

    const { data:{subscription}, } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/login', { replace: true })
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
