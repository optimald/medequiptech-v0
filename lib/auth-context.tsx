'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error: any }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: any }>
  signInDemo: (role: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  isDemoUser: boolean
  demoRole: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user credentials
const DEMO_USERS = {
  technician: {
    email: 'demo.technician@medequiptech.com',
    password: 'demo123',
    role: 'technician'
  },
  trainer: {
    email: 'demo.trainer@medequiptech.com',
    password: 'demo123',
    role: 'trainer'
  },
  medspa: {
    email: 'demo.medspa@medequiptech.com',
    password: 'demo123',
    role: 'medspa'
  },
  admin: {
    email: 'demo.admin@medequiptech.com',
    password: 'demo123',
    role: 'admin'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoUser, setIsDemoUser] = useState(false)
  const [demoRole, setDemoRole] = useState<string | null>(null)

  useEffect(() => {
    // Get initial session and restore demo user state
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      // Restore demo user state from localStorage if available
      const storedDemoRole = localStorage.getItem('demoRole')
      const storedIsDemoUser = localStorage.getItem('isDemoUser')
      
      if (storedDemoRole && storedIsDemoUser === 'true') {
        setIsDemoUser(true)
        setDemoRole(storedDemoRole)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // If user signs out, clear demo state
        if (event === 'SIGNED_OUT') {
          setIsDemoUser(false)
          setDemoRole(null)
          localStorage.removeItem('demoRole')
          localStorage.removeItem('isDemoUser')
        }
        
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

    return { success: !error, error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { success: !error, error }
  }

  const signInDemo = async (role: string) => {
    try {
      console.log('🔍 Starting demo login for role:', role)
      const demoUser = DEMO_USERS[role as keyof typeof DEMO_USERS]
      if (!demoUser) {
        console.error('❌ Invalid demo role:', role)
        return { error: { message: 'Invalid demo role' } }
      }

      console.log('📧 Attempting to sign in with:', demoUser.email)

      // First, try to sign in with existing demo user
      let { error, data } = await supabase.auth.signInWithPassword({
        email: demoUser.email,
        password: demoUser.password
      })

      console.log('🔐 Sign in attempt result:', { error, hasData: !!data })

      // If demo user doesn't exist, create them
      if (error && error.message.includes('Invalid login credentials')) {
        console.log('👤 Creating demo user for role:', role)
        
        // Create the demo user
        const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
          email: demoUser.email,
          password: demoUser.password,
          options: {
            data: {
              full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
              role: role
            }
          }
        })

        console.log('📝 Sign up result:', { signUpError, signUpData })

        if (signUpError) {
          console.error('❌ Error creating demo user:', signUpError)
          return { error: signUpError }
        }

        // Wait a moment for the user to be fully created
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Create profile for the demo user
        if (signUpData.user) {
          console.log('👤 Creating profile for user:', signUpData.user.id)
          
          const profileData = {
            user_id: signUpData.user.id,
            full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            phone: '555-000-0000',
            role_tech: role === 'technician' || role === 'admin',
            role_trainer: role === 'trainer' || role === 'admin',
            base_city: 'Demo City',
            base_state: 'CA',
            service_radius_mi: 50,
            is_approved: true, // Demo users are pre-approved
            role_admin: role === 'admin'
          }

          try {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert(profileData)

            if (profileError) {
              console.error('❌ Error creating demo profile:', profileError)
              console.log('⚠️ Continuing without profile - user can still sign in')
            } else {
              console.log('✅ Demo profile created successfully')
            }
          } catch (profileErr) {
            console.error('❌ Exception creating demo profile:', profileErr)
            console.log('⚠️ Continuing without profile - user can still sign in')
          }

          // Now sign in with the newly created user
          console.log('🔐 Signing in with newly created user...')
          const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
            email: demoUser.email,
            password: demoUser.password
          })

          if (signInError) {
            console.error('❌ Error signing in with new user:', signInError)
            return { error: signInError }
          }

          data = signInData
          console.log('✅ Successfully signed in with new demo user')
        }
      } else if (error) {
        // Some other error occurred during sign in
        console.error('❌ Error during sign in (not credentials):', error)
        return { error }
      }

      if (error) {
        console.error('❌ Final error:', error)
        return { error }
      }

      // Set demo user state and persist to localStorage
      if (data.user) {
        console.log('🎉 Demo login successful, setting state for user:', data.user.id)
        setUser(data.user)
        setIsDemoUser(true)
        setDemoRole(role)
        localStorage.setItem('demoRole', role)
        localStorage.setItem('isDemoUser', 'true')
      }

      return { error: null }
    } catch (err) {
      console.error('💥 Unexpected error in signInDemo:', err)
      return { error: { message: 'Failed to sign in demo user' } }
    }
  }

  const signOut = async () => {
    // Clear demo user state
    setIsDemoUser(false)
    setDemoRole(null)
    localStorage.removeItem('demoRole')
    localStorage.removeItem('isDemoUser')
    
    // Sign out from Supabase
    await supabase.auth.signOut()
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
