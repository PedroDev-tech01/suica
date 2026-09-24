export interface BonusTool {
  id: string;
  number: number;
  title: string;
  tagline: string;
  description: string;
}

export const BONUS_TOOLS_LIST: BonusTool[] = [
  {
    id: 'franchise-worksheet',
    number: 1,
    title: 'Franchise Comparison Worksheet',
    tagline: 'Side-by-side financial trade-off matrix',
    description:
      'Evaluate your risk tolerance and liquidity cushion when choosing between the CHF 300 baseline and CHF 2,500 maximum deductible.',
  },
  {
    id: 'cost-planner',
    number: 2,
    title: 'Annual Healthcare Cost Planner',
    tagline: 'Interactive healthcare expense bucket planner',
    description:
      'Itemize routine doctor visits, prescription medications, specialist consults, and therapies to estimate realistic annual medical spending.',
  },
  {
    id: 'comparison-checklist',
    number: 3,
    title: 'Insurance Comparison Checklist',
    tagline: 'A systematic audit checklist before signing or switching',
    description:
      'Everything you need to check: network lists, customer service ratings, reimbursement processing speeds, and digital app quality.',
  },
  {
    id: 'newcomer-checklist',
    number: 4,
    title: 'New to Switzerland Starter Guide',
    tagline: 'The definitive timeline & action guide for new arrivals',
    description:
      'Understand the strict 3-month registration deadline, retrospective premium billing, residency permits, and family enrollments.',
  },
  {
    id: 'glossary-tool',
    number: 5,
    title: 'Swiss Insurance Multilingual Glossary',
    tagline: 'German, French, Italian & English translation matrix',
    description:
      'Never get lost in German or French insurance paperwork again. Plain-English definitions for every technical insurance term.',
  },
  {
    id: 'questions-before-switching',
    number: 6,
    title: '10 Questions Before Changing Your Setup',
    tagline: 'Vital due-diligence questions before sending your cancellation letter',
    description:
      'Avoid unpleasant surprises regarding doctor networks, cancellation deadlines, and pre-existing condition traps on supplementary plans.',
  },
];

export const NEWCOMER_CHECKLIST_ITEMS = [
  {
    id: 'nc-1',
    step: 'Step 1: Understand the 3-Month Window',
    title: 'Mandatory Insurance Within 3 Months of Arrival',
    detail:
      'Under Swiss law (KVG Art. 3), you have exactly three months from the date you officially take up residence or register at the local town hall (Kreisbüro / Contrôle des habitants) to take out compulsory health insurance.',
    importantNote:
      'Coverage is strictly retrospective back to your first official day of residence in Switzerland. Even if you enroll in month 3, you will receive retroactive premium invoices back to day 1.',
  },
  {
    id: 'nc-2',
    step: 'Step 2: Basic Insurance Freedom of Acceptance',
    title: 'Insurers Cannot Deny Basic Cover or Impose Medical Reserves',
    detail:
      'Every approved Swiss health insurer is legally mandated to accept you for compulsory basic health insurance (KVG) regardless of age, medical history, chronic conditions, or ongoing pregnancies. Pre-existing conditions are fully covered by law from day one.',
    importantNote:
      'Never accept exclusions (Vorbehalte / réserves) on basic compulsory health insurance — they are strictly illegal on KVG plans.',
  },
  {
    id: 'nc-3',
    step: 'Step 3: Separate Children and Adults',
    title: 'Each Family Member Has an Individual Policy',
    detail:
      'There are no "family group policies" in Swiss basic healthcare. Each spouse, partner, and child holds an individual insurance contract with their own franchise and monthly premium. Children can even be insured with a completely different company if that insurer is cheaper in your canton.',
    importantNote:
      'Children (under 18) have a standard CHF 0 franchise and lower maximum coinsurance (CHF 350 vs CHF 700 for adults).',
  },
  {
    id: 'nc-4',
    step: 'Step 4: Check Employer Accident Coverage (UVG / LAA)',
    title: 'Do Not Pay Twice for Accident Insurance',
    detail:
      'If you work for an employer in Switzerland for 8 or more hours per week, you are legally covered for both occupational and non-occupational accidents through your employer’s UVG/LAA policy. You can exclude accident coverage from your basic health insurance policy and save approximately 7% on your monthly premium.',
    importantNote:
      'Verify with your employer’s HR department and request proof of UVG coverage if required by your health insurer.',
  },
  {
    id: 'nc-5',
    step: 'Step 5: Separate Basic (KVG) from Supplementary (VVG)',
    title: 'Keep Basic and Supplementary Policies Distinct',
    detail:
      'You are NOT required to take supplementary insurance (dental, private hospital ward, alternative medicine) from the same company that provides your basic insurance. While basic insurance must accept everyone, supplementary insurers can reject applicants or reject coverage for pre-existing conditions.',
    importantNote:
      'Never cancel an existing supplementary insurance policy until your new supplementary insurer has formally accepted you in writing without exclusions.',
  },
  {
    id: 'nc-6',
    step: 'Step 6: Official Comparison with Priminfo',
    title: 'Use Only Switzerland’s Official Tool: Priminfo',
    detail:
      'Commercial broker websites often rank insurers by sales commission. Use the official federal comparison portal run by the Federal Office of Public Health (FOPH / BAG): www.priminfo.admin.ch. It is completely independent, non-commercial, and lists all approved premium rates.',
    importantNote:
      'In basic insurance, medical benefits are 100% identical by federal statute across all insurers. Only customer service, processing speed, digital tools, and monthly price differ.',
  },
];

