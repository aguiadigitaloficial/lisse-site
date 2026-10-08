import kelly from '../assets/professionals/kelly-trindade.webp'
import diogo from '../assets/professionals/diogo-rafael.webp'
import yeiko from '../assets/professionals/yeiko-roca.webp'
import fernanda from '../assets/professionals/fernanda-lucas.webp'
import diego from '../assets/professionals/diego-lacerda.webp'
import { getProfessional } from './professionals'
import { clinicContact, type SpecialtyPage } from './site'
import type { Professional } from '../types/content'

export type HomeProfessional = {
  professional: Professional
  registration: { council: 'CRM' | 'CRBM' | 'CRN' | 'CRN9'; number: string; provisional?: boolean }
  image: string
  alt: string
  anchor: string
  aliases?: string[]
  heading: string
  description: string
  services: string[]
  pages: { page: SpecialtyPage; label: string }[]
}

function existingProfessional(id: string): Professional {
  const professional = getProfessional(id)
  if (!professional) throw new Error(`Profissional não cadastrado: ${id}`)
  return professional
}

// Homepage presentation only: specialty-page rosters remain unchanged.
export const homeProfessionals: readonly HomeProfessional[] = [
  {
    professional: existingProfessional('kelly'),
    registration: { council: 'CRBM', number: '12472' },
    image: kelly,
    alt: 'Kelly Trindade sentada no consultório da Lisse Clinic',
    anchor: 'tratamento-harmonizacao-corporal',
    aliases: ['tratamento-harmonizacao-facial'],
    heading: 'Harmonização facial e corporal',
    description: 'Valorize seus traços e cuide dos contornos do corpo com um plano de atendimento pensado para você. Agende sua avaliação e conheça as opções para seus objetivos.',
    services: ['Harmonização facial e corporal', 'Bioestimuladores e ácido hialurônico', 'Botox', 'Preenchimento labial', 'Enzimas lipolíticas'],
    pages: [{ page: 'harmonizacao', label: 'Conhecer a harmonização' }],
  },
  {
    professional: existingProfessional('diogo'),
    registration: { council: 'CRBM', number: '14403' },
    image: diogo,
    alt: 'Dr. Diogo Rafael sentado na recepção da Lisse Clinic',
    anchor: 'tratamento-estetica-em-geral',
    heading: 'Estética facial e corporal',
    description: 'Seu cuidado começa com uma conversa sobre o que você deseja valorizar. Conheça os tratamentos para o rosto, a pele e o corpo e receba uma orientação individual.',
    services: ['Harmonização facial', 'Harmonização corporal', 'Estética em geral'],
    pages: [{ page: 'harmonizacao', label: 'Conhecer a harmonização' }],
  },
  {
    professional: existingProfessional('yeiko'),
    registration: { council: 'CRM', number: '91646' },
    image: yeiko,
    alt: 'Dr. Yeiko Roca sentado à mesa no consultório da Lisse Clinic',
    anchor: 'tratamento-faloplastia',
    heading: 'Harmonização e Faloplastia',
    description: 'Converse sobre seus objetivos com privacidade e orientação médica. Na avaliação, esclareça suas dúvidas sobre harmonização e Faloplastia e entenda as possibilidades de cuidado.',
    services: ['Harmonização facial e corporal', 'Faloplastia', 'Avaliação individual e acompanhamento'],
    pages: [{ page: 'faloplastia', label: 'Conhecer a Faloplastia' }, { page: 'harmonizacao', label: 'Conhecer a harmonização' }],
  },
  {
    professional: existingProfessional('fernanda'),
    registration: { council: 'CRN9', number: '15241' },
    image: fernanda,
    alt: 'Dra. Fernanda Lucas no consultório da Lisse Clinic',
    anchor: 'tratamento-emagrecimento',
    heading: 'Nutrição e emagrecimento',
    description: 'Transforme seus objetivos em escolhas que façam sentido na sua rotina. Conte com um plano alimentar individual e acompanhamento para construir novos hábitos.',
    services: ['Avaliação nutricional', 'Plano alimentar individual', 'Acompanhamento para emagrecimento'],
    pages: [{ page: 'emagrecimento', label: 'Conhecer o acompanhamento' }],
  },
  {
    professional: existingProfessional('diego'),
    registration: { council: 'CRM', number: '64350' },
    image: diego,
    alt: 'Dr. Diego Lacerda sentado no consultório da Lisse Clinic',
    anchor: 'tratamento-tricologia',
    heading: 'Tricologia e saúde capilar',
    description: 'Dê atenção aos seus cabelos e ao couro cabeludo com uma avaliação individual. Esclareça suas dúvidas e receba orientação para os próximos passos do seu cuidado.',
    services: ['Tricologia', 'Avaliação dos cabelos e couro cabeludo', 'Orientação e acompanhamento'],
    pages: [],
  },
]

export function getProfessionalWhatsAppLink(name: string) {
  const message = `Olá! Gostaria de informações sobre os atendimentos de ${name} na Lisse Clinic e de agendar uma avaliação.`
  return `https://wa.me/${clinicContact.whatsappNumber}?text=${encodeURIComponent(message)}`
}
