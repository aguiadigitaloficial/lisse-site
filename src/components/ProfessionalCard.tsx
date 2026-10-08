import brandMark from '../assets/hero/brand-mark.svg'
import { homeImageProps } from '../data/homeImageVariants'
import separatorMark from '../assets/hero/separator-mark.png'
import clinicSeal from '../assets/treatments/logo-cards.png'
import { getProfessionalWhatsAppLink, type HomeProfessional } from '../data/homeProfessionals'
import { getPagePath, type SpecialtyPage } from '../data/site'

const tones = ['taupe', 'cream', 'white', 'gold', 'cocoa'] as const

type ProfessionalCardProps = {
  profile: HomeProfessional
  index: number
  onNavigate: (page: SpecialtyPage) => void
}

export function ProfessionalCard({ profile, index, onNavigate }: ProfessionalCardProps) {
  const { professional, registration, image, alt, anchor, aliases, heading, description, services, pages } = profile

  return (
    <div id={anchor} className="professional-stack-item" style={{ zIndex: index + 1, scrollMarginTop: 32 + index * 14 }}>
      {aliases?.map((id) => <span id={id} className="professional-sheet__anchor" aria-hidden="true" key={id} />)}
      <div className="professional-stack-pin">
        <article className={`professional-sheet professional-sheet--${tones[index % tones.length]}${index % 2 ? ' professional-sheet--reverse' : ''}`} aria-labelledby={`professional-${professional.id}`}>
          <div className="professional-sheet__watermark" aria-hidden="true"><img src={separatorMark} alt="" /></div>

          <div className="professional-sheet__identity">
            <div className="professional-sheet__photo-frame">
              <img className="professional-sheet__portrait" src={image} alt={alt} {...homeImageProps(image, '(max-width: 600px) 70vw, 280px')} loading="lazy" decoding="async" />
              <img className="professional-sheet__seal" src={clinicSeal} alt="" aria-hidden="true" width="68" height="68" />
            </div>
            <div className="professional-sheet__signature">
              <h3 id={`professional-${professional.id}`}>{professional.name}</h3>
              <p className="professional-sheet__role">{professional.role}</p>
              <dl className="professional-sheet__registration">
                <dt>Registro profissional</dt>
                <dd>{registration.council} <span>{registration.number}</span>{registration.provisional && <span className="professional-sheet__pending"> — provisório</span>}</dd>
              </dl>
              {registration.provisional && <p className="professional-sheet__registration-note">Número a confirmar antes da publicação.</p>}
            </div>
          </div>

          <div className="professional-sheet__care">
            <header className="professional-sheet__intro">
              <p className="professional-sheet__label">Áreas de atendimento</p>
              <h4>{heading}</h4>
              <p className="professional-sheet__description">{description}</p>
            </header>
            <ul className="professional-sheet__services" aria-label={`Atendimentos de ${professional.name}`}>
              {services.map((service) => <li key={service}>{service}</li>)}
            </ul>
            <div className="professional-sheet__actions">
              <a className="professional-sheet__contact" href={getProfessionalWhatsAppLink(professional.name)} target="_blank" rel="noreferrer" aria-label={`Conversar com a equipe sobre ${professional.name} pelo WhatsApp`}>
                <img src={brandMark} alt="" aria-hidden="true" />
                <span>Agendar pelo WhatsApp</span>
              </a>
              {pages.length > 0 && <div className="professional-sheet__links">
                {pages.map(({ page, label }) => (
                  <a href={getPagePath(page, 'inicio')} key={page} onClick={(event) => {
                    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
                    event.preventDefault()
                    onNavigate(page)
                  }}>{label}</a>
                ))}
              </div>}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
