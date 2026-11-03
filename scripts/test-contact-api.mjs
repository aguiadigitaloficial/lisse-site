import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript'

// Load the real TypeScript handler without adding a runtime dependency.
const modules = new Map()
async function moduleUrl(file) {
  if (modules.has(file.href)) return modules.get(file.href)
  const source = await readFile(file, 'utf8')
  let code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
  for (const match of [...code.matchAll(/from ['"]([^'"]+)['"]/g)]) {
    if (match[1].startsWith('.')) {
      const dependency = await moduleUrl(new URL(`${match[1]}.ts`, file))
      code = code.replace(match[0], `from '${dependency}'`)
    }
  }
  const url = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  modules.set(file.href, url)
  return url
}
const { handleContactRequest } = await import(await moduleUrl(new URL('../server/contact-handler.ts', import.meta.url)))
const sample = { name: ' Teste integração Lisse ', phone: '31 99999-9999', service: 'Harmonização', professional: 'Kelly Trindade', page: 'inicio', source: 'untrusted' }
const request = (body = sample, headers = {}, method = 'POST') => new Request('https://lisse.example/api/contato', {
  method, headers: { 'Content-Type': 'application/json', Origin: 'https://lisse.example', ...headers },
  ...(method === 'GET' ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
})

await test('API de contato: validação, encaminhamento e falhas sem rede real', async (t) => {
  const originalEnv = process.env.DATACRAZY_WEBHOOK_URL
  t.after(() => {
    if (originalEnv === undefined) delete process.env.DATACRAZY_WEBHOOK_URL
    else process.env.DATACRAZY_WEBHOOK_URL = originalEnv
  })
  process.env.DATACRAZY_WEBHOOK_URL = 'https://api.datacrazy.io/test-only/not-a-live-webhook'

  await t.test('normaliza as quatro páginas e os profissionais sem vazar campos extras', async (t) => {
    let calls = 0
    t.mock.method(globalThis, 'fetch', async (url, options) => {
      calls++
      assert.equal(url.hostname, 'api.datacrazy.io')
      assert.equal(options.method, 'POST')
      assert.equal(options.redirect, 'error')
      assert.ok(options.signal instanceof AbortSignal)
      const body = JSON.parse(options.body)
      assert.deepEqual(Object.keys(body).sort(), ['name', 'phone', 'service', 'professional', 'page', 'source'].sort())
      assert.equal(body.name, 'Teste integração Lisse')
      assert.equal(body.phone, '5531999999999')
      assert.equal(body.source, 'Site Lisse')
      return new Response('accepted', { status: 202 })
    })
    for (const page of ['inicio', 'harmonizacao', 'faloplastia', 'emagrecimento']) {
      for (const professional of [null, 'Kelly Trindade', 'Dr. Diogo Rafael', 'Dr. Yeiko Roca', 'Dra. Fernanda Lucas', 'Dr. Diego Lacerda']) {
        const res = await handleContactRequest(request({ ...sample, page, professional, password: 'not-forwarded' }))
        assert.equal(res.status, 200)
        assert.equal(res.headers.get('cache-control'), 'no-store')
        assert.deepEqual(await res.json(), { ok: true, status: 'accepted' })
      }
    }
    assert.equal(calls, 24)
  })
  await t.test('rejeita entradas inválidas antes de chamar o webhook', async (t) => {
    t.mock.method(globalThis, 'fetch', () => { assert.fail('Não deve chamar a rede') })
    for (const body of [null, [], {}, { ...sample, name: '' }, { ...sample, phone: '123' },
      { ...sample, service: 'invalid' }, { ...sample, page: 'invalid' }, { ...sample, professional: {} },
      { ...sample, name: 'a\nInjected' }, '{']) {
      assert.equal((await handleContactRequest(request(body))).status, 400)
    }
    assert.equal((await handleContactRequest(request('x'.repeat(4097)))).status, 413)
    assert.equal((await handleContactRequest(request(sample, { 'Content-Type': 'text/plain' }))).status, 415)
    assert.equal((await handleContactRequest(request(sample, { Origin: 'https://other.example' }))).status, 403)
    assert.equal((await handleContactRequest(request(sample, { 'Sec-Fetch-Site': 'cross-site' }))).status, 403)
    const res = await handleContactRequest(request(undefined, {}, 'GET'))
    assert.equal(res.status, 405)
    assert.equal(res.headers.get('allow'), 'POST')
  })
  await t.test('configuração ausente ou destino inválido não chama a rede', async (t) => {
    t.mock.method(globalThis, 'fetch', () => { assert.fail('Não deve chamar a rede') })
    const configured = process.env.DATACRAZY_WEBHOOK_URL
    for (const value of ['', 'http://api.datacrazy.io/test', 'https://other.example/test']) {
      process.env.DATACRAZY_WEBHOOK_URL = value
      assert.equal((await handleContactRequest(request())).status, 503)
    }
    process.env.DATACRAZY_WEBHOOK_URL = configured
  })
  await t.test('rejeição e indisponibilidade não retornam falso sucesso nem repetem o envio', async (t) => {
    let calls = 0
    const mock = t.mock.method(globalThis, 'fetch', async () => {
      calls++
      return new Response('upstream-secret-response', { status: 500 })
    })
    const res = await handleContactRequest(request())
    assert.equal(res.status, 502)
    assert.equal((await res.text()).includes('upstream-secret'), false)
    mock.mock.mockImplementation(async () => { calls++; throw new DOMException('timed out', 'TimeoutError') })
    assert.equal((await handleContactRequest(request())).status, 504)
    assert.equal(calls, 2)
  })
})
