import { parseContactSubmission } from '../src/data/contactSubmission'

const MAX_BYTES = 4096
const json = (status: number, body: object, extraHeaders?: Record<string, string>) => Response.json(body, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extraHeaders },
})

export async function handleContactRequest(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' }, { Allow: 'POST' })
  const origin = request.headers.get('origin')
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') {
    return json(403, { ok: false, error: 'forbidden' })
  }
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
    return json(415, { ok: false, error: 'json_required' })
  }
  if (Number(request.headers.get('content-length')) > MAX_BYTES) return json(413, { ok: false, error: 'payload_too_large' })

  let payload
  try {
    const reader = request.body?.getReader()
    if (!reader) return json(400, { ok: false, error: 'invalid_data' })
    let bytes = 0
    const chunks: Uint8Array[] = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_BYTES) {
        await reader.cancel()
        return json(413, { ok: false, error: 'payload_too_large' })
      }
      chunks.push(value)
    }
    payload = parseContactSubmission(JSON.parse(Buffer.concat(chunks).toString('utf8')))
  } catch {
    return json(400, { ok: false, error: 'invalid_data' })
  }
  if (!payload) return json(400, { ok: false, error: 'invalid_data' })

  let webhook: URL
  try {
    webhook = new URL(process.env.DATACRAZY_WEBHOOK_URL ?? '')
    if (webhook.protocol !== 'https:' || webhook.username || webhook.password || webhook.port ||
      !['api.datacrazy.io', 'api.g1.datacrazy.io'].includes(webhook.hostname)) throw new Error('Invalid configuration')
  } catch {
    return json(503, { ok: false, error: 'integration_unavailable' })
  }

  try {
    const result = await fetch(webhook, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(8000), redirect: 'error',
    })
    // Never expose the upstream response, webhook URL, or personal data to logs/client.
    await result.body?.cancel()
    if (!result.ok) return json(502, { ok: false, error: 'upstream_rejected' })
    return json(200, { ok: true, status: 'accepted' })
  } catch {
    // No automatic retry: an interrupted response may already have created a lead.
    return json(504, { ok: false, error: 'upstream_unavailable' })
  }
}
