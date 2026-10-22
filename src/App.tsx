import { Suspense, lazy, useEffect, useState } from 'react'
import { SmoothScroll } from './components/common/SmoothScroll'
import { CustomCursor } from './components/common/CustomCursor'
import { PreloaderIntro } from './components/common/PreloaderIntro'
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

export default function App() {
  // Flipped by the preloader intro-reveal once the page is unveiled.
  const [revealed, setRevealed] = useState(false)

  // Lock scrolling until the reveal completes.
  useEffect(() => {
    document.body.style.overflow = revealed ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [revealed])

  return (
    <SmoothScroll start={revealed}>
      <PreloaderIntro onReveal={() => setRevealed(true)} />
      <CustomCursor />

      <div className="grain relative" data-reveal-root>
        <a
          href="#experience"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-bone-100 focus:px-4 focus:py-2 focus:text-sm focus:text-ink-950"
        >
          Skip to content
        </a>

        <Navbar />

        <main>
          <Hero started={revealed} />
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