export const TEN_QUESTIONS_BEFORE_SWITCHING = [
  {
    number: 1,
    question: 'What is my exact new monthly and annual premium?',
    whyItMatters:
      'Multiply the monthly quote by 12 to see the exact annual financial commitment. Ensure any payment discounts (e.g. 1-2% for annual prepayment) are factored in.',
  },
  {
    number: 2,
    question: 'What franchise have I selected and what is my maximum out-of-pocket exposure?',
    whyItMatters:
      'Remember that your true maximum annual healthcare exposure is always your chosen Franchise + CHF 700 Coinsurance Cap (for adults). Can you pay this comfortably if a serious accident or illness occurs?',
  },
  {
    number: 3,
    question: 'If choosing an alternative model, what is my mandatory first point of contact?',
    whyItMatters:
      'For Family Doctor (Hausarzt), you must contact your GP. For HMO, your registered health center. For Telmed, the 24/7 medical hotline. Violating this rule can result in bills being denied or forced reassignment to the expensive standard model.',
  },
  {
    number: 4,
    question: 'Is my preferred family doctor or clinic in the insurer’s approved network list?',
    whyItMatters:
      'Not all physicians participate in every insurer’s network list. Before signing up for a Family Doctor or HMO plan, confirm your current doctor is on the insurer’s approved roster for your municipality.',
  },
  {
    number: 5,
    question: 'Does the alternative model offer phone/app support in English?',
    whyItMatters:
      'If you choose a Telmed model, you will need to describe your medical symptoms over the phone before seeing a doctor. Verify that the telemedicine partner (e.g. Medgate, Santé24) has 24/7 English-speaking doctors available.',
  },
  {
    number: 6,
    question: 'Is accident coverage excluded if I work 8+ hours per week for an employer?',
    whyItMatters:
      'Keeping accident coverage active when you already have employer UVG/LAA coverage wastes around 7% of your monthly premium every single month on duplicate coverage.',
  },
  {
    number: 7,
    question: 'What is the exact cancellation deadline and procedure?',
    whyItMatters:
      'Written cancellation for basic insurance must physically arrive at your current insurer’s office by the last working day of November (November 30) for January 1 changes. Sending it on November 29 by standard post is a frequent cause of missed deadlines.',
  },
  {
    number: 8,
    question: 'Do I have supplementary insurance (VVG) tied to this policy?',
    whyItMatters:
      'Switching your basic health insurance does not automatically cancel your supplementary policies. Be aware that supplementary insurance policies often have different cancellation deadlines (e.g. 3 months before year-end, i.e. September 30).',
  },
  {
    number: 9,
    question: 'Have I double-checked this premium on the official Priminfo portal?',
    whyItMatters:
      'Third-party brokers often present quotes that bundle unsolicited supplementary packages. Confirm the pure basic KVG premium on priminfo.admin.ch.',
  },
  {
    number: 10,
    question: 'Have all outstanding premiums and bills with my current insurer been paid?',
    whyItMatters:
      'Under Swiss law (KVG Art. 64a), an insurer has the legal right to block your transfer to another health insurer if you have overdue, unpaid premiums or co-payments on November 30.',
  },
];
