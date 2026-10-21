import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { getWhatsAppLink, type SitePage } from '../data/site'
import type { ContactFormProps } from './ContactForm'
import './ContactFormSection.css'

export function ContactFormSection({ page }: { page: SitePage }) {
  const sectionRef = useRef<HTMLElement>(null)
  const alive = useRef(true)
  const loading = useRef(false)
  const [loaded, setLoaded] = useState<{ Form: ComponentType<ContactFormProps> } | null>(null)
  const [failed, setFailed] = useState(false)
  const load = useCallback(async () => {
    if (loading.current) return
    loading.current = true
    try {
      const { ContactForm } = await import('./ContactForm')
      if (alive.current) setLoaded({ Form: ContactForm })
    } catch {
      if (alive.current) setFailed(true)
    } finally {
      loading.current = false
    }
  }, [])

  useEffect(() => {
    alive.current = true
    if (window.location.hash === '#agendamento' || !('IntersectionObserver' in window)) {
      // Direct links should work even before the browser paints this section.
      queueMicrotask(() => { if (alive.current) void load() })
      return () => { alive.current = false }
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        void load()
      }
    }, { rootMargin: '400px' })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { alive.current = false; observer.disconnect() }
  }, [load])

  return <section id="agendamento" className="contact-form-section" ref={sectionRef} aria-labelledby="appointment-section-title">
    <div className="contact-form-section__inner">
      <div className="contact-form-section__copy">
        <h2 id="appointment-section-title">Agende sua avaliação</h2>
        <p>Conte como podemos chamar você e qual cuidado procura. Ao final, continue a conversa com nossa equipe pelo WhatsApp.</p>
        <p className="contact-form-section__note">No seu tempo, com atenção a cada detalhe.</p>
      </div>
      <div className="contact-form-section__slot">
        {loaded ? <div className="contact-flow contact-flow--inline">
          <loaded.Form origin={{ page }} headingLevel={3} />
        </div> : <div className="contact-form-section__fallback">
          <p role="status">{failed ? 'Não foi possível carregar o formulário.' : 'Preparando seu atendimento…'}</p>
          {failed && <button type="button" onClick={() => { setFailed(false); void load() }}>Tentar novamente</button>}
          <a href={getWhatsAppLink(page)} target="_blank" rel="noopener noreferrer">Conversar diretamente pelo WhatsApp</a>
        </div>}
      </div>
    </div>
  </section>
}
