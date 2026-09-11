import type { Ref } from 'react'
import cardWatermark from '../assets/treatments/card-mark-gold.svg'
import type { SpecialtyPage } from '../data/site'
import { specialtyPages } from '../data/specialtyPages'
import { useContinuousCarousel } from '../hooks/useContinuousCarousel'
import type { SpecialtyBenefit } from '../types/content'

type BenefitsGroupProps = {
  benefits: readonly SpecialtyBenefit[]
  duplicate?: boolean
  groupRef?: Ref<HTMLDivElement>
}

function BenefitsGroup({ benefits, duplicate = false, groupRef }: BenefitsGroupProps) {
  return (
    <div
      className="harmonization-benefits__group"
      ref={groupRef}
      role={duplicate ? undefined : 'list'}
      aria-hidden={duplicate || undefined}
    >
      {benefits.map((benefit) => (
        <article
          className="harmonization-benefit-card"
          role={duplicate ? undefined : 'listitem'}
          key={benefit.id}
        >
          <img
            className="harmonization-benefit-card__watermark"
            src={cardWatermark}
            alt=""
            aria-hidden="true"
          />
          <span className="harmonization-benefit-card__icon" aria-hidden="true">
            <img src={benefit.icon} alt="" loading="lazy" decoding="async" />
          </span>
          <span className="harmonization-benefit-card__rule" aria-hidden="true" />
          <h2>{benefit.title}</h2>
          <p>{benefit.description}</p>
        </article>
      ))}
    </div>
  )
}

type SpecialtyBenefitsProps = {
  page: SpecialtyPage
}

export function SpecialtyBenefits({ page }: SpecialtyBenefitsProps) {
  const config = specialtyPages[page]
  const isEditorialCarousel = config.benefitsVariant === 'editorial-carousel'
  const {
    viewportRef,
    trackRef,
    primaryGroupRef,
    copyCount,
    isPaused,
    isDragging,
    prefersReducedMotion,
    togglePaused,
    carouselHandlers,
  } = useContinuousCarousel({
    itemSelector: '.harmonization-benefit-card',
    interactive: isEditorialCarousel,
    slowFactor: isEditorialCarousel ? 0.35 : 0,
    dependencyKey: page,
  })

  return (
    <section
      id={`diferenciais-${page}`}
      className="harmonization-benefits"
      aria-label={config.benefitsLabel}
      data-specialty={page}
      data-variant={config.benefitsVariant}
    >
      {config.benefitsHeading ? (
        <div
          className="harmonization-benefits__header"
          data-reveal={isEditorialCarousel ? undefined : 'up'}
        >
          <div className="harmonization-benefits__heading-copy">
            <h2>{config.benefitsHeading}</h2>
            {config.benefitsDescription ? <p>{config.benefitsDescription}</p> : null}
          </div>

          {!prefersReducedMotion ? (
            <button
              className="harmonization-benefits__motion-control"
              type="button"
              aria-pressed={isPaused}
              aria-label={isPaused ? 'Retomar movimento' : 'Pausar movimento'}
              onClick={togglePaused}
            >
              <span className="harmonization-benefits__motion-icon" aria-hidden="true">
                {isPaused ? (
                  <svg viewBox="0 0 18 18">
                    <path d="M5.8 3.7 14 9l-8.2 5.3V3.7Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 18 18">
                    <path d="M5.1 3.6h2.6v10.8H5.1zM10.3 3.6h2.6v10.8h-2.6z" />
                  </svg>
                )}
              </span>
              {isPaused ? 'Retomar movimento' : 'Pausar movimento'}
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        className="harmonization-benefits__viewport"
        ref={viewportRef}
        tabIndex={isEditorialCarousel || prefersReducedMotion ? 0 : undefined}
        aria-label={
          prefersReducedMotion
            ? 'Diferenciais do acompanhamento. Deslize para ver os demais.'
            : isEditorialCarousel
              ? page === 'harmonizacao'
                ? 'Carrossel dos pilares da harmonização. Arraste ou use as setas para navegar.'
                : 'Carrossel contínuo de diferenciais. Arraste ou use as setas para navegar.'
              : 'Carrossel contínuo de diferenciais do acompanhamento.'
        }
        data-reveal={isEditorialCarousel ? undefined : 'fade'}
        data-paused={isPaused || undefined}
        data-dragging={isDragging || undefined}
        {...carouselHandlers}
      >
        <div className="harmonization-benefits__track" ref={trackRef}>
          {Array.from({ length: copyCount }, (_, index) => (
            <BenefitsGroup
              benefits={config.benefits}
              duplicate={index > 0}
              groupRef={index === 0 ? primaryGroupRef : undefined}
              key={`${page}-benefits-group-${index}`}
            />
          ))}
        </div>

        <span className="harmonization-benefits__shade harmonization-benefits__shade--left" />
        <span className="harmonization-benefits__shade harmonization-benefits__shade--right" />
      </div>
    </section>
  )
}
