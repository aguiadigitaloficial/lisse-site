import { useEffect, useRef } from 'react'
import separatorMark from '../assets/hero/separator-mark.png'

type SpecialtyRailProps = {
  items: readonly string[]
  destinations?: Readonly<Record<string, string>>
  reveal?: boolean
  variant?: 'default' | 'hero'
}

export function SpecialtyRail({
  items,
  destinations,
  reveal = false,
  variant = 'default',
}: SpecialtyRailProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)
  const pauseReasons = useRef(new Set<string>(['offscreen']))
  const itemsKey = items.join('|')

  const setPauseReason = (reason: string, active: boolean) => {
    if (active) pauseReasons.current.add(reason)
    else pauseReasons.current.delete(reason)
    const rail = viewportRef.current?.parentElement
    if (rail) rail.dataset.motionPaused = String(pauseReasons.current.size > 0)
    if (pauseReasons.current.size) animationRef.current?.pause()
    else animationRef.current?.play()
  }

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const group = track?.firstElementChild
    if (!viewport || !track || !group) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let measuredWidth = 0
    let frame = 0
    const syncPlayback = () => {
      if (viewport.parentElement) {
        viewport.parentElement.dataset.motionPaused = String(pauseReasons.current.size > 0 || preference.matches)
      }
      if (pauseReasons.current.size || preference.matches) animationRef.current?.pause()
      else animationRef.current?.play()
    }
    const measure = () => {
      if (preference.matches) {
        animationRef.current?.cancel()
        animationRef.current = null
        measuredWidth = 0
        syncPlayback()
        return
      }
      const width = group.getBoundingClientRect().width
      if (!width || (Math.abs(width - measuredWidth) < 0.5 && animationRef.current)) return
      const previous = animationRef.current
      const oldDuration = Number(previous?.effect?.getTiming().duration) || 1
      const cyclePosition = Number(previous?.currentTime ?? 0) / oldDuration
      previous?.cancel()
      measuredWidth = width
      const duration = Math.max(20000, width / 30 * 1000)
      const animation = track.animate([
        { transform: 'translate3d(0, 0, 0)' },
        { transform: `translate3d(${-width}px, 0, 0)` },
      ], { duration, iterations: Infinity, direction: 'alternate', easing: 'cubic-bezier(0.45, 0, 0.55, 1)' })
      animation.currentTime = cyclePosition * duration
      animationRef.current = animation
      syncPlayback()
    }
    const visibility = () => {
      if (document.hidden) pauseReasons.current.add('hidden')
      else pauseReasons.current.delete('hidden')
      syncPlayback()
    }
    const resize = new ResizeObserver(measure)
    resize.observe(viewport)
    resize.observe(group)
    const intersection = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) pauseReasons.current.delete('offscreen')
      else pauseReasons.current.add('offscreen')
      syncPlayback()
    })
    intersection.observe(viewport)
    document.addEventListener('visibilitychange', visibility)
    preference.addEventListener('change', measure)
    visibility()
    frame = requestAnimationFrame(measure)
    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      intersection.disconnect()
      document.removeEventListener('visibilitychange', visibility)
      preference.removeEventListener('change', measure)
      animationRef.current?.cancel()
      animationRef.current = null
    }
  }, [itemsKey])

  return (
    <div
      className={`specialty-rail specialty-rail--${variant} specialty-rail--animated`}
      aria-label="Especialidades"
      data-motion-paused="true"
      data-reveal={reveal ? 'fade' : undefined}
      onMouseEnter={() => setPauseReason('hover', true)}
      onMouseLeave={() => setPauseReason('hover', false)}
      onFocusCapture={(event) => {
        setPauseReason('focus', true)
        if (event.target.matches(':focus-visible') && animationRef.current) {
          animationRef.current.currentTime = 0
        }
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPauseReason('focus', false)
      }}
      onPointerDown={() => setPauseReason('touch', true)}
      onPointerUp={() => setPauseReason('touch', false)}
      onPointerCancel={() => setPauseReason('touch', false)}
      onPointerLeave={() => setPauseReason('touch', false)}
    >
      <div className="specialty-rail__light" aria-hidden="true" />
      <div className="specialty-rail__viewport" ref={viewportRef} tabIndex={0} aria-label="Lista de especialidades">
        <div className="specialty-rail__track" ref={trackRef}>
          {[0, 1, 2].map((copy) => (
            <div className="specialty-rail__group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
              {items.map((item) => (
                <div className="specialty-rail__item" key={item}>
                  {destinations?.[item] ? (
                    <a href={destinations[item]} tabIndex={copy > 0 ? -1 : undefined}>{item}</a>
                  ) : <span>{item}</span>}
                  <img src={separatorMark} alt="" aria-hidden="true" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
