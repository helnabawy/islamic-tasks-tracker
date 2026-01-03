'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface ThemeAwareWrapperProps {
  children: (theme: string | undefined) => React.ReactNode
}

export function ThemeAwareWrapper({ children }: ThemeAwareWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const theme = useTheme().theme

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render until mounted to prevent SSR issues
  if (!mounted) {
    return <>{children('light')}</>
  }

  return <>{children(theme)}</>
}
