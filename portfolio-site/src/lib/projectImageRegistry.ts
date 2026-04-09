import flightOpsPreview from '../assets/projects/Relational_Diagram.webp'
import ragPreview from '../assets/projects/AI-Fact-Checker.webp'
import type { ProjectImageAsset } from '../content/types'

export const projectImageRegistry: Record<string, ProjectImageAsset> = {
  'flightops-database': {
    src: flightOpsPreview,
    width: 720,
    height: 480,
    alt: 'Relational diagram for the FlightOps Database Design project.',
  },
  'rag-fact-checking': {
    src: ragPreview,
    width: 720,
    height: 480,
    alt: 'Screenshot for the RAG Fact-Checking Extension project.',
  },
}
