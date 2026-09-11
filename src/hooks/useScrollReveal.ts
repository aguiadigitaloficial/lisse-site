import { useEffect } from 'react'

const revealSelector = '[data-reveal]'

function revealImmediately(elements: HTMLElement[]) {
  elements.forEach((element) => element.classList.add('is-revealed'))
}

export function useScrollReveal(dependency?: unknown) {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    )
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealImmediately(elements)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))

    const revealVisibleElements = () => {
      const revealBoundary = window.innerHeight * 0.9

      elements.forEach((element) => {
        const bounds = element.getBoundingClientRect()
        const isVisible = bounds.top < revealBoundary && bounds.bottom > 0

        if (!isVisible) return

        element.classList.add('is-revealed')
        observer.unobserve(element)
      })
    }

    const revealVisibleFrame = window.requestAnimationFrame(
      revealVisibleElements,
    )
    const revealVisibleTimeout = window.setTimeout(revealVisibleElements, 160)

    return () => {
      window.cancelAnimationFrame(revealVisibleFrame)
      window.clearTimeout(revealVisibleTimeout)
      observer.disconnect()
    }
  }, [dependency])
}
