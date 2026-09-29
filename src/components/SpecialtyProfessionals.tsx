import { getProfessional, professionalCredentials, specialtyProfessionalIds } from '../data/professionals'
import type { SpecialtyPage } from '../data/site'

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
        <ul className="specialty-professionals__list">
          {availableProfessionals.map((professional) => (
            <li key={professional.id}>
              <span className="specialty-professionals__name">{professional.name}</span>
              <span className="specialty-professionals__credentials">{professionalCredentials(professional)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
