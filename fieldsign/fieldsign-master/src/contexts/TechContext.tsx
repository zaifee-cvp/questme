'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { QrValidationResult } from '@/types'

interface TechSession extends QrValidationResult {
  token: string
}

interface TechContextValue {
  session: TechSession | null
  loading: boolean
  setSession: (s: TechSession | null) => void
  clearSession: () => void
}

const TechContext = createContext<TechContextValue>({
  session: null,
  loading: true,
  setSession: () => {},
  clearSession: () => {},
})

const SESSION_KEY = 'fs_tech_session'

export function TechProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<TechSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as TechSession
        setSessionState(parsed)
      }
    } catch {}
    setLoading(false)
  }, [])

  const setSession = (s: TechSession | null) => {
    setSessionState(s)
    if (s) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(s))
    } else {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  const clearSession = () => setSession(null)

  return (
    <TechContext.Provider value={{ session, loading, setSession, clearSession }}>
      {children}
    </TechContext.Provider>
  )
}

export function useTechSession() {
  return useContext(TechContext)
}
