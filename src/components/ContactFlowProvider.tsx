import { useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { ContactFlowContext, type ContactRequest } from './contactFlowContext'
import type { ContactDialogProps } from './ContactDialog'
import type { SitePage } from '../data/site'

export function ContactFlowProvider({ page, children }: { page: SitePage; children: ReactNode }) {
  const [session, setSession] = useState<{ request: ContactRequest; Dialog: ComponentType<ContactDialogProps> } | null>(null)
  const loading = useRef(false)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const open = async (request: ContactRequest) => {
    if (loading.current || session) return
    loading.current = true
    request.trigger.setAttribute('aria-busy', 'true')
    try {
      const { ContactDialog } = await import('./ContactDialog')
      if (mounted.current) setSession({ request, Dialog: ContactDialog })
    } catch {
      // Preserve a working direct contact when the optional form chunk is unavailable.
      if (mounted.current) window.location.assign(request.href)
    } finally {
      loading.current = false
      request.trigger.removeAttribute('aria-busy')
    }
  }

  return <ContactFlowContext.Provider value={open}>
    {children}
    {session && <session.Dialog
      origin={{ page, service: session.request.service, professional: session.request.professional }}
      trigger={session.request.trigger}
      onClose={() => setSession(null)}
    />}
  </ContactFlowContext.Provider>
}
