import tedxPreview from '../assets/design/Habanero_mockup.webp'
import dkuUltimatePreview from '../assets/design/DKU_Cup.webp'
import emberPreview from '../assets/projects/unlockember.webp'
import flightOpsPreview from '../assets/projects/Relational_Diagram.webp'
import ragPreview from '../assets/projects/AI-Fact-Checker.webp'
import rippleFlowPreview from '../assets/projects/rippleflow-water-distortion.svg'
import type { ShowcaseImageAsset } from '../content/types'

export const showcaseImageRegistry: Record<string, ShowcaseImageAsset> = {
  'ember-intelligence': {
    src: emberPreview,
    width: 2556,
    height: 1428,
    alt: 'Screenshot of the Ember Intelligence website.',
  },
  'flightops-database': {
    src: flightOpsPreview,
    width: 1058,
    height: 942,
    alt: 'Relational diagram for the FlightOps Database Design project.',
  },
  'rag-fact-checking': {
    src: ragPreview,
    width: 605,
    height: 1005,
    alt: 'RAG Fact-Checking Extension UI.',
  },
  'rippleflow-water-distortion': {
    src: rippleFlowPreview,
    width: 720,
    height: 480,
    alt: 'Illustration of the RippleFlow water distortion package.',
  },
  'tedx-dku': {
    src: tedxPreview,
    width: 386,
    height: 1280,
    alt: 'TEDx DKU promotional work.',
    renderMode: 'cutout',
  },
  'dku-ultimate-instagram': {
    src: dkuUltimatePreview,
    width: 3000,
    height: 4000,
    alt: 'DKU Ultimate gameday poster.',
  },
}
