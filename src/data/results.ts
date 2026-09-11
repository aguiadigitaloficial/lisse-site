import result01 from '../assets/results/result-01.jpg'
import result02 from '../assets/results/result-02.jpg'
import result03 from '../assets/results/result-03.jpg'
import result04 from '../assets/results/result-04.jpg'
import result05 from '../assets/results/result-05.jpg'
import result06 from '../assets/results/result-06.jpg'
import result07 from '../assets/results/result-07.jpg'
import result08 from '../assets/results/result-08.jpg'
import result09 from '../assets/results/result-09.jpg'
import result10 from '../assets/results/result-10.jpg'
import result11 from '../assets/results/result-11.jpg'
import result12 from '../assets/results/result-12.jpg'
import type { ResultCase } from '../types/content'
import { photography } from './photography'

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
    alt: 'Comparativo antes e depois de harmonização facial, vista de perfil',
  },
  {
    id: 'resultado-05',
    image: result05,
    alt: 'Comparativo antes e depois de harmonização facial, vista frontal',
  },
  {
    id: 'resultado-06',
    image: result06,
    alt: 'Comparativo antes e depois de harmonização facial, vista lateral',
  },
  {
    id: 'resultado-07',
    image: result07,
    alt: 'Comparativo antes e depois de harmonização facial do nariz, vista lateral',
  },
  {
    id: 'resultado-08',
    image: result08,
    alt: 'Comparativo antes e depois de harmonização facial dos lábios, vista lateral',
  },
  {
    id: 'resultado-09',
    image: result09,
    alt: 'Comparativo antes e depois de harmonização facial, vista em três quartos',
  },
  {
    id: 'resultado-10',
    image: result10,
    alt: 'Comparativo frontal antes e depois de uma jornada de emagrecimento',
  },
  {
    id: 'resultado-11',
    image: result11,
    alt: 'Comparativo antes e depois de harmonização facial masculina, vista frontal',
  },
  {
    id: 'resultado-12',
    image: result12,
    alt: 'Comparativo lateral antes e depois de uma jornada de emagrecimento',
  },
  {
    id: 'resultado-13',
    image: photography.results.facialFrontal,
    alt: 'Comparativo antes e depois de harmonização facial, vista frontal',
    fit: 'contain',
  },
  {
    id: 'resultado-14',
    image: photography.results.facialFullFace,
    alt: 'Comparativo antes e depois de harmonização facial, enquadramento frontal',
    fit: 'contain',
  },
  {
    id: 'resultado-15',
    image: photography.results.facialProfile,
    alt: 'Comparativo antes e depois de harmonização facial, vista de perfil',
    fit: 'contain',
  },
]
