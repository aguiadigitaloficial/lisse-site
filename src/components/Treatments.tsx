import brandMark from '../assets/hero/brand-mark.svg'
import { useProfessionalStack } from '../hooks/useProfessionalStack'
import { homeProfessionals } from '../data/homeProfessionals'
import { getWhatsAppLink, treatmentSpecialties, type SpecialtyPage } from '../data/site'
import { SpecialtyRail } from './SpecialtyRail'
import { ProfessionalCard } from './ProfessionalCard'
import './HomeProfessionals.css'

type TreatmentsProps = {
  onNavigate: (page: SpecialtyPage) => void
}

const railDestinations = {
  'Harmonização': '#tratamento-harmonizacao-corporal',
  'Tricologia': '#tratamento-tricologia',
  'Faloplastia': '#tratamento-faloplastia',
  'Emagrecimento': '#tratamento-emagrecimento',
  'Estética em Geral': '#tratamento-estetica-em-geral',
} as const

export function Treatments({ onNavigate }: TreatmentsProps) {
  const stackRef = useProfessionalStack()
  return (
    <section id="tratamentos" className="treatments-section home-professionals" aria-labelledby="treatments-title">
      <span id="equipe" className="treatments-section__anchor" aria-hidden="true" />
      <span id="resultados" className="treatments-section__anchor" aria-hidden="true" />
      <SpecialtyRail items={treatmentSpecialties} destinations={railDestinations} reveal variant="hero" />

      <div className="home-professionals__inner">
        <header className="home-professionals__header">
          <h2 id="treatments-title">Profissionais da Lisse</h2>
          <p>Conheça nossa equipe e as áreas de atendimento de cada profissional.</p>
        </header>

        <div className="home-professionals__list" ref={stackRef}>
          {homeProfessionals.map((profile, index) => (
            <ProfessionalCard profile={profile} index={index} onNavigate={onNavigate} key={profile.professional.id} />
          ))}
        </div>

        <div className="treatments-section__cta">
          <div className="treatments-section__cta-copy">
            <h3>Não sabe qual cuidado combina com seu objetivo?</h3>
            <p>Agende uma avaliação e receba uma orientação personalizada.</p>
          </div>
          <a className="treatments-section__cta-button brand-cta brand-cta--compact" href={getWhatsAppLink()} target="_blank" rel="noreferrer">
            <span className="treatments-section__cta-mark brand-cta__mark" aria-hidden="true"><img src={brandMark} alt="" /></span>
            <span className="brand-cta__label">Agendar uma avaliação</span>
          </a>
        </div>
      </div>
    </section>
  )
}
