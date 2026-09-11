import facialHarmonization from '../assets/treatments/harmonization-facial-result.jpg'
import type { HarmonizationProcedure } from '../types/content'
import { photography } from './photography'

export const harmonizationProcedures: readonly HarmonizationProcedure[] = [
  {
    id: 'harmonizacao-facial',
    eyebrow: 'Harmonização Facial',
    title: 'Realce seus traços sem perder a sua essência.',
    highlights: [
      'Toxina botulínica',
      'Preenchimento labial',
      'Bioestimuladores',
    ],
    description:
      'Procedimentos personalizados para suavizar sinais do tempo, melhorar os contornos e devolver equilíbrio e luminosidade ao rosto.',
    indications: [
      'Linhas de expressão',
      'Olheiras',
      'Pouca luminosidade',
      'Flacidez',
    ],
    image: facialHarmonization,
    imageAlt: 'Avaliação de harmonização facial na Lisse Clinic',
    imageSide: 'left',
    imagePosition: '50% center',
  },
  {
    id: 'harmonizacao-corporal',
    eyebrow: 'Harmonização Corporal',
    title: 'Mais equilíbrio, volume e definição para o seu corpo.',
    highlights: ['Glúteos', 'Panturrilhas', 'Membros superiores'],
    description:
      'Protocolos personalizados para melhorar proporções, valorizar os contornos e tratar áreas que nem sempre respondem como desejado aos exercícios.',
    indications: ['Celulite', 'Pouco volume', 'Flacidez', 'Falta de definição'],
    image: photography.procedures.harmonizationBody.image,
    imageAlt: photography.procedures.harmonizationBody.alt,
    imageSide: 'right',
    imagePosition: '50% 62%',
  },
]
