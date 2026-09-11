import decorMarkLeft from '../assets/about/decor-mark-left.svg'
import decorMarkRight from '../assets/about/decor-mark-right.svg'
import brandMark from '../assets/hero/brand-mark.svg'
import { externalLinks } from '../data/site'

export function Contact() {
  return (
    <section
      id="contato"
      className="contact-section"
      aria-labelledby="contact-title"
    >
      <div className="contact-section__decor" aria-hidden="true">
        <img
          className="contact-section__decor-mark contact-section__decor-mark--left"
          src={decorMarkLeft}
          alt=""
        />
        <img
          className="contact-section__decor-mark contact-section__decor-mark--right"
          src={decorMarkRight}
          alt=""
        />
      </div>

      <div className="contact-section__inner" data-reveal="up">
        <p className="contact-section__eyebrow">Contato</p>
        <h2 id="contact-title">Seu próximo passo começa com uma conversa</h2>
        <p className="contact-section__intro">
          Fale com nossa equipe e agende uma avaliação personalizada para
          descobrir quais cuidados combinam com os seus objetivos.
        </p>

        <a
          className="contact-section__cta brand-cta brand-cta--compact"
          href={externalLinks.whatsapp}
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-section__cta-mark brand-cta__mark" aria-hidden="true">
            <img src={brandMark} alt="" />
          </span>
          <span className="brand-cta__label">Agendar avaliação pelo WhatsApp</span>
        </a>

        <p className="contact-section__note">
          Atendimento personalizado <span>•</span> Privacidade <span>•</span>{' '}
          Acompanhamento
        </p>
      </div>
    </section>
  )
}
