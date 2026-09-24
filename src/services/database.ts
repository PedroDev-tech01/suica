/**
 * Future Cloud Persistence Architecture (Supabase / Postgres Ready)
 *
 * Defines the clean relational schema and service interface so that remote database
 * storage can be connected in the future without refactoring existing UI components.
 *
 * For the MVP: Data is maintained locally via React state and browser localStorage.
 */

import { ComparisonResult, InsurancePlan, UserProfile } from '../types/insurance';

export interface DbUser {
  id: string;
  email?: string;
  createdAt: string;
}

export interface DbPurchase {
  id: string;
  userId?: string;
  amountCHF: number;
  paymentProvider: string;
  paymentReference: string;
  status: 'pending' | 'completed' | 'refunded';
  createdAt: string;
}

export interface DbOptimizerSession {
  id: string;
  userId?: string;
  canton: string;
  ageGroup: string;
  employmentStatus: string;
  createdAt: string;
}

export interface DbSavedScenario {
  id: string;
  sessionId: string;
  profile: UserProfile;
  currentPlan: InsurancePlan;
  altPlan: InsurancePlan;
  calculation: ComparisonResult;
  createdAt: string;
}

export interface DbReport {
  id: string;
  scenarioId: string;
  reportHtml?: string;
  generatedAt: string;
}

/**
 * Local Storage Adapter fulfilling the storage contract for MVP
 */
const STORAGE_KEY = 'shio_user_session_v1';

export interface LocalSessionData {
  profile: UserProfile;
  currentPlan: InsurancePlan;
  altPlan: InsurancePlan;
  completedSteps: string[];
  checklistCompleted: Record<string, boolean>;
  lastUpdated: string;
}

export function saveLocalSession(data: LocalSessionData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save session to localStorage', e);
  }
}

export function loadLocalSession(): LocalSessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not load session from localStorage', e);
    return null;
  }
}

export function clearLocalSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('shio_access_token');
  } catch (e) {
    console.warn('Could not clear local session', e);
  }
}

export interface StoredInsuranceState {
  profile?: UserProfile;
  currentPlan?: InsurancePlan;
  altPlan?: InsurancePlan;
  usage?: any;
  checklist?: Record<string, boolean>;
  hasCompletedQuestionnaire?: boolean;
  updatedAt?: string;
}

export const dbService = {
  saveInsuranceState: (state: StoredInsuranceState): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  },
  loadInsuranceState: (): StoredInsuranceState | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Failed to load from localStorage', e);
      return null;
    }
  },
  hasSavedQuestionnaire: (): boolean => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed: StoredInsuranceState = JSON.parse(raw);
      if (parsed.hasCompletedQuestionnaire) return true;
      // Valid profile with plans already entered
      if (
        parsed.profile?.canton &&
        parsed.currentPlan &&
        parsed.currentPlan.monthlyPremium > 0 &&
        parsed.altPlan &&
        parsed.altPlan.monthlyPremium > 0
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  isFullAccessGranted: (): boolean => {
    try {
      return localStorage.getItem('shio_hotmart_access') === 'true';
    } catch {
      return false;
    }
  },
  setFullAccessGranted: (granted: boolean): void => {
    try {
      if (granted) {
        localStorage.setItem('shio_hotmart_access', 'true');
      } else {
        localStorage.removeItem('shio_hotmart_access');
      }
    } catch {
      // Ignore
    }
  },
  clearAllData: (): void => {
    clearLocalSession();
    try {
      localStorage.removeItem('shio_hotmart_access');
    } catch {
      // Ignore
    }
  },
};
