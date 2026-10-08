import type { CSSProperties, Ref } from 'react'
import decorMarkLeft from '../assets/about/decor-mark-left.svg'
import decorMarkRight from '../assets/about/decor-mark-right.svg'
import brandMark from '../assets/hero/brand-mark.svg'
import { getWhatsAppLink, type SitePage } from '../data/site'
import { harmonizationBodyRecord, resultCases } from '../data/results'
import { useContinuousCarousel } from '../hooks/useContinuousCarousel'
import type { ResultCase } from '../types/content'
import { specialtyImageProps } from '../data/specialtyImageVariants'

type ResultCardProps = {
  result: ResultCase
  isClone?: boolean
}

type ResultRowProps = {
  id: string
  title?: string
  results: ResultCase[]
  direction: 'left' | 'right'
  accessibleLabel: string
  interactive?: boolean
}

type ResultGroupProps = {
  results: ResultCase[]
  duplicate?: boolean
  groupRef?: Ref<HTMLDivElement>
}

const defaultResultsRows: ResultRowProps[] = Array.from(
  { length: 4 },
  (_, index) => ({
    id: `general-${index + 1}`,
    results: resultCases.slice(index * 3, index * 3 + 3),
    direction: index % 2 === 0 ? 'right' : 'left',
    accessibleLabel: `Resultados estéticos, fileira ${index + 1} de 4`,
  }),
)

const weightLossResults = resultCases.filter(
  ({ id }) => id === 'resultado-10' || id === 'resultado-12',
)

const harmonizationFacialResults = resultCases.filter(({ id }) =>
  [
    'resultado-04',
    'resultado-05',
    'resultado-06',
    'resultado-07',
    'resultado-08',
    'resultado-09',
  ].includes(id),
)

const harmonizationBodyResults = [
  ...resultCases.filter(({ id }) =>
    ['resultado-01', 'resultado-02', 'resultado-03'].includes(id),
  ),
  harmonizationBodyRecord,
]

const weightLossRows: ResultRowProps[] = [
  {
    id: 'weight-loss',
    results: weightLossResults,
    direction: 'right',
    accessibleLabel: 'Resultados de emagrecimento, vistas frontal e lateral',
  },
]

const harmonizationRows: ResultRowProps[] = [
  {
    id: 'harmonization-facial',
    title: 'Harmonização facial',
    results: harmonizationFacialResults,
    direction: 'left',
    accessibleLabel:
      'Resultados de harmonização facial. Arraste ou use as setas para navegar.',
    interactive: true,
  },
  {
    id: 'harmonization-body',
    title: 'Harmonização corporal',
    results: harmonizationBodyResults,
    direction: 'right',
    accessibleLabel:
      'Resultados de harmonização corporal. Arraste ou use as setas para navegar.',
    interactive: true,
  },
]

function ResultCard({ result, isClone = false }: ResultCardProps) {
  const isClinicalRecord = result.kind === 'clinical-record'
  return (
    <figure className={`results-card${result.format ? ` results-card--${result.format}` : ''}`} role={isClone ? undefined : 'listitem'}>
      <img
        className={`results-card__image results-card__image--${result.fit ?? 'cover'}`}
        src={result.image}
        {...specialtyImageProps(result.image, '(max-width: 700px) 85vw, 480px')}
        alt={isClone ? '' : result.alt}
        loading="lazy"
        decoding="async"
        draggable={false}
      />

      {isClinicalRecord ? (
        <span className="results-card__label results-card__label--record">Registro clínico</span>
      ) : (
        <>
          <span className="results-card__label results-card__label--before">Antes</span>
          <span className="results-card__label results-card__label--after">Depois</span>
        </>
      )}
    </figure>
  )
}

function ResultGroup({ results, duplicate = false, groupRef }: ResultGroupProps) {
  return (
    <div
      className={`results-marquee__group${duplicate ? ' results-marquee__group--clone' : ''}`}
      ref={groupRef}
      role={duplicate ? undefined : 'list'}
      aria-hidden={duplicate || undefined}
    >
      {results.map((result) => (
        <ResultCard
          result={result}
          isClone={duplicate}
          key={`${result.id}${duplicate ? '-clone' : ''}`}
        />
      ))}
    </div>
  )
}

function ResultRowHeading({ title }: { title?: string }) {
  return title ? (
    <div className="results-row__heading">
      <h3>{title}</h3>
      <span aria-hidden="true" />
    </div>
  ) : null
}

