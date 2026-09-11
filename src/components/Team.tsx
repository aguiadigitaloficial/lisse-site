import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type UIEvent,
} from 'react'
import decorMarkLeft from '../assets/about/decor-mark-left.svg'
import decorMarkRight from '../assets/about/decor-mark-right.svg'
import brandMark from '../assets/hero/brand-mark.svg'
import { externalLinks } from '../data/site'
import { teamMembers } from '../data/team'
import type { TeamMember } from '../types/content'

type DragState = {
  pointerId: number
  startX: number
  startScrollLeft: number
}

type TeamCardProps = {
  member: TeamMember
}

function TeamCard({ member }: TeamCardProps) {
  return (
    <article className="team-card">
      <div className="team-card__portrait">
        {member.image ? (
          <img src={member.image} alt={`Retrato de ${member.name}`} />
        ) : (
          <span aria-hidden="true" />
        )}
      </div>

      <div className="team-card__content">
        <p className="team-card__area">{member.area}</p>
        <h3>{member.name}</h3>
        <p className="team-card__specialty">{member.specialty}</p>
        <p className="team-card__biography">{member.biography}</p>
        <p className="team-card__label">Especialidades</p>
        <div className="team-card__tags">
          {member.tags.map((tag, index) => (
            <span key={`${tag}-${index}`}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  )
}

export function Team() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const scrollFrameRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToIndex = useCallback((requestedIndex: number) => {
    const carousel = carouselRef.current
    if (!carousel) return

    const nextIndex = Math.max(
      0,
      Math.min(requestedIndex, teamMembers.length - 1),
    )
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    carousel.scrollTo({
      left: nextIndex * carousel.clientWidth,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
    setActiveIndex(nextIndex)
  }, [])

  useEffect(
    () => () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
      }
    },
    [],
  )

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const carousel = event.currentTarget

    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current)
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      if (!carousel.clientWidth) return

      const nextIndex = Math.round(carousel.scrollLeft / carousel.clientWidth)
      setActiveIndex(Math.max(0, Math.min(nextIndex, teamMembers.length - 1)))
    })
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return

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
  }

  const finishPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current
    if (!dragState || dragState.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    delete event.currentTarget.dataset.dragging
    dragStateRef.current = null

    const slideWidth = event.currentTarget.clientWidth
    if (!slideWidth) return

    scrollToIndex(Math.round(event.currentTarget.scrollLeft / slideWidth))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      scrollToIndex(activeIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollToIndex(activeIndex - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      scrollToIndex(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      scrollToIndex(teamMembers.length - 1)
    }
  }

  return (
    <section id="equipe" className="team-section" aria-labelledby="team-title">
      <div className="team-section__decor" aria-hidden="true">
        <img
          className="team-section__decor-mark team-section__decor-mark--left"
          src={decorMarkLeft}
          alt=""
        />
        <img
          className="team-section__decor-mark team-section__decor-mark--right"
          src={decorMarkRight}
          alt=""
        />
      </div>

      <div className="team-section__inner">
        <header className="team-section__header" data-reveal="up">
          <p className="team-section__eyebrow">Nossa equipe</p>
          <h2 id="team-title">Conheça quem cuida de você.</h2>
          <p>
            Uma equipe multiprofissional que une experiência, escuta e cuidado
            personalizado em cada etapa.
          </p>
        </header>

        <div className="team-carousel" data-reveal="up">
          <div
            ref={carouselRef}
            className="team-carousel__viewport"
            role="region"
            aria-roledescription="carrossel"
            aria-label="Profissionais da Lisse Clinic"
            tabIndex={0}
            onScroll={handleScroll}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerDrag}
            onPointerCancel={finishPointerDrag}
            onKeyDown={handleKeyDown}
          >
            {teamMembers.map((member, index) => (
              <div
                className="team-carousel__slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${teamMembers.length}`}
                key={member.id}
              >
                <TeamCard member={member} />
              </div>
            ))}
          </div>

          <div className="team-carousel__dots" aria-label="Selecionar profissional">
            {teamMembers.map((member, index) => (
              <button
                type="button"
                className="team-carousel__dot"
                data-active={activeIndex === index}
                aria-label={`Mostrar ${member.name}, opção ${index + 1}`}
                aria-current={activeIndex === index ? 'true' : undefined}
                onClick={() => scrollToIndex(index)}
                key={member.id}
              />
            ))}
          </div>

          <p className="visually-hidden" aria-live="polite">
            Profissional {activeIndex + 1} de {teamMembers.length}
          </p>
        </div>

        <a
          className="team-section__cta brand-cta"
          href={externalLinks.whatsapp}
          target="_blank"
          rel="noreferrer"
          data-reveal="up"
        >
          <span className="team-section__cta-mark brand-cta__mark" aria-hidden="true">
            <img src={brandMark} alt="" />
          </span>
          <span className="brand-cta__label">Desejo agendar minha consulta</span>
        </a>
      </div>
    </section>
  )
}
