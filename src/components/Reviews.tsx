import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import decorMarkLeft from '../assets/about/decor-mark-left.svg'
import decorMarkRight from '../assets/about/decor-mark-right.svg'
import brandMark from '../assets/hero/brand-mark.svg'
import arrowIcon from '../assets/reviews/arrow.svg'
import googleIcon from '../assets/reviews/google-icon.png'
import starsIcon from '../assets/reviews/stars.svg'
import {
  harmonizationReviews,
  phaloplastyReviews,
  reviews,
  weightLossReviews,
} from '../data/reviews'
import { externalLinks, getWhatsAppLink, type SitePage } from '../data/site'
import type { Review } from '../types/content'

type DragState = {
  pointerId: number
  startX: number
  startScrollLeft: number
}

const REVIEW_LOOP_COPIES = 3
const REVIEW_LOOP_MIDDLE_COPY = 1
const INITIAL_REVIEW_INDEX = 2

function GoogleSummary({ neutral = false }: { neutral?: boolean }) {
  return (
    <div
      className="reviews-summary"
      data-neutral={neutral || undefined}
      data-reveal={neutral ? undefined : 'up'}
    >
      <div className="reviews-summary__identity">
        <img src={googleIcon} alt="Google" />
        <div>
          <strong>
            {neutral
              ? 'Avaliações da Lisse Clinic no Google'
              : 'Lisse Clinic no Google'}
          </strong>
          {neutral ? (
            <p className="reviews-summary__prompt">
              Confira as experiências publicadas no perfil da clínica.
            </p>
          ) : (
            <div className="reviews-summary__rating">
              <b>5.0</b>
              <img src={starsIcon} alt="5 estrelas" />
              <span>Avaliações de pacientes</span>
            </div>
          )}
        </div>
      </div>

      <a
        className="reviews-summary__link"
        href={externalLinks.googleReviews}
        target="_blank"
        rel="noreferrer"
      >
        Ver todas as avaliações no Google
        <img src={arrowIcon} alt="" aria-hidden="true" />
      </a>
    </div>
  )
}

function getInitials(author: string) {
  const names = author.trim().split(/\s+/)
  const initials = names.length > 1 ? [names[0], names.at(-1)] : [names[0]]

  return initials
    .filter(Boolean)
    .map((name) => name?.charAt(0).toUpperCase())
    .join('')
}

function ReviewCard({ review }: { review: Review }) {
  const isEditorial = review.source === 'editorial'

  return (
    <article className="review-card" data-source={review.source}>
      <header className="review-card__header">
        <div className="review-card__customer">
          <span className="review-card__avatar" aria-hidden="true">
            {review.avatar ? (
              <img src={review.avatar} alt="" />
            ) : (
              <span className="review-card__initials">
                {getInitials(review.author)}
              </span>
            )}
          </span>
          <strong>{review.author}</strong>
        </div>
        {!isEditorial ? (
          <img className="review-card__google" src={googleIcon} alt="Google" />
        ) : null}
      </header>

      {!isEditorial && review.rating && review.relativeDate ? (
        <div className="review-card__meta">
          <img src={starsIcon} alt={`${review.rating} estrelas`} />
          <span>{review.relativeDate}</span>
        </div>
      ) : null}

      {isEditorial ? (
        <p className="review-card__quote">{review.quote}</p>
      ) : (
        <blockquote>{review.quote}</blockquote>
      )}
      <p className="review-card__procedure">{review.procedure}</p>
    </article>
  )
}

type ReviewsProps = {
  page?: SitePage
}

