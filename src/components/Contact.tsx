import brandMark from '../assets/hero/brand-mark.svg'
import welcomeCoffee from '../assets/photography/clinic-welcome-coffee.webp'
import { getWhatsAppLink } from '../data/site'
import { useContactMotion } from '../hooks/useContactMotion'
import './Contact.css'

export function Contact() {
  const sectionRef = useContactMotion()
  return (
    <section
      id="contato"
      className="contact-section contact-section--glass"
      aria-labelledby="contact-title"
      ref={sectionRef}
    >
      <div className="contact-section__inner">
        <figure className="contact-section__photo">
          <div className="contact-section__glass">
            <img
              src={welcomeCoffee}
              alt="Mãos segurando uma xícara com a marca da Lisse Clinic, na recepção da clínica"
              width={574}
              height={763}
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>

        <div className="contact-section__copy">
          <p className="contact-section__eyebrow" data-contact-step>Contato</p>
          <h2 id="contact-title" data-contact-step>Seu próximo passo começa com uma conversa</h2>
          <p className="contact-section__intro" data-contact-step>
            Fale com nossa equipe e agende uma avaliação personalizada para
            descobrir quais cuidados combinam com os seus objetivos.
          </p>

          <ul className="contact-section__qualities">
            <li data-contact-step>Atendimento personalizado</li>
            <li data-contact-step>Privacidade</li>
            <li data-contact-step>Acompanhamento</li>
          </ul>

          <a
            className="contact-section__cta brand-cta brand-cta--compact"
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            data-contact-step
          >
            <span className="contact-section__cta-mark brand-cta__mark" aria-hidden="true">
              <img src={brandMark} alt="" />
            </span>
            <span className="brand-cta__label">Agendar avaliação pelo WhatsApp</span>
          </a>

        </div>
      </div>
    </section>
  )
}
