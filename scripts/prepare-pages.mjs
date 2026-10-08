import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { pageMetadata, pagePaths } from '../src/data/site.ts'

// Static document shells preserve direct URLs, metadata and early image discovery.
// React remains responsible for rendering and client-side navigation (no SSR migration).
const dist = new URL('../dist/', import.meta.url)
const template = await readFile(new URL('index.html', dist), 'utf8')
const assets = await readdir(new URL('assets/', dist))
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;')
function asset(prefix, extension) {
  const file = assets.find((name) => name.startsWith(`${prefix}-`) && name.endsWith(extension))
  if (!file) throw new Error(`Missing build asset: ${prefix}${extension}`)
  return `/assets/${file}`
}
function preload(prefix, widths, sizes) {
  const srcset = widths.map((width) => `${asset(`${prefix}-${width}`, '.webp')} ${width}w`).join(', ')
  return `<link rel="preload" as="image" fetchpriority="high" imagesrcset="${srcset}" imagesizes="${sizes}" />`
}
const preloads = {
  inicio: preload('kelly-brunette-hero', [480, 640, 900], '(max-width: 480px) 100vw, (max-width: 999px) 480px, (max-width: 1440px) 42vw, 605px'),
  harmonizacao: preload('facial-female-front-8121', [320, 640, 960, 1200], '(max-width: 999px) 48vw, 380px'),
  faloplastia: '',
  emagrecimento: preload('weight-loss-front', [320, 640, 960], '(max-width: 999px) 48vw, 380px'),
}
for (const [page, path] of Object.entries(pagePaths)) {
  const metadata = pageMetadata[page]
  // Direct specialty visits can discover their chunk alongside the main entry.
  // The homepage still downloads it only after navigating to a specialty.
  const routePreload = page === 'inicio' ? '' : `<link rel="modulepreload" href="${asset('SpecialtyLandingPage', '.js')}" />\n    <link rel="stylesheet" href="${asset('SpecialtyLandingPage', '.css')}" />`
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${metadata.title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*("\s*\/>)/, `$1${escape(metadata.description)}$2`)
    .replace('</head>', `${preloads[page]}\n    ${routePreload}\n    <meta property="og:type" content="website" />\n    <meta property="og:locale" content="pt_BR" />\n    <meta property="og:title" content="${escape(metadata.title)}" />\n    <meta property="og:description" content="${escape(metadata.description)}" />\n  </head>`)
  const folder = path === '/' ? dist : new URL(`${path.slice(1)}/`, dist)
  await mkdir(folder, { recursive: true })
  await writeFile(new URL('index.html', folder), html)
}
console.log('Prepared four route documents with metadata and image preloads.')
