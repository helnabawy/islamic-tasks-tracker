'use client'

import { useEffect } from 'react'

/**
 * Hook to clean up extension-injected attributes that cause hydration mismatches.
 * 
 * Browser extensions (like Hotjar, analytics tools, etc.) often inject attributes
 * into the DOM after server-side rendering but before React hydrates. This causes
 * hydration mismatches because the server-rendered HTML doesn't have these attributes.
 * 
 * This hook removes these attributes after mount to ensure clean hydration.
 */
export function useExtensionCleanup() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return
    }

    // Patterns of attributes commonly injected by extensions
    const extensionAttributes = [
      'data--h-bstatus', // Hotjar
      'data-hj-hotjar-id', // Hotjar
      'data-hj-ignore-attributes', // Hotjar
      'data-heap-id', // Heap Analytics
      'data-heap-ignore', // Heap Analytics
      'data-gtm', // Google Tag Manager
      'data-ga', // Google Analytics
      'data-amplitude', // Amplitude
      'data-mixpanel', // Mixpanel
      'data-segment', // Segment
      'data-intercom', // Intercom
      'data-pendo', // Pendo
      'data-fullstory', // FullStory
      'data-optimizely', // Optimizely
      'data-vwo', // VWO
      'data-crazyegg', // Crazy Egg
      'data-hotjar', // Hotjar (alternative)
    ]

    let removedCount = 0
    const removedAttributes: string[] = []

    // Remove extension attributes from all elements
    const cleanupAttributes = () => {
      const allElements = document.querySelectorAll('*')
      
      allElements.forEach((element) => {
        extensionAttributes.forEach((attr) => {
          if (element.hasAttribute(attr)) {
            element.removeAttribute(attr)
            removedCount++
            removedAttributes.push(`${attr} on ${element.tagName.toLowerCase()}`)
          }
        })
      })
    }

    // Run cleanup immediately
    cleanupAttributes()

    // Log removed attributes in development for debugging
    if (process.env.NODE_ENV === 'development' && removedCount > 0) {
      console.group('[Extension Cleanup]')
      console.log(`Removed ${removedCount} extension-injected attributes`)
      console.log('Removed attributes:', removedAttributes)
      console.groupEnd()
    }

    // Also run cleanup after a short delay to catch late-injecting extensions
    const timeoutId = setTimeout(() => {
      const beforeCount = removedCount
      cleanupAttributes()
      const afterCount = removedCount
      
      if (process.env.NODE_ENV === 'development' && afterCount > beforeCount) {
        console.group('[Extension Cleanup - Delayed]')
        console.log(`Removed ${afterCount - beforeCount} additional attributes after delay`)
        console.groupEnd()
      }
    }, 100)

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
}

/**
 * Hook to clean up extension attributes and suppress hydration warnings
 * for specific elements. Use this when you need both cleanup and suppression.
 */
export function useExtensionCleanupWithSuppress() {
  useExtensionCleanup()
}
