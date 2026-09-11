import careIcon from '../assets/harmonization/benefit-care.png'
import protocolIcon from '../assets/harmonization/benefit-protocol.png'
import sparkleIcon from '../assets/harmonization/benefit-sparkle.png'
import volumeIcon from '../assets/harmonization/benefit-volume.png'
import type { HarmonizationBenefit } from '../types/content'

export const harmonizationBenefits: readonly HarmonizationBenefit[] = [
  {
    id: 'harmonia-naturalidade',
    title: 'Harmonia e naturalidade',
    description:
      'Resultados planejados para valorizar seus traços e contornos sem apagar sua identidade.',
    icon: sparkleIcon,
  },
  {
    id: 'protocolo-personalizado',
    title: 'Protocolo personalizado',
    description:
      'Cada tratamento é definido conforme sua anatomia, suas necessidades e seus objetivos.',
    icon: protocolIcon,
  },
  {
    id: 'volume-definicao',
    title: 'Volume e definição',
    description:
      'Soluções para melhorar proporções, suavizar flacidez e valorizar áreas do rosto e do corpo.',
    icon: volumeIcon,
  },
  {
    id: 'cuidado-multiprofissional',
    title: 'Cuidado multiprofissional',
    description:
      'Avaliação individual e acompanhamento especializado em todas as etapas do tratamento.',
    icon: careIcon,
  },
]
