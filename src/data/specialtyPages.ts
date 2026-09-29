import harmonizationBodyResult from '../assets/hero/harmonization-body-result-sem-data.webp'
import harmonizationFaceFemale from '../assets/results/facial-female-front-8121.webp'
import harmonizationFaceMale from '../assets/results/facial-male-front-8831.webp'
import phaloplastyIcon from '../assets/hero/phaloplasty-icon.png'
import phaloplastyPhoto from '../assets/treatments/phaloplasty-consultation-candid.jpg'
import weightLossEvaluation from '../assets/treatments/weight-loss-multiprofessional-evaluation.jpg'
import weightLossPhoto from '../assets/treatments/weight-loss.jpg'
import weightLossFront from '../assets/hero/weight-loss-front.jpg'
import weightLossSide from '../assets/hero/weight-loss-side.jpg'
import careIcon from '../assets/harmonization/benefit-care.png'
import protocolIcon from '../assets/harmonization/benefit-protocol.png'
import sparkleIcon from '../assets/harmonization/benefit-sparkle.png'
import volumeIcon from '../assets/harmonization/benefit-volume.png'
import type { SpecialtyBenefit, SpecialtyProcedure } from '../types/content'
import type { SpecialtyPage } from './site'
import { harmonizationBenefits } from './harmonizationBenefits'
import { harmonizationProcedures } from './harmonizationProcedures'

export interface SpecialtyPageConfig {
  hero: {
    eyebrow: string
    titleLines: readonly string[]
    description: string
    image: string
    imageAlt: string
    alternateImage?: string
    alternateImageAlt?: string
    imageKind: 'wide' | 'consultation' | 'results-collage' | 'icon-card'
    imageLabel?: string
    collageLabel?: string
    secondaryImage?: string
    secondaryImageAlt?: string
    secondaryAlternateImage?: string
    secondaryAlternateImageAlt?: string
    secondaryImageLabel?: string
  }
  proceduresHeader: {
    eyebrow: string
    title: string
    description: string
  }
  procedures: readonly SpecialtyProcedure[]
  benefits: readonly SpecialtyBenefit[]
  benefitsLabel: string
  benefitsHeading?: string
  benefitsDescription?: string
  benefitsVariant?: 'editorial-carousel'
}

const phaloplastyProcedures: readonly SpecialtyProcedure[] = [
  {
    id: 'avaliacao-faloplastia',
    eyebrow: 'Avaliação individual',
    title: 'Um cuidado reservado, pensado para você.',
    highlights: ['Escuta', 'Anatomia', 'Objetivos'],
    description:
      'A primeira etapa é compreender suas expectativas e características para construir uma orientação individual, cuidadosa e discreta.',
    indications: [
      'Pouco volume',
      'Circunferência fina',
      'Busca por proporção',
      'Dúvidas sobre o procedimento',
    ],
    image: phaloplastyPhoto,
    imageAlt: 'Cena ilustrativa de um médico conversando com um paciente sobre faloplastia',
    imageSide: 'left',
    imagePosition: 'center',
  },
  {
    id: 'aumento-peniano',
    eyebrow: 'Faloplastia',
    title: 'Aumento peniano com discrição e planejamento.',
    highlights: ['Volume', 'Circunferência', 'Proporção'],
    description:
      'O protocolo é definido de forma personalizada, respeitando a anatomia, os objetivos apresentados em consulta e cada etapa do acompanhamento.',
    indications: [
      'Plano personalizado',
      'Atendimento reservado',
      'Orientação médica',
      'Acompanhamento',
    ],
    image: phaloplastyPhoto,
    imageAlt: 'Cena ilustrativa de planejamento de faloplastia entre médico e paciente',
    imageSide: 'right',
    imagePosition: 'center',
  },
]

