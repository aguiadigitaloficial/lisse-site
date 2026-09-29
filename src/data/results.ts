import result01 from '../assets/results/result-01-sem-data.webp'
import result02 from '../assets/results/result-02-sem-data.webp'
import result03 from '../assets/results/result-03-sem-data.webp'
import result04 from '../assets/results/facial-female-front-8121.webp'
import result05 from '../assets/results/facial-male-front-8831.webp'
import result06 from '../assets/results/facial-female-three-quarter-8437.webp'
import result07 from '../assets/results/facial-male-front-7339.webp'
import result08 from '../assets/results/facial-female-profile-8122.webp'
import result09 from '../assets/results/facial-female-front-7360.webp'
import result10 from '../assets/results/result-10.jpg'
import result12 from '../assets/results/result-12.jpg'
import harmonizationBodyMale from '../assets/hero/harmonization-body-male.webp'
import type { ResultCase } from '../types/content'

export const resultCases: ResultCase[] = [
  {
    id: 'resultado-01',
    image: result01,
    alt: 'Comparativo antes e depois de harmonização corporal, vista posterior',
  },
  {
    id: 'resultado-02',
    image: result02,
    alt: 'Comparativo antes e depois de harmonização corporal, vista lateral',
  },
  {
    id: 'resultado-03',
    image: result03,
    alt: 'Comparativo antes e depois de harmonização corporal, vista posterior',
  },
  {
    id: 'resultado-04',
    image: result04,
    alt: 'Comparativo antes e depois de harmonização facial feminina, vista frontal',
    format: 'facial',
  },
  {
    id: 'resultado-05',
    image: result05,
    alt: 'Comparativo antes e depois de harmonização facial masculina, vista frontal',
    format: 'facial',
  },
  {
    id: 'resultado-06',
    image: result06,
    alt: 'Comparativo antes e depois de harmonização facial feminina, vista em três quartos',
    format: 'facial',
  },
  {
    id: 'resultado-07',
    image: result07,
    alt: 'Comparativo antes e depois de harmonização facial masculina, vista frontal',
    format: 'facial',
  },
  {
    id: 'resultado-08',
    image: result08,
    alt: 'Comparativo antes e depois de harmonização facial feminina, vista de perfil',
    format: 'facial',
  },
  {
    id: 'resultado-09',
    image: result09,
    alt: 'Comparativo antes e depois de harmonização facial feminina, vista frontal',
    format: 'facial',
  },
  {
    id: 'resultado-10',
    image: result10,
    alt: 'Comparativo frontal antes e depois de uma jornada de emagrecimento',
  },
  {
    id: 'resultado-12',
    image: result12,
    alt: 'Comparativo lateral antes e depois de uma jornada de emagrecimento',
  },
]

export const harmonizationBodyRecord: ResultCase = {
  id: 'corporal-masculina-registro',
  image: harmonizationBodyMale,
  alt: 'Registro clínico individual de panturrilhas masculinas, sem comparação de antes e depois',
  format: 'portrait',
  kind: 'clinical-record',
}
