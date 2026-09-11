import { useState } from 'react'
import decorMarkLeft from '../assets/about/decor-mark-left.svg'
import decorMarkRight from '../assets/about/decor-mark-right.svg'
import brandMark from '../assets/hero/brand-mark.svg'
import addressIcon from '../assets/information/address-icon.png'
import clockIcon from '../assets/information/clock-icon.png'
import whatsappIcon from '../assets/information/whatsapp-icon.png'
import { faqItems } from '../data/faq'
import { externalLinks } from '../data/site'

const locationDetails = [
  {
    id: 'endereco',
    icon: addressIcon,
    label: 'Endereço',
    value: 'Pampulha — Belo Horizonte, MG',
    note: 'Endereço completo a confirmar',
  },
  {
    id: 'horarios',
    icon: clockIcon,
    label: 'Horário de atendimento',
    value: 'Dias e horários a confirmar',
  },
  {
    id: 'contato',
    icon: whatsappIcon,
    label: 'Contato',
    value: 'WhatsApp oficial a confirmar',
  },
] as const

export function Information() {
  const [openItemId, setOpenItemId] = useState<string | null>(null)

  const toggleItem = (itemId: string) => {
    setOpenItemId((currentItemId) =>
      currentItemId === itemId ? null : itemId,
    )
  }

  return (
    <section
      id="informacoes"
      className="information-section"
      aria-labelledby="information-title"
    >
      <div className="information-section__decor" aria-hidden="true">
        <img
          className="information-section__decor-mark information-section__decor-mark--left"
          src={decorMarkLeft}
          alt=""
        />
        <img
          className="information-section__decor-mark information-section__decor-mark--right"
          src={decorMarkRight}
          alt=""
        />
      </div>

      <div className="information-section__inner">
        <header className="information-section__header" data-reveal="up">
          <p className="information-section__eyebrow">Informações</p>
          <h2 id="information-title">
            Tudo o que você precisa saber antes de nos visitar.
          </h2>
          <p>
            Encontre respostas para as dúvidas mais comuns
            <br />e veja como chegar à Lisse Clinic.
          </p>
        </header>

        <div className="information-section__content">
          <div className="information-faq" data-reveal="left">
            <p className="information-faq__eyebrow">Dúvidas frequentes</p>
            <h3>Antes de agendar, tire suas dúvidas.</h3>

            <div className="information-faq__list">
              {faqItems.map((item, index) => {
                const isOpen = openItemId === item.id
                const answerId = `faq-answer-${item.id}`
                const questionId = `faq-question-${item.id}`

                return (
                  <article
                    className="information-faq__item"
                    data-open={isOpen}
                    key={item.id}
                  >
                    <button
                      id={questionId}
                      type="button"
                      className="information-faq__question"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleItem(item.id)}
                    >
                      <span className="information-faq__number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{item.question}</span>
                      <span className="information-faq__toggle" aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    <div
                      id={answerId}
                      className="information-faq__answer"
                      role="region"
                      aria-labelledby={questionId}
                      aria-hidden={!isOpen}
                    >
                      <div>
                        {item.answer ? <p>{item.answer}</p> : null}
                        {!item.answer ? (
                          <span className="visually-hidden">
                            Resposta ainda não cadastrada.
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <aside className="information-location" data-reveal="right">
            <p className="information-location__eyebrow">Localização</p>
            <h3>Estamos esperando por você.</h3>
            <p className="information-location__intro">
              Um espaço preparado para oferecer conforto, privacidade e uma
              experiência de cuidado em cada detalhe.
            </p>

            <div className="information-location__details">
              {locationDetails.map((detail) => (
                <div className="information-location__detail" key={detail.id}>
                  <span className="information-location__icon" aria-hidden="true">
                    <img src={detail.icon} alt="" />
                  </span>
                  <div>
                    <p>{detail.label}</p>
                    <strong>{detail.value}</strong>
                    {'note' in detail ? <span>{detail.note}</span> : null}
                  </div>
                </div>
              ))}
            </div>

            <a
              className="information-location__maps-link brand-cta"
              href={externalLinks.googleMaps}
              target="_blank"
              rel="noreferrer"
            >
              <span className="brand-cta__mark" aria-hidden="true">
                <img src={brandMark} alt="" />
              </span>
              <span className="brand-cta__label">Endereço Google Maps</span>
            </a>

            <div className="information-location__map">
              <iframe
                src={externalLinks.mapEmbed}
                title="Mapa da região indicada para a Lisse Clinic"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
