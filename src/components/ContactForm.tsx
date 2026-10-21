import { useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import {
  contactServices, formatContactPhone, getContactFormLink, normalizeContactPhone,
  pageContactService, type ContactOrigin, type ContactService,
} from '../data/contactFlow'
import './ContactDialog.css'

export type ContactFormProps = {
  origin: ContactOrigin
  onClose?: () => void
  titleId?: string
  headingLevel?: 2 | 3
}

const titles = ['Como podemos chamar você?', 'Qual é o seu WhatsApp?', 'Qual cuidado você procura?', 'Vamos conversar?']

export function ContactForm({ origin, onClose, titleId: suppliedTitleId, headingLevel = 2 }: ContactFormProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const formRef = useRef<HTMLDivElement>(null)
  const interacted = useRef(false)
  const instanceId = useId()
  const titleId = suppliedTitleId ?? `${instanceId}-title`
  const nameId = `${instanceId}-name`
  const phoneId = `${instanceId}-phone`
  const errorId = `${instanceId}-error`
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState<ContactService | ''>(origin.service ?? pageContactService[origin.page] ?? '')
  const [error, setError] = useState('')
  const normalizedPhone = normalizeContactPhone(phone)


  useLayoutEffect(() => {
    // The inline section must never steal focus or scroll on load.
    if (!interacted.current) return
    const form = formRef.current!
    const target = step === 2
      ? form.querySelector<HTMLInputElement>('input:checked') ?? form.querySelector<HTMLInputElement>('input[type="radio"]')
      : step === 3 ? form.querySelector<HTMLElement>('.contact-flow__title') : form.querySelector<HTMLInputElement>('.contact-flow__input')
    const dialog = form.closest('dialog')
    target?.focus({ preventScroll: !!dialog })
    if (dialog) dialog.scrollTop = 0
  }, [step])

  const advance = (event: FormEvent) => {
    event.preventDefault()
    const message = step === 0 && !name.trim() ? 'Digite seu nome para continuar.'
      : step === 1 && !normalizedPhone ? 'Digite um telefone com DDD e 10 ou 11 dígitos.'
        : step === 2 && !service ? 'Escolha um serviço ou selecione “Ainda não sei”.' : ''
    setError(message)
    if (message) {
      formRef.current?.querySelector<HTMLInputElement>('input[aria-invalid="true"], input')?.focus()
      return
    }
    interacted.current = true
    setStep((current) => Math.min(current + 1, 3))
  }


  return <div ref={formRef} className="contact-flow__content">
    <div className="contact-flow__top">
      <p className="contact-flow__step" aria-live="polite">Etapa {step + 1} de 4</p>
      {onClose && <button type="button" className="contact-flow__close" onClick={onClose} aria-label="Fechar formulário">
        <span>Fechar</span><span aria-hidden="true">×</span>
      </button>}
    </div>
    <div className="contact-flow__progress" aria-hidden="true">
      {titles.map((title, index) => <span key={title} data-complete={index <= step} />)}
    </div>
    <Heading id={titleId} className="contact-flow__title" tabIndex={-1}>{titles[step]}</Heading>
    <p className="contact-flow__intro">{step === 0 ? 'Uma conversa é o primeiro passo para um cuidado pensado para você.'
      : step === 1 ? 'Informe seu número com DDD para facilitar o contato com a equipe.'
        : step === 2 ? 'Você pode esclarecer suas dúvidas com a equipe antes de decidir.'
          : 'Confira seus dados antes de seguir para a conversa.'}</p>
    <form onSubmit={advance} noValidate aria-labelledby={titleId}>
      {step === 0 && <div className="contact-flow__field">
        <label htmlFor={nameId}>Seu nome</label>
        <input id={nameId} className="contact-flow__input" name="name" autoComplete="given-name" maxLength={100} required
          value={name} onChange={(event) => { setName(event.target.value); setError('') }} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} />
      </div>}
      {step === 1 && <div className="contact-flow__field">
        <label htmlFor={phoneId}>WhatsApp com DDD</label>
        <input id={phoneId} className="contact-flow__input" name="tel" type="tel" inputMode="tel" autoComplete="tel" placeholder="(31) 99999-9999" maxLength={25} required
          value={phone} onChange={(event) => { setPhone(event.target.value); setError('') }} aria-invalid={!!error} aria-describedby={error ? errorId : undefined} />
      </div>}
      {step === 2 && <fieldset className="contact-flow__services" aria-describedby={error ? errorId : undefined} aria-invalid={!!error}>
        <legend>Serviço de interesse</legend>
        {contactServices.map((option) => <label key={option}>
          <input type="radio" name={`${instanceId}-service`} value={option} checked={service === option} required
            onChange={() => { setService(option); setError('') }} />
          <span>{option}</span>
        </label>)}
      </fieldset>}
      {step === 3 && <>
        <dl className="contact-flow__review">
          <div><dt>Nome</dt><dd>{name.trim()}</dd></div>
          <div><dt>WhatsApp</dt><dd>{normalizedPhone && `+55 ${formatContactPhone(normalizedPhone)}`}</dd></div>
          <div><dt>Serviço de interesse</dt><dd>{service}</dd></div>
          {origin.professional && <div><dt>Profissional de interesse</dt><dd>{origin.professional}</dd></div>}
        </dl>
        <p className="contact-flow__notice">Ao continuar, o WhatsApp será aberto com seus dados preenchidos. Você confirma o envio por lá.</p>
      </>}
      {error && <p id={errorId} className="contact-flow__error" role="alert">{error}</p>}
      <div className="contact-flow__actions">
        {step === 3 && normalizedPhone && service
          ? <a className="contact-flow__primary" href={getContactFormLink(name, normalizedPhone, service, origin)} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp</a>
          : <button type="submit" className="contact-flow__primary">Continuar</button>}
        {step > 0 && <button type="button" className="contact-flow__back" onClick={() => { interacted.current = true; setError(''); setStep((current) => current - 1) }}>Voltar</button>}
      </div>
    </form>
    <p className="contact-flow__privacy">Seus dados não são salvos neste site.</p>
  </div>
}
