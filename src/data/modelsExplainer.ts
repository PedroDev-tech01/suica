export interface ModelInfo {
  id: string;
  name: string;
  germanName: string;
  tagline: string;
  howItWorks: string;
  firstPointOfContact: string;
  typicalPremiumDiscount: string;
  keyRestrictions: string[];
  exceptions: string[];
  bestSuitedFor: string;
  questionsToVerify: string[];
}

export const SWISS_INSURANCE_MODELS: ModelInfo[] = [
  {
    id: 'standard',
    name: 'Standard Model (Free Choice of Doctor)',
    germanName: 'Freie Arztwahl (Standard-Modell)',
    tagline: 'Maximum autonomy — visit any recognized physician or specialist directly without referral.',
    howItWorks:
      'Under the classic statutory model, you have unrestricted freedom to choose any licensed physician, specialist, or public hospital in your canton of residence. You do not need authorization or referrals before booking appointments.',
    firstPointOfContact: 'Any licensed physician or specialist of your choice.',
    typicalPremiumDiscount: 'Baseline (0% discount — highest premium tier).',
    keyRestrictions: [
      'No gatekeeper restrictions.',
      'Highest monthly premium among all available models.',
    ],
    exceptions: ['Does not restrict emergency treatment or specialized second opinions.'],
    bestSuitedFor:
      'Individuals who frequently see multiple specialists directly or prefer total flexibility without coordinating through a primary physician or hotline.',
    questionsToVerify: [
      'Are you willing to pay a higher premium specifically for immediate direct specialist access?',
      'Do you already have a network of specialists you wish to consult without referrals?',
    ],
  },
  {
    id: 'family_doctor',
    name: 'Family Doctor Model (GP Model)',
    germanName: 'Hausarztmodell',
    tagline: 'Designated general practitioner coordinates all care and specialist referrals.',
    howItWorks:
      'You choose a registered general practitioner (GP) from your insurer’s approved network list. Whenever you need medical care, you must consult this primary care doctor first. If specialized diagnostics or surgery are necessary, your family doctor issues an official written referral.',
    firstPointOfContact: 'Your registered family doctor / Hausarzt.',
    typicalPremiumDiscount: 'Approx. 5% to 15% lower than the standard model.',
    keyRestrictions: [
      'Must see your designated GP first before any specialist visits.',
      'Referral validity is time-limited (often 3 to 6 months).',
      'If your family doctor is on vacation, you must visit their officially nominated locum.',
    ],
    exceptions: [
      'Medical emergencies.',
      'Annual routine gynecological checkups (usually exempt).',
      'Routine eye doctor / ophthalmologist checkups (often exempt).',
      'Pediatric consultations for young children.',
    ],
    bestSuitedFor:
      'People who value having a long-term personal doctor who knows their medical history and handles all clinical coordination.',
    questionsToVerify: [
      'Is your current preferred doctor included in the insurer’s approved Hausarzt list for your ZIP code?',
      'Are they accepting new patients under basic health insurance contracts?',
    ],
  },
  {
    id: 'hmo',
    name: 'HMO Model (Health Maintenance Organization)',
    germanName: 'HMO-Modell (Gesundheitszentrum)',
    tagline: 'Team-based care coordinated through a local group practice or medical center.',
    howItWorks:
      'You are registered with a specific HMO group practice (Gesundheitszentrum) where general practitioners, specialists, and nursing teams practice collaboratively under one roof. All treatments, prescriptions, and external hospital referrals are managed by the HMO medical team.',
    firstPointOfContact: 'Your chosen HMO health center practice.',
    typicalPremiumDiscount: 'Approx. 10% to 25% lower than the standard model.',
    keyRestrictions: [
      'Must physically visit or contact the designated HMO group center.',
      'Specialists outside the HMO center require explicit internal HMO referral.',
      'HMO network centers are primarily located in urban and suburban areas.',
    ],
    exceptions: [
      'Life-threatening emergencies.',
      'Annual routine gynecological exams.',
      'Pediatric emergency care.',
    ],
    bestSuitedFor:
      'Expats living in cities or near major medical centers who appreciate integrated multidisciplinary care and substantial premium savings.',
    questionsToVerify: [
      'Is there an HMO group practice within a reasonable commute of your residence or workplace?',
      'Does the HMO practice offer consultations in your preferred language (e.g. English)?',
    ],
  },
  {
    id: 'telmed',
    name: 'Telmed Model (Telemedicine First)',
    germanName: 'Telmed-Modell',
    tagline: 'Mandatory free telephone or video consultation before any in-person appointment.',
    howItWorks:
      'Before booking an appointment with any physician or clinic, you must contact a certified 24/7 medical hotline (such as Medgate or Santé24). A physician or triage specialist evaluates your symptoms, provides immediate medical advice, and issues an authorized referral timeframe (e.g., 30 days) to see a local doctor.',
    firstPointOfContact: 'Insurer’s designated 24/7 telemedicine hotline or smartphone app.',
    typicalPremiumDiscount: 'Approx. 10% to 20% lower than the standard model.',
    keyRestrictions: [
      'Must call or use the app prior to every in-person medical appointment.',
      'Must adhere to the approved treatment window and referral parameters.',
      'Failure to register the call before visiting a doctor can result in denied invoices or forced transfer to the expensive Standard model.',
    ],
    exceptions: [
      'Acute life-threatening emergencies (call 144 / hospital ER).',
      'Annual preventive gynecological examinations.',
      'Routine pediatric vaccinations.',
      'Routine dental emergencies or ophthalmologist checkups (insurer-specific).',
    ],
    bestSuitedFor:
      'Comfortable communicating by phone or digital app, tech-savvy professionals, or people who travel frequently within Switzerland.',
    questionsToVerify: [
      'Does the telemedicine provider offer telephone consultations in English 24/7?',
      'Are you diligent about calling before booking an appointment?',
    ],
  },
];
