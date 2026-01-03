import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return
    }

    // Check if matchMedia is available
    if (typeof window.matchMedia !== 'function') {
      return
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Check if mql has addEventListener method
    if (typeof mql.addEventListener !== 'function') {
      // Fallback: set initial value and check on resize
      const checkMobile = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
