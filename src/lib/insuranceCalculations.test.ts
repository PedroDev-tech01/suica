/**
 * Unit Tests for Swiss Health Insurance Financial Calculation Engine
 *
 * Validates Swiss KVG/LAMal rules according to Art. 64 KVG & OAMal Art. 103-105:
 * - Adults: standard franchise CHF 300, optional up to 2500, 10% coinsurance capped at CHF 700.
 * - Children: standard franchise CHF 0, optional up to 600, 10% coinsurance capped at CHF 350.
 * - Monthly to annual premium conversions.
 * - Scenario cost functions and break-even intersections.
 */

import {
  calculateAnnualPremium,
  calculateBreakEvenExpense,
  calculateOutOfPocket,
  calculateTotalAnnualCost,
  formatCHF,
} from './insuranceCalculations';

export interface TestResult {
  name: string;
  passed: boolean;
  expected?: unknown;
  actual?: unknown;
  error?: string;
}

export function runInsuranceCalculationTests(): {
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
} {
  const results: TestResult[] = [];

  function assert(name: string, condition: boolean, expected?: unknown, actual?: unknown) {
    results.push({
      name,
      passed: condition,
      expected,
      actual,
    });
  }

  // 1. Monthly to Annual Premium
  const annualPrem = calculateAnnualPremium(450.5);
  assert(
    'Monthly to Annual Premium (450.50 * 12 = 5406.00)',
    annualPrem === 5406.0,
    5406.0,
    annualPrem
  );

  assert(
    'Monthly Premium zero or negative returns zero',
    calculateAnnualPremium(-100) === 0 && calculateAnnualPremium(0) === 0,
    0,
    calculateAnnualPremium(-100)
  );

  // 2. Zero Healthcare Spending
  const oopZero = calculateOutOfPocket(0, 300, false);
  assert(
    'Zero healthcare spending yields 0 out of pocket',
    oopZero.franchisePaid === 0 &&
      oopZero.coinsurancePaid === 0 &&
      oopZero.totalOutOfPocket === 0,
    0,
    oopZero.totalOutOfPocket
  );

  // 3. Healthcare spending below franchise (e.g. spending 200 on 300 franchise)
  const oopBelowF = calculateOutOfPocket(200, 300, false);
  assert(
    'Healthcare spending below franchise (spending 200 on 300 franchise = 200 out of pocket)',
    oopBelowF.franchisePaid === 200 &&
      oopBelowF.coinsurancePaid === 0 &&
      oopBelowF.totalOutOfPocket === 200,
    200,
    oopBelowF.totalOutOfPocket
  );

  // 4. Healthcare spending above franchise but below coinsurance cap (Adult, franchise 300, spending 1300)
  // Franchise covers 300; remaining 1000 has 10% coinsurance = 100; total = 400.
  const oopMid = calculateOutOfPocket(1300, 300, false);
  assert(
    'Spending 1300 on 300 adult franchise pays 300 franchise + 100 coinsurance = 400 out of pocket',
    oopMid.franchisePaid === 300 &&
      oopMid.coinsurancePaid === 100 &&
      oopMid.totalOutOfPocket === 400,
    400,
    oopMid.totalOutOfPocket
  );

  // 5. Coinsurance Cap Scenarios (Adult coinsurance cap is CHF 700)
  // Spending 15,000 on franchise 300:
  // Franchise: 300
  // Remaining: 14,700 * 10% = 1470 -> capped at 700
  // Total out-of-pocket: 300 + 700 = 1000
  const oopCapAdult300 = calculateOutOfPocket(15000, 300, false);
  assert(
    'Adult coinsurance cap reached on 300 franchise (Max out of pocket is 1000)',
    oopCapAdult300.coinsurancePaid === 700 &&
      oopCapAdult300.totalOutOfPocket === 1000 &&
      oopCapAdult300.maxOutOfPocket === 1000,
    1000,
    oopCapAdult300.totalOutOfPocket
  );

  // Spending 15,000 on franchise 2500:
  // Franchise: 2500
  // Remaining: 12,500 * 10% = 1250 -> capped at 700
  // Total out-of-pocket: 2500 + 700 = 3200
  const oopCapAdult2500 = calculateOutOfPocket(15000, 2500, false);
  assert(
    'Adult coinsurance cap reached on 2500 franchise (Max out of pocket is 3200)',
    oopCapAdult2500.coinsurancePaid === 700 &&
      oopCapAdult2500.totalOutOfPocket === 3200 &&
      oopCapAdult2500.maxOutOfPocket === 3200,
    3200,
    oopCapAdult2500.totalOutOfPocket
  );

  // 6. Children Rules (Coinsurance cap is CHF 350, standard franchise CHF 0)
  // Child spending 5000 on franchise 0:
  // Franchise: 0
  // Remaining: 5000 * 10% = 500 -> capped at 350
  // Total: 350
  const oopChild = calculateOutOfPocket(5000, 0, true);
  assert(
    'Child coinsurance cap is CHF 350 on standard franchise 0',
    oopChild.franchisePaid === 0 &&
      oopChild.coinsurancePaid === 350 &&
      oopChild.totalOutOfPocket === 350,
    350,
    oopChild.totalOutOfPocket
  );

  // 7. Total Annual Cost calculation
  // Monthly premium 350, expenses 1000, franchise 300
  // Annual premium = 4200. Out of pocket = 300 + (700 * 0.1) = 370. Total = 4570
  const totalCost = calculateTotalAnnualCost(350, 1000, 300, false);
  assert(
    'Total annual cost combines annual premium + calculated out of pocket (4200 + 370 = 4570)',
    totalCost === 4570,
    4570,
    totalCost
  );

  // 8. Break-Even Calculation
  // Plan A: Monthly 400 (Annual 4800), Franchise 300.
  // Plan B: Monthly 300 (Annual 3600), Franchise 2500.
  // Premium savings on Plan B = 1200 / yr.
  // When expenses are 0: Plan B costs 3600, Plan A costs 4800 (Plan B is 1200 cheaper).
  // When expenses are 10,000:
  // Plan A out-of-pocket: 300 + 700 = 1000 -> Total = 5800.
  // Plan B out-of-pocket: 2500 + 700 = 3200 -> Total = 6800.
  // Since Plan A costs 5800 and Plan B costs 6800, Plan A is cheaper by 1000.
  // Therefore there is an exact break-even expense point in between!
  const breakEven = calculateBreakEvenExpense(400, 300, 300, 2500, false);
  assert(
    'Break-even expense point exists between 300 and 2500 franchise plans',
    breakEven !== null && breakEven > 1000 && breakEven < 3000,
    'Between 1000 and 3000 CHF',
    breakEven
  );

  // 9. Format CHF
  const formatted = formatCHF(465.3);
  assert(
    'Currency formatting produces strict Swiss Franc format',
    formatted.includes('CHF') && formatted.includes('465.30'),
    'CHF 465.30',
    formatted
  );

  const passedCount = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
    results,
  };
}
