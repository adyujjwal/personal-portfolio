import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Preloader intro-reveal (portfolio-2025 style)
 * ──────────────────────────────────────────────────────────────────────
 * A single drop-in overlay that plays once per load:
 *   1. Full-screen beige overlay with a centered monogram. The logo fills from
 *      the bottom up (an SVG mask rect scaled on Y) as simulated progress eases
 *      to ~90%, then settles to 100% once fonts are ready — never wired to
 *      anything heavy, never blocks if assets are slow.
 *   2. At 100% the overlay fades out while the logo scales down.
 *   3. As it leaves, the page fades up from the background (`[data-reveal-root]`)
 *      and the hero heading (`[data-hero-heading]`) does a staggered split-text
 *      reveal (per-character opacity/y/blur).
 *   4. Calls `onReveal` so the host can enable scrolling / start smooth scroll.
 *
 * Respects prefers-reduced-motion (skips everything, reveals immediately) and
 * fully removes itself from the DOM afterwards so it never blocks clicks.
 *
 * All timings/colours live in CONFIG below — tweak freely.
 */

const CONFIG = {
  bg: '#050507', // overlay background — matches the app (ink-950)
  logo: '#f5f5f2', // faint base monogram (ghost) — bone-100
  fill: '#5de4c7', // rising fill colour — the site green
  accent: '#5de4c7', // marquee separator accent — the site green
  raceTo90: 1.1, // seconds to fill up to ~90%
  settle: 0.5, // seconds to finish 90 → 100 once ready
  hold: 0.25, // brief hold once full
  exit: 0.45, // overlay fade + logo shrink duration
  exitScale: 0.4, // logo scale on exit
  pageFade: 0.95, // page opacity 0 → 1 duration
  charDuration: 0.7, // per-character reveal duration
  charStagger: 0.025, // delay between characters
  fontsTimeout: 2500, // ms — give up waiting on fonts after this
} as const

// Adway's hexagon monogram (shared with portfolio-2025).
const LOGO_PATH =
  'M3 14 24 2C28 0 28 0 32 2L53 14C56 16 56 17 56 19L56 43C56 46 55 47 51 49L32 59C28 61 28 61 24 59L5 49C1 47 0 46 0 43L0 19C0 17 0 16 3 14M28 4 5 17 28 28 51 17 28 4M53 20 30 31 30 56 53 44 53 20M40 42 33 35C33 35 32 34 33 33 34 32 35 33 36 34L36 34 43 41C44 42 44 42 43 43L35 51C35 51 34 52 33 51 32 50 33 49 33 49L40 42M16 42 23 35C23 35 24 34 23 33 22 32 21 33 20 34L13 41C12 42 12 42 13 43L21 51C21 51 22 52 23 51 24 50 23 49 23 49L16 42'

interface PreloaderIntroProps {
  /** Fired when the page begins revealing (safe point to enable scrolling). */
  onReveal?: () => void
  /** Selector for the element to fade up from the background. */
  revealRootSelector?: string
  /** Selector for the heading to split-text reveal. */
  headingSelector?: string
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Tiny character splitter: wraps every character of every text node under
 * `root` in an inline-block <span>, grouped into per-word nowrap spans so lines
 * only ever break at real spaces (never mid-word). Nested elements (e.g. a
 * coloured accent span) and whitespace are preserved. Returns the char spans in
 * document order for staggering.
 */
function splitChars(root: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = []
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? ''
        if (!text) continue
        const frag = document.createDocumentFragment()
        for (const token of text.split(/(\s+)/)) {
          if (token === '') continue
          if (/^\s+$/.test(token)) {
            frag.appendChild(document.createTextNode(token))
            continue
          }
          const word = document.createElement('span')
          word.style.display = 'inline-block'
          word.style.whiteSpace = 'nowrap'
          for (const ch of token) {
            const span = document.createElement('span')
            span.textContent = ch
            span.style.display = 'inline-block'
            span.style.willChange = 'transform, opacity, filter'
            word.appendChild(span)
            chars.push(span)
          }
          frag.appendChild(word)
        }
        node.replaceChild(frag, child)
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child)
      }
    }
  }
  walk(root)
  return chars
}

