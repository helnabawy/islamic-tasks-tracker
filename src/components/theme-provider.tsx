'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
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
