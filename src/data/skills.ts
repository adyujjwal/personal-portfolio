/**
 * Skills data - drives the 3D constellation (and the mobile 2D network).
 * ──────────────────────────────────────────────────────────────────────
 * Each skill belongs to a category (which sets its color + orbit grouping).
 * `level` (0–1) scales node size. `context` powers the hover tooltip.
 */

export type SkillCategory =
  | 'Frontend'
  | 'Backend'
  | 'Cloud'
  | 'DevOps'
  | 'AI'
  | 'Database'
  | 'Testing'

export interface Skill {
  id: string
  label: string
  category: SkillCategory
  level: number // 0..1 - visual weight only
  context: string
}

export const categoryColors: Record<SkillCategory, string> = {
  Frontend: '#6ea8ff',
  Backend: '#ff8f6e',
  Cloud: '#9ec1ff',
  DevOps: '#c58fff',
  AI: '#5de4c7',
  Database: '#ffd36e',
  Testing: '#ff7eb6',
}

export const centralNode = {
  id: 'adway',
  label: 'ADWAY',
}

export const skills: Skill[] = [
  // Frontend
  { id: 'react', label: 'React', category: 'Frontend', level: 1, context: 'Primary UI library across products.' },
  { id: 'typescript', label: 'TypeScript', category: 'Frontend', level: 0.95, context: 'Type-safe app development.' },
  { id: 'javascript', label: 'JavaScript', category: 'Frontend', level: 0.9, context: 'Core of the web platform.' },

  // Backend
  { id: 'java', label: 'Java', category: 'Backend', level: 1, context: 'Primary backend language.' },
  { id: 'spring', label: 'Spring Boot', category: 'Backend', level: 1, context: 'Microservices & REST APIs.' },
  { id: 'microservices', label: 'Microservices', category: 'Backend', level: 0.9, context: 'Distributed system design.' },

  // Cloud
  { id: 'aws', label: 'AWS', category: 'Cloud', level: 0.9, context: 'Cloud infrastructure & services.' },

  // DevOps
  { id: 'docker', label: 'Docker', category: 'DevOps', level: 0.85, context: 'Containerized workloads.' },
  { id: 'kubernetes', label: 'Kubernetes', category: 'DevOps', level: 0.85, context: 'Orchestration at scale.' },

  // Database
  { id: 'mysql', label: 'MySQL', category: 'Database', level: 0.8, context: 'Relational data modeling.' },
  { id: 'sql', label: 'SQL', category: 'Database', level: 0.85, context: 'Querying & optimization.' },
  { id: 'redis', label: 'Redis', category: 'Database', level: 0.8, context: 'Caching & low-latency stores.' },

  // AI
  { id: 'ai', label: 'AI / GenAI', category: 'AI', level: 0.9, context: 'Applied generative AI.' },
  { id: 'rag', label: 'RAG', category: 'AI', level: 0.85, context: 'Retrieval-augmented generation.' },
  { id: 'langchain', label: 'LangChain', category: 'AI', level: 0.8, context: 'LLM application framework.' },
  { id: 'langgraph', label: 'LangGraph', category: 'AI', level: 0.8, context: 'Agentic orchestration graphs.' },
]
