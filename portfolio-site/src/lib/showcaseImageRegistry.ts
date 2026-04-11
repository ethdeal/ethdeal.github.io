import tedxPreview from '../assets/design/Habanero_mockup.webp'
import dkuUltimatePreview from '../assets/design/DKU_Cup.webp'
import flightOpsPreview from '../assets/projects/Relational_Diagram.webp'
import ragPreview from '../assets/projects/AI-Fact-Checker.webp'
import type { ShowcaseImageAsset } from '../content/types'

export const showcaseImageRegistry: Record<string, ShowcaseImageAsset> = {
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
