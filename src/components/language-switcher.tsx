'use client'

import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'
import { motion } from 'framer-motion'

const locales = [
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'en', name: 'English', dir: 'ltr' }
] as const

export function LanguageSwitcher() {
  const switchLocale = (newLocale: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('islamic-tracker-locale', newLocale)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error switching locale:', error)
    }
  }

  const getCurrentLocale = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem('islamic-tracker-locale') || 'ar'
      }
    } catch (error) {
      console.error('Error getting locale:', error)
    }
    return 'ar'
  }

  const currentLocale = getCurrentLocale()

  return (
    <div className="flex items-center gap-2">
      <Languages className="w-4 h-4 text-muted-foreground" />
      <div className="flex rounded-lg border bg-background p-1">
        {locales.map((loc) => (
          <motion.button
            key={loc.code}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchLocale(loc.code)}
            className={`px-3 py-1.5 text-sm rounded-md transition-all ${
              currentLocale === loc.code
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {loc.name}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
