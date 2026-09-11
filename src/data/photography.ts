import clinicBodyCare from '../assets/photography/clinic-body-care.jpg'
import facialLipTreatment from '../assets/photography/facial-lip-treatment.jpg'
import facialResultFrontal from '../assets/photography/facial-result-frontal.jpg'
import facialResultFullFace from '../assets/photography/facial-result-full-face.jpg'
import facialResultProfile from '../assets/photography/facial-result-profile.jpg'
import harmonizationBodyApplication from '../assets/photography/harmonization-body-application.jpg'
import kellyClinicHero1440 from '../assets/photography/kelly-clinic-hero-1440.jpg'
import kellyClinicHero640 from '../assets/photography/kelly-clinic-hero-640.jpg'
import kellyClinicHero960 from '../assets/photography/kelly-clinic-hero-960.jpg'
import kellyTreatmentRoom from '../assets/photography/kelly-treatment-room.jpg'

export const photography = {
  owner: {
    hero: {
      small: kellyClinicHero640,
      medium: kellyClinicHero960,
      large: kellyClinicHero1440,
      alt: 'Kelly Trindade na Lisse Clinic',
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
