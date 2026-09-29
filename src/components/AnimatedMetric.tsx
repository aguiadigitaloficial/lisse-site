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
    let frame = 0
    let started = false
    let elapsed = 0
    let lastTime = 0

    const finish = () => {
      cancelAnimationFrame(frame)
      element.textContent = finalText
      finishedRef.current = true
    }
    const tick = (time: number) => {
      if (!document.hidden) elapsed += Math.min(time - lastTime, 64)
      lastTime = time
      const progress = Math.min(elapsed / 2000, 1)
      const eased = 1 - (1 - progress) ** 3
      const displayed = decimals ? (value * eased).toFixed(decimals) : Math.floor(value * eased).toString()
      element.textContent = `${displayed}${suffix}`
      if (progress < 1) frame = requestAnimationFrame(tick)
      else finish()
    }
    const onPreferenceChange = () => {
      if (preference.matches) finish()
    }

    if (finishedRef.current || preference.matches || !('IntersectionObserver' in window)) {
      finish()
      return
    }
    element.textContent = `${(0).toFixed(decimals)}${suffix}`
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started || finishedRef.current) return
      started = true
      lastTime = performance.now()
      frame = requestAnimationFrame(tick)
      observer?.disconnect()
    }, { threshold: 0.5 })
    observer.observe(element)
    preference.addEventListener('change', onPreferenceChange)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      preference.removeEventListener('change', onPreferenceChange)
    }
  }, [value, suffix, decimals, finalText])

  return (
    <strong className="clinic-metric-number">
      <span className="visually-hidden">{finalText}</span>
      <span className="clinic-metric-number__reserve" aria-hidden="true">{finalText}</span>
      <span className="clinic-metric-number__value" ref={numberRef} aria-hidden="true">{finalText}</span>
    </strong>
  )
}
