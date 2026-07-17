import { useEffect, useState } from 'react'
import { WaterDistortion } from '@rippleflow/water-distortion'
import waterBackground from './assets/water-background.svg?no-inline'
import { PortfolioPage } from './features/layout/PortfolioPage'
import styles from './App.module.css'

function App() {
  const [textureImage, setTextureImage] = useState<HTMLImageElement>()
  const [isWaterReady, setIsWaterReady] = useState(false)

  useEffect(() => {
    if (!textureImage) {
      return undefined
    }

    let revealFrame = 0
    const uploadFrame = window.requestAnimationFrame(() => {
      revealFrame = window.requestAnimationFrame(() => {
        setIsWaterReady(true)
      })
    })

    return () => {
      window.cancelAnimationFrame(uploadFrame)
      window.cancelAnimationFrame(revealFrame)
    }
  }, [textureImage])

  return (
    <WaterDistortion
      className={[styles.water, isWaterReady ? '' : styles.waterPending]
        .filter(Boolean)
        .join(' ')}
      mode="texture"
      texture={textureImage}
      underlay={
        <img
          aria-hidden="true"
          alt=""
          className={styles.underlay}
          src={waterBackground}
          onLoad={(event) => setTextureImage(event.currentTarget)}
        />
      }
      wakeStrength={0.3}
      waveSpeed={.6}
      ridgeStrength={.6}
      crestIntensity={0.01}
      specularIntensity={0.1}
      causticIntensity={0.5}
    >
      <PortfolioPage />
    </WaterDistortion>
  )
}

export default App
