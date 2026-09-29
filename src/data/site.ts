export type SitePage =
  | 'inicio'
  | 'harmonizacao'
  | 'faloplastia'
  | 'emagrecimento'

export type SpecialtyPage = Exclude<SitePage, 'inicio'>

export const sitePages: readonly SitePage[] = [
  'inicio',
  'harmonizacao',
  'faloplastia',
  'emagrecimento',
]

export function isSitePage(value: string | null): value is SitePage {
  return value !== null && sitePages.includes(value as SitePage)
}

export const pagePaths: Record<SitePage, string> = {
  inicio: '/',
  harmonizacao: '/harmonizacao',
  faloplastia: '/faloplastia',
  emagrecimento: '/emagrecimento',
}

export const pageSectionIds: Record<SitePage, readonly string[]> = {
  inicio: [
    'inicio',
    'sobre',
    'tratamentos',
    'equipe',
    'resultados',
    'avaliacoes',
    'informacoes',
    'contato',
  ],
  harmonizacao: [
    'inicio',
    'procedimentos',
    'profissionais',
    'diferenciais-harmonizacao',
    'resultados',
    'avaliacoes',
    'informacoes',
  ],
  faloplastia: [
    'inicio',
    'procedimentos',
    'profissionais',
    'diferenciais-faloplastia',
    'avaliacoes',
    'informacoes',
  ],
  emagrecimento: [
    'inicio',
    'procedimentos',
    'profissionais',
    'diferenciais-emagrecimento',
    'resultados',
    'avaliacoes',
    'informacoes',
  ],
}

export function getPagePath(page: SitePage, targetId?: string) {
  const hash = targetId ? `#${targetId}` : ''
  return `${pagePaths[page]}${hash}`
}

export function findSitePageFromPathname(pathname: string): SitePage | null {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  return sitePages.find(
    (page) => pagePaths[page] === normalizedPath,
  ) ?? null
}

export function isPageSection(page: SitePage, targetId: string) {
  return pageSectionIds[page].includes(targetId)
}

export const pageMetadata: Record<
  SitePage,
  { title: string; description: string }
> = {
  inicio: {
    title: 'Lisse Clinic | Estética e cuidado em Belo Horizonte',
    description:
      'Protocolos personalizados para rosto, corpo, saúde e bem-estar em Belo Horizonte.',
  },
  harmonizacao: {
    title: 'Harmonização facial e corporal | Lisse Clinic',
    description:
      'Harmonização facial e corporal com avaliação individual, equilíbrio e naturalidade.',
  },
  faloplastia: {
    title: 'Faloplastia com cuidado e discrição | Lisse Clinic',
    description:
      'Atendimento individual e reservado para faloplastia, com planejamento e acompanhamento.',
  },
  emagrecimento: {
    title: 'Acompanhamento nutricional para emagrecimento | Lisse Clinic',
    description:
      'Avaliação e acompanhamento nutricional individualizados para sua jornada de emagrecimento.',
  },
}

export const navigationItems = [
  {
    label: 'Início',
    href: getPagePath('inicio', 'inicio'),
    page: 'inicio',
    targetId: 'inicio',
    activeFor: 'inicio',
  },
  {
    label: 'Harmonização',
    href: getPagePath('harmonizacao', 'inicio'),
    page: 'harmonizacao',
    targetId: 'inicio',
    activeFor: 'harmonizacao',
  },
  {
    label: 'Faloplastia',
    href: getPagePath('faloplastia', 'inicio'),
    page: 'faloplastia',
    targetId: 'inicio',
    activeFor: 'faloplastia',
  },
  {
    label: 'Emagrecimento',
    href: getPagePath('emagrecimento', 'inicio'),
    page: 'emagrecimento',
    targetId: 'inicio',
    activeFor: 'emagrecimento',
  },
] as const

export const specialties = [
  'Harmonização',
  'Tricologia',
  'Emagrecimento',
  'Estética e Bem-estar',
  'Estética Íntima',
] as const

export const treatmentSpecialties = [
  'Harmonização',
  'Tricologia',
  'Faloplastia',
  'Emagrecimento',
  'Estética em Geral',
] as const

export const clinicContact = {
  addressLine: 'Av. Miguel Perrela, 663, Sala 201',
  neighborhoodLine: 'Bairro Castelo, Belo Horizonte/MG',
  phoneDisplay: '(31) 98556-6396',
  whatsappNumber: '5531985566396',
} as const

const whatsappMessages: Record<SitePage | 'estetica' | 'tricologia', string> = {
  inicio: 'Olá! Gostaria de agendar uma avaliação na Lisse Clinic.',
  harmonizacao:
    'Olá! Gostaria de saber mais sobre harmonização facial e corporal e agendar uma avaliação.',
  faloplastia:
    'Olá! Gostaria de informações sobre faloplastia e agendar uma avaliação reservada.',
  emagrecimento:
    'Olá! Gostaria de saber mais sobre o acompanhamento para emagrecimento e agendar uma avaliação.',
  estetica:
    'Olá! Gostaria de saber mais sobre os cuidados de estética em geral da Lisse Clinic.',
  tricologia:
    'Olá! Gostaria de saber mais sobre a consulta de tricologia com o Dr. Diego Lacerda e agendar uma avaliação.',
}

export function getWhatsAppLink(context: SitePage | 'estetica' | 'tricologia' = 'inicio') {
  return `https://wa.me/${clinicContact.whatsappNumber}?text=${encodeURIComponent(whatsappMessages[context])}`
}

export const externalLinks = {
  instagram: 'https://www.instagram.com/lisseclinic/',
  googleReviews:
    'https://www.google.com/search?q=Lisse+Clinic+avalia%C3%A7%C3%B5es',
  googleMaps:
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Av. Miguel Perrela, 663, Castelo, Belo Horizonte, MG, Brasil')}`,
  mapEmbed:
    `https://www.google.com/maps?q=${encodeURIComponent('Av. Miguel Perrela, 663, Castelo, Belo Horizonte, MG, Brasil')}&z=17&output=embed`,
} as const
