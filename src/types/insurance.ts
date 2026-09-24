export type CantonCode =
  | 'AG' | 'AR' | 'AI' | 'BL' | 'BS' | 'BE' | 'FR' | 'GE' | 'GL' | 'GR'
  | 'JU' | 'LU' | 'NE' | 'NW' | 'OW' | 'SG' | 'SH' | 'SZ' | 'SO' | 'TG'
  | 'TI' | 'UR' | 'VS' | 'VD' | 'ZG' | 'ZH';

export interface Canton {
  code: CantonCode;
  name: string;
  languages: string[];
}

export type AgeGroup = '0-18' | '19-25' | '26+';

export type EmploymentStatus =
  | 'employee'
  | 'self-employed'
  | 'student'
  | 'unemployed'
  | 'other';

export type Employment8Hours = 'yes' | 'no' | 'unsure';

export type InsuranceModel =
  | 'standard'
  | 'family_doctor'
  | 'hmo'
  | 'telmed'
  | 'other'
  | 'unsure';

export type AccidentCoverage = 'included' | 'excluded' | 'unsure';

export type HealthcareUsage = 'low' | 'medium' | 'high' | {
  expectedAnnualDoctorVisits?: number;
  takesRegularPrescriptionMeds?: 'yes' | 'no';
  plannedHospitalOrMaternity?: 'yes' | 'no';
  hasChronicCondition?: 'yes' | 'no';
  availableLiquidEmergencySavings?: number;
};

export interface UserProfile {
  canton: string;
  zipCode?: string;
  municipality?: string;
  ageGroup: AgeGroup;
  employmentStatus: EmploymentStatus;
  employment8Hours: Employment8Hours;
  accidentCoveredByEmployer?: 'yes' | 'no' | 'unsure';
}

export interface InsurancePlan {
  insurerName?: string;
  monthlyPremium: number;
  franchise: number;
  model: InsuranceModel;
  accidentCoverage: AccidentCoverage | 'with' | 'without';
}

export interface ScenarioCalculation {
  annualHealthcareExpenses: number;
  currentOutOfPocket: number;
  currentTotalCost: number;
  alternativeOutOfPocket: number;
  alternativeTotalCost: number;
  totalDifference: number; // currentTotalCost - alternativeTotalCost (positive = alternative costs less)
}

export interface EducationalFlag {
  id: string;
  level: 'red' | 'yellow' | 'green';
  title: string;
  summary: string;
  detail: string;
  actionAdvice?: string;
}

export interface ComparisonResult {
  currentAnnualPremium: number;
  alternativeAnnualPremium: number;
  premiumDifference: number; // current - alternative (positive = alternative premium is lower)
  franchiseDifference: number; // alternative - current
  currentMaxOutOfPocket: number; // Franchise + Coinsurance cap
  alternativeMaxOutOfPocket: number;
  breakEvenExpense: number | null; // Healthcare expense level where total costs intersect
  flags: EducationalFlag[];
  scenarios: ScenarioCalculation[];
}

export type AppView =
  | 'landing'
  | 'login'
  | 'app'
  | 'optimizer'
  | 'preview'
  | 'results'
  | 'report'
  | 'print-report'
  | 'bonuses'
  | 'sources'
  | 'methodology'
  | 'optimizer-access'
  | 'full-access-welcome';

export interface GlossaryTerm {
  id: string;
  termEn: string;
  termDe: string;
  termFr: string;
  termIt: string;
  shortDefinition: string;
  fullExplanation: string;
  practicalTip: string;
}
