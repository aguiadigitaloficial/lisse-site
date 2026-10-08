import { useLayoutEffect } from 'react'
import { specialtyPages } from '../data/specialtyPages'
import { specialtyImageProps } from '../data/specialtyImageVariants'
import { Hero } from '../components/Hero'
import { SpecialtyBenefits } from '../components/HarmonizationBenefits'
import { SpecialtyProcedures } from '../components/HarmonizationProcedures'
import { SpecialtyProfessionals } from '../components/SpecialtyProfessionals'
import { Information } from '../components/Information'
import { Results } from '../components/Results'
import { Reviews } from '../components/Reviews'
import type { SitePage, SpecialtyPage } from '../data/site'

type SpecialtyLandingPageProps = {
  page: SpecialtyPage
  onNavigate: (page: SitePage, targetId: string) => void
  onReady: (page: SitePage) => void
}

export function SpecialtyLandingPage({
  page,
  onNavigate,
  onReady,
}: SpecialtyLandingPageProps) {
  useLayoutEffect(() => { onReady(page) }, [page, onReady])
  return (
    <>
      <Hero page={page} onNavigate={onNavigate} specialtyConfig={specialtyPages[page]} imageProps={specialtyImageProps} />
      <SpecialtyProcedures page={page} />
      <SpecialtyProfessionals page={page} />
      <SpecialtyBenefits page={page} />
      {page !== 'faloplastia' ? <Results page={page} /> : null}
      <Reviews key={page} page={page} />
      <Information />
    </>
  )
}
