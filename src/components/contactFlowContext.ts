import { createContext } from 'react'
import type { ContactService } from '../data/contactFlow'

export type ContactRequest = {
  href: string
  trigger: HTMLAnchorElement
  service?: ContactService
  professional?: string
}

export const ContactFlowContext = createContext<((request: ContactRequest) => void) | null>(null)