export function PreloaderIntro({
  onReveal,
  revealRootSelector = '[data-reveal-root]',
  headingSelector = '[data-hero-heading]',
}: PreloaderIntroProps) {
  // Start already-removed under reduced motion so the overlay never flashes.
  const [removed, setRemoved] = useState(() => prefersReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const rectRef = useRef<SVGRectElement>(null)
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const revealRoot = document.querySelector<HTMLElement>(revealRootSelector)

    // Reduced motion (or SSR fallback): reveal immediately, no animation.
    if (prefersReducedMotion()) {
      if (revealRoot) revealRoot.style.opacity = '1'
      onReveal?.()
      setRemoved(true)
      return
    }

    // Safety: if anything below throws, reveal the page rather than trap it.
    let tl: gsap.core.Timeline | null = null
    try {
      const prog = { p: 0 }
      const setFill = () => {
        if (rectRef.current) rectRef.current.style.transform = `scaleY(${prog.p / 100})`
      }

      // Hide the page until the reveal; prep the heading split-text hidden.
      if (revealRoot) gsap.set(revealRoot, { opacity: 0 })
      const heading = document.querySelector<HTMLElement>(headingSelector)
      const chars = heading ? splitChars(heading) : []
      if (chars.length) {
        gsap.set(heading, { opacity: 1 })
        gsap.set(chars, { opacity: 0, y: 80, filter: 'blur(5px)' })
      }

      // Progress is ready once fonts resolve — but never wait past the timeout.
      const fontsReady: Promise<unknown> =
        typeof document !== 'undefined' && 'fonts' in document
          ? (document as Document).fonts.ready
          : Promise.resolve()
      const ready = Promise.race([
        fontsReady,
        new Promise((res) => window.setTimeout(res, CONFIG.fontsTimeout)),
      ])

      tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => setRemoved(true),
      })

      // 1) Fill to ~90%.
      tl.to(prog, { p: 90, duration: CONFIG.raceTo90, onUpdate: setFill })

      // Pause at ~90% until fonts/assets are ready, then resume.
      tl.addPause(undefined, () => {
        ready.finally(() => tl?.resume())
      })

      // 2) Settle to 100%, then hold briefly.
      tl.to(prog, { p: 100, duration: CONFIG.settle, ease: 'power1.inOut', onUpdate: setFill })
      tl.to({}, { duration: CONFIG.hold })

      // 3) Exit (fade + shrink) + page reveal + hero split-text, concurrent.
      tl.add('reveal')
      tl.add(() => onReveal?.(), 'reveal')
      tl.to(
        svgRef.current,
        { scale: CONFIG.exitScale, opacity: 0, duration: CONFIG.exit, ease: 'power2.in' },
        'reveal',
      )
      tl.to(
        rootRef.current,
        { autoAlpha: 0, duration: CONFIG.exit, ease: 'power2.in' },
        'reveal',
      )
      if (revealRoot) {
        tl.to(revealRoot, { opacity: 1, duration: CONFIG.pageFade, ease: 'power1.out' }, 'reveal')
      }
      if (chars.length) {
        tl.to(
          chars,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: CONFIG.charDuration,
            ease: 'power2.inOut',
            stagger: CONFIG.charStagger,
          },
          'reveal+=0.15',
        )
      }
    } catch {
      if (revealRoot) revealRoot.style.opacity = '1'
      onReveal?.()
      setRemoved(true)
    }

    // No cleanup teardown: this overlay is a one-shot that removes itself when
    // the timeline completes. Killing the timeline on cleanup would abort it
    // under React 18 StrictMode's dev remount probe (setup → cleanup → setup),
    // since the `ran` guard intentionally blocks the second setup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (removed) return null

  // Duplicated row so the -50% marquee loop is seamless (same technique as the
  // skills ticker). Each cell is "Adway Ujjwal" + an accent separator.
  const cells = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-12 overflow-hidden"
      style={{ backgroundColor: CONFIG.bg }}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 56 61"
        className="h-28 w-28 sm:h-32 sm:w-32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path id="preloader-logo" d={LOGO_PATH} />
          <mask id="preloader-mask">
            <rect fill="black" x="-2" y="0" width="60" height="61" />
            <rect
              ref={rectRef}
              fill="white"
              x="-2"
              y="0"
              width="60"
              height="61"
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'bottom',
                transform: 'scaleY(0)',
              }}
            />
          </mask>
        </defs>
        {/* faint ghost base + masked fill that rises with progress (green) */}
        <use href="#preloader-logo" fill={CONFIG.logo} opacity={0.18} />
        <use href="#preloader-logo" fill={CONFIG.fill} mask="url(#preloader-mask)" />
      </svg>

      {/* Moving name band — mirrors the skills marquee motion */}
      <div className="marquee-mask w-full overflow-hidden">
        <div className="animate-marquee flex w-max gap-2">
          {[...cells, ...cells].map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap font-display text-4xl font-bold tracking-tight text-bone-100/10 sm:text-6xl"
            >
              Adway Ujjwal
              <span className="mx-6" style={{ color: CONFIG.accent }}>
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
