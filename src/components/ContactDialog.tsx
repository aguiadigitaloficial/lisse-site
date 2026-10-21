import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import {
  contactServices, formatContactPhone, getContactFormLink, normalizeContactPhone,
  pageContactService, type ContactOrigin, type ContactService,
} from '../data/contactFlow'
import './ContactDialog.css'

export type ContactDialogProps = {
  origin: ContactOrigin
  trigger: HTMLAnchorElement
  onClose: () => void
}

const titles = ['Como podemos chamar você?', 'Qual é o seu WhatsApp?', 'Qual cuidado você procura?', 'Vamos conversar?']

export function ContactDialog({ origin, trigger, onClose }: ContactDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState<ContactService | ''>(origin.service ?? pageContactService[origin.page] ?? '')
  const [error, setError] = useState('')
  const normalizedPhone = normalizeContactPhone(phone)

  useLayoutEffect(() => {
    const dialog = dialogRef.current!
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    const updateViewport = () => {
      const viewport = window.visualViewport
      dialog.style.setProperty('--contact-viewport-height', `${viewport?.height ?? window.innerHeight}px`)
      dialog.style.setProperty('--contact-viewport-center', `${(viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight) / 2}px`)
    }
    updateViewport()
    dialog.showModal()
    window.visualViewport?.addEventListener('resize', updateViewport)
    window.visualViewport?.addEventListener('scroll', updateViewport)
    window.addEventListener('resize', updateViewport)
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      window.visualViewport?.removeEventListener('resize', updateViewport)
      window.visualViewport?.removeEventListener('scroll', updateViewport)
      window.removeEventListener('resize', updateViewport)
      // A closed mobile menu makes its original contact link inert.
      const returnTarget = trigger.closest('[inert]') || !trigger.getClientRects().length
        ? document.querySelector<HTMLElement>('.menu-toggle') : trigger
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true })
    }
  }, [trigger])

  useLayoutEffect(() => {
    const dialog = dialogRef.current!
    const target = step === 2
      ? dialog.querySelector<HTMLInputElement>('input:checked') ?? dialog.querySelector<HTMLInputElement>('input[type="radio"]')
      : step === 3 ? dialog.querySelector<HTMLElement>('#contact-flow-title') : dialog.querySelector<HTMLInputElement>('.contact-flow__input')
    target?.focus({ preventScroll: true })
    dialog.scrollTop = 0
  }, [step])

  const advance = (event: FormEvent) => {
    event.preventDefault()
    const message = step === 0 && !name.trim() ? 'Digite seu nome para continuar.'
      : step === 1 && !normalizedPhone ? 'Digite um telefone com DDD e 10 ou 11 dígitos.'
        : step === 2 && !service ? 'Escolha um serviço ou selecione “Ainda não sei”.' : ''
    setError(message)
    if (message) {
      dialogRef.current?.querySelector<HTMLInputElement>('input[aria-invalid="true"], input')?.focus()
      return
    }
    setStep((current) => Math.min(current + 1, 3))
  }

  return createPortal(<dialog ref={dialogRef} className="contact-flow" aria-labelledby="contact-flow-title" onKeyDown={(event) => {
    if (event.key !== 'Tab') return
    const dialog = event.currentTarget
    const candidates = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]'))
    const checkedRadio = dialog.querySelector<HTMLInputElement>('input[type="radio"]:checked')
    const firstRadio = dialog.querySelector<HTMLInputElement>('input[type="radio"]')
    const focusable = candidates.filter((element) => !(element instanceof HTMLInputElement) || element.type !== 'radio' || element === (checkedRadio ?? firstRadio))
    const index = focusable.indexOf(document.activeElement as HTMLElement)
    if (event.shiftKey && index <= 0) {
      event.preventDefault()
      focusable.at(-1)?.focus()
    } else if (!event.shiftKey && index === focusable.length - 1) {
      event.preventDefault()
      focusable[0]?.focus()
    }
  }} onCancel={(event) => {
    event.preventDefault()
    onClose()
  }}>
    <div className="contact-flow__top">
      <p className="contact-flow__step" aria-live="polite">Etapa {step + 1} de 4</p>
      <button type="button" className="contact-flow__close" onClick={onClose} aria-label="Fechar formulário">
        <span>Fechar</span><span aria-hidden="true">×</span>
      </button>
    </div>
    <div className="contact-flow__progress" aria-hidden="true">
      {titles.map((title, index) => <span key={title} data-complete={index <= step} />)}
    </div>
    <h2 id="contact-flow-title" tabIndex={-1}>{titles[step]}</h2>
    <p className="contact-flow__intro">{step === 0 ? 'Uma conversa é o primeiro passo para um cuidado pensado para você.'
      : step === 1 ? 'Informe seu número com DDD para facilitar o contato com a equipe.'
        : step === 2 ? 'Você pode esclarecer suas dúvidas com a equipe antes de decidir.'
          : 'Confira seus dados antes de seguir para a conversa.'}</p>
    <form onSubmit={advance} noValidate>
      {step === 0 && <div className="contact-flow__field">
        <label htmlFor="contact-flow-name">Seu nome</label>
        <input id="contact-flow-name" className="contact-flow__input" name="name" autoComplete="given-name" maxLength={100} required
          value={name} onChange={(event) => { setName(event.target.value); setError('') }} aria-invalid={!!error} aria-describedby={error ? 'contact-flow-error' : undefined} />
      </div>}
      {step === 1 && <div className="contact-flow__field">
        <label htmlFor="contact-flow-phone">WhatsApp com DDD</label>
        <input id="contact-flow-phone" className="contact-flow__input" name="tel" type="tel" inputMode="tel" autoComplete="tel" placeholder="(31) 99999-9999" maxLength={25} required
          value={phone} onChange={(event) => { setPhone(event.target.value); setError('') }} aria-invalid={!!error} aria-describedby={error ? 'contact-flow-error' : undefined} />
      </div>}
      {step === 2 && <fieldset className="contact-flow__services" aria-describedby={error ? 'contact-flow-error' : undefined} aria-invalid={!!error}>
        <legend>Serviço de interesse</legend>
        {contactServices.map((option) => <label key={option}>
          <input type="radio" name="service" value={option} checked={service === option} required
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
      {error && <p id="contact-flow-error" className="contact-flow__error" role="alert">{error}</p>}
      <div className="contact-flow__actions">
        {step === 3 && normalizedPhone && service
          ? <a className="contact-flow__primary" href={getContactFormLink(name, normalizedPhone, service, origin)} target="_blank" rel="noopener noreferrer">Continuar no WhatsApp</a>
          : <button type="submit" className="contact-flow__primary">Continuar</button>}
        {step > 0 && <button type="button" className="contact-flow__back" onClick={() => { setError(''); setStep((current) => current - 1) }}>Voltar</button>}
      </div>
    </form>
    <p className="contact-flow__privacy">Seus dados não são salvos neste site.</p>
  </dialog>, document.body)
}
