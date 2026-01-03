'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export function useSafeTheme() {
  const [mounted, setMounted] = useState(false)
  const theme = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return undefined during SSR to prevent localStorage access
  return {
    ...theme,
    theme: mounted ? theme.theme : undefined,
    setTheme: theme.setTheme,
    systemTheme: mounted ? theme.systemTheme : undefined
  }
}
