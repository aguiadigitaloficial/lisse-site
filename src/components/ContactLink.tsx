import { useContext, type ComponentProps } from 'react'
import { ContactFlowContext } from './contactFlowContext'
import type { ContactService } from '../data/contactFlow'

type ContactLinkProps = ComponentProps<'a'> & {
  href: string
  service?: ContactService
  professional?: string
}

export function ContactLink({ href, service, professional, onClick, ...props }: ContactLinkProps) {
  const open = useContext(ContactFlowContext)
  return <a {...props} href={href} aria-haspopup={open ? 'dialog' : undefined} onClick={(event) => {
    onClick?.(event)
    if (!open || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || typeof HTMLDialogElement === 'undefined') return
    event.preventDefault()
    open({ href, service, professional, trigger: event.currentTarget })
  }} />
}
