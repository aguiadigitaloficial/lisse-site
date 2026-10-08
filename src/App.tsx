import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Header } from './components/Header'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { SiteFooter } from './components/SiteFooter'
import {
  findSitePageFromPathname,
  getPagePath,
  isPageSection,
  isSitePage,
  pageMetadata,
  pagePaths,
  type SitePage,
  type SpecialtyPage,
} from './data/site'
import { useScrollReveal } from './hooks/useScrollReveal'
import { HomePage } from './pages/HomePage'
const SpecialtyLandingPage = lazy(() => import('./pages/SpecialtyLandingPage').then(
  (module) => ({ default: module.SpecialtyLandingPage }),
))

type PendingNavigation = {
  page: SitePage
  targetId: string
  focusMain: boolean
}

function normalizeLocation(): { page: SitePage; targetId: string } {
  const currentUrl = new URL(window.location.href)
  const legacyPage = currentUrl.searchParams.get('modo')
  const pathnamePage = findSitePageFromPathname(currentUrl.pathname)
  const hasValidLegacyPage = isSitePage(legacyPage)
  const hasInvalidPath = pathnamePage === null && !hasValidLegacyPage
  const page = hasValidLegacyPage
    ? legacyPage
    : (pathnamePage ?? 'inicio')

  currentUrl.pathname = pagePaths[page]
  currentUrl.searchParams.delete('modo')

  const requestedTargetId = (() => {
    try {
      return decodeURIComponent(currentUrl.hash.slice(1)) || 'inicio'
    } catch {
      return 'inicio'
    }
  })()

  const targetId = !hasInvalidPath && isPageSection(page, requestedTargetId)
    ? requestedTargetId
    : 'inicio'
  currentUrl.hash = targetId

  const normalizedLocation = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
  if (normalizedLocation !== getLocationKey()) {
    window.history.replaceState({}, '', normalizedLocation)
  }

  return { page, targetId }
}

function getLocationKey() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

function updatePageMetadata(page: SitePage) {
  const metadata = pageMetadata[page]
  const description =
    document.querySelector<HTMLMetaElement>('meta[name="description"]')
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  document.title = metadata.title
  description?.setAttribute('content', metadata.description)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', metadata.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', metadata.description)

  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }

  canonical.href = new URL(pagePaths[page], window.location.origin).href
}

