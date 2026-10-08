import clinicBodyCare from '../assets/photography/clinic-body-care.jpg'
import facialLipTreatment from '../assets/photography/facial-lip-treatment.jpg'
import facialResultFrontal from '../assets/photography/facial-result-frontal.jpg'
import facialResultFullFace from '../assets/photography/facial-result-full-face.jpg'
import facialResultProfile from '../assets/photography/facial-result-profile.jpg'
import harmonizationBodyApplication from '../assets/photography/harmonization-body-application.jpg'
import kellyEditorialHero480 from '../assets/photography/kelly-brunette-hero-480.webp'
import kellyEditorialHero640 from '../assets/photography/kelly-brunette-hero-640.webp'
import kellyEditorialHero900 from '../assets/photography/kelly-brunette-hero-900.webp'
import kellyTreatmentRoom from '../assets/photography/kelly-treatment-room.jpg'

export const photography = {
  owner: {
    hero: {
      small: kellyEditorialHero480,
      medium: kellyEditorialHero640,
      large: kellyEditorialHero900,
      alt: 'Kelly Trindade, de cabelos castanhos e roupa branca, no consultório da Lisse Clinic',
    },
    portrait: {
      image: kellyTreatmentRoom,
      alt: 'Kelly Trindade em uma sala de atendimento da Lisse Clinic',
    },
  },
  clinic: {
    bodyCare: {
      image: clinicBodyCare,
      alt: 'Atendimento corporal realizado na Lisse Clinic',
    },
    facialTreatment: {
      image: facialLipTreatment,
      alt: 'Detalhe de um atendimento de harmonização labial na Lisse Clinic',
    },
  },
  procedures: {
    harmonizationBody: {
      image: harmonizationBodyApplication,
      alt: 'Aplicação durante um atendimento de harmonização corporal',
    },
  },
  results: {
    facialFrontal: facialResultFrontal,
    facialFullFace: facialResultFullFace,
    facialProfile: facialResultProfile,
  },
} as const
