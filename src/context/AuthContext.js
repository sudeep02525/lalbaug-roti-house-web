"use client"
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo')
        if (userInfo) {
          const parsed = JSON.parse(userInfo)
          // Validate token with backend
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/me`, {
            headers: {
              Authorization: `Bearer ${parsed.token}`
            },
            validateStatus: () => true
          })
          if (res.status === 200) {
            setUser(parsed)
          } else {
            localStorage.removeItem('userInfo')
            setUser(null)
          }
        }
      } catch (error) {
        console.error("Auth check failed", error)
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/login`, 
        { email, password },
        { validateStatus: () => true }
      )
      const data = res.data
      
      if (res.status !== 200) {
        throw new Error(data.message || 'Login failed')
      }

      setUser(data.data)
      localStorage.setItem('userInfo', JSON.stringify(data.data))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password, phone) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/register`,
        { name, email, password, phone },
        { validateStatus: () => true }
      )
      const data = res.data
      
      if (res.status !== 200 && res.status !== 201) {
        throw new Error(data.message || 'Registration failed')
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem('userInfo')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
