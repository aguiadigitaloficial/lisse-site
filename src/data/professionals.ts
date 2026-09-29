import type { Professional } from '../types/content'
import type { SpecialtyPage } from './site'

export const professionals: readonly Professional[] = [
  { id: 'yeiko', name: 'Dr. Yeiko Roca', role: 'Médico', registration: 'CRM 91646', specialty: 'Estética Facial & Corporal' },
  { id: 'fernanda', name: 'Dra. Fernanda Lucas', role: 'Nutricionista' },
  { id: 'diego', name: 'Dr. Diego Lacerda', role: 'Médico', registration: 'CRM 64350', specialty: 'Tricologista' },
  { id: 'diogo', name: 'Dr. Diogo Rafael', role: 'Biomédico Esteta', specialty: 'Estética Facial & Corporal' },
]

export const specialtyProfessionalIds: Record<SpecialtyPage, readonly string[]> = {
  harmonizacao: ['yeiko', 'diogo'],
  faloplastia: ['yeiko'],
  emagrecimento: ['fernanda'],
}

export function getProfessional(id: string) {
  return professionals.find((professional) => professional.id === id)
}

export function professionalCredentials(professional: Professional) {
  return [professional.role, professional.registration, professional.specialty]
    .filter(Boolean)
    .join(' · ')
}
