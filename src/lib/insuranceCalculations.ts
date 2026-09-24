/**
 * Swiss Health Insurance (KVG / LAMal) Calculation Engine
 *
 * Official Legal References:
 * - Federal Health Insurance Act (KVG / LAMal) Art. 64 (Cost sharing / Participation aux coûts)
 * - Ordinance on Health Insurance (KVV / OAMal) Art. 103 (Franchises) & Art. 104-105 (Coinsurance / Selbstbehalt)
 * - Federal Office of Public Health (FOPH / BAG) Directives on KVG Out-of-Pocket limits
 *
 * Last verified: September 2026
 */

import { SWISS_KVG_RULES } from '../config/appConfig';
import {
  ComparisonResult,
  EducationalFlag,
  InsurancePlan,
  ScenarioCalculation,
  UserProfile,
} from '../types/insurance';

/**
 * Format currency in strict Swiss Franc style (e.g. "CHF 465.30", "CHF 5,583.60")
 */
export function formatCHF(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return 'CHF 0.00';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('de-CH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${isNegative ? '-' : ''}CHF ${formatted}`;
}

/**
 * Format round amounts without cents if clean (e.g. "CHF 300", "CHF 2,500")
 */
export function formatCHFRound(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return 'CHF 0';
  const isNegative = amount < 0;
  const abs = Math.abs(amount);
  const formatted = Math.round(abs).toLocaleString('de-CH');
  return `${isNegative ? '-' : ''}CHF ${formatted}`;
}

/**
 * Annual basic insurance premium calculation
 * Formula: monthlyPremium * 12
 */
export function calculateAnnualPremium(monthlyPremium: number): number {
  if (!monthlyPremium || monthlyPremium < 0) return 0;
  return Math.round(monthlyPremium * 12 * 100) / 100;
}

/**
 * Calculate annual out-of-pocket healthcare expenses according to official Swiss KVG rules:
 *
 * 1. Policyholder pays 100% of covered healthcare costs up to the chosen Franchise (Deductible).
 * 2. On expenses exceeding the Franchise, policyholder pays 10% Coinsurance (Selbstbehalt / Quote-part).
 * 3. The 10% Coinsurance is capped at:
 *    - Adults (19+): CHF 700 per calendar year (reached when spending exceeds franchise by CHF 7,000).
 *    - Children (0-18): CHF 350 per calendar year (reached when spending exceeds franchise by CHF 3,500).
 * 4. Maximum out-of-pocket per year = Franchise + Coinsurance Cap (e.g. CHF 300 + 700 = CHF 1,000; CHF 2,500 + 700 = CHF 3,200).
 * Note: Excludes optional daily hospital contribution (CHF 15/day for adults) and non-KVG uncovered treatments.
 */
export function calculateOutOfPocket(
  annualCoveredExpenses: number,
  franchise: number,
  isChild = false
): {
  franchisePaid: number;
  coinsurancePaid: number;
  totalOutOfPocket: number;
  maxOutOfPocket: number;
} {
  const safeExpenses = Math.max(0, annualCoveredExpenses || 0);
  const safeFranchise = Math.max(0, franchise || 0);
  const coinsuranceCap = isChild
    ? SWISS_KVG_RULES.childCoinsuranceCap
    : SWISS_KVG_RULES.adultCoinsuranceCap;

  // Maximum possible out-of-pocket under this franchise
  const maxOutOfPocket = safeFranchise + coinsuranceCap;

  // Amount applied to franchise
  const franchisePaid = Math.min(safeExpenses, safeFranchise);

  // Amount subject to 10% coinsurance
  const remainingExpenses = Math.max(0, safeExpenses - safeFranchise);
  const coinsuranceCalculated = remainingExpenses * SWISS_KVG_RULES.coinsuranceRate;
  const coinsurancePaid = Math.min(coinsuranceCalculated, coinsuranceCap);

  const totalOutOfPocket = franchisePaid + coinsurancePaid;

  return {
    franchisePaid: Math.round(franchisePaid * 100) / 100,
    coinsurancePaid: Math.round(coinsurancePaid * 100) / 100,
    totalOutOfPocket: Math.round(totalOutOfPocket * 100) / 100,
    maxOutOfPocket,
  };
}

/**
 * Calculate total annual cost (Annual Premium + Out-of-Pocket Expenses)
 */
export function calculateTotalAnnualCost(
  monthlyPremium: number,
  annualCoveredExpenses: number,
  franchise: number,
  isChild = false
): number {
  const annualPrem = calculateAnnualPremium(monthlyPremium);
  const { totalOutOfPocket } = calculateOutOfPocket(
    annualCoveredExpenses,
    franchise,
    isChild
  );
  return Math.round((annualPrem + totalOutOfPocket) * 100) / 100;
}

/**
 * Calculate the estimated Break-Even healthcare expense point between two plans.
 *
 * Context:
 * When Plan A has a lower franchise (e.g. CHF 300) and higher premium,
 * while Plan B has a higher franchise (e.g. CHF 2,500) and lower premium:
 * - At zero healthcare expenses, Plan B is cheaper by the premium difference (annualPremiumA - annualPremiumB).
 * - As healthcare expenses rise, Plan B pays more out-of-pocket because of the higher franchise.
 * - If expenses rise enough, Plan A may become more cost-effective overall.
 *
 * This function calculates the approximate healthcare spending level where total costs are equal.
 */
export function calculateBreakEvenExpense(
  premiumA: number,
  franchiseA: number,
  premiumB: number,
  franchiseB: number,
  isChild = false
): number | null {
  const annualPremA = calculateAnnualPremium(premiumA);
  const annualPremB = calculateAnnualPremium(premiumB);

  // If both scenarios have the same franchise, no franchise break-even exists
  if (franchiseA === franchiseB) return null;

  // Identify lower-franchise vs higher-franchise plan
  const [lowFPlan, highFPlan] =
    franchiseA < franchiseB
      ? [
          { prem: annualPremA, franchise: franchiseA },
          { prem: annualPremB, franchise: franchiseB },
        ]
      : [
          { prem: annualPremB, franchise: franchiseB },
          { prem: annualPremA, franchise: franchiseA },
        ];

  // If the higher franchise plan ALSO has a higher or equal annual premium, it's never mathematically cheaper
  const annualPremiumSavings = lowFPlan.prem - highFPlan.prem;
  if (annualPremiumSavings <= 0) {
    return null;
  }

  // Iterate or solve piecewise:
  // Since cost functions are monotonic piecewise linear from 0 to 15,000 CHF,
  // we do a fine binary search to find the intersection point.
  let low = 0;
  let high = 25000;
  let breakEven: number | null = null;

  const costDiffAtZero =
    lowFPlan.prem +
    calculateOutOfPocket(0, lowFPlan.franchise, isChild).totalOutOfPocket -
    (highFPlan.prem +
      calculateOutOfPocket(0, highFPlan.franchise, isChild).totalOutOfPocket);

  const costDiffAtHigh =
    lowFPlan.prem +
    calculateOutOfPocket(high, lowFPlan.franchise, isChild).totalOutOfPocket -
    (highFPlan.prem +
      calculateOutOfPocket(high, highFPlan.franchise, isChild).totalOutOfPocket);

  // If signs don't differ between 0 and 25000, there is no break-even within normal healthcare expense ranges
  if (costDiffAtZero * costDiffAtHigh > 0) {
    return null;
  }

  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const costLowF =
      lowFPlan.prem +
      calculateOutOfPocket(mid, lowFPlan.franchise, isChild).totalOutOfPocket;
    const costHighF =
      highFPlan.prem +
      calculateOutOfPocket(mid, highFPlan.franchise, isChild).totalOutOfPocket;

    const diff = costLowF - costHighF;
    if (Math.abs(diff) < 1) {
      breakEven = Math.round(mid);
      break;
    }
    if (diff > 0) {
      // High franchise is still cheaper, expense must be higher for low-franchise to catch up
      low = mid;
    } else {
      high = mid;
    }
  }

  return breakEven;
}

