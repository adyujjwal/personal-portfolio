/**
 * Experience data.
 * ──────────────────────────────────────────────────────────────────────
 * Edit roles, dates, tags and brand colors here. `logo` points to an image in
 * public/images/. `accent` tints each portal card's glow. `logoBg` is the tile
 * behind the (transparent) logo; `logoScale` nudges logos that have padding.
 */

export interface ExperienceItem {
  id: string
  company: string
  role: string
  period: string
  location: string
  summary: string
  highlights: string[]
  technologies: string[]
  logo: string
  accent: string // hex used for the card glow / holographic tint
  /** Background tile behind the (transparent) logo so every brand pops. */
  logoBg: string
  /** Visual scale for the logo inside its tile (some logos have padding). */
  logoScale?: number
}

export const experience: ExperienceItem[] = [
  {
    id: 'walmart',
    company: 'Walmart Global Tech',
    role: 'Senior Software Engineer',
    period: 'Oct 2026 - Present',
    location: 'Bengaluru, India',
    summary:
      "Joining Walmart's Catalog team to build large-scale, high-throughput systems that power product data across one of the world's largest retailers.",
    highlights: [
      'Engineering catalog systems that serve product data at massive scale and traffic.',
      'Focused on distributed systems, reliability, performance and clean API design.',
      'Bringing full-stack and AI/LLM experience to catalog data and automation.',
    ],
    technologies: [
      'Java',
      'React',
      'Node.js',
      'Microservices',
      'Cloud Architecture',
      'GCP',
      'Azure',
      'NoSQL',
      'RDBMS',
      'CI/CD',
      'Catalog',
      'Distributed Systems',
    ],
    logo: '/images/downloaded/Walmart.webp',
    accent: '#0071dc',
    logoBg: '#041e42',
  },
  {
    id: 'sap',
    company: 'SAP Labs India',
    role: 'Software Developer 2',
    period: 'Oct 2021 - Oct 2026',
    location: 'Bengaluru, India',
    summary:
      'Grew from Associate to Software Developer 2 on SAP Concur, shipping AI-powered, distributed systems for enterprise spend management at global scale.',
    highlights: [
      'Built GenAI inference pipelines on SAP AI Core with Gemini 2.5 Flash, with multi-model fallback and structured-output validation for invoice OCR, expense classification and policy extraction.',
      'Delivered end-to-end virtual card issuance integrating Mastercard & Amex APIs, with lifecycle management and automatic deactivation.',
      'Developed an event-driven invoice capture platform processing 1M+ invoices daily across US, EU and APJ datacenters using AWS SQS, S3 and DynamoDB.',
      'Migrated the Concur Invoice UI from Ext JS to React/Redux and backend to Spring Boot microservices, for 40% faster initial load and 30% better system performance.',
    ],
    technologies: [
      'Java',
      'Spring Boot',
      'React',
      'GenAI',
      'AWS',
      'Microservices',
      'Redis',
      'Distributed Systems',
    ],
    logo: '/images/downloaded/sap.webp',
    accent: '#0a6ed1',
    logoBg: '#ffffff',
  },
  {
    id: 'enquero',
    company: 'Enquero',
    role: 'Software Engineer',
    period: 'Aug 2020 - Oct 2021',
    location: 'Bengaluru, India',
    summary:
      'Built partner-onboarding platforms end to end, with responsive Angular UIs backed by Spring Boot services and third-party integrations.',
    highlights: [
      'Developed modular Angular components for onboarding, document submission and real-time progress monitoring.',
      'Built Spring Boot services for partner data management, validations and workflow orchestration.',
      'Integrated Cisco internal systems and DocuSign to automate compliance workflows, with GDPR-compliant, role-based dashboards.',
    ],
    technologies: ['Angular', 'Spring Boot', 'Workflows', 'DocuSign', 'GDPR'],
    logo: '/images/downloaded/enquero.webp',
    accent: '#17b890',
    logoBg: '#ffffff',
    logoScale: 2.0,
  },
]
