import { Hero } from '../components/Hero'
import { SpecialtyBenefits } from '../components/HarmonizationBenefits'
import { SpecialtyProcedures } from '../components/HarmonizationProcedures'
import { Information } from '../components/Information'
import { Results } from '../components/Results'
import { Reviews } from '../components/Reviews'
import type { SitePage, SpecialtyPage } from '../data/site'

type SpecialtyLandingPageProps = {
  page: SpecialtyPage
  onNavigate: (page: SitePage, targetId: string) => void
}

export function SpecialtyLandingPage({
  page,
  onNavigate,
}: SpecialtyLandingPageProps) {
  return (
    <>
      <Hero page={page} onNavigate={onNavigate} />
      <SpecialtyProcedures page={page} />
      <SpecialtyBenefits page={page} />
      {page !== 'faloplastia' ? <Results page={page} /> : null}
      <Reviews key={page} page={page} />
      <Information />
    </>
  )
}
