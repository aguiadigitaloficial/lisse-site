import decorMarkLeft from '../assets/about/decor-mark-left.svg'
import decorMarkRight from '../assets/about/decor-mark-right.svg'
import type { SpecialtyPage } from '../data/site'
import { specialtyPages } from '../data/specialtyPages'
import { specialtyImageProps } from '../data/specialtyImageVariants'
import type { SpecialtyProcedure } from '../types/content'

type ProcedureCardProps = {
  procedure: SpecialtyProcedure
}

function ProcedureCard({ procedure }: ProcedureCardProps) {
  return (
    <article
      className={`harmonization-procedure harmonization-procedure--image-${procedure.imageSide}`}
      data-reveal="up"
    >
      <div className="harmonization-procedure__image">
        <img
          src={procedure.image}
          {...specialtyImageProps(procedure.image, '(max-width: 999px) 90vw, 550px')}
          alt={procedure.imageAlt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: procedure.imagePosition }}
        />
      </div>

      <div className="harmonization-procedure__copy">
        <p className="harmonization-procedure__eyebrow">
          {procedure.eyebrow}
        </p>
        <h3>{procedure.title}</h3>
        <p className="harmonization-procedure__highlights">
          {procedure.highlights.map((highlight, index) => (
            <span key={highlight}>
              {highlight}
              {index < procedure.highlights.length - 1 && (
                <span aria-hidden="true"> • </span>
              )}
            </span>
          ))}
        </p>
        <p className="harmonization-procedure__description">
          {procedure.description}
        </p>
        <p className="harmonization-procedure__indication-label">
          Indicado para:
        </p>
        <div
          className="harmonization-procedure__tags"
          aria-label="Indicações"
        >
          {procedure.indications.map((indication) => (
            <span key={indication}>{indication}</span>
          ))}
        </div>
        <span
          className="harmonization-procedure__explore"
          aria-disabled="true"
        >
          Explorar especialidade
        </span>
      </div>
    </article>
  )
}

type SpecialtyProceduresProps = {
  page: SpecialtyPage
}

export function SpecialtyProcedures({ page }: SpecialtyProceduresProps) {
  const config = specialtyPages[page]

  return (
    <section
      id="procedimentos"
      className="harmonization-procedures"
      aria-labelledby={`${page}-procedures-title`}
      data-specialty={page}
    >
      <div className="harmonization-procedures__decor" aria-hidden="true">
        <img
          className="harmonization-procedures__mark harmonization-procedures__mark--upper-left"
          src={decorMarkLeft}
          alt=""
        />
        <img
          className="harmonization-procedures__mark harmonization-procedures__mark--middle-right"
          src={decorMarkRight}
          alt=""
        />
        <img
          className="harmonization-procedures__mark harmonization-procedures__mark--lower-right"
          src={decorMarkRight}
          alt=""
        />
      </div>

      <div className="harmonization-procedures__inner">
        <header className="harmonization-procedures__header" data-reveal="up">
          <p className="harmonization-procedures__eyebrow">
            {config.proceduresHeader.eyebrow}
          </p>
          <h2 id={`${page}-procedures-title`}>
            {config.proceduresHeader.title}
          </h2>
          <p>{config.proceduresHeader.description}</p>
        </header>

        <div className="harmonization-procedures__list">
          {config.procedures.map((procedure) => (
            <ProcedureCard procedure={procedure} key={procedure.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
