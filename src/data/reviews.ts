import type { Review } from '../types/content'

const provisionalReview: Omit<Review, 'id'> = {
  author: 'Nome do cliente',
  rating: 5,
  relativeDate: 'há 1 mês • Avaliação no Google',
  quote:
    '“É um fato conhecido de todos que um leitor se distrairá com o conteúdo de texto legível de uma página quando estiver examinando sua diagramação”',
  procedure: 'Harmonização de glúteos',
}

export const reviews: readonly Review[] = [
  { id: 'avaliacao-provisoria-1', ...provisionalReview },
  { id: 'avaliacao-provisoria-2', ...provisionalReview },
  { id: 'avaliacao-provisoria-3', ...provisionalReview },
  { id: 'avaliacao-provisoria-4', ...provisionalReview },
  { id: 'avaliacao-provisoria-5', ...provisionalReview },
]

export const weightLossReviews: readonly Review[] = [
  {
    id: 'experiencia-claudio',
    author: 'Claudio',
    quote:
      'Fui recebido com atenção desde a primeira avaliação. A equipe explicou cada etapa com clareza e construiu um acompanhamento que fez sentido para a minha rotina.',
    procedure: 'Avaliação individual',
    source: 'editorial',
  },
  {
    id: 'experiencia-ronan',
    author: 'Ronan',
    quote:
      'Gostei da integração entre nutrição e acompanhamento médico. As orientações foram práticas, sem julgamentos, e me ajudaram a compreender melhor meus hábitos.',
    procedure: 'Cuidado multiprofissional',
    source: 'editorial',
  },
  {
    id: 'experiencia-elisa',
    author: 'Elisa',
    quote:
      'O cuidado foi individual desde o início. Minhas dúvidas foram ouvidas e o plano foi ajustado com tranquilidade ao longo do acompanhamento.',
    procedure: 'Acompanhamento contínuo',
    source: 'editorial',
  },
  {
    id: 'experiencia-bruna',
    author: 'Bruna',
    quote:
      'Encontrei uma equipe acolhedora e organizada. O acompanhamento próximo me ajudou a manter constância e fazer escolhas mais conscientes no dia a dia.',
    procedure: 'Construção de hábitos',
    source: 'editorial',
  },
  {
    id: 'experiencia-maria-eduarda',
    author: 'Maria Eduarda',
    quote:
      'A avaliação foi completa e muito respeitosa. Saí com orientações claras e mais segurança para seguir cada etapa do processo com calma.',
    procedure: 'Plano personalizado',
    source: 'editorial',
  },
  {
    id: 'experiencia-jessica',
    author: 'Jessica',
    quote:
      'O que mais gostei foi não receber um atendimento genérico. A equipe considerou minha rotina e adaptou as orientações às minhas necessidades.',
    procedure: 'Atendimento individual',
    source: 'editorial',
  },
]

export const harmonizationReviews: readonly Review[] = [
  {
    id: 'experiencia-ana-paula',
    author: 'Ana Paula',
    quote:
      'Desde a primeira conversa, senti cuidado em entender o que me incomodava sem exageros. O planejamento foi explicado com clareza e respeitou o que eu buscava.',
    procedure: 'Avaliação facial',
    source: 'editorial',
  },
  {
    id: 'experiencia-camila',
    author: 'Camila',
    quote:
      'Gostei da atenção aos detalhes e da forma tranquila como cada etapa foi apresentada. A proposta valorizou a naturalidade e me deixou segura nas decisões.',
    procedure: 'Planejamento individual',
    source: 'editorial',
  },
  {
    id: 'experiencia-fernanda',
    author: 'Fernanda',
    quote:
      'O atendimento foi pensado para minhas proporções e objetivos. A equipe ouviu minhas dúvidas e conduziu todo o processo com muita delicadeza.',
    procedure: 'Harmonização corporal',
    source: 'editorial',
  },
  {
    id: 'experiencia-juliana',
    author: 'Juliana',
    quote:
      'Recebi orientações claras e tive espaço para tirar dúvidas em cada etapa. O acompanhamento próximo tornou a experiência mais tranquila e organizada.',
    procedure: 'Acompanhamento',
    source: 'editorial',
  },
  {
    id: 'experiencia-larissa',
    author: 'Larissa',
    quote:
      'Eu buscava um cuidado sutil, que preservasse minhas características. A equipe compreendeu isso desde a avaliação e apresentou possibilidades com muito bom senso.',
    procedure: 'Naturalidade',
    source: 'editorial',
  },
  {
    id: 'experiencia-marcelo',
    author: 'Marcelo',
    quote:
      'O atendimento foi discreto, respeitoso e sem pressa. Senti que cada recomendação considerou minhas necessidades e o resultado que eu desejava.',
    procedure: 'Atendimento individual',
    source: 'editorial',
  },
]

export const phaloplastyReviews: readonly Review[] = [
  {
    id: 'experiencia-rafael',
    author: 'Rafael',
    quote:
      'Desde a primeira conversa, fui atendido com respeito e discrição. A avaliação foi clara e me ajudou a entender cada possibilidade com tranquilidade.',
    procedure: 'Avaliação reservada',
    source: 'editorial',
  },
  {
    id: 'experiencia-bruno',
    author: 'Bruno',
    quote:
      'A equipe ouviu minhas dúvidas sem julgamentos e explicou o planejamento de forma objetiva. Senti segurança para tomar minha decisão sem pressa.',
    procedure: 'Escuta individual',
    source: 'editorial',
  },
  {
    id: 'experiencia-thiago',
    author: 'Thiago',
    quote:
      'Recebi orientações cuidadosas sobre todas as etapas. O atendimento foi profissional, direto e sempre respeitou as minhas expectativas.',
    procedure: 'Orientação médica',
    source: 'editorial',
  },
  {
    id: 'experiencia-andre',
    author: 'André',
    quote:
      'O ambiente reservado e a atenção da equipe fizeram diferença para mim. Tive liberdade para conversar e esclarecer assuntos que antes me deixavam inseguro.',
    procedure: 'Discrição e acolhimento',
    source: 'editorial',
  },
  {
    id: 'experiencia-lucas',
    author: 'Lucas',
    quote:
      'Gostei de perceber que não existe uma proposta genérica. O planejamento considerou minhas características e foi apresentado de maneira muito responsável.',
    procedure: 'Plano personalizado',
    source: 'editorial',
  },
  {
    id: 'experiencia-henrique',
    author: 'Henrique',
    quote:
      'O acompanhamento foi próximo e organizado. Sempre soube quais seriam os próximos cuidados e encontrei abertura para falar com a equipe quando precisei.',
    procedure: 'Acompanhamento',
    source: 'editorial',
  },
]
