import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let pluginsRegistered = false

export function ensureGsapPlugins() {
  if (!pluginsRegistered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    pluginsRegistered = true
  }
}

export { gsap, ScrollTrigger }
