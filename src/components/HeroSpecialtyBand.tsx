import { SpecialtyRail } from './SpecialtyRail'

const destinations = {
  'Harmonização': '/#tratamento-harmonizacao-corporal',
  'Tricologia': '/#tratamento-tricologia',
  'Emagrecimento': '/#tratamento-emagrecimento',
  'Estética e Bem-estar': '/#tratamento-estetica-em-geral',
  'Estética Íntima': '/#tratamento-faloplastia',
} as const

export function HeroSpecialtyBand({ items }: { items: readonly string[] }) {
  return <SpecialtyRail items={items} destinations={destinations} variant="hero" />
}
