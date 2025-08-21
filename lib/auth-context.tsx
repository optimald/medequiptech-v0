'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signInDemo: (role: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  isDemoUser: boolean
  demoRole: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoUser, setIsDemoUser] = useState(false)
  const [demoRole, setDemoRole] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (!error) {
      // Create profile after successful signup
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            full_name: userData.full_name,
            phone: userData.phone,
            role_tech: userData.role_tech,
            role_trainer: userData.role_trainer,
            base_city: userData.base_city,
            base_state: userData.base_state,
            service_radius_mi: userData.service_radius_mi,
            is_approved: false
          })
      }
    }

    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { error }
  }

  const signInDemo = async (role: string) => {
    try {
      // Map role to demo email
      const demoEmails = {
        technician: 'demo.technician@medequiptech.com',
        trainer: 'demo.trainer@medequiptech.com',
        medspa: 'demo.medspa@medequiptech.com',
        admin: 'demo.admin@medequiptech.com'
      }
      
      const email = demoEmails[role as keyof typeof demoEmails]
      if (!email) {
        return { error: { message: 'Invalid demo role' } }
      }

      // Sign in with demo credentials
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password: 'demo123'
      })

      if (error) {
        return { error }
      }

      // Set demo user state
      if (data.user) {
        setUser(data.user)
        setIsDemoUser(true)
        setDemoRole(role)
      }

      return { error: null }
    } catch (err) {
      return { error: { message: 'Failed to sign in demo user' } }
    }
  }

  const signOut = async () => {
    if (isDemoUser) {
      // Clear demo user state
      setUser(null)
      setIsDemoUser(false)
      setDemoRole(null)
    } else {
      // Regular signout
      await supabase.auth.signOut()
    }
  }

  const refreshUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInDemo,
    signOut,
    refreshUser,
    isDemoUser,
    demoRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
