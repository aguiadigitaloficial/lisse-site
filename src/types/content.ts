export interface Treatment {
  id: string
  eyebrow: string
  title: string
  highlights: string[]
  description: string
  tags: string[]
  image: string
  tone: 'dark-gradient' | 'cream' | 'white' | 'gold' | 'dark'
  imageSide: 'left' | 'right'
  hasMedallion?: boolean
  media: TreatmentMedia[]
  professionalIds: string[]
  destination:
    | {
        type: 'page'
        page: 'harmonizacao' | 'faloplastia' | 'emagrecimento'
      }
    | {
        type: 'external'
        href: string
      }
}

export interface TeamMember {
  id: string
  name: string
  area: string
  specialty: string
  biography: string
  tags: string[]
  image?: string
}

export interface ResultCase {
  id: string
  image: string
  alt: string
  crop?: {
    width: number
    height: number
    left: number
    top: number
  }
  fit?: 'cover' | 'contain'
}

export interface Review {
  id: string
  author: string
  rating?: number
  relativeDate?: string
  quote: string
  procedure: string
  avatar?: string
  source?: 'google' | 'editorial'
}

export interface TreatmentMedia {
  id: string
  image: string
  alt: string
  kind: 'result' | 'institutional'
  fit?: 'cover' | 'contain'
}

export interface Professional {
  id: string
  name: string
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface SpecialtyProcedure {
  id: string
  eyebrow: string
  title: string
  highlights: string[]
  description: string
  indications: string[]
  image: string
  imageAlt: string
  imageSide: 'left' | 'right'
  imagePosition?: string
}

export interface SpecialtyBenefit {
  id: string
  title: string
  description: string
  icon: string
}

export type HarmonizationProcedure = SpecialtyProcedure
export type HarmonizationBenefit = SpecialtyBenefit
