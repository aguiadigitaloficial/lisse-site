import { AboutClinic } from '../components/AboutClinic'
import { Contact } from '../components/Contact'
import { Hero } from '../components/Hero'
import { Information } from '../components/Information'
import { Reviews } from '../components/Reviews'
import { Treatments } from '../components/Treatments'
import type { SitePage, SpecialtyPage } from '../data/site'

type HomePageProps = {
  onNavigate: (page: SitePage, targetId: string) => void
  onNavigateToSpecialty: (page: SpecialtyPage) => void
}

export function HomePage({
  onNavigate,
  onNavigateToSpecialty,
}: HomePageProps) {
  return (
    <>
      <Hero page="inicio" onNavigate={onNavigate} />
      <AboutClinic onNavigateToTreatments={() => onNavigate('inicio', 'tratamentos')} />
      <Treatments onNavigate={onNavigateToSpecialty} />
      <Reviews />
      <Information />
      <Contact />
    </>
  )
}
