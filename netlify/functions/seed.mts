import type { Config } from '@netlify/functions'
import { db } from '../../db/index.js'
import { simulations, enrollments } from '../../db/schema.js'

const SEED_SIMULATIONS = [
  {
    title: 'SQL Injection Attack & Defense',
    category: 'cybersecurity',
    level: 'beginner',
    duration: '1h 30m',
    description: 'Learn how SQL injection attacks work and how to defend against them using parameterized queries and input validation.',
  },
  {
    title: 'XSS Vulnerability Lab',
    category: 'cybersecurity',
    level: 'intermediate',
    duration: '2h',
    description: 'Discover and exploit cross-site scripting vulnerabilities, then implement proper output encoding and CSP headers.',
  },
  {
    title: 'Capture The Flag: Network Recon',
    category: 'cybersecurity',
    level: 'advanced',
    duration: '3h',
    description: 'Use real network reconnaissance tools to map a target infrastructure and uncover flags hidden in services.',
  },
  {
    title: 'Build a Text Classifier with scikit-learn',
    category: 'ai',
    level: 'beginner',
    duration: '2h',
    description: 'Train a spam/ham email classifier, evaluate accuracy metrics, and deploy the model as a REST API.',
  },
  {
    title: 'Fine-tune a Language Model',
    category: 'ai',
    level: 'intermediate',
    duration: '4h',
    description: 'Fine-tune a pre-trained transformer model on a domain-specific dataset and compare inference performance.',
  },
  {
    title: 'RAG Pipeline from Scratch',
    category: 'ai',
    level: 'advanced',
    duration: '5h',
    description: 'Build a retrieval-augmented generation system with vector embeddings, a document store, and an LLM query engine.',
  },
  {
    title: 'Deploy a Static Site to AWS S3 + CloudFront',
    category: 'cloud',
    level: 'beginner',
    duration: '1h',
    description: 'Configure an S3 bucket for static hosting, set up CloudFront as a CDN, and deploy a real site via the CLI.',
  },
  {
    title: 'Kubernetes Pod & Service Orchestration',
    category: 'cloud',
    level: 'intermediate',
    duration: '3h',
    description: 'Deploy a multi-container application to a Kubernetes cluster, configure services, and set up a rolling update strategy.',
  },
  {
    title: 'CI/CD Pipeline with GitHub Actions',
    category: 'cloud',
    level: 'intermediate',
    duration: '2h 30m',
    description: 'Build an automated pipeline that runs tests, builds Docker images, and deploys to cloud on every push to main.',
  },
  {
    title: 'Infrastructure as Code with Terraform',
    category: 'cloud',
    level: 'advanced',
    duration: '4h',
    description: 'Provision a full cloud environment (VPC, EC2, RDS, ALB) using Terraform modules with remote state management.',
  },
]

export default async (_req: Request) => {
  const existing = await db.select().from(simulations).limit(1)
  if (existing.length > 0) {
    return Response.json({ message: 'Already seeded', count: existing.length })
  }

  const inserted = await db.insert(simulations).values(SEED_SIMULATIONS).returning()
  return Response.json({ message: 'Seeded', count: inserted.length })
}

export const config: Config = {
  path: '/api/seed',
}
