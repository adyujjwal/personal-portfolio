/**
 * Achievements data.
 * ──────────────────────────────────────────────────────────────────────
 * Certificate images live in public/images/downloaded/certificates/.
 * `aspect` is width/height of the image so each carousel card matches its
 * certificate (no cropping). Fill in real `organization` / `year` where TODO.
 */

export interface Achievement {
  id: string
  title: string
  organization: string
  year: string
  description: string
  image: string
  accent: string
  /** image width / height — sizes the carousel card to avoid cropping. */
  aspect?: number
}

const DIR = '/images/downloaded/certificates'

export const achievements: Achievement[] = [
  {
    id: 'hacks-2023',
    title: 'Hacks for Innovation - Winner',
    organization: 'SAP Labs India',
    year: '2023',
    description:
      'Winner at Hacks for Innovation, recognized for building an innovative solution under hackathon constraints.',
    image: `${DIR}/hacks-for-innovation.webp`,
    accent: '#6ea8ff',
    aspect: 1427 / 1102,
  },
  {
    id: 'sap-concur',
    title: 'Certificate of Appreciation',
    organization: 'SAP Concur',
    year: '2023',
    description: 'Certificate of Appreciation from SAP Concur for outstanding contribution.',
    image: `${DIR}/sap-concur-appreciation.webp`,
    accent: '#0a6ed1',
    aspect: 1500 / 1049,
  },
  {
    id: 'next-gen',
    title: 'Next Gen Team Player',
    organization: 'Enquero',
    year: '2021',
    description: 'Certificate of Appreciation recognizing standout team collaboration.',
    image: `${DIR}/next-gen-team-player.webp`,
    accent: '#5de4c7',
    aspect: 1675 / 939,
  },
  {
    id: 'psg-techfest',
    title: 'Certificate of Appreciation',
    organization: 'PSG TechFest',
    year: '2023',
    description: 'Certificate of Appreciation from PSG TechFest.',
    image: `${DIR}/psg-techfest-appreciation.webp`,
    accent: '#c58fff',
    aspect: 1458 / 1079,
  },
  {
    id: 'tech-award',
    title: 'Technology Award',
    organization: 'PSG Institute of Technology, Coimbatore',
    year: '2023',
    description: 'Recognition for technical innovation and excellence.',
    image: `${DIR}/technology-award.webp`,
    accent: '#ffd36e',
    aspect: 1309 / 1202,
  },
]
