import { WaterDistortion } from '@rippleflow/water-distortion'
import starBackground from './assets/star-background.svg'
import waterBackground from './assets/water-background.svg'
import { PortfolioPage } from './features/layout/PortfolioPage'
import { useTimeBasedTheme } from './hooks/useTimeBasedTheme'
import type { SiteTheme } from './lib/theme'
import styles from './App.module.css'

const backgroundTextures: Record<SiteTheme, string> = {
  light: waterBackground,
  dark: starBackground,
}

function App() {
  const { theme, preference, toggleTheme, useAutomaticTheme } =
    useTimeBasedTheme()
  const backgroundTexture = backgroundTextures[theme]

  return (
    <WaterDistortion
      className={styles.water}
      mode="texture"
      texture={backgroundTexture}
      underlay={
        <img
          aria-hidden="true"
          alt=""
          className={styles.underlay}
          src={backgroundTexture}
        />
      }
      interactionMode={"both"}
      wakeStrength={0.3}
      waveSpeed={.6}
      ridgeStrength={.6}
      refractionStrength={.1}
      specularIntensity={0.1}
      crestIntensity={0.01}
      causticIntensity={0}
    >
      <PortfolioPage
        theme={theme}
        themePreference={preference}
        onToggleTheme={toggleTheme}
        onUseAutomaticTheme={useAutomaticTheme}
      />
    </WaterDistortion>
  )
}

export default App