const phaloplastyBenefits: readonly SpecialtyBenefit[] = [
  {
    id: 'discricao-acolhimento',
    title: 'Discrição e acolhimento',
    description:
      'Atendimento reservado, com escuta individual e respeito aos objetivos de cada paciente.',
    icon: sparkleIcon,
  },
  {
    id: 'planejamento-personalizado',
    title: 'Planejamento personalizado',
    description:
      'Cada protocolo parte da anatomia, das necessidades e das expectativas avaliadas em consulta.',
    icon: protocolIcon,
  },
  {
    id: 'volume-proporcao',
    title: 'Volume e proporção',
    description:
      'Uma estratégia pensada para trabalhar volume, circunferência e harmonia de forma proporcional.',
    icon: volumeIcon,
  },
  {
    id: 'orientacao-medica',
    title: 'Orientação médica',
    description:
      'Avaliação e acompanhamento especializados para conduzir cada etapa com clareza e cuidado.',
    icon: careIcon,
  },
]

const weightLossProcedures: readonly SpecialtyProcedure[] = [
  {
    id: 'avaliacao-metabolica',
    eyebrow: 'Avaliação nutricional',
    title: 'Entender seu corpo é o primeiro passo.',
    highlights: ['Nutricionista', 'Hábitos alimentares', 'Plano individual'],
    description:
      'Uma análise individual considera histórico, hábitos, necessidades e objetivos para orientar uma jornada coerente com a sua realidade.',
    indications: [
      'Obesidade',
      'Compulsão alimentar',
      'Mudança de hábitos',
      'Dificuldade para emagrecer',
    ],
    image: weightLossEvaluation,
    imageAlt: 'Avaliação nutricional individualizada para emagrecimento na Lisse Clinic',
    imageSide: 'left',
    imagePosition: '50% 46%',
  },
  {
    id: 'plano-emagrecimento',
    eyebrow: 'Plano de emagrecimento',
    title: 'Uma jornada gradual, acompanhada de verdade.',
    highlights: ['Saúde metabólica', 'Novos hábitos', 'Evolução'],
    description:
      'O acompanhamento nutricional considera sua rotina para construir uma estratégia personalizada e ajustar o plano ao longo da evolução.',
    indications: [
      'Plano individual',
      'Metas possíveis',
      'Acompanhamento',
      'Construção de hábitos',
    ],
    image: weightLossPhoto,
    imageAlt: 'Acompanhamento individual de uma jornada de emagrecimento',
    imageSide: 'right',
    imagePosition: '55% center',
  },
]

const weightLossBenefits: readonly SpecialtyBenefit[] = [
  {
    id: 'saude-alem-balanca',
    title: 'Saúde além da balança',
    description:
      'Um plano voltado à saúde metabólica, ao bem-estar e a uma evolução acompanhada.',
    icon: sparkleIcon,
  },
  {
    id: 'avaliacao-individual',
    title: 'Avaliação individual',
    description:
      'Cada jornada considera seu histórico, seus hábitos, suas necessidades e seus objetivos.',
    icon: protocolIcon,
  },
  {
    id: 'acompanhamento-nutricional',
    title: 'Acompanhamento nutricional',
    description:
      'Orientação nutricional individualizada para apoiar escolhas e acompanhar a evolução.',
    icon: volumeIcon,
  },
  {
    id: 'acompanhamento-continuo',
    title: 'Acompanhamento contínuo',
    description:
      'A evolução é acompanhada para ajustar o plano e apoiar a construção de novos hábitos.',
    icon: careIcon,
  },
]