/**
 * Generate standard scenario expense benchmarks for comparison tables and charts:
 * 0 (no medical visits), 500 (minor doctor visit), 1,200 (routine checkup + meds),
 * 2,000, 3,000, 5,000, 10,000 (hospital/specialist procedure).
 */
export function generateScenarioCalculations(
  currentPlan: InsurancePlan,
  altPlan: InsurancePlan,
  isChild = false
): ScenarioCalculation[] {
  const expensePoints = [0, 500, 1200, 2000, 3200, 5000, 8000, 12000];

  return expensePoints.map((annualHealthcareExpenses) => {
    const currentOutOfPocket = calculateOutOfPocket(
      annualHealthcareExpenses,
      currentPlan.franchise,
      isChild
    ).totalOutOfPocket;
    const currentTotalCost =
      calculateAnnualPremium(currentPlan.monthlyPremium) + currentOutOfPocket;

    const alternativeOutOfPocket = calculateOutOfPocket(
      annualHealthcareExpenses,
      altPlan.franchise,
      isChild
    ).totalOutOfPocket;
    const alternativeTotalCost =
      calculateAnnualPremium(altPlan.monthlyPremium) + alternativeOutOfPocket;

    return {
      annualHealthcareExpenses,
      currentOutOfPocket,
      currentTotalCost: Math.round(currentTotalCost * 100) / 100,
      alternativeOutOfPocket,
      alternativeTotalCost: Math.round(alternativeTotalCost * 100) / 100,
      totalDifference: Math.round((currentTotalCost - alternativeTotalCost) * 100) / 100,
    };
  });
}

