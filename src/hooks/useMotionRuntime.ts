import { useEffect, useState, type RefObject } from 'react'

/** Load scroll effects shortly before their section, never on the critical hero path. */
export function useMotionRuntime(ref: RefObject<HTMLElement | null>) {
  const [runtime, setRuntime] = useState<typeof import('../utils/motionRuntime') | null>(null)
  useEffect(() => {
    const target = ref.current
    if (!target) return
    let disposed = false
    let requested = false
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const load = () => {
      if (requested || preference.matches) return
      requested = true
      void import('../utils/motionRuntime').then((module) => {
        if (!disposed) setRuntime(module)
      }).catch(() => { requested = false }) // Content remains usable if a motion chunk cannot load.
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) load()
    }, { rootMargin: '600px' })
    const preferenceChanged = () => {
      const bounds = target.getBoundingClientRect()
      if (bounds.top < innerHeight + 600 && bounds.bottom > -600) load()
    }
    observer.observe(target)
    preference.addEventListener('change', preferenceChanged)
    return () => {
      disposed = true
      observer.disconnect()
      preference.removeEventListener('change', preferenceChanged)
    }
  }, [ref])
  return runtime
}
