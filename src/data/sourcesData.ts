export interface VerifiedSource {
  rule: string;
  sourceAuthority: string;
  legalReference: string;
  officialUrl: string;
  lastVerified: string;
  summary: string;
}

export const VERIFIED_SOURCES: VerifiedSource[] = [
  {
    rule: 'Compulsory Basic Insurance & Benefit Equality',
    sourceAuthority: 'Federal Office of Public Health (FOPH / BAG)',
    legalReference: 'Federal Health Insurance Act (KVG / LAMal) Art. 1a, Art. 3, Art. 34',
    officialUrl: 'https://www.bag.admin.ch/bag/en/home/versicherungen/krankenversicherung.html',
    lastVerified: 'September 2026',
    summary:
      'Compulsory health insurance is mandatory for all Swiss residents. Benefits are statutory and identical across all licensed health insurance companies.',
  },
  {
    rule: 'Cost Sharing, Franchises & Coinsurance Caps',
    sourceAuthority: 'Federal Office of Public Health (FOPH / BAG)',
    legalReference: 'KVG Art. 64 & Ordinance on Health Insurance (KVV / OAMal) Art. 103-105',
    officialUrl: 'https://www.bag.admin.ch/bag/en/home/versicherungen/krankenversicherung/krankenversicherung-leistungen-tarife/kostenbeteiligung.html',
    lastVerified: 'September 2026',
    summary:
      'Adult franchise tiers: CHF 300 (standard), 500, 1000, 1500, 2000, 2500. Child franchise tiers: CHF 0 (standard) to 600. Coinsurance is 10% above franchise, capped at CHF 700/year for adults and CHF 350/year for children.',
  },
  {
    rule: 'Hospital Daily Stay Contribution',
    sourceAuthority: 'Federal Office of Public Health (FOPH / BAG)',
    legalReference: 'KVG Art. 64 Para. 5 & KVV Art. 104b',
    officialUrl: 'https://www.bag.admin.ch/bag/en/home/versicherungen/krankenversicherung/krankenversicherung-leistungen-tarife/kostenbeteiligung.html',
    lastVerified: 'September 2026',
    summary:
      'Statutory contribution of CHF 15 per day of hospitalization for single adults without dependents, compensating for food and accommodation costs. Exemptions apply for children, students up to age 25, and maternity care.',
  },
  {
    rule: 'Accident Coverage (UVG / LAA vs KVG)',
    sourceAuthority: 'Swiss Federal Social Insurance Office (FSIO / BSV)',
    legalReference: 'Federal Law on Accident Insurance (UVG / LAA) Art. 1a, 7, 8',
    officialUrl: 'https://www.bsv.admin.ch/bsv/en/home/social-insurance/uv.html',
    lastVerified: 'September 2026',
    summary:
      'Employees working 8 or more hours per week for the same employer are mandatorily covered for occupational and non-occupational accidents by employer UVG. Accident coverage can be excluded from basic KVG insurance to reduce premiums.',
  },
  {
    rule: 'Official Independent Premium Comparison (Priminfo)',
    sourceAuthority: 'Federal Office of Public Health (FOPH / BAG)',
    legalReference: 'Official Federal Premium Calculation Portal',
    officialUrl: 'https://www.priminfo.admin.ch/',
    lastVerified: 'September 2026',
    summary:
      'The only non-commercial, official premium comparison platform in Switzerland. Contains all approved basic insurance tariffs across all cantons and age groups without sales commissions.',
  },
  {
    rule: 'Cancellation & Plan Switching Deadlines',
    sourceAuthority: 'Swiss Government Portal (ch.ch) & FOPH',
    legalReference: 'KVG Art. 7',
    officialUrl: 'https://www.ch.ch/en/health-insurance/changing-health-insurance/',
    lastVerified: 'September 2026',
    summary:
      'Written cancellation notice must reach the insurer by the last working day of November (November 30) for plan changes taking effect January 1. Standard model with CHF 300 franchise can also be changed by March 31 for July 1.',
  },
];