function App() {
  const [activePage, setActivePage] = useState<SitePage>(
    () => normalizeLocation().page,
  )
  const activePageRef = useRef(activePage)
  const [readyPage, setReadyPage] = useState<SitePage | null>(null)
  const pageReady = activePage === 'inicio' || readyPage === activePage
  const handlePageReady = useCallback((page: SitePage) => setReadyPage(page), [])
  const mainRef = useRef<HTMLElement>(null)
  const pendingNavigationRef = useRef<PendingNavigation | null>(null)
  const scrollJobRef = useRef(0)
  const initialScrollRef = useRef(true)
  const lastHandledLocationRef = useRef(getLocationKey())
  const pageTransitionTimerRef = useRef<number | null>(null)

  useScrollReveal(`${activePage}:${pageReady}`)

  const scheduleTargetScroll = useCallback(
    (page: SitePage, requestedTargetId: string, smooth: boolean, focusMain: boolean) => {
      const job = ++scrollJobRef.current
      const root = document.documentElement

      if (!smooth) {
        root.classList.add('is-instant-navigation')
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (job !== scrollJobRef.current || page !== activePageRef.current) return

          const requestedTarget = document.getElementById(requestedTargetId)
          const target =
            requestedTarget ?? document.getElementById('inicio') ?? mainRef.current

          if (!requestedTarget && window.location.hash !== '#inicio') {
            window.history.replaceState({}, '', getPagePath(page, 'inicio'))
            lastHandledLocationRef.current = getLocationKey()
          }

          target?.scrollIntoView({
            behavior: smooth ? 'smooth' : 'auto',
            block: 'start',
          })

          if (focusMain) {
            mainRef.current?.focus({ preventScroll: true })
          }

          if (!smooth) {
            window.requestAnimationFrame(() => {
              if (job === scrollJobRef.current) {
                root.classList.remove('is-instant-navigation')
              }
            })
          }
        })
      })
    },
    [],
  )

  useLayoutEffect(() => {
    activePageRef.current = activePage
    // Keep deep-link scrolling until the lazy route has actually mounted.
    if (!pageReady) return

    const pendingNavigation = pendingNavigationRef.current
    if (pendingNavigation?.page === activePage) {
      pendingNavigationRef.current = null

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        mainRef.current?.classList.remove('site-page-enter')
        void mainRef.current?.offsetWidth
        mainRef.current?.classList.add('site-page-enter')

        if (pageTransitionTimerRef.current !== null) {
          window.clearTimeout(pageTransitionTimerRef.current)
        }
        pageTransitionTimerRef.current = window.setTimeout(() => {
          mainRef.current?.classList.remove('site-page-enter')
          pageTransitionTimerRef.current = null
        }, 320)
      }

      scheduleTargetScroll(
        activePage,
        pendingNavigation.targetId,
        false,
        pendingNavigation.focusMain,
      )
      initialScrollRef.current = false
      return
    }

    if (initialScrollRef.current) {
      initialScrollRef.current = false
      scheduleTargetScroll(
        activePage,
        normalizeLocation().targetId,
        false,
        false,
      )
    }
  }, [activePage, pageReady, scheduleTargetScroll])

  useEffect(() => {
    updatePageMetadata(activePage)
  }, [activePage])

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])

  useEffect(
    () => () => {
      if (pageTransitionTimerRef.current !== null) {
        window.clearTimeout(pageTransitionTimerRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    const updateFromHistory = () => {
      const locationKey = getLocationKey()
      if (locationKey === lastHandledLocationRef.current) return

      const { page: nextPage, targetId } = normalizeLocation()
      lastHandledLocationRef.current = getLocationKey()

      if (nextPage !== activePageRef.current) {
        ++scrollJobRef.current
        document.documentElement.classList.add('is-instant-navigation')
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        pendingNavigationRef.current = {
          page: nextPage,
          targetId,
          focusMain: false,
        }
        flushSync(() => setActivePage(nextPage))
        return
      }

      scheduleTargetScroll(nextPage, targetId, false, false)
    }

    window.addEventListener('popstate', updateFromHistory)
    window.addEventListener('hashchange', updateFromHistory)

    return () => {
      window.removeEventListener('popstate', updateFromHistory)
      window.removeEventListener('hashchange', updateFromHistory)
    }
  }, [scheduleTargetScroll])

  const navigate = (page: SitePage, targetId: string) => {
    const pageChanged = page !== activePageRef.current
    const nextPath = getPagePath(page, targetId)
    const currentPath = getLocationKey()

    const commitNavigation = () => {
      ++scrollJobRef.current
      window.scrollTo({ top: window.scrollY, left: 0, behavior: 'auto' })

      if (currentPath !== nextPath) {
        window.history.pushState({}, '', nextPath)
      }
      lastHandledLocationRef.current = getLocationKey()

      if (pageChanged) {
        document.documentElement.classList.add('is-instant-navigation')
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
        pendingNavigationRef.current = {
          page,
          targetId,
          focusMain: true,
        }
        flushSync(() => setActivePage(page))
        return
      }

      scheduleTargetScroll(page, targetId, true, false)
    }

    commitNavigation()
  }

  const navigateToSpecialty = (page: SpecialtyPage) => {
    navigate(page, 'inicio')
  }

  return (
    <>
      <Header key={activePage} activePage={activePage} onNavigate={navigate} />
      <main ref={mainRef} tabIndex={-1}>
        {activePage === 'inicio' ? (
          <HomePage
            onNavigate={navigate}
            onNavigateToSpecialty={navigateToSpecialty}
          />
        ) : (
          <Suspense fallback={<div className="route-loading" role="status">Carregando a especialidade…</div>}>
            <SpecialtyLandingPage page={activePage} onNavigate={navigate} onReady={handlePageReady} />
          </Suspense>
        )}
      </main>
      <SiteFooter activePage={activePage} onNavigate={navigate} />
      <FloatingWhatsApp page={activePage} />
    </>
  )
}

export default App