/**
 * Generate Educational Flags based on the user's answers and plan configurations.
 * STRICTLY avoids personalized advice, guaranteed savings claims, or broker instructions.
 */
export function generateEducationalFlags(
  currentPlan: InsurancePlan,
  altPlan: InsurancePlan,
  profile?: UserProfile
): EducationalFlag[] {
  const flags: EducationalFlag[] = [];
  const safeProfile: UserProfile = {
    canton: profile?.canton || 'ZH',
    municipality: profile?.municipality || 'Zurich',
    ageGroup: profile?.ageGroup || '26+',
    employmentStatus: profile?.employmentStatus || 'employee',
    employment8Hours: profile?.employment8Hours || 'yes',
    accidentCoveredByEmployer: profile?.accidentCoveredByEmployer || 'yes',
  };

  // Flag 1: Franchise Trade-off
  if (altPlan.franchise !== currentPlan.franchise) {
    if (altPlan.franchise > currentPlan.franchise) {
      flags.push({
        id: 'franchise-higher',
        level: 'red',
        title: 'Compare Franchise Trade-off',
        summary: `Alternative uses a higher franchise (CHF ${altPlan.franchise} vs CHF ${currentPlan.franchise}).`,
        detail:
          'While a higher franchise typically offers a lower monthly premium, your potential out-of-pocket healthcare exposure is also higher. You would need to pay more of your initial healthcare costs yourself before insurance contributions begin under applicable cost-sharing rules.',
        actionAdvice:
          'Consider whether you have liquid funds to comfortably cover the higher franchise plus coinsurance if medical needs arise.',
      });
    } else {
      flags.push({
        id: 'franchise-lower',
        level: 'yellow',
        title: 'Lower Franchise Scenario',
        summary: `Alternative uses a lower franchise (CHF ${altPlan.franchise} vs CHF ${currentPlan.franchise}).`,
        detail:
          'A lower franchise reduces your initial out-of-pocket exposure when using healthcare services, but typically requires a higher monthly premium regardless of whether you visit a doctor.',
        actionAdvice:
          'Compare the higher annual premium against your expected annual healthcare usage to see if this trade-off aligns with your situation.',
      });
    }
  }

  // Flag 2: Accident Coverage (UVG / LAA)
  if (
    safeProfile.employmentStatus === 'employee' &&
    safeProfile.employment8Hours === 'yes' &&
    altPlan.accidentCoverage === 'included'
  ) {
    flags.push({
      id: 'accident-employer',
      level: 'yellow',
      title: 'Check Accident Coverage with Employer',
      summary:
        'Your employment situation suggests employer accident insurance (UVG/LAA) may already apply.',
      detail:
        'Under Swiss law, employees working at least 8 hours per week with the same employer are typically covered by mandatory occupational and non-occupational accident insurance through their employer. If so, including accident coverage in your basic health insurance may be duplicate coverage (which often adds ~7% to basic premiums).',
      actionAdvice:
        'Ask your employer or HR department whether UVG/LAA accident coverage applies to you, and verify with your insurer before requesting exclusion.',
    });
  } else if (
    (safeProfile.employmentStatus === 'self-employed' ||
      safeProfile.employmentStatus === 'student' ||
      safeProfile.employmentStatus === 'unemployed' ||
      safeProfile.employment8Hours === 'no') &&
    altPlan.accidentCoverage === 'excluded'
  ) {
    flags.push({
      id: 'accident-missing',
      level: 'red',
      title: 'Verify Accident Coverage Requirement',
      summary:
        'Accident coverage is marked as excluded, but your profile suggests you may need it.',
      detail:
        'Persons not covered under an employer’s UVG/LAA insurance (such as self-employed individuals without private UVG, students, or those working fewer than 8 hours per week) must ensure accident coverage is included in their compulsory basic health insurance.',
      actionAdvice:
        'Confirm whether you have active UVG coverage through another source before excluding accident risk from your basic health insurance policy.',
    });
  }

  // Flag 3: Insurance Model Care Restrictions
  if (altPlan.model !== currentPlan.model) {
    flags.push({
      id: 'model-change',
      level: 'yellow',
      title: 'Review Insurance Model Conditions',
      summary: `Alternative scenario changes your care model from ${getModelName(
        currentPlan.model
      )} to ${getModelName(altPlan.model)}.`,
      detail:
        'Alternative insurance models (such as Family Doctor, HMO, or Telmed) generally offer premium discounts in exchange for agreeing to specific gatekeeper rules (e.g. calling a telemedicine hotline or seeing a designated network doctor before visiting a specialist). Non-compliance can lead to uncovered medical bills.',
      actionAdvice:
        'Read the specific insurer’s model terms to confirm who your required first point of contact would be and how emergency or specialist referrals work.',
    });
  }

  // Flag 4: Official Priminfo Verification
  flags.push({
    id: 'priminfo-verification',
    level: 'green',
    title: 'Verify Premiums on Official Priminfo',
    summary:
      'Always verify quotes and authorized insurers using Switzerland’s official tool.',
    detail:
      'Priminfo is the official, independent premium comparison service provided by the Swiss Federal Office of Public Health (FOPH/BAG). It carries no commercial broker commissions and contains all legally approved premiums for your canton and municipality.',
    actionAdvice:
      'Compare your exact canton, age group, and municipality on priminfo.admin.ch before making any final contractual decision.',
  });

  return flags;
}

