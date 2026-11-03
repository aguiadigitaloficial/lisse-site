import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { handleContactRequest } from '../server/contact-handler'

async function localContactApi(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const pathname = req.url?.split('?')[0]
  if (pathname !== '/api/contato') return next()
  try {
    const chunks: Buffer[] = []
    let bytes = 0
    for await (const chunk of req) {
      bytes += chunk.length
      if (bytes > 4096) {
        res.writeHead(413, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
        res.end(JSON.stringify({ ok: false, error: 'payload_too_large' }))
        return
      }
      chunks.push(Buffer.from(chunk))
    }
    const headers = new Headers()
    for (const [name, value] of Object.entries(req.headers)) {
      if (value) headers.set(name, Array.isArray(value) ? value.join(', ') : value)
    }
    const method = req.method ?? 'GET'
    const request = new Request(`http://${req.headers.host ?? '127.0.0.1'}${req.url}`, {
      method, headers, ...(method !== 'GET' && method !== 'HEAD' ? { body: Buffer.concat(chunks).toString('utf8') } : {}),
    })
    const result = await handleContactRequest(request)
    res.writeHead(result.status, Object.fromEntries(result.headers))
    res.end(await result.text())
  } catch {
    res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify({ ok: false, error: 'local_api_unavailable' }))
  }
}

export function contactApiPlugin(): Plugin {
  return {
    name: 'local-contact-api',
    configureServer(server) { server.middlewares.use(localContactApi) },
    configurePreviewServer(server) { server.middlewares.use(localContactApi) },
  }
}
