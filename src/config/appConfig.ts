/**
 * Product & Swiss Legislation Configuration
 * Centralized year-dependent data for seamless updates (e.g. 2026 -> 2027 edition)
 */

export const PRODUCT_CONFIG = {
  name: 'Swiss Health Insurance Optimizer',
  tagline: 'Understand your Swiss health insurance before choosing your plan.',
  editionYear: '2026 / 2027',
  lastVerifiedDate: 'September 2026',
  priceCHF: 19.90,
  currency: 'CHF',
  // Seasonal mode: set to true in Autumn (Sept-Nov) when next year's premiums are officially announced
  seasonalMode: false,
  officialPriminfoUrl: 'https://www.priminfo.admin.ch/',
  officialFophUrl: 'https://www.bag.admin.ch/',
  officialChUrl: 'https://www.ch.ch/en/health-insurance/',
} as const;

/**
 * Verified Official Swiss Health Insurance (KVG / LAMal) Rules
 * Legal basis: Federal Health Insurance Act (KVG / LAMal, Art. 64)
 * Ordinance on Health Insurance (KVV / OAMal, Art. 103-105)
 */
export const SWISS_KVG_RULES = {
  lastVerified: 'September 2026',
  authority: 'Federal Office of Public Health (FOPH / BAG)',
  adultFranchises: [300, 500, 1000, 1500, 2000, 2500] as const,
  childFranchises: [0, 100, 200, 300, 400, 500, 600] as const,
  standardAdultFranchise: 300,
  standardChildFranchise: 0,
  coinsuranceRate: 0.10, // 10% Selbstbehalt / Quote-part
  adultCoinsuranceCap: 700, // CHF 700 maximum per calendar year
  childCoinsuranceCap: 350, // CHF 350 maximum per calendar year
  dailyHospitalFee: 15, // CHF 15/day for adults without dependent children
  switchingNoticeDeadlineStandard: '31 March (for 1 July effective date, only for standard model with CHF 300 franchise)',
  switchingNoticeDeadlineAnnual: '30 November (letter must reach insurer by the last working day of November for 1 January change)',
  uvgMinimumHoursPerWeek: 8, // Working 8+ hours/week with same employer entitles to mandatory UVG (occupational and non-occupational accident coverage)
} as const;
