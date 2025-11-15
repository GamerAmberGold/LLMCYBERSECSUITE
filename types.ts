export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  ANALYST = 'ROLE_ANALYST',
  TRAINEE = 'ROLE_TRAINEE',
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  createdAt: string;
  enabled: boolean;
}

export enum PhishVerdict {
  BENIGN = 'Benign',
  SUSPICIOUS = 'Suspicious',
  MALICIOUS = 'Malicious',
}

export interface PhishResult {
  id: string;
  subject: string;
  body: string;
  verdict: PhishVerdict;
  score: number;
  reasons: string[];
  llm_evidence: string;
  createdAt: string;
  raw_email_ref?: string;
}

export enum IncidentSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export enum IncidentStatus {
  NEW = 'New',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  CLOSED = 'Closed',
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  ownerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDoc {
    id: string;
    title: string;
    content: string;
    source: string;
}

export interface GMailAccount {
    id: string;
    email: string;
    lastSync: string;
}