export function Reviews({ page = 'inicio' }: ReviewsProps) {
  const isWeightLoss = page === 'emagrecimento'
  const isHarmonization = page === 'harmonizacao'
  const isPhaloplasty = page === 'faloplastia'
  const isEditorialPage = isWeightLoss || isHarmonization || isPhaloplasty
  const activeReviews = isWeightLoss
    ? weightLossReviews
    : isHarmonization
      ? harmonizationReviews
      : isPhaloplasty
        ? phaloplastyReviews
      : reviews
  const reviewCount = activeReviews.length
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const scrollFrameRef = useRef<number | null>(null)
  const normalizationTimerRef = useRef<number | null>(null)
  const normalizationFrameRef = useRef<number | null>(null)
  const isNormalizingRef = useRef(false)
  const physicalIndexRef = useRef(
    reviewCount * REVIEW_LOOP_MIDDLE_COPY + INITIAL_REVIEW_INDEX,
  )
  const activeIndexRef = useRef(INITIAL_REVIEW_INDEX)
  const [activeIndex, setActiveIndex] = useState(INITIAL_REVIEW_INDEX)

  const loopedReviews = Array.from(
    { length: REVIEW_LOOP_COPIES },
    (_, copyIndex) =>
      activeReviews.map((review, logicalIndex) => ({
        copyIndex,
        logicalIndex,
        review,
      })),
  ).flat()

  const getSlideLeft = useCallback((index: number) => {
    const viewport = viewportRef.current
    const slide = viewport?.querySelectorAll<HTMLElement>(
      '.reviews-carousel__slide',
    )[index]

    if (!viewport || !slide) return 0

    return slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2
  }, [])

  const scrollToPhysicalIndex = useCallback(
    (requestedIndex: number, behavior?: ScrollBehavior) => {
      const viewport = viewportRef.current
      if (!viewport) return

      const slideCount = reviewCount * REVIEW_LOOP_COPIES
      const nextIndex = Math.max(0, Math.min(requestedIndex, slideCount - 1))
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

      viewport.scrollTo({
        left: getSlideLeft(nextIndex),
        behavior: behavior ?? (reducedMotion ? 'auto' : 'smooth'),
      })
      physicalIndexRef.current = nextIndex
      const logicalIndex = nextIndex % reviewCount
      activeIndexRef.current = logicalIndex
      setActiveIndex(logicalIndex)
    },
    [getSlideLeft, reviewCount],
  )

  const scrollToLogicalIndex = useCallback(
    (requestedIndex: number) => {
      const logicalIndex =
        ((requestedIndex % reviewCount) + reviewCount) % reviewCount
      const candidates = Array.from(
        { length: REVIEW_LOOP_COPIES },
        (_, copyIndex) => copyIndex * reviewCount + logicalIndex,
      )
      const currentIndex = physicalIndexRef.current
      const nearestIndex = candidates.reduce((nearest, candidate) =>
        Math.abs(candidate - currentIndex) < Math.abs(nearest - currentIndex)
          ? candidate
          : nearest,
      )

      scrollToPhysicalIndex(nearestIndex)
    },
    [reviewCount, scrollToPhysicalIndex],
  )

  useLayoutEffect(() => {
    const positionInitialSlide = () =>
      scrollToPhysicalIndex(
        reviewCount * REVIEW_LOOP_MIDDLE_COPY + activeIndexRef.current,
        'auto',
      )
    const frame = window.requestAnimationFrame(positionInitialSlide)
    window.addEventListener('resize', positionInitialSlide)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', positionInitialSlide)
    }
  }, [reviewCount, scrollToPhysicalIndex])

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
      if (normalizationTimerRef.current !== null) {
        window.clearTimeout(normalizationTimerRef.current)
      }
      if (normalizationFrameRef.current !== null) {
        window.cancelAnimationFrame(normalizationFrameRef.current)
      }
    },
    [],
  )

  const findNearestSlide = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return 0

    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2
    const slides = Array.from(
      viewport.querySelectorAll<HTMLElement>('.reviews-carousel__slide'),
    )

    return slides.reduce(
      (nearest, slide, index) => {
        const distance = Math.abs(
          slide.offsetLeft + slide.offsetWidth / 2 - viewportCenter,
        )
        return distance < nearest.distance ? { index, distance } : nearest
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index
  }, [])

  const normalizeLoopPosition = useCallback(() => {
    const viewport = viewportRef.current
    const physicalIndex = physicalIndexRef.current
    if (!viewport || isNormalizingRef.current) return

    let normalizedIndex = physicalIndex
    if (physicalIndex < reviewCount) {
      normalizedIndex = physicalIndex + reviewCount
    } else if (physicalIndex >= reviewCount * 2) {
      normalizedIndex = physicalIndex - reviewCount
    }

    if (normalizedIndex === physicalIndex) return

    const slides = viewport.querySelectorAll<HTMLElement>(
      '.reviews-carousel__slide',
    )
    const currentSlide = slides[physicalIndex]
    const normalizedSlide = slides[normalizedIndex]
    if (!currentSlide || !normalizedSlide) return

    const previousInlineBehavior = viewport.style.scrollBehavior
    isNormalizingRef.current = true
    const offsetDelta = normalizedSlide.offsetLeft - currentSlide.offsetLeft
    viewport.style.scrollBehavior = 'auto'
    viewport.scrollLeft += offsetDelta
    if (dragStateRef.current) {
      dragStateRef.current.startScrollLeft += offsetDelta
    }
    physicalIndexRef.current = normalizedIndex

    normalizationFrameRef.current = window.requestAnimationFrame(() => {
      viewport.style.scrollBehavior = previousInlineBehavior
      isNormalizingRef.current = false
      normalizationFrameRef.current = null
    })
  }, [reviewCount])

  const handleScroll = () => {
    if (isNormalizingRef.current) return

    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current)
    }

    if (normalizationTimerRef.current !== null) {
      window.clearTimeout(normalizationTimerRef.current)
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const physicalIndex = findNearestSlide()
      const logicalIndex = physicalIndex % reviewCount
      physicalIndexRef.current = physicalIndex
      activeIndexRef.current = logicalIndex
      setActiveIndex(logicalIndex)

      if (!dragStateRef.current) {
        normalizationTimerRef.current = window.setTimeout(
          () => {
            normalizationTimerRef.current = null
            normalizeLoopPosition()
          },
          140,
        )
      }
    })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return

    if (normalizationTimerRef.current !== null) {
      window.clearTimeout(normalizationTimerRef.current)
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.dataset.dragging = 'true'
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    event.preventDefault()
    event.currentTarget.scrollLeft =
      dragState.startScrollLeft - (event.clientX - dragState.startX)

    physicalIndexRef.current = findNearestSlide()
    normalizeLoopPosition()
  }

  const finishPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    delete event.currentTarget.dataset.dragging
    dragStateRef.current = null
    scrollToPhysicalIndex(findNearestSlide())
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollToPhysicalIndex(physicalIndexRef.current + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollToPhysicalIndex(physicalIndexRef.current - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      scrollToLogicalIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      scrollToLogicalIndex(reviewCount - 1)
    }
  }

  return (
    <section
      id="avaliacoes"
      className="reviews-section"
      aria-labelledby="reviews-title"
      data-specialty={page}
    >
      <div className="reviews-section__decor" aria-hidden="true">
        <img
          className="reviews-section__decor-mark reviews-section__decor-mark--left"
          src={decorMarkLeft}
          alt=""
        />
        <img
          className="reviews-section__decor-mark reviews-section__decor-mark--right"
          src={decorMarkRight}
          alt=""
        />
      </div>

      <div className="reviews-section__inner">
        <header
          className="reviews-section__header"
          data-reveal={isEditorialPage ? undefined : 'up'}
        >
          <p className="reviews-section__eyebrow">
            {isEditorialPage ? 'Experiências' : 'Avaliações'}
          </p>
          <h2 id="reviews-title">
            {isWeightLoss
              ? 'Cuidado percebido em cada etapa.'
              : isHarmonization
                ? 'Naturalidade percebida em cada detalhe.'
                : isPhaloplasty
                  ? 'Confiança construída com clareza e discrição.'
                  : 'Experiências que refletem o nosso cuidado.'}
          </h2>
          <p>
            {isWeightLoss
              ? 'Perspectivas sobre acolhimento, clareza e acompanhamento individual durante a jornada.'
              : isHarmonization
                ? 'Perspectivas sobre escuta, planejamento individual e cuidado com a identidade de cada pessoa.'
                : isPhaloplasty
                  ? 'Perspectivas masculinas sobre privacidade, orientação médica e acompanhamento individual.'
                  : 'Relatos de quem confiou na Lisse Clinic e viveu uma experiência personalizada em cada etapa.'}
          </p>
        </header>

        <GoogleSummary neutral={isEditorialPage} />

        <div
          className="reviews-carousel"
          data-reveal={isEditorialPage ? undefined : 'up'}
        >
          <div
            ref={viewportRef}
            className="reviews-carousel__viewport"
            role="region"
            aria-roledescription="carrossel"
            aria-label={
              isWeightLoss
                ? 'Experiências de acompanhamento em emagrecimento'
                : isHarmonization
                  ? 'Experiências de cuidado em harmonização'
                  : isPhaloplasty
                    ? 'Experiências masculinas de cuidado em faloplastia'
                    : 'Avaliações de pacientes'
            }
            tabIndex={0}
            onScroll={handleScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerDrag}
            onPointerCancel={finishPointerDrag}
            onKeyDown={handleKeyDown}
          >
            {loopedReviews.map(
              ({ copyIndex, logicalIndex, review }, physicalIndex) => (
              <div
                className="reviews-carousel__slide"
                role={copyIndex === REVIEW_LOOP_MIDDLE_COPY ? 'group' : undefined}
                aria-roledescription={
                  copyIndex === REVIEW_LOOP_MIDDLE_COPY ? 'slide' : undefined
                }
                aria-label={
                  copyIndex === REVIEW_LOOP_MIDDLE_COPY
                    ? `${logicalIndex + 1} de ${reviewCount}`
                    : undefined
                }
                aria-hidden={
                  copyIndex === REVIEW_LOOP_MIDDLE_COPY ? undefined : true
                }
                key={`${review.id}-copy-${copyIndex}-${physicalIndex}`}
              >
                <ReviewCard review={review} />
              </div>
              ),
            )}
          </div>

          <span className="reviews-carousel__shade reviews-carousel__shade--left" />
          <span className="reviews-carousel__shade reviews-carousel__shade--right" />
        </div>

        <div
          className="reviews-carousel__dots"
          aria-label={isEditorialPage ? 'Selecionar experiência' : 'Selecionar avaliação'}
        >
          {activeReviews.map((review, index) => (
            <button
              type="button"
              className="reviews-carousel__dot"
              data-active={activeIndex === index}
              aria-label={`Mostrar ${isEditorialPage ? 'experiência' : 'avaliação'} ${index + 1}`}
              aria-current={activeIndex === index ? 'true' : undefined}
              onClick={() => scrollToLogicalIndex(index)}
              key={review.id}
            />
          ))}
        </div>

        <p className="visually-hidden" aria-live="polite">
          {isEditorialPage ? 'Experiência' : 'Avaliação'} {activeIndex + 1} de{' '}
          {reviewCount}
        </p>

        <a
          className="reviews-section__cta brand-cta brand-cta--compact"
          href={getWhatsAppLink(page)}
          target="_blank"
          rel="noreferrer"
          data-reveal={isEditorialPage ? undefined : 'up'}
        >
          <span className="reviews-section__cta-mark brand-cta__mark" aria-hidden="true">
            <img src={brandMark} alt="" />
          </span>
          <span className="brand-cta__label">Desejo agendar minha consulta</span>
        </a>
      </div>
    </section>
  )
}
