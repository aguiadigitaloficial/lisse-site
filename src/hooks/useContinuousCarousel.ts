import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

type MotionMode = 'auto' | 'dragging' | 'settling'

type DragMotion = {
  pointerId: number
  startX: number
  lastX: number
  lastTime: number
  velocity: number
  moved: boolean
}

type SettleMotion = {
  startOffset: number
  targetOffset: number
  startTime: number
  duration: number
}

type ContinuousCarouselOptions = {
  itemSelector: string
  direction?: 'left' | 'right'
  baseSpeed?: number
  slowFactor?: number
  interactive?: boolean
  dependencyKey?: string
}

function normalizeOffset(offset: number, width: number) {
  if (!width) return 0
  return ((offset % width) + width) % width
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

export function useContinuousCarousel({
  itemSelector,
  direction = 'left',
  baseSpeed = 44,
  slowFactor = 0.35,
  interactive = true,
  dependencyKey = '',
}: ContinuousCarouselOptions) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const primaryGroupRef = useRef<HTMLDivElement>(null)
  const cycleWidthRef = useRef(0)
  const itemStepRef = useRef(0)
  const offsetRef = useRef(0)
  const slowedRef = useRef(false)
  const pausedRef = useRef(false)
  const modeRef = useRef<MotionMode>('auto')
  const dragRef = useRef<DragMotion | null>(null)
  const settleRef = useRef<SettleMotion | null>(null)
  const currentSpeedRef = useRef(baseSpeed)
  const [copyCount, setCopyCount] = useState(4)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    const primaryGroup = primaryGroupRef.current

    if (!viewport || !track || !primaryGroup) return

    const measure = () => {
      const previousWidth = cycleWidthRef.current
      const firstGroup = track.children.item(0) as HTMLElement | null
      const secondGroup = track.children.item(1) as HTMLElement | null
      const groupWidth = primaryGroup.getBoundingClientRect().width
      const nextWidth =
        firstGroup && secondGroup
          ? secondGroup.getBoundingClientRect().left -
            firstGroup.getBoundingClientRect().left
          : groupWidth

      if (!nextWidth) return

      if (previousWidth) {
        offsetRef.current = normalizeOffset(
          (offsetRef.current / previousWidth) * nextWidth,
          nextWidth,
        )
      }

      cycleWidthRef.current = nextWidth
      const items = primaryGroup.querySelectorAll<HTMLElement>(itemSelector)

      if (items.length > 1) {
        itemStepRef.current =
          items[1].getBoundingClientRect().left -
          items[0].getBoundingClientRect().left
      } else if (items.length === 1) {
        itemStepRef.current = items[0].getBoundingClientRect().width
      }

      setCopyCount(
        prefersReducedMotion
          ? 1
          : Math.max(3, Math.ceil(viewport.clientWidth / nextWidth) + 2),
      )
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(viewport)
    resizeObserver.observe(primaryGroup)

    return () => resizeObserver.disconnect()
  }, [dependencyKey, itemSelector, prefersReducedMotion])

  useEffect(() => {
    const track = trackRef.current

    if (!track || prefersReducedMotion) {
      if (track) track.style.removeProperty('transform')
      return
    }

    let previousTime = performance.now()
    let animationFrame = 0
    const directionMultiplier = direction === 'left' ? 1 : -1

    const animate = (currentTime: number) => {
      const elapsed = Math.min((currentTime - previousTime) / 1000, 0.05)
      previousTime = currentTime

      if (!document.hidden && cycleWidthRef.current > 0) {
        if (modeRef.current === 'settling' && settleRef.current) {
          const settle = settleRef.current
          const progress = clamp(
            (currentTime - settle.startTime) / settle.duration,
            0,
            1,
          )
          const easedProgress = 1 - Math.pow(1 - progress, 3)

          offsetRef.current = normalizeOffset(
            settle.startOffset +
              (settle.targetOffset - settle.startOffset) * easedProgress,
            cycleWidthRef.current,
          )

          if (progress === 1) {
            settleRef.current = null
            modeRef.current = 'auto'
            currentSpeedRef.current = 0
          }
        } else if (modeRef.current === 'auto') {
          const targetSpeed = pausedRef.current
            ? 0
            : slowedRef.current
              ? baseSpeed * slowFactor
              : baseSpeed

          currentSpeedRef.current = pausedRef.current
            ? 0
            : currentSpeedRef.current +
              (targetSpeed - currentSpeedRef.current) *
                (1 - Math.exp(-elapsed * 4.5))

          offsetRef.current = normalizeOffset(
            offsetRef.current +
              currentSpeedRef.current * elapsed * directionMultiplier,
            cycleWidthRef.current,
          )
        }

        if (modeRef.current !== 'dragging') {
          track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`
        }
      }

      animationFrame = window.requestAnimationFrame(animate)
    }

    animationFrame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      track.style.removeProperty('transform')
    }
  }, [baseSpeed, direction, prefersReducedMotion, slowFactor])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden || !dragRef.current) return

      dragRef.current = null
      settleRef.current = null
      modeRef.current = 'auto'
      currentSpeedRef.current = 0
      setIsDragging(false)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const togglePaused = () => {
    const nextPaused = !pausedRef.current
    pausedRef.current = nextPaused
    setIsPaused(nextPaused)
  }

  const beginSettle = (targetOffset: number) => {
    settleRef.current = {
      startOffset: offsetRef.current,
      targetOffset,
      startTime: performance.now(),
      duration: 450,
    }
    modeRef.current = 'settling'
    currentSpeedRef.current = 0
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || prefersReducedMotion) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    event.currentTarget.setPointerCapture(event.pointerId)
    settleRef.current = null
    modeRef.current = 'dragging'
    currentSpeedRef.current = 0
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
      moved: false,
    }
    setIsDragging(true)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    const cycleWidth = cycleWidthRef.current

    if (!drag || drag.pointerId !== event.pointerId || !track || !cycleWidth) {
      return
    }

    const currentTime = performance.now()
    const deltaX = event.clientX - drag.lastX
    const elapsed = Math.max(currentTime - drag.lastTime, 1)
    const instantaneousVelocity = deltaX / elapsed

    drag.velocity = drag.velocity * 0.68 + instantaneousVelocity * 0.32
    drag.lastX = event.clientX
    drag.lastTime = currentTime
    drag.moved = drag.moved || Math.abs(event.clientX - drag.startX) > 6

    offsetRef.current = normalizeOffset(
      offsetRef.current - deltaX,
      cycleWidth,
    )
    track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`

    if (drag.moved) event.preventDefault()
  }

  const finishPointerInteraction = (
    event: PointerEvent<HTMLDivElement>,
    cancelled = false,
  ) => {
    const drag = dragRef.current

    if (!drag || drag.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    dragRef.current = null
    setIsDragging(false)

    const itemStep = itemStepRef.current
    const cycleWidth = cycleWidthRef.current

    if (!drag.moved || !itemStep || !cycleWidth) {
      modeRef.current = 'auto'
      currentSpeedRef.current = 0
      return
    }

    const velocity = cancelled ? 0 : clamp(drag.velocity, -1.25, 1.25)
    const projectedOffset = offsetRef.current - velocity * 190
    const snappedOffset = Math.round(projectedOffset / itemStep) * itemStep
    const maximumSettleDistance = itemStep * 1.25
    const settleDistance = clamp(
      snappedOffset - offsetRef.current,
      -maximumSettleDistance,
      maximumSettleDistance,
    )

    beginSettle(offsetRef.current + settleDistance)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      !interactive ||
      (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
    ) {
      return
    }

    event.preventDefault()
    const keyboardDirection = event.key === 'ArrowRight' ? 1 : -1
    const itemStep = itemStepRef.current

    if (!itemStep) return

    if (prefersReducedMotion) {
      event.currentTarget.scrollBy({
        left: keyboardDirection * itemStep,
        behavior: 'smooth',
      })
      return
    }

    settleRef.current = null
    dragRef.current = null
    setIsDragging(false)
    beginSettle(
      Math.round(offsetRef.current / itemStep) * itemStep +
        keyboardDirection * itemStep,
    )
  }

  return {
    viewportRef,
    trackRef,
    primaryGroupRef,
    copyCount,
    isPaused,
    isDragging,
    prefersReducedMotion,
    togglePaused,
    carouselHandlers: {
      onKeyDown: handleKeyDown,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishPointerInteraction,
      onPointerCancel: (event: PointerEvent<HTMLDivElement>) =>
        finishPointerInteraction(event, true),
      onLostPointerCapture: (event: PointerEvent<HTMLDivElement>) =>
        finishPointerInteraction(event, true),
      onPointerEnter: () => {
        slowedRef.current = true
      },
      onPointerLeave: () => {
        slowedRef.current = false
      },
    },
  }
}
