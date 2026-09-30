import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import separatorMark from '../assets/hero/separator-mark.png'
import cardMarkGold from '../assets/treatments/card-mark-gold.svg'
import cardMedallion from '../assets/treatments/logo-cards.png'
import { getProfessional, professionalCredentials } from '../data/professionals'
import type { SpecialtyPage } from '../data/site'
import type { Treatment } from '../types/content'

type TreatmentCardProps = {
  treatment: Treatment
  onNavigate: (page: SpecialtyPage) => void
}

type DragState = {
  pointerId: number
  startX: number
  startY: number
  startScrollLeft: number
  startLogicalIndex: number
  lastX: number
  lastTime: number
  velocity: number
  axis: 'pending' | 'horizontal' | 'vertical'
}

type GalleryAnimation = {
  frameId: number
  targetLeft: number
  targetLogicalIndex: number
  targetPhysicalIndex: number
}

function TreatmentGallery({ treatment }: Pick<TreatmentCardProps, 'treatment'>) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<Array<HTMLElement | null>>([])
  const dragStateRef = useRef<DragState | null>(null)
  const scrollFrameRef = useRef<number | null>(null)
  const scrollSettleRef = useRef<number | null>(null)
  const resizeFrameRef = useRef<number | null>(null)
  const animationRef = useRef<GalleryAnimation | null>(null)
  const activeIndexRef = useRef(0)
  const targetIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const mediaCount = treatment.media.length
  const hasMultipleMedia = mediaCount > 1
  const hasInstitutionalMedia = treatment.media.some(
    (media) => media.kind === 'institutional',
  )
  const mediaNoun = hasInstitutionalMedia ? 'imagem' : 'resultado'
  const renderedMedia = hasMultipleMedia
    ? [
        {
          media: treatment.media[mediaCount - 1],
          logicalIndex: mediaCount - 1,
          duplicate: true,
          key: `${treatment.media[mediaCount - 1].id}-clone-before`,
        },
        ...treatment.media.map((media, logicalIndex) => ({
          media,
          logicalIndex,
          duplicate: false,
          key: media.id,
        })),
        {
          media: treatment.media[0],
          logicalIndex: 0,
          duplicate: true,
          key: `${treatment.media[0].id}-clone-after`,
        },
      ]
    : treatment.media.map((media) => ({
        media,
        logicalIndex: 0,
        duplicate: false,
        key: media.id,
      }))

  const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const commitIndex = (index: number) => {
    activeIndexRef.current = index
    targetIndexRef.current = index
    setActiveIndex(index)
  }

  const clearScrollSettle = () => {
    if (scrollSettleRef.current !== null) {
      window.clearTimeout(scrollSettleRef.current)
      scrollSettleRef.current = null
    }
  }

  const physicalToLogical = (physicalIndex: number) => {
    if (!hasMultipleMedia) return 0
    if (physicalIndex === 0) return mediaCount - 1
    if (physicalIndex === mediaCount + 1) return 0
    return physicalIndex - 1
  }

  const nearestPhysicalIndex = () => {
    const viewport = viewportRef.current
    if (!viewport) return hasMultipleMedia ? activeIndexRef.current + 1 : 0

    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return
      const distance = Math.abs(slide.offsetLeft - viewport.scrollLeft)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })
    return nearestIndex
  }

  const normalizePhysicalPosition = (
    physicalIndex: number,
    logicalIndex: number,
  ) => {
    const viewport = viewportRef.current
    if (!viewport) return

    let canonicalIndex = physicalIndex
    if (hasMultipleMedia && physicalIndex === 0) canonicalIndex = mediaCount
    if (hasMultipleMedia && physicalIndex === mediaCount + 1) canonicalIndex = 1

    const canonicalSlide = slideRefs.current[canonicalIndex]
    if (canonicalSlide && canonicalIndex !== physicalIndex) {
      viewport.scrollLeft = canonicalSlide.offsetLeft
    }
    commitIndex(logicalIndex)
  }

  const cancelAnimation = (complete = false) => {
    const animation = animationRef.current
    if (!animation) return

    window.cancelAnimationFrame(animation.frameId)
    animationRef.current = null

    if (complete) {
      const viewport = viewportRef.current
      if (viewport) viewport.scrollLeft = animation.targetLeft
      normalizePhysicalPosition(
        animation.targetPhysicalIndex,
        animation.targetLogicalIndex,
      )
    }
  }

  const animateToPhysical = (
    physicalIndex: number,
    logicalIndex: number,
    duration = 420,
  ) => {
    const viewport = viewportRef.current
    const targetSlide = slideRefs.current[physicalIndex]
    if (!viewport || !targetSlide) return

    cancelAnimation()
    clearScrollSettle()
    targetIndexRef.current = logicalIndex

    const startLeft = viewport.scrollLeft
    const targetLeft = targetSlide.offsetLeft
    const distance = targetLeft - startLeft

    if (reducedMotion() || Math.abs(distance) < 1) {
      viewport.scrollLeft = targetLeft
      normalizePhysicalPosition(physicalIndex, logicalIndex)
      return
    }

    const startedAt = performance.now()
    const animation: GalleryAnimation = {
      frameId: 0,
      targetLeft,
      targetLogicalIndex: logicalIndex,
      targetPhysicalIndex: physicalIndex,
    }
    animationRef.current = animation

    const tick = (now: number) => {
      if (animationRef.current !== animation) return

      const progress = Math.min((now - startedAt) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      viewport.scrollLeft = startLeft + distance * eased

      if (progress < 1) {
        animation.frameId = window.requestAnimationFrame(tick)
        return
      }

      animationRef.current = null
      viewport.scrollLeft = targetLeft
      normalizePhysicalPosition(physicalIndex, logicalIndex)
    }

    animation.frameId = window.requestAnimationFrame(tick)
  }

  const navigateBy = (direction: -1 | 1) => {
    if (!hasMultipleMedia) return

    // Complete an in-flight step before accepting another rapid click, keeping
    // every destination adjacent even at the cloned ends of the carousel.
    cancelAnimation(true)
    const currentIndex = physicalToLogical(nearestPhysicalIndex())
    const nextIndex = (currentIndex + direction + mediaCount) % mediaCount
    const physicalIndex =
      direction === 1 && currentIndex === mediaCount - 1
        ? mediaCount + 1
        : direction === -1 && currentIndex === 0
          ? 0
          : nextIndex + 1

    animateToPhysical(physicalIndex, nextIndex)
  }

  const navigateToIndex = (requestedIndex: number) => {
    if (!hasMultipleMedia) return

    cancelAnimation(true)
    const nextIndex = Math.max(0, Math.min(requestedIndex, mediaCount - 1))
    const currentIndex = physicalToLogical(nearestPhysicalIndex())
    let physicalIndex = nextIndex + 1

    if (currentIndex === 0 && nextIndex === mediaCount - 1) physicalIndex = 0
    if (currentIndex === mediaCount - 1 && nextIndex === 0) {
      physicalIndex = mediaCount + 1
    }

    animateToPhysical(physicalIndex, nextIndex)
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const alignCurrentSlide = () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current.frameId)
        animationRef.current = null
      }
      const logicalIndex = targetIndexRef.current
      const physicalIndex = hasMultipleMedia ? logicalIndex + 1 : 0
      const slide = slideRefs.current[physicalIndex]
      if (!slide) return

      viewport.scrollLeft = slide.offsetLeft
      commitIndex(logicalIndex)
    }

    const scheduleAlignment = () => {
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current)
      }
      resizeFrameRef.current = window.requestAnimationFrame(alignCurrentSlide)
    }

    const observer = new ResizeObserver(scheduleAlignment)
    observer.observe(viewport)
    scheduleAlignment()

    return () => {
      observer.disconnect()
      if (resizeFrameRef.current !== null) {
        window.cancelAnimationFrame(resizeFrameRef.current)
      }
    }
  }, [hasMultipleMedia, mediaCount])

  useEffect(
    () => () => {
      if (animationRef.current) {
        window.cancelAnimationFrame(animationRef.current.frameId)
      }
      if (scrollSettleRef.current !== null) {
        window.clearTimeout(scrollSettleRef.current)
      }
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
    },
    [],
  )

  const handleScroll = () => {
    if (animationRef.current || dragStateRef.current?.axis === 'horizontal') return

    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current)
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const physicalIndex = nearestPhysicalIndex()
      const logicalIndex = physicalToLogical(physicalIndex)

      clearScrollSettle()
      scrollSettleRef.current = window.setTimeout(() => {
        animateToPhysical(physicalIndex, logicalIndex, 240)
      }, 110)
    })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      !hasMultipleMedia ||
      (event.pointerType === 'mouse' && event.button !== 0) ||
      (event.target as HTMLElement).closest('button')
    ) {
      return
    }

    cancelAnimation(true)
    clearScrollSettle()
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: event.currentTarget.scrollLeft,
      startLogicalIndex: physicalToLogical(nearestPhysicalIndex()),
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
      axis: 'pending',
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    if (dragState.axis === 'pending') {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 7) return
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        dragState.axis = 'vertical'
        dragStateRef.current = null
        return
      }

      dragState.axis = 'horizontal'
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.dataset.dragging = 'true'
    }

    if (dragState.axis !== 'horizontal') return

    event.preventDefault()
    const elapsed = Math.max(event.timeStamp - dragState.lastTime, 1)
    const instantaneousVelocity = -(event.clientX - dragState.lastX) / elapsed
    dragState.velocity = dragState.velocity * 0.58 + instantaneousVelocity * 0.42
    dragState.lastX = event.clientX
    dragState.lastTime = event.timeStamp
    event.currentTarget.scrollLeft = dragState.startScrollLeft - deltaX
  }

  const finishPointerDrag = (
    event: PointerEvent<HTMLDivElement>,
    cancelled = false,
  ) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    dragStateRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    delete event.currentTarget.dataset.dragging

    if (dragState.axis !== 'horizontal') return

    const displacement = event.currentTarget.scrollLeft - dragState.startScrollLeft
    const threshold = event.currentTarget.clientWidth * 0.18
    const hasDirectionalIntent =
      !cancelled &&
      (Math.abs(displacement) >= threshold || Math.abs(dragState.velocity) >= 0.42)

    if (hasDirectionalIntent) {
      const direction: -1 | 1 = displacement > 0 || dragState.velocity > 0 ? 1 : -1
      const nextIndex =
        (dragState.startLogicalIndex + direction + mediaCount) % mediaCount
      const physicalIndex =
        direction === 1 && dragState.startLogicalIndex === mediaCount - 1
          ? mediaCount + 1
          : direction === -1 && dragState.startLogicalIndex === 0
            ? 0
            : nextIndex + 1
      animateToPhysical(physicalIndex, nextIndex)
      return
    }

    if (cancelled) {
      const nearestIndex = nearestPhysicalIndex()
      animateToPhysical(nearestIndex, physicalToLogical(nearestIndex), 300)
      return
    }

    animateToPhysical(
      dragState.startLogicalIndex + 1,
      dragState.startLogicalIndex,
      320,
    )
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasMultipleMedia) return

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      navigateBy(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      navigateBy(-1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      navigateToIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      navigateToIndex(mediaCount - 1)
    }
  }

  return (
    <div className="treatment-card__image">
      <div className="treatment-gallery__frame">
        <div
          className="treatment-gallery__viewport"
          ref={viewportRef}
          role={hasMultipleMedia ? 'region' : 'group'}
          aria-roledescription={hasMultipleMedia ? 'carrossel' : undefined}
          aria-label={
            hasMultipleMedia
              ? `${hasInstitutionalMedia ? 'Imagens' : 'Resultados'} de ${treatment.eyebrow}. Arraste ou use as setas para navegar.`
              : `Imagem de ${treatment.eyebrow}`
          }
          tabIndex={hasMultipleMedia ? 0 : undefined}
          onScroll={handleScroll}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => finishPointerDrag(event)}
          onPointerCancel={(event) => finishPointerDrag(event, true)}
          onKeyDown={handleKeyDown}
        >
          <div className="treatment-gallery__track">
            {renderedMedia.map(
              ({ media, logicalIndex, duplicate, key }, physicalIndex) => (
                <figure
                  className="treatment-gallery__slide"
                  data-media-kind={media.kind}
                  data-media-fit={media.fit}
                  ref={(node) => {
                    slideRefs.current[physicalIndex] = node
                  }}
                  role={hasMultipleMedia && !duplicate ? 'group' : undefined}
                  aria-roledescription={
                    hasMultipleMedia && !duplicate ? 'slide' : undefined
                  }
                  aria-label={
                    hasMultipleMedia && !duplicate
                      ? `${logicalIndex + 1} de ${mediaCount}`
                      : undefined
                  }
                  aria-hidden={
                    duplicate || (hasMultipleMedia && logicalIndex !== activeIndex)
                  }
                  key={key}
                >
                  <img
                    src={media.image}
                    alt={duplicate ? '' : media.alt}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                  />
                  {media.kind === 'result' && (
                    <>
                      <span className="treatment-gallery__label treatment-gallery__label--before">
                        Antes
                      </span>
                      <span className="treatment-gallery__label treatment-gallery__label--after">
                        Depois
                      </span>
                    </>
                  )}
                </figure>
              ),
            )}
          </div>
        </div>

        {hasMultipleMedia && (
          <>
            <button
              className="treatment-gallery__arrow treatment-gallery__arrow--previous"
              type="button"
              aria-label={`Ver ${mediaNoun} anterior de ${treatment.eyebrow}`}
              onClick={() => navigateBy(-1)}
            >
              ‹
            </button>
            <button
              className="treatment-gallery__arrow treatment-gallery__arrow--next"
              type="button"
              aria-label={`Ver ${hasInstitutionalMedia ? 'próxima imagem' : 'próximo resultado'} de ${treatment.eyebrow}`}
              onClick={() => navigateBy(1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {hasMultipleMedia && (
        <div className="treatment-gallery__status">
          <span aria-live="polite">
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(mediaCount).padStart(2, '0')}
          </span>
          <div className="treatment-gallery__dots" aria-label={`Selecionar ${mediaNoun}`}>
            {treatment.media.map((media, index) => (
              <button
                type="button"
                data-active={activeIndex === index}
                aria-label={`Mostrar ${mediaNoun} ${index + 1}`}
                aria-current={activeIndex === index ? 'true' : undefined}
                onClick={() => navigateToIndex(index)}
                key={media.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TreatmentCopy({ treatment, onNavigate }: TreatmentCardProps) {
  const { destination } = treatment
  const availableProfessionals = treatment.professionalIds
    .map(getProfessional)
    .filter((professional) => professional !== undefined)
  const exploreControl =
    destination.type === 'page' ? (
      <button
        className="treatment-card__explore"
        type="button"
        onClick={() => onNavigate(destination.page)}
        aria-label={`Explorar ${treatment.eyebrow}`}
      >
        Explorar especialidade
      </button>
    ) : (
      <a
        className="treatment-card__explore"
        href={destination.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Conversar sobre ${treatment.eyebrow} pelo WhatsApp`}
      >
        Saiba mais pelo WhatsApp
      </a>
    )

  return (
    <div className="treatment-card__copy">
      <p className="treatment-card__eyebrow">{treatment.eyebrow}</p>
      <h3>{treatment.title}</h3>
      <p className="treatment-card__highlights">
        {treatment.highlights.map((highlight, index) => (
          <span key={highlight}>
            {highlight}
            {index < treatment.highlights.length - 1 && (
              <span className="treatment-card__bullet" aria-hidden="true">
                {' '}•{' '}
              </span>
            )}
          </span>
        ))}
      </p>
      <p className="treatment-card__description">{treatment.description}</p>
      <div className="treatment-card__tags" aria-label="Benefícios">
        {treatment.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="treatment-card__professionals">
        <p>Profissionais disponíveis</p>
        <ul>
          {availableProfessionals.map((professional) => (
            <li key={professional.id}>
              <strong>{professional.name}</strong>
              <small>{professionalCredentials(professional)}</small>
            </li>
          ))}
        </ul>
      </div>

      {exploreControl}
    </div>
  )
}

export function TreatmentCard({ treatment, onNavigate }: TreatmentCardProps) {
  const gallery = <TreatmentGallery treatment={treatment} />
  const copy = <TreatmentCopy treatment={treatment} onNavigate={onNavigate} />

  return (
    <article
      id={`tratamento-${treatment.id}`}
      className={`treatment-card treatment-card--${treatment.tone} treatment-card--image-${treatment.imageSide} treatment-card--${treatment.id}`}
      data-reveal="up"
    >
      <div className="treatment-card__watermark" aria-hidden="true">
        <img
          src={treatment.tone === 'gold' ? cardMarkGold : separatorMark}
          alt=""
        />
      </div>

      {gallery}
      {copy}

      {treatment.hasMedallion && (
        <img
          className="treatment-card__medallion"
          src={cardMedallion}
          alt=""
          aria-hidden="true"
        />
      )}
    </article>
  )
}