export function getModelName(model: string): string {
  switch (model) {
    case 'standard':
      return 'Standard (Free Doctor Choice)';
    case 'family_doctor':
      return 'Family Doctor (Hausarzt)';
    case 'hmo':
      return 'HMO Health Center';
    case 'telmed':
      return 'Telmed (Telemedicine First)';
    case 'other':
      return 'Alternative Model';
    default:
      return 'Unspecified Model';
  }
}

/**
 * Generate complete comparison result between current setup and alternative setup
 */
export function generateComparison(
  currentPlan: InsurancePlan,
  altPlan: InsurancePlan,
  profile?: UserProfile
): ComparisonResult {
  const safeProfile: UserProfile = {
    canton: profile?.canton || 'ZH',
    municipality: profile?.municipality || 'Zurich',
    ageGroup: profile?.ageGroup || '26+',
    employmentStatus: profile?.employmentStatus || 'employee',
    employment8Hours: profile?.employment8Hours || 'yes',
    accidentCoveredByEmployer: profile?.accidentCoveredByEmployer || 'yes',
  };
  const isChild = safeProfile.ageGroup === '0-18';
  const currentAnnualPremium = calculateAnnualPremium(currentPlan.monthlyPremium);
  const alternativeAnnualPremium = calculateAnnualPremium(altPlan.monthlyPremium);
  const premiumDifference = Math.round((currentAnnualPremium - alternativeAnnualPremium) * 100) / 100;
  const franchiseDifference = altPlan.franchise - currentPlan.franchise;

  const currentMaxOutOfPocket =
    currentPlan.franchise +
    (isChild
      ? SWISS_KVG_RULES.childCoinsuranceCap
      : SWISS_KVG_RULES.adultCoinsuranceCap);
  const alternativeMaxOutOfPocket =
    altPlan.franchise +
    (isChild
      ? SWISS_KVG_RULES.childCoinsuranceCap
      : SWISS_KVG_RULES.adultCoinsuranceCap);

  const breakEvenExpense = calculateBreakEvenExpense(
    currentPlan.monthlyPremium,
    currentPlan.franchise,
    altPlan.monthlyPremium,
    altPlan.franchise,
    isChild
  );

  const flags = generateEducationalFlags(currentPlan, altPlan, safeProfile);
  const scenarios = generateScenarioCalculations(currentPlan, altPlan, isChild);

  return {
    currentAnnualPremium,
    alternativeAnnualPremium,
    premiumDifference,
    franchiseDifference,
    currentMaxOutOfPocket,
    alternativeMaxOutOfPocket,
    breakEvenExpense,
    flags,
    scenarios,
  };
}

export const calculateComparison = generateComparison;
