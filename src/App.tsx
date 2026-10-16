import { Suspense, lazy, useEffect, useState } from 'react'
import { SmoothScroll } from './components/common/SmoothScroll'
import { CustomCursor } from './components/common/CustomCursor'
import { LoadingScreen } from './components/common/LoadingScreen'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/hero/Hero'

// Below-the-fold sections are code-split to keep the initial bundle lean.
const Experience = lazy(() =>
  import('./components/experience/Experience').then((m) => ({ default: m.Experience })),
)
const Projects = lazy(() =>
  import('./components/projects/Projects').then((m) => ({ default: m.Projects })),
)
const Achievements = lazy(() =>
  import('./components/achievements/Achievements').then((m) => ({ default: m.Achievements })),
)
const Skills = lazy(() => import('./components/skills/Skills').then((m) => ({ default: m.Skills })))
const Contact = lazy(() =>
  import('./components/contact/Contact').then((m) => ({ default: m.Contact })),
)

function useIntroLoader() {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = performance.now()
    const MIN = 900 // keep the intro brief but intentional
    let raf = 0
    const tick = () => {
      const elapsed = performance.now() - start
      const pct = Math.min(100, (elapsed / MIN) * 100)
      setProgress(pct)
      if (pct < 100) raf = requestAnimationFrame(tick)
      else setTimeout(() => setDone(true), 250)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return { progress, done }
}

export default function App() {
  const { progress, done } = useIntroLoader()

  return (
    <SmoothScroll>
      <LoadingScreen progress={progress} done={done} />
      <CustomCursor />

      <div className="grain relative">
        <a
          href="#experience"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-bone-100 focus:px-4 focus:py-2 focus:text-sm focus:text-ink-950"
        >
          Skip to content
        </a>

        <Navbar />

        <main>
          <Hero started={done} />
          <Suspense fallback={<div className="h-px" />}>
            <Experience />
            <Projects />
            <Achievements />
            <Skills />
            <Contact />
          </Suspense>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  )
}
