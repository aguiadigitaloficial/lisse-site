import type { TeamMember } from '../types/content'

const kellyPlaceholder: Omit<TeamMember, 'id'> = {
  name: 'Dra. Kelly Trindade',
  area: 'estética avançada',
  specialty: 'Harmonização corporal e facial',
  biography:
    'Kelly conduz cada atendimento com escuta, precisão e um olhar individual para os objetivos de cada paciente. Sua atuação prioriza resultados naturais, segurança e acompanhamento próximo.',
  tags: [
    'Glúteos',
    'Panturrilhas',
    'Panturrilhas',
    'Membros superiores',
    'Bioestimuladores',
  ],
}

export const teamMembers: readonly TeamMember[] = [
  { id: 'kelly-placeholder-1', ...kellyPlaceholder },
  { id: 'kelly-placeholder-2', ...kellyPlaceholder },
  { id: 'kelly-placeholder-3', ...kellyPlaceholder },
]
