import { contactServices, normalizeContactPhone, type ContactService } from './contactFlow'
import { isSitePage, type SitePage } from './site'

export type ContactSubmission = {
  name: string
  phone: string
  service: ContactService
  professional: string | null
  page: SitePage
  source: 'Site Lisse'
}

const hasControlCharacters = (value: string) => Array.from(value).some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)

// Shared validation keeps the browser and the server on the same contract.
export function parseContactSubmission(value: unknown): ContactSubmission | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const data = value as Record<string, unknown>
  if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 100 || hasControlCharacters(data.name)) return null
  if (typeof data.phone !== 'string' || data.phone.length > 25) return null
  const phone = normalizeContactPhone(data.phone)
  if (!phone || typeof data.service !== 'string' || !contactServices.includes(data.service as ContactService)) return null
  if (typeof data.page !== 'string' || !isSitePage(data.page)) return null
  if (data.professional !== undefined && data.professional !== null &&
    (typeof data.professional !== 'string' || data.professional.length > 100 || hasControlCharacters(data.professional))) return null
  return {
    name: data.name.trim(), phone: `55${phone}`, service: data.service as ContactService,
    professional: typeof data.professional === 'string' ? data.professional.trim() || null : null,
    page: data.page, source: 'Site Lisse',
  }
}
