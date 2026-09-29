import { useEffect, useRef } from 'react'
import backgroundMark from '../assets/hero/background-mark.png'
import brandMark from '../assets/hero/brand-mark.svg'
import harmonizationMedallion from '../assets/hero/harmonization-medallion.png'
import { photography } from '../data/photography'
import { getWhatsAppLink, specialties, type SitePage } from '../data/site'
import { specialtyPages } from '../data/specialtyPages'
import { Header } from './Header'
import { SpecialtyRail } from './SpecialtyRail'

type HeroProps = {
  page: SitePage
  onNavigate: (page: SitePage, targetId: string) => void
}

export function Hero({ page, onNavigate }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const sealMotionRef = useRef<HTMLImageElement>(null)
  const specialtyPage = page === 'inicio' ? null : page
  const specialtyConfig = specialtyPage
    ? specialtyPages[specialtyPage]
    : null
  const collageImage =
    specialtyConfig?.hero.imageKind === 'results-collage' &&
    specialtyConfig.hero.secondaryImage
      ? specialtyConfig.hero.secondaryImage
      : null
  const iconCard = specialtyConfig?.hero.imageKind === 'icon-card'

  useEffect(() => {
    const hero = heroRef.current
    const seal = sealMotionRef.current
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )

    if (!collageImage || !hero || !seal || reducedMotion.matches) {
      return
    }

    let frameId = 0

    const updateSeal = () => {
      frameId = 0
      const bounds = hero.getBoundingClientRect()

      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return

      const progress = Math.min(
        1,
        Math.max(0, -bounds.top / Math.max(1, bounds.height * 0.72)),
      )

      seal.style.setProperty('--seal-parallax-x', `${progress * 8}px`)
      seal.style.setProperty('--seal-parallax-y', `${progress * -10}px`)
      seal.style.setProperty('--seal-parallax-rotate', `${progress * 2.5}deg`)
    }

    const requestUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateSeal)
    }

    updateSeal()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [page, collageImage])

  return (
    <section
      ref={heroRef}
      id="inicio"
      className={`hero hero--${page}${specialtyPage ? ' hero--specialty' : ' hero--home'}${collageImage ? ' hero--results-collage' : ''}`}
      aria-labelledby="hero-title"
    >
      <Header activePage={page} onNavigate={onNavigate} />

      <div className="hero__stage">
        <div className="hero__visual">
          {specialtyConfig && specialtyPage ? (
            <>
              <img
                className="hero__harmonization-background-mark"
                src={backgroundMark}
                alt=""
              />
              {iconCard ? (
                <div className="hero__phaloplasty-composition" aria-hidden="true">
                  <div className="hero__phaloplasty-orbit" />
                  <div className="hero__phaloplasty-card">
                    <img
                      className="hero__phaloplasty-icon"
                      src={specialtyConfig.hero.image}
                      alt=""
                    />
                  </div>
                  <span className="hero__phaloplasty-medallion">
                    <img src={harmonizationMedallion} alt="" />
                  </span>
                </div>
              ) : collageImage ? (
                <div
                  className="hero__harmonization-collage"
                  role="group"
                  aria-label={specialtyConfig.hero.collageLabel}
                >
                  <figure className="hero__harmonization-result-card hero__harmonization-result-card--face">
                    <div className="hero__harmonization-result-media">
                      <img
                        className="hero__harmonization-result-photo hero__harmonization-result-photo--primary"
                        src={specialtyConfig.hero.image}
                        alt={specialtyConfig.hero.imageAlt}
                      />
                      {specialtyConfig.hero.alternateImage && (
                        <img
                          className="hero__harmonization-result-photo hero__harmonization-result-photo--alternate"
                          src={specialtyConfig.hero.alternateImage}
                          alt={specialtyConfig.hero.alternateImageAlt ?? ''}
                        />
                      )}
                    </div>
                    <figcaption className="hero__harmonization-result-label hero__harmonization-result-label--face">
                      {specialtyConfig.hero.imageLabel}
                    </figcaption>
                  </figure>
                  <figure className="hero__harmonization-result-card hero__harmonization-result-card--body">
                    <div className="hero__harmonization-result-media">
                      <img
                        className="hero__harmonization-result-photo hero__harmonization-result-photo--primary"
                        src={collageImage}
                        alt={specialtyConfig.hero.secondaryImageAlt}
                      />
                      {specialtyConfig.hero.secondaryAlternateImage && (
                        <img
                          className="hero__harmonization-result-photo hero__harmonization-result-photo--alternate"
                          src={specialtyConfig.hero.secondaryAlternateImage}
                          alt={specialtyConfig.hero.secondaryAlternateImageAlt ?? ''}
                        />
                      )}
                    </div>
                    <figcaption className="hero__harmonization-result-label hero__harmonization-result-label--body">
                      {specialtyConfig.hero.secondaryImageLabel}
                    </figcaption>
                  </figure>
                  <span
                    className="hero__harmonization-medallion hero__harmonization-medallion--collage"
                    aria-hidden="true"
                  >
                    <img
                      ref={sealMotionRef}
                      className="hero__harmonization-medallion-motion"
                      src={harmonizationMedallion}
                      alt=""
                    />
                  </span>
                </div>
              ) : (
                <>
                  <img
                    className={`hero__harmonization-photo hero__specialty-photo hero__specialty-photo--${specialtyConfig.hero.imageKind}`}
                    src={specialtyConfig.hero.image}
                    alt={specialtyConfig.hero.imageAlt}
                  />
                  <span className="hero__harmonization-medallion">
                    <img src={harmonizationMedallion} alt="" />
                  </span>
                </>
              )}
            </>
          ) : (
            <figure className="hero__home-portrait">
              <picture>
                <source
                  media="(max-width: 700px)"
                  srcSet={photography.owner.hero.small}
                />
                <source
                  media="(max-width: 1100px)"
                  srcSet={photography.owner.hero.medium}
                />
                <img
                  src={photography.owner.hero.large}
                  alt={photography.owner.hero.alt}
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </figure>
          )}
        </div>

        <div className="hero__content">
          <div className="hero__copy">
            {specialtyConfig ? (
              <>
                <p className="eyebrow">{specialtyConfig.hero.eyebrow}</p>
                <h1 id="hero-title">
                  {specialtyConfig.hero.titleLines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h1>
                <p className="hero__description">
                  {specialtyConfig.hero.description}
                </p>
              </>
            ) : (
              <>
                <p className="eyebrow hero__location-signature">
                  <span className="hero__location-mark" aria-hidden="true">
                    <img src={brandMark} alt="" />
                  </span>
                  <span>Lisse Clinic</span>
                  <span>Belo Horizonte</span>
                </p>
                <h1 id="hero-title">
                  <span>Sua beleza, com</span>
                  <span>cuidado e exclusividade.</span>
                </h1>
                <p className="hero__description">
                  Protocolos personalizados para rosto, corpo, saúde e bem-estar,
                  conduzidos por uma equipe multiprofissional
                </p>
              </>
            )}
          </div>

          <div className="hero__actions" aria-label="Ações principais">
            <a
              className="button button--primary"
              href={getWhatsAppLink(page)}
              target="_blank"
              rel="noreferrer"
            >
              Agendar avaliação
            </a>
            {specialtyConfig ? (
              <a
                className="button button--link"
                href="#procedimentos"
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(page, 'procedimentos')
                }}
              >
                Conhecer tratamentos
              </a>
            ) : (
              <a
                className="button button--link"
                href="#tratamentos"
                onClick={(event) => {
                  event.preventDefault()
                  onNavigate(page, 'tratamentos')
                }}
              >
                Conhecer tratamentos
              </a>
            )}
          </div>
        </div>
      </div>

      <SpecialtyRail items={specialties} variant="hero" />

    </section>
  )
}
