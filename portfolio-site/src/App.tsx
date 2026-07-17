import { WaterDistortion } from '@rippleflow/water-distortion'
import waterBackground from './assets/water-background.svg'
import { PortfolioPage } from './features/layout/PortfolioPage'
import styles from './App.module.css'

function App() {
  return (
    <WaterDistortion
      className={styles.water}
      mode="texture"
      texture={waterBackground}
      underlay={
        <img
          aria-hidden="true"
          alt=""
          className={styles.underlay}
          src={waterBackground}
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
