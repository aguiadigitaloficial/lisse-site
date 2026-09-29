import bodyContouring from '../assets/treatments/body-contouring.jpg'
import facialHarmonization from '../assets/treatments/facial-harmonization.jpg'
import generalAesthetics from '../assets/treatments/general-aesthetics.jpg'
import phaloplasty from '../assets/treatments/phaloplasty-consultation-candid.jpg'
import weightLoss from '../assets/treatments/weight-loss.jpg'
import { resultCases } from './results'
import type { Treatment } from '../types/content'
import { getWhatsAppLink } from './site'

const resultMedia = (ids: string[]) =>
  resultCases
    .filter((result) => ids.includes(result.id))
    .map((result) => ({ ...result, kind: 'result' as const }))

const institutionalMedia = (id: string, image: string, alt: string) => [
  { id, image, alt, kind: 'institutional' as const },
]

export const treatments: readonly Treatment[] = [
  {
    id: 'harmonizacao-corporal',
    eyebrow: 'Harmonização Corporal',
    title: 'Equilíbrio e definição em cada detalhe do seu corpo.',
    highlights: ['Glúteos', 'Panturrilhas', 'Membros superiores'],
    description:
      'Protocolos personalizados para melhorar volume, proporção, firmeza e contorno corporal.',
    tags: ['Volume', 'Proporção', 'Firmeza', 'Definição'],
    image: bodyContouring,
    media: resultMedia(['resultado-01', 'resultado-02', 'resultado-03']),
    professionalIds: ['yeiko', 'diogo'],
    tone: 'dark-gradient',
    imageSide: 'left',
    hasMedallion: true,
    destination: { type: 'page', page: 'harmonizacao' },
  },
  {
    id: 'faloplastia',
    eyebrow: 'Faloplastia',
    title: 'Aumento peniano com discrição e cuidado.',
    highlights: ['Volume', 'Circunferência', 'Proporção'],
    description:
      'Avaliação individual e atendimento reservado para homens que buscam mais confiança e segurança.',
    tags: ['Avaliação individual', 'Sigilo', 'Orientação médica'],
    image: phaloplasty,
    media: institutionalMedia(
      'faloplastia-institucional',
      phaloplasty,
      'Cena ilustrativa de um médico conversando com um paciente sobre faloplastia',
    ),
    professionalIds: ['yeiko'],
    tone: 'cream',
    imageSide: 'right',
    destination: { type: 'page', page: 'faloplastia' },
  },
  {
    id: 'harmonizacao-facial',
    eyebrow: 'Harmonização Facial',
    title: 'Naturalidade para valorizar seus traços faciais.',
    highlights: ['Botox', 'Preenchimento labial', 'Bioestimuladores'],
    description:
      'Cuidados para linhas de expressão, olheiras, flacidez, manchas e falta de luminosidade.',
    tags: ['Harmonia facial', 'Suavização de linhas', 'Firmeza'],
    image: facialHarmonization,
    media: resultMedia([
      'resultado-04',
      'resultado-05',
      'resultado-06',
      'resultado-07',
      'resultado-08',
      'resultado-09',
    ]),
    professionalIds: ['yeiko', 'diogo'],
    tone: 'white',
    imageSide: 'left',
    destination: { type: 'page', page: 'harmonizacao' },
  },
  {
    id: 'emagrecimento',
    eyebrow: 'Emagrecimento',
    title: 'Uma jornada completa, acompanhada de verdade.',
    highlights: ['Avaliação nutricional', 'Plano individual', 'Acompanhamento'],
    description:
      'Acompanhamento nutricional individualizado para emagrecimento e construção de novos hábitos.',
    tags: ['Plano individual', 'Evolução', 'Novos hábitos'],
    image: weightLoss,
    media: resultMedia(['resultado-10', 'resultado-12']),
    professionalIds: ['fernanda'],
    tone: 'gold',
    imageSide: 'right',
    destination: { type: 'page', page: 'emagrecimento' },
  },
  {
    id: 'estetica-em-geral',
    eyebrow: 'Estética em Geral',
    title: 'Cuidado completo para a sua pele e bem-estar.',
    highlights: ['Limpeza de pele', 'Massoterapia', 'Camuflagem de estrias'],
    description:
      'Protocolos para acne, poros, manchas, hidratação, estrias e cicatrizes.',
    tags: ['Textura', 'Bem-estar', 'Firmeza'],
    image: generalAesthetics,
    media: institutionalMedia(
      'estetica-institucional',
      generalAesthetics,
      'Cuidado estético e de bem-estar na Lisse Clinic',
    ),
    professionalIds: ['diogo'],
    tone: 'dark',
    imageSide: 'left',
    hasMedallion: true,
    destination: { type: 'external', href: getWhatsAppLink('estetica') },
  },
]
