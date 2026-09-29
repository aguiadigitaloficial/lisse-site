import brandMark from '../assets/hero/brand-mark.svg'
import welcomeCoffee from '../assets/photography/clinic-welcome-coffee.webp'
import { getWhatsAppLink } from '../data/site'

export function Contact() {
  return (
    <section
      id="contato"
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="contact-section__inner" data-reveal="up">
        <figure className="contact-section__photo">
          <img
            src={welcomeCoffee}
            alt="Mãos segurando uma xícara com a marca da Lisse Clinic, na recepção da clínica"
            width={574}
            height={763}
            loading="lazy"
            decoding="async"
          />
        </figure>

        <div className="contact-section__copy">
          <p className="contact-section__eyebrow">Contato</p>
          <h2 id="contact-title">Seu próximo passo começa com uma conversa</h2>
          <p className="contact-section__intro">
            Fale com nossa equipe e agende uma avaliação personalizada para
            descobrir quais cuidados combinam com os seus objetivos.
          </p>

          <ul className="contact-section__qualities">
            <li>Atendimento personalizado</li>
            <li>Privacidade</li>
            <li>Acompanhamento</li>
          </ul>

          <a
            className="contact-section__cta brand-cta brand-cta--compact"
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
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
