import { useLayoutEffect, useRef } from 'react'
import { useMotionRuntime } from './useMotionRuntime'

/** Own only this list's triggers, including route-change and StrictMode cleanup. */
export function useProfessionalStack() {
  const ref = useRef<HTMLDivElement>(null)
  const runtime = useMotionRuntime(ref)
  useLayoutEffect(() => {
    if (!runtime) return
    const { gsap, ScrollTrigger } = runtime
    const list = ref.current
    if (!list) return
    const items = Array.from(list.querySelectorAll<HTMLElement>('.professional-stack-item'))
    const cards = Array.from(list.querySelectorAll<HTMLElement>('.professional-sheet'))
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let context: ReturnType<typeof gsap.context> | undefined
    let frame = 0
    let signature = ''
    let disposed = false

    const rebuild = () => {
      if (disposed) return
      const sizes = cards.map((card) => card.offsetHeight)
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0
      const stackTop = headerHeight + 32
      const next = [window.innerWidth, window.innerHeight, headerHeight, ...sizes, reducedMotion.matches].join(':')
      if (next === signature) return
      signature = next
      context?.revert()
      const canStack = window.innerWidth >= 900 &&
        Math.max(...sizes) + stackTop + (items.length - 1) * 14 + 24 <= window.innerHeight
      list.dataset.stackMode = reducedMotion.matches ? 'reduced' : canStack ? 'stack' : 'flow'
      if (reducedMotion.matches) return

      context = gsap.context(() => {
        if (canStack) {
          items.slice(0, -1).forEach((item, index) => {
            ScrollTrigger.create({
              trigger: item,
              start: `top ${stackTop + index * 14}`,
              endTrigger: items.at(-1),
              end: `top ${stackTop + (items.length - 1) * 14}`,
              pin: item.querySelector<HTMLElement>('.professional-stack-pin')!,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            })
            // Scale the card inside the pin, never the pinned element itself.
            gsap.to(cards[index], {
              scale: 0.94,
              ease: 'none',
              scrollTrigger: {
                trigger: items[index + 1],
                start: 'top 85%',
                end: `top ${stackTop + 14 + index * 14}`,
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            })
          })
        } else {
          cards.forEach((card) => gsap.from(card, {
            y: 28,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 94%', once: true },
          }))
        }
      }, list)
      ScrollTrigger.refresh()
    }
    const schedule = () => {
      if (disposed) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(rebuild)
    }
    const observer = new ResizeObserver(schedule)
    cards.forEach((card) => observer.observe(card))
    window.addEventListener('resize', schedule)
    reducedMotion.addEventListener('change', schedule)
    const revealFocusedCard = (event: FocusEvent) => {
      const target = event.target
      if (list.dataset.stackMode !== 'stack' || !(target instanceof HTMLElement) || !target.matches(':focus-visible')) return
      const rect = target.getBoundingClientRect()
      const visible = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
      if (!visible || !target.contains(visible)) {
        target.closest('.professional-stack-item')?.scrollIntoView({ block: 'start', behavior: 'instant' })
      }
    }
    list.addEventListener('focusin', revealFocusedCard)
    rebuild()
    void document.fonts.ready.then(schedule)

    return () => {
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', schedule)
      reducedMotion.removeEventListener('change', schedule)
      list.removeEventListener('focusin', revealFocusedCard)
      context?.revert()
      delete list.dataset.stackMode
    }
  }, [runtime])
  return ref
}
