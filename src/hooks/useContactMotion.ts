import { useLayoutEffect, useRef } from 'react'
import { useMotionRuntime } from './useMotionRuntime'

/** Contact-only reveal, separate from the photo so mobile reading starts in view. */
export function useContactMotion() {
  const ref = useRef<HTMLElement>(null)
  const runtime = useMotionRuntime(ref)

  useLayoutEffect(() => {
    if (!runtime) return
    const { gsap } = runtime
    const section = ref.current
    if (!section) return
    const photo = section.querySelector<HTMLElement>('.contact-section__photo')
    const copy = section.querySelector<HTMLElement>('.contact-section__copy')
    const steps = gsap.utils.toArray<HTMLElement>('[data-contact-step]', section)
    if (!photo || !copy || !steps.length) return

    let copyStarted = false
    let photoStarted = false
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const photoReveal = !photoStarted ? gsap.from(photo, {
        y: 16,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
        onStart: () => { photoStarted = true },
        scrollTrigger: { trigger: photo, start: 'top 88%', once: true },
      }) : undefined

      const readingSequence = !copyStarted ? gsap.from(steps, {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.19,
        ease: 'power2.out',
        clearProps: 'opacity,transform',
        onStart: () => { copyStarted = true },
        scrollTrigger: { trigger: copy, start: 'top 86%', once: true },
      }) : undefined

      // The link stays in the tab order; keyboard focus immediately reveals the content.
      const finishOnFocus = () => {
        readingSequence?.progress(1)
        photoReveal?.progress(1)
      }
      section.addEventListener('focusin', finishOnFocus)
      return () => section.removeEventListener('focusin', finishOnFocus)
    }, section)

    return () => media.revert()
  }, [runtime])

  return ref
}