export const specialtyPages: Record<SpecialtyPage, SpecialtyPageConfig> = {
  harmonizacao: {
    hero: {
      eyebrow: 'Harmonização facial e corporal',
      titleLines: ['Realce seus traços.', 'Valorize seus contornos.'],
      description:
        'Tratamentos personalizados para quem deseja aprimorar a aparência do rosto e do corpo com equilíbrio, naturalidade e respeito às próprias características.',
      image: harmonizationFaceFemale,
      imageAlt: 'Comparativo facial feminino antes e depois',
      alternateImage: harmonizationFaceMale,
      alternateImageAlt: 'Comparativo facial masculino antes e depois',
      imageLabel: 'Harmonização facial',
      imageKind: 'results-collage',
      collageLabel: 'Resultados de harmonização corporal e facial',
      secondaryImage: harmonizationBodyResult,
      secondaryImageAlt: 'Comparativo de harmonização corporal antes e depois',
      secondaryImageLabel: 'Harmonização corporal',
    },
    proceduresHeader: {
      eyebrow: 'Sobre os procedimentos',
      title: 'Cuidados pensados para o que você deseja transformar.',
      description:
        'Na Lisse, cada protocolo é definido após uma avaliação individual, considerando suas características, necessidades e objetivos.',
    },
    procedures: harmonizationProcedures,
    benefits: harmonizationBenefits,
    benefitsLabel: 'Diferenciais dos tratamentos de harmonização',
    benefitsHeading: 'Os pilares da harmonização',
    benefitsDescription:
      'Planejamento individual, técnica e cuidado para valorizar traços e contornos com equilíbrio.',
    benefitsVariant: 'editorial-carousel',
  },
  faloplastia: {
    hero: {
      eyebrow: 'Faloplastia | Aumento peniano',
      titleLines: ['Mais confiança,', 'com discrição e cuidado.'],
      description:
        'Protocolos individualizados para homens que desejam melhorar volume, circunferência e proporção, com avaliação cuidadosa, atendimento reservado e orientação médica.',
      image: phaloplastyIcon,
      imageAlt: '',
      imageKind: 'icon-card',
    },
    proceduresHeader: {
      eyebrow: 'Sobre a faloplastia',
      title: 'Cuidado individual em cada etapa da sua decisão.',
      description:
        'Da primeira conversa ao acompanhamento, cada conduta é planejada com discrição, clareza e respeito às suas características.',
    },
    procedures: phaloplastyProcedures,
    benefits: phaloplastyBenefits,
    benefitsLabel: 'Diferenciais do cuidado em faloplastia',
    benefitsHeading: 'Os pilares de um cuidado reservado',
    benefitsDescription:
      'Planejamento individual, orientação médica e discrição em todas as etapas.',
    benefitsVariant: 'editorial-carousel',
  },
  emagrecimento: {
    hero: {
      eyebrow: 'Emagrecimento | Cuidado nutricional',
      titleLines: ['Uma jornada de saúde,', 'acompanhada de verdade.'],
      description:
        'Acompanhamento nutricional individualizado para compreender seus hábitos e construir uma estratégia possível para a sua rotina.',
      image: weightLossFront,
      imageAlt: 'Comparativo frontal de evolução corporal, com os dois registros lado a lado',
      imageLabel: 'Vista frontal',
      imageKind: 'results-collage',
      collageLabel: 'Comparativos de evolução corporal em vista frontal e lateral',
      secondaryImage: weightLossSide,
      secondaryImageAlt: 'Comparativo lateral de evolução corporal, com os dois registros lado a lado',
      secondaryImageLabel: 'Vista lateral',
    },
    proceduresHeader: {
      eyebrow: 'Sobre o acompanhamento',
      title: 'Um plano que considera sua saúde por inteiro.',
      description:
        'A jornada começa com uma avaliação nutricional individual para orientar escolhas, acompanhar a evolução e construir novos hábitos.',
    },
    procedures: weightLossProcedures,
    benefits: weightLossBenefits,
    benefitsLabel: 'Diferenciais do acompanhamento para emagrecimento',
    benefitsHeading: 'Os pilares do cuidado',
    benefitsDescription:
      'Uma jornada construída com olhar individual, orientação nutricional e acompanhamento contínuo.',
    benefitsVariant: 'editorial-carousel',
  },
}
