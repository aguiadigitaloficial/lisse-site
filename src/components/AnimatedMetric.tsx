import { useEffect, useRef } from 'react'

type AnimatedMetricProps = {
  value: number
  suffix: string
  decimals?: number
}

export function AnimatedMetric({ value, suffix, decimals = 0 }: AnimatedMetricProps) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const finishedRef = useRef(false)
  const finalText = `${value.toFixed(decimals)}${suffix}`

  useEffect(() => {
    const element = numberRef.current
    if (!element) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animation: Animation | undefined

    const finish = () => {
      animation?.cancel()
      finishedRef.current = true
    }
    const onPreferenceChange = () => {
      if (preference.matches) finish()
    }

    if (finishedRef.current || preference.matches || !('IntersectionObserver' in window) || !element.animate) {
      finish()
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || finishedRef.current) return
      finishedRef.current = true
      observer.disconnect()
      animation = element.animate(
        [
          { filter: 'blur(8px)', opacity: 0 },
          { filter: 'blur(0px)', opacity: 1 },
        ],
        { duration: 1100, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      )
    }, { threshold: 0.5 })
    observer.observe(element)
    preference.addEventListener('change', onPreferenceChange)
    return () => {
      animation?.cancel()
      observer.disconnect()
      preference.removeEventListener('change', onPreferenceChange)
    }
  }, [finalText])

  return (
    <strong className="clinic-metric-number">
      <span className="visually-hidden">{finalText}</span>
      <span className="clinic-metric-number__reserve" aria-hidden="true">{finalText}</span>
      <span className="clinic-metric-number__value" ref={numberRef} aria-hidden="true">{finalText}</span>
    </strong>
  )
}
