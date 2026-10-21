import { ContactLink } from './ContactLink'
import whatsappLogo from '../assets/whatsapp-official.svg'
import { getWhatsAppLink, type SitePage } from '../data/site'
import './FloatingWhatsApp.css'

export function FloatingWhatsApp({ page }: { page: SitePage }) {
  return (
    <ContactLink
      className="floating-whatsapp"
      href={getWhatsAppLink(page)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Iniciar atendimento com a Lisse Clinic"
      title="Conversar pelo WhatsApp"
    >
      <span className="floating-whatsapp__glass" aria-hidden="true">
        <img src={whatsappLogo} alt="" width="32" height="32" />
      </span>
    </ContactLink>
  )
}
