import { useId, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ContactOrigin } from '../data/contactFlow'
import { ContactForm } from './ContactForm'

export type ContactDialogProps = {
  origin: ContactOrigin
  trigger: HTMLAnchorElement
  onClose: () => void
}

export function ContactDialog({ origin, trigger, onClose }: ContactDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

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
    dialog.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true })
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

  return createPortal(<dialog ref={dialogRef} className="contact-flow" aria-labelledby={titleId} onKeyDown={(event) => {
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
    <ContactForm origin={origin} onClose={onClose} titleId={titleId} />
  </dialog>, document.body)
}
