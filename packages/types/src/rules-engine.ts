import type { StateEntity, ActivityLog } from './common';

export interface RuleSet extends StateEntity {
  name: string;
  description?: string;
  policyType: string;
  rules: Rule[];
  priority: number;
  effectiveFrom?: string;
  effectiveUntil?: string;
  activities: ActivityLog[];
}

export interface Rule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
  metadata?: Record<string, unknown>;
}

export interface FactDefinition {
  id: string;
  name: string;
  dataType: string;
  description?: string;
  source: string;
}

export interface Decision {
  id: string;
  ruleSetId: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  matchedRules: string[];
  evaluatedAt: string;
}
