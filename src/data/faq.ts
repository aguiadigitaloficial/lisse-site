import type { FaqItem } from '../types/content'

export const faqItems: readonly FaqItem[] = [
  {
    id: 'primeira-avaliacao',
    question: 'Como funciona a primeira avaliação?',
    answer:
      'Na primeira consulta, nossa equipe conversa com você para compreender suas necessidades, seu histórico de saúde, suas expectativas e objetivos. Após uma avaliação individual, apresentamos as possibilidades de cuidado e explicamos com clareza as etapas, orientações e próximos passos.',
  },
  {
    id: 'tratamento-indicado',
    question: 'Como saber qual tratamento é indicado para mim?',
    answer:
      'A indicação é definida somente após uma avaliação individual. Consideramos suas características, seu histórico de saúde, suas prioridades e possíveis contraindicações para recomendar um plano seguro e coerente. Quando determinado procedimento não é adequado para você, nossa equipe explica os motivos e apresenta as orientações necessárias.',
  },
  {
    id: 'tratamentos-personalizados',
    question: 'Os tratamentos são personalizados?',
    answer:
      'Sim. Cada protocolo é planejado de forma individual, respeitando a anatomia, as necessidades, os objetivos e o momento de cada paciente. As etapas, os produtos e o número de sessões podem variar, sempre com explicação prévia e consentimento.',
  },
  {
    id: 'acompanhamento',
    question: 'Existe acompanhamento após o procedimento?',
    answer:
      'Sim. O acompanhamento é definido de acordo com o procedimento e pode incluir orientações de cuidado, retorno programado e suporte para dúvidas. Caso ocorra alguma reação inesperada, nossa equipe orientará sobre a assistência adequada.',
  },
  {
    id: 'outras-cidades',
    question: 'A Lisse Clinic atende pacientes de outras cidades?',
    answer:
      'Sim. Recebemos pacientes de outras cidades e organizamos o atendimento com antecedência. Antes da viagem, nossa equipe confirma a avaliação, o planejamento e a possível necessidade de permanência ou retorno, que variam conforme o procedimento.',
  },
]
