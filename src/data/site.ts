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
    'diferenciais-harmonizacao',
    'resultados',
    'avaliacoes',
    'informacoes',
  ],
  faloplastia: [
    'inicio',
    'procedimentos',
    'diferenciais-faloplastia',
    'avaliacoes',
    'informacoes',
  ],
  emagrecimento: [
    'inicio',
    'procedimentos',
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
    title: 'Emagrecimento multiprofissional | Lisse Clinic',
    description:
      'Acompanhamento multiprofissional para uma jornada de emagrecimento personalizada.',
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
  'Harmonização Corporal',
  'Harmonização Facial',
  'Emagrecimento',
  'Estética e Bem-estar',
  'Estética Íntima',
] as const

export const treatmentSpecialties = [
  'Harmonização Corporal',
  'Harmonização Facial',
  'Faloplastia',
  'Emagrecimento',
  'Estética em Geral',
] as const

export const externalLinks = {
  whatsapp:
    'https://api.whatsapp.com/message/FQ6YGEHPMXHSM1?autoload=1&app_absent=0&utm_source=ig',
  instagram: 'https://www.instagram.com/lisseclinic/',
  googleReviews:
    'https://www.google.com/search?q=Lisse+Clinic+avalia%C3%A7%C3%B5es',
  googleMaps:
    'https://www.google.com/maps/place/Castelo,+Belo+Horizonte+-+MG/@-19.8858158,-44.0019741,16z/data=!4m6!3m5!1s0xa691398c04648f:0xf376faf11efebb19!8m2!3d-19.8822196!4d-43.9996134!16s%2Fg%2F1ymtf0ts1?entry=ttu&g_ep=EgoyMDI2MDgwMy4wIKXMDSoASAFQAw%3D%3D',
  mapEmbed:
    'https://www.google.com/maps?q=-19.8822196,-43.9996134&z=16&output=embed',
} as const
