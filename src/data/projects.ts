/**
 * Projects data.
 * ──────────────────────────────────────────────────────────────────────
 * Each project renders inside a floating 3D laptop. `media` is a video/image in
 * public/images/downloaded/. `github`/`liveDemo` are left `null` until real URLs
 * are provided - DO NOT invent links; set a real string and the button appears.
 */

export interface Project {
  id: string
  title: string
  /** Category chip, e.g. ['AI', 'Full-Stack'] -> "AI · Full-Stack". */
  tags: string[]
  description: string
  /** Problem / Solution / Impact breakdown shown in the card. */
  details: { label: string; text: string }[]
  technologies: string[]
  /** Path to video / image inside public/images/downloaded/. */
  media: string
  github: string | null // TODO: add real repo URL or keep null
  liveDemo: string | null // TODO: add real demo URL or keep null
  accent: string
}

export const projects: Project[] = [
  {
    id: 'mockoffer',
    title: 'MockOffer',
    tags: ['AI', 'Full-Stack'],
    description:
      'An AI-powered mock coding interview platform to practice company-specific questions from Google, Meta, and Amazon, with instant feedback on complexity, correctness, and code quality.',
    details: [
      {
        label: 'Problem',
        text: 'Interview prep is scattered, and generic practice questions rarely reflect how specific companies actually evaluate candidates.',
      },
      {
        label: 'Solution',
        text: 'A Monaco-based code editor with company-tagged problem sets and an AI reviewer that grades solutions on time and space complexity, correctness, and code quality in real time.',
      },
      {
        label: 'Impact',
        text: 'One place to practice targeted interview questions and get instant, actionable feedback on every submission.',
      },
    ],
    technologies: ['TypeScript', 'React', 'Monaco Editor', 'AI', 'Node.js'],
    media: '/images/downloaded/mockoffer.mp4',
    github: 'https://github.com/adyujjwal/MockOffer',
    liveDemo: 'https://mockoffer.live/',
    accent: '#6ea8ff',
  },
  {
    id: 'walklens',
    title: 'WalkLens',
    tags: ['AR', 'Vuforia'],
    description:
      'An augmented reality platform that turns a simple QR scan into interactive product walkthroughs and support material.',
    details: [
      {
        label: 'Problem',
        text: 'Product walkthroughs and support content are hard to reach at the exact moment users need them, standing in front of the product.',
      },
      {
        label: 'Solution',
        text: 'A QR-driven AR experience that overlays contextual guides and support material onto real products, letting users learn by pointing their camera.',
      },
      {
        label: 'Impact',
        text: 'Faster, self-serve product onboarding and support without digging through manuals.',
      },
    ],
    technologies: ['Python', 'Augmented Reality', 'QR', 'Vuforia'],
    media: '/images/downloaded/walklens.mp4',
    github: 'https://github.com/adyujjwal/WalkLens',
    liveDemo: null,
    accent: '#5de4c7',
  },
  {
    id: 'virtra',
    title: 'Virtra',
    tags: ['3D', 'Web'],
    description:
      'A metaverse hotel booking solution that lets guests explore and reserve rooms inside an immersive virtual environment.',
    details: [
      {
        label: 'Problem',
        text: 'Traditional hotel booking is flat and text-heavy, so guests cannot get a real feel for a space before they book.',
      },
      {
        label: 'Solution',
        text: 'An interactive 3D world where users walk through virtual hotels and book rooms directly from the immersive experience.',
      },
      {
        label: 'Impact',
        text: 'A more immersive way to preview and book stays before ever arriving.',
      },
    ],
    technologies: ['Unity', 'React Three.js', 'React 360', 'WebGL', '3D', 'JavaScript'],
    media: '/images/downloaded/virtra.mp4',
    github: 'https://github.com/adyujjwal/Virtra',
    liveDemo: null,
    accent: '#c58fff',
  },
]
