'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProviderClient({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('[DEBUG ThemeProviderClient] Component mounted')
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    console.log('[DEBUG ThemeProviderClient] Not mounted yet, returning children without provider')
    return <>{children}</>
  }

  console.log('[DEBUG ThemeProviderClient] Mounted, wrapping with NextThemesProvider')

  return (
    <NextThemesProvider
      {...props}
      enableSystem={false}
      storageKey='islamic-tracker-theme'
      defaultTheme='light'
    >
      {children}
    </NextThemesProvider>
  )
}
