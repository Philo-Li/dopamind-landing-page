'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

export type Theme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  theme: Theme
  actualTheme: 'light' | 'dark' // The actual applied theme (resolved from auto)
  setTheme: (theme: Theme) => void
}

interface ThemeProviderProps {
  children: React.ReactNode
  initialTheme?: Theme
  initialActualTheme?: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function normalizeTheme(value: string | null | undefined): Theme {
  if (value === 'light' || value === 'dark' || value === 'auto') {
    return value
  }
  return 'auto'
}

export function ThemeProvider({
  children,
  initialTheme = 'auto',
  initialActualTheme = 'light'
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(initialActualTheme)

  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }, [])

  const resolveActualTheme = useCallback((selectedTheme: Theme): 'light' | 'dark' => {
    if (selectedTheme === 'auto') {
      return getSystemTheme()
    }
    return selectedTheme
  }, [getSystemTheme])

  const applyTheme = useCallback((appliedTheme: 'light' | 'dark') => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement

    root.classList.remove('light', 'dark')
    if (appliedTheme === 'dark') {
      root.classList.add('dark')
    }

    root.setAttribute('data-theme', appliedTheme)
    document.body?.setAttribute('data-theme', appliedTheme)
  }, [])

  // Ensure we reflect stored preference on first client render
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current || typeof window === 'undefined') {
      return
    }
    initialized.current = true

    const storedValue = window.localStorage.getItem('theme')
    const storedPreference = normalizeTheme(storedValue)
    const preferenceToApply = storedValue === null ? theme : storedPreference

    setTheme((prev) => (prev === preferenceToApply ? prev : preferenceToApply))

    const resolved = resolveActualTheme(preferenceToApply)
    setActualTheme((prev) => (prev === resolved ? prev : resolved))
    applyTheme(resolved)
  }, [applyTheme, resolveActualTheme, theme])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    document.cookie = `theme-preference=${theme}; path=/; max-age=31536000; SameSite=Lax`

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme)
    }
  }, [theme])

  useEffect(() => {
    applyTheme(actualTheme)

    if (typeof document !== 'undefined') {
      document.cookie = `theme-resolved=${actualTheme}; path=/; max-age=31536000; SameSite=Lax`
    }
  }, [actualTheme, applyTheme])

  useEffect(() => {
    if (theme === 'auto' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

      const handleChange = (event: MediaQueryListEvent) => {
        const newActualTheme = event.matches ? 'dark' : 'light'
        setActualTheme(newActualTheme)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme)
    setActualTheme(resolveActualTheme(newTheme))
  }, [resolveActualTheme])

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme: handleSetTheme,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
