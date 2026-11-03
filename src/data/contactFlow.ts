import { clinicContact, type SitePage } from './site'

export const contactServices = [
  'Harmonização', 'Faloplastia', 'Emagrecimento', 'Tricologia',
  'Estética em geral', 'Ainda não sei',
] as const

export type ContactService = typeof contactServices[number]
export type ContactOrigin = {
  page: SitePage
  service?: ContactService
  professional?: string
}

export const pageContactService: Partial<Record<SitePage, ContactService>> = {
  harmonizacao: 'Harmonização', faloplastia: 'Faloplastia', emagrecimento: 'Emagrecimento',
}

export const professionalContactService: Record<string, ContactService> = {
  kelly: 'Harmonização', diogo: 'Estética em geral', yeiko: 'Faloplastia',
  fernanda: 'Emagrecimento', diego: 'Tricologia',
}

export function normalizeContactPhone(value: string): string | null {
  if (/[^\d\s()+.-]/u.test(value)) return null
  let digits = value.replace(/\D/g, '')
  if (value.includes('+') && (!/^\s*\+55[\d\s().-]+$/.test(value) || ![12, 13].includes(digits.length))) return null
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith('55')) digits = digits.slice(2)
  if (!/^[1-9]{2}\d{8,9}$/.test(digits) || /^(\d)\1+$/.test(digits)) return null
  return digits
}

export function formatContactPhone(digits: string) {
  return `(${digits.slice(0, 2)}) ${digits.slice(2, -4)}-${digits.slice(-4)}`
}

export function formatContactPhoneInput(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) digits = digits.slice(2)
  digits = digits.slice(0, 11)
  if (digits.length <= 2) return digits
  const split = digits.length === 11 ? 7 : 6
  return `${digits.slice(0, 2)} ${digits.slice(2, split)}${digits.length > split ? `-${digits.slice(split)}` : ''}`
}

export function getContactFormLink(name: string, phone: string, service: ContactService, origin: ContactOrigin) {
  const pageNames: Record<SitePage, string> = {
    inicio: 'Início', harmonizacao: 'Harmonização', faloplastia: 'Faloplastia', emagrecimento: 'Emagrecimento',
  }
  const message = [
    'Olá! Gostaria de conversar com a equipe da Lisse Clinic.',
    `Nome: ${name.trim()}`,
    `WhatsApp: +55 ${formatContactPhone(phone)}`,
    `Serviço de interesse: ${service}`,
    ...(origin.professional ? [`Profissional de interesse: ${origin.professional}`] : []),
    `Página de origem: ${pageNames[origin.page]}`,
  ].join('\n')
  return `https://wa.me/${clinicContact.whatsappNumber}?text=${encodeURIComponent(message)}`
}