function InteractiveResultRow({
  id,
  title,
  results,
  direction,
  accessibleLabel,
}: ResultRowProps) {
  const {
    viewportRef,
    trackRef,
    primaryGroupRef,
    copyCount,
    isDragging,
    prefersReducedMotion,
    carouselHandlers,
  } = useContinuousCarousel({
    itemSelector: '.results-card',
    direction,
    baseSpeed: 38,
    slowFactor: 0.35,
    dependencyKey: id,
  })

  return (
    <div className={`results-row${title ? ' results-row--titled' : ''}`}>
      <ResultRowHeading title={title} />

      <div
        className={`results-marquee results-marquee--${direction}`}
        role="region"
        aria-roledescription="carrossel"
        aria-label={
          prefersReducedMotion
            ? `${accessibleLabel.replace(' Arraste ou use as setas para navegar.', '')} Deslize para ver os demais.`
            : accessibleLabel
        }
        tabIndex={0}
        data-interactive="true"
        data-dragging={isDragging || undefined}
        ref={viewportRef}
        {...carouselHandlers}
      >
        <div className="results-marquee__track" ref={trackRef}>
          {Array.from({ length: copyCount }, (_, copyIndex) => (
            <ResultGroup
              results={results}
              duplicate={copyIndex > 0}
              groupRef={copyIndex === 0 ? primaryGroupRef : undefined}
              key={`${id}-group-${copyIndex}`}
            />
          ))}
        </div>

        <span className="results-marquee__shade results-marquee__shade--left" aria-hidden="true" />
        <span className="results-marquee__shade results-marquee__shade--right" aria-hidden="true" />
      </div>
    </div>
  )
}

function StaticResultRow({ title, results, direction, accessibleLabel }: ResultRowProps) {
  const rowStyle = { '--results-count': results.length } as CSSProperties

  return (
    <div
      className={`results-row${title ? ' results-row--titled' : ''}`}
      style={rowStyle}
    >
      <ResultRowHeading title={title} />

      <div
        className={`results-marquee results-marquee--${direction}`}
        role="group"
        aria-label={accessibleLabel}
        tabIndex={0}
      >
        <div className="results-marquee__track">
          <ResultGroup results={results} />
          {[1, 2].map((copy) => (
            <ResultGroup results={results} duplicate key={copy} />
          ))}
        </div>

        <span className="results-marquee__shade results-marquee__shade--left" aria-hidden="true" />
        <span className="results-marquee__shade results-marquee__shade--right" aria-hidden="true" />
      </div>
    </div>
  )
}

function ResultRow(props: ResultRowProps) {
  return props.interactive ? (
    <InteractiveResultRow {...props} />
  ) : (
    <StaticResultRow {...props} />
  )
}

type ResultsProps = {
  page?: SitePage
}

export function Results({ page = 'inicio' }: ResultsProps) {
  const visibleRows =
    page === 'emagrecimento'
      ? weightLossRows
      : page === 'harmonizacao'
        ? harmonizationRows
        : defaultResultsRows

  return (
    <section
      id="resultados"
      className="results-section"
      aria-labelledby="results-title"
      data-specialty={page}
    >
      <div className="results-section__decor" aria-hidden="true">
        <img
          className="results-section__decor-mark results-section__decor-mark--left"
          src={decorMarkLeft}
          alt=""
        />
        <img
          className="results-section__decor-mark results-section__decor-mark--right"
          src={decorMarkRight}
          alt=""
        />
      </div>

      <div className="results-section__inner">
        <header className="results-section__header" data-reveal="up">
          <p className="results-section__eyebrow">Nossos resultados</p>
          <h2 id="results-title">Transformações que preservam a sua essência.</h2>
          <p>
            Uma equipe multiprofissional que une experiência, escuta e cuidado
            personalizado em cada etapa.
          </p>
        </header>

        <div className="results-section__marquees" data-reveal="up">
          {visibleRows.map((row) => (
            <ResultRow {...row} key={row.id} />
          ))}
        </div>

        <a
          className="results-section__cta brand-cta brand-cta--compact"
          href={getWhatsAppLink(page)}
          target="_blank"
          rel="noreferrer"
          data-reveal="up"
        >
          <span className="results-section__cta-mark brand-cta__mark" aria-hidden="true">
            <img src={brandMark} alt="" />
          </span>
          <span className="brand-cta__label">Agendar avaliação</span>
        </a>
      </div>
    </section>
  )
}
