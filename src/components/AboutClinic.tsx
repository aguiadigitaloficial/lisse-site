import decorMarkLeft from '../assets/about/decor-mark-left.svg'
import decorMarkRight from '../assets/about/decor-mark-right.svg'
import decorRingCenter from '../assets/about/decor-ring-center.svg'
import decorRingLeft from '../assets/about/decor-ring-left.svg'
import decorRingRight from '../assets/about/decor-ring-right.svg'
import mosaicMark from '../assets/about/mosaic-mark.png'
import reception from '../assets/about/reception.png'
import brandMark from '../assets/hero/brand-mark.svg'
import separatorMark from '../assets/hero/separator-mark.png'
import { photography } from '../data/photography'

type AboutClinicProps = {
  onNavigateToTreatments: () => void
}

type ClinicMetric = {
  value: string
  label: string
}

const clinicMetrics: readonly ClinicMetric[] = [
  { value: '500+', label: 'Procedimentos realizados' },
  { value: '5.0★', label: 'Avaliação no Google' },
  { value: '100%', label: 'Protocolo personalizado' },
]

export function AboutClinic({ onNavigateToTreatments }: AboutClinicProps) {
  return (
    <section
      id="sobre"
      className="about-clinic"
      aria-labelledby="about-clinic-title"
    >
      <div className="about-clinic__decor" aria-hidden="true">
        <img
          className="about-clinic__decor-ring about-clinic__decor-ring--left"
          src={decorRingLeft}
          alt=""
        />
        <img
          className="about-clinic__decor-ring about-clinic__decor-ring--center"
          src={decorRingCenter}
          alt=""
        />
        <img
          className="about-clinic__decor-ring about-clinic__decor-ring--right"
          src={decorRingRight}
          alt=""
        />
        <img
          className="about-clinic__decor-mark about-clinic__decor-mark--left"
          src={decorMarkLeft}
          alt=""
        />
        <img
          className="about-clinic__decor-mark about-clinic__decor-mark--right"
          src={decorMarkRight}
          alt=""
        />
      </div>

      <div className="about-clinic__inner">
        <header className="about-clinic__header" data-reveal="up">
          <h2 id="about-clinic-title">
            Um cuidado único,
            <br />
            {' '}
            pensado em cada detalhe.
          </h2>
          <p>
            Na <strong>Lisse Clinic</strong>, cada protocolo nasce de uma avaliação
            individual e da atuação integrada de uma equipe multiprofissional,
            unindo excelência, exclusividade e atendimento humanizado.
          </p>
        </header>

        <div
          className="about-clinic__metrics"
          aria-label="Indicadores da clínica"
          data-reveal="up"
          data-reveal-delay="1"
        >
          {clinicMetrics.map((metric, index) => (
            <div className="about-clinic__metric-group" key={metric.label}>
              <div className="about-clinic__metric">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
              {index < clinicMetrics.length - 1 && (
                <span className="about-clinic__metric-separator" aria-hidden="true">
                  <img src={separatorMark} alt="" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="about-clinic__body">
          <div className="about-clinic__mosaic" data-reveal="left">
            <figure className="about-clinic__tile about-clinic__tile--reception">
              <img
                src={reception}
                alt="Recepção da Lisse Clinic"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figure className="about-clinic__tile about-clinic__tile--consultation">
              <img
                src={photography.owner.portrait.image}
                alt={photography.owner.portrait.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figure className="about-clinic__tile about-clinic__tile--conversation">
              <img
                src={photography.clinic.bodyCare.image}
                alt={photography.clinic.bodyCare.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <figure className="about-clinic__tile about-clinic__tile--facial">
              <img
                src={photography.clinic.facialTreatment.image}
                alt={photography.clinic.facialTreatment.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
            <img
              className="about-clinic__mosaic-mark"
              src={mosaicMark}
              alt=""
              aria-hidden="true"
            />
          </div>

          <div
            className="about-clinic__copy"
            data-reveal="right"
            data-reveal-delay="1"
          >
            <div className="about-clinic__copy-content">
              <p className="about-clinic__eyebrow">Conheça a Lisse Clinic</p>
              <h3>Uma clínica completa para os seus cuidados</h3>
              <div className="about-clinic__description">
                <p>
                  Localizada na Pampulha, em <strong>Belo Horizonte</strong>, a{' '}
                  <strong>Lisse Clinic</strong> reúne estética avançada, saúde e
                  bem-estar em <strong>protocolos personalizados</strong>.
                </p>
                <p>
                  Cada jornada começa com uma <strong>avaliação individual</strong>{' '}
                  e é conduzida por uma equipe multiprofissional, com discrição,
                  segurança e naturalidade.
                </p>
              </div>

              <a
                className="about-clinic__button brand-cta"
                href="#tratamentos"
                onClick={(event) => {
                  event.preventDefault()
                  onNavigateToTreatments()
                }}
              >
                <span className="about-clinic__button-mark brand-cta__mark" aria-hidden="true">
                  <img src={brandMark} alt="" />
                </span>
                <span className="brand-cta__label">Conheça os nossos tratamentos</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
