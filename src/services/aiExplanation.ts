/**
 * Future AI Explanation Architecture
 *
 * Designed to provide optional plain-English narrative summaries of calculated scenarios.
 *
 * CRITICAL SAFETY & LEGAL CONSTRAINTS:
 * 1. AI is NOT required for the core MVP. The MVP functions 100% deterministically.
 * 2. AI must NEVER diagnose, provide medical advice, recommend insurers, or choose a franchise.
 * 3. AI must NEVER claim guaranteed savings.
 * 4. Input payload contains ONLY non-sensitive scenario figures and calculated mathematical flags.
 */

import { ComparisonResult, InsurancePlan, UserProfile } from '../types/insurance';

export interface AISummaryRequest {
  profile: Pick<UserProfile, 'canton' | 'ageGroup' | 'employmentStatus'>;
  currentPlan: Pick<InsurancePlan, 'monthlyPremium' | 'franchise' | 'model' | 'accidentCoverage'>;
  altPlan: Pick<InsurancePlan, 'monthlyPremium' | 'franchise' | 'model' | 'accidentCoverage'>;
  calculation: Pick<
    ComparisonResult,
    'currentAnnualPremium' | 'alternativeAnnualPremium' | 'premiumDifference' | 'breakEvenExpense'
  >;
}

export interface AISummaryResponse {
  overviewText: string;
  keyTakeaway: string;
  suggestedChecklistPoints: string[];
}

/**
 * Deterministic fallback narrative generator used in the MVP
 * Generates clear, professional English summaries without relying on external API latency or keys.
 */
export function generateDeterministicSummary(
  request: AISummaryRequest
): AISummaryResponse {
  const { currentPlan, altPlan, calculation, profile } = request;
  const isPremiumLower = calculation.premiumDifference > 0;
  const isFranchiseDifferent = currentPlan.franchise !== altPlan.franchise;

  let overview = `You are comparing your current setup in canton ${profile.canton} against an alternative plan. `;

  if (isPremiumLower) {
    overview += `The alternative scenario reflects an annual basic premium that is CHF ${Math.abs(
      calculation.premiumDifference
    ).toLocaleString('de-CH')} lower. `;
  } else if (calculation.premiumDifference < 0) {
    overview += `The alternative scenario reflects an annual basic premium that is CHF ${Math.abs(
      calculation.premiumDifference
    ).toLocaleString('de-CH')} higher. `;
  } else {
    overview += `Both plans have identical annual basic premiums. `;
  }

  if (isFranchiseDifferent) {
    if (altPlan.franchise > currentPlan.franchise) {
      overview += `Because the alternative uses a higher franchise (CHF ${altPlan.franchise} vs CHF ${currentPlan.franchise}), your personal out-of-pocket healthcare expense limit before insurance contributions is increased. `;
    } else {
      overview += `Because the alternative uses a lower franchise (CHF ${altPlan.franchise} vs CHF ${currentPlan.franchise}), you would pay less out-of-pocket before insurance covers 90% of medical bills. `;
    }
  }

  let takeaway = '';
  if (calculation.breakEvenExpense !== null) {
    takeaway = `Based on your numbers, approximately CHF ${calculation.breakEvenExpense.toLocaleString(
      'de-CH'
    )} in annual covered healthcare expenses represents the estimated threshold where the total cost dynamic between these two setups shifts.`;
  } else {
    takeaway =
      'Look at your realistic anticipated healthcare usage over the next 12 months rather than looking solely at monthly premium bills.';
  }

  const checklist: string[] = [
    'Confirm exact official premiums for your municipality on priminfo.admin.ch',
    'Review physician access restrictions for your chosen care model',
    'Verify non-occupational accident coverage status with your employer',
  ];

  return {
    overviewText: overview,
    keyTakeaway: takeaway,
    suggestedChecklistPoints: checklist,
  };
}
