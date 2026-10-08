import { getProfessional, specialtyProfessionalIds } from '../data/professionals'
import type { SpecialtyPage } from '../data/site'
import { homeImageProps } from '../data/homeImageVariants'
import yeikoPortrait from '../assets/professionals/yeiko-faloplastia.webp'
import diogoPortrait from '../assets/professionals/diogo-rafael.webp'
import kellyPortrait from '../assets/professionals/kelly-trindade.webp'
import fernandaPortrait from '../assets/professionals/fernanda-lucas.webp'
import './SpecialtyProfessionals.css'

const portraits: Record<string, { src: string; alt: string; width: number; height: number }> = {
  yeiko: { src: yeikoPortrait, alt: 'Dr. Yeiko Roca sentado na clínica', width: 640, height: 960 },
  diogo: { src: diogoPortrait, alt: 'Dr. Diogo Rafael sentado na recepção da Lisse Clinic', width: 960, height: 1280 },
  kelly: { src: kellyPortrait, alt: 'Kelly Trindade sentada no consultório da Lisse Clinic', width: 960, height: 1280 },
  fernanda: { src: fernandaPortrait, alt: 'Dra. Fernanda Lucas no consultório da Lisse Clinic', width: 960, height: 1280 },
}

type SpecialtyProfessionalsProps = {
  page: SpecialtyPage
}

export function SpecialtyProfessionals({ page }: SpecialtyProfessionalsProps) {
  const availableProfessionals = specialtyProfessionalIds[page]
    .map(getProfessional)
    .filter((professional) => professional !== undefined)

  return (
    <section id="profissionais" className="specialty-professionals" aria-labelledby="specialty-professionals-title">
      <div className="specialty-professionals__inner">
        <div className="specialty-professionals__heading">
          <p>Quem acompanha seu cuidado</p>
          <h2 id="specialty-professionals-title">Profissionais disponíveis</h2>
        </div>
        <ul className={`specialty-professionals__list${availableProfessionals.length === 1 ? ' specialty-professionals__list--single' : ''}`}>
          {availableProfessionals.map((professional) => {
            const portrait = portraits[professional.id]
            return (
              <li key={professional.id} className="specialty-professionals__profile">
                {portrait && (
                  <img
                    className="specialty-professionals__portrait"
                    {...portrait}
                    {...homeImageProps(portrait.src, '240px')}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className="specialty-professionals__identity">
                  <h3 className="specialty-professionals__name">{professional.name}</h3>
                  <p className="specialty-professionals__credentials">{professional.role}</p>
                  {professional.registration && <p className="specialty-professionals__credentials">{professional.registration}</p>}
                  {professional.specialty && <p className="specialty-professionals__credentials">{professional.specialty}</p>}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
