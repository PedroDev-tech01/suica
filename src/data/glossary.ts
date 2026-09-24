import { GlossaryTerm } from '../types/insurance';

export const SWISS_INSURANCE_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'franchise',
    termEn: 'Franchise (Annual Deductible)',
    termDe: 'Franchise',
    termFr: 'Franchise',
    termIt: 'Franchigia',
    shortDefinition:
      'The fixed annual amount you pay yourself for covered medical treatments before insurance cost-sharing starts.',
    fullExplanation:
      'Under Swiss KVG/LAMal law, adults choose an annual deductible between CHF 300 (the standard minimum) and CHF 2,500. You pay 100% of doctor, hospital, and medication bills until you reach this amount in each calendar year. A higher franchise lowers your monthly premium, but increases your personal financial risk if you need healthcare.',
    practicalTip:
      'A change in franchise takes effect only at the start of a calendar year (January 1) and must be submitted to your insurer by November 30.',
  },
  {
    id: 'selbstbehalt',
    termEn: 'Coinsurance (Retention Fee)',
    termDe: 'Selbstbehalt',
    termFr: 'Quote-part',
    termIt: 'Aliquota percentuale',
    shortDefinition:
      'The 10% share of covered healthcare costs you continue to pay after exceeding your franchise.',
    fullExplanation:
      'Once your annual medical bills exceed your chosen franchise, the basic health insurance pays 90% and you pay 10%. This 10% coinsurance is legally capped at CHF 700 per calendar year for adults (CHF 350 for children). Once your 10% share reaches CHF 700, insurance pays 100% of covered benefits for the rest of that year.',
    practicalTip:
      'Maximum annual out-of-pocket spending (excluding monthly premiums) is always your Franchise + CHF 700 coinsurance cap.',
  },
  {
    id: 'grundversicherung',
    termEn: 'Basic Mandatory Health Insurance',
    termDe: 'Obligatorische Grundversicherung (KVG)',
    termFr: 'Assurance obligatoire des soins (AOS / LAMal)',
    termIt: "Assicurazione obbligatoria delle cure medico-sanitarie",
    shortDefinition:
      'The legally mandatory health insurance that every resident in Switzerland must have.',
    fullExplanation:
      'Benefits under basic insurance are strictly defined by federal law and are 100% identical across all Swiss health insurers. Insurers cannot reject any applicant for basic insurance, regardless of age, nationality, or pre-existing medical conditions. However, monthly premiums differ significantly between insurers, cantons, and care models.',
    practicalTip:
      'Because mandatory benefits are identical across all companies, you receive the same statutory healthcare coverage regardless of whether you pay CHF 320 or CHF 550 per month.',
  },
  {
    id: 'krankenkasse',
    termEn: 'Health Insurer / Health Insurance Fund',
    termDe: 'Krankenkasse',
    termFr: 'Caisse-maladie',
    termIt: 'Cassa malati',
    shortDefinition:
      'A federally approved, non-profit entity providing compulsory basic health insurance in Switzerland.',
    fullExplanation:
      'By law, insurers must operate basic health insurance on a strictly non-profit basis. They must hold reserve funds and submit their premium proposals annually to the Federal Office of Public Health (FOPH / BAG) for official approval.',
    practicalTip:
      'Insurers can also offer voluntary supplementary private insurance (VVG / LCA), which is for-profit and can reject applicants or impose medical exclusions.',
  },
  {
    id: 'hausarztmodell',
    termEn: 'Family Doctor Model (GP Model)',
    termDe: 'Hausarztmodell',
    termFr: 'Modèle médecin de famille',
    termIt: 'Modello del medico di famiglia',
    shortDefinition:
      'An alternative insurance model where you commit to always consulting your designated general practitioner first.',
    fullExplanation:
      'In exchange for a monthly premium discount (typically 5% to 15%), you agree to contact your chosen primary care doctor before seeing any specialist. Your family doctor coordinates referrals. Gynecological checkups, pediatric care, and urgent emergencies are usually exempt from prior referral.',
    practicalTip:
      'Ensure your preferred local doctor is recognized on the specific insurer’s approved GP network list before switching.',
  },
  {
    id: 'hmo',
    termEn: 'HMO Model (Health Maintenance Organization)',
    termDe: 'HMO-Modell (Gesundheitszentrum)',
    termFr: 'Modèle HMO (Centre de santé)',
    termIt: 'Modello HMO (Centro medico)',
    shortDefinition:
      'An alternative care model where all medical treatment is coordinated through a specific group medical practice or HMO center.',
    fullExplanation:
      'Doctors, therapists, and specialists practice together in regional HMO centers. You designate an HMO center as your first point of medical contact. This model often yields significant premium savings (typically 10% to 25%).',
    practicalTip:
      'Check how close the nearest HMO center is to your home or office before enrolling.',
  },
  {
    id: 'telmed',
    termEn: 'Telmed Model (Telemedicine First)',
    termDe: 'Telmed-Modell',
    termFr: 'Modèle Telmed',
    termIt: 'Modello Telmed',
    shortDefinition:
      'An alternative insurance model where you must call a certified medical hotline before visiting any doctor in person.',
    fullExplanation:
      'Before going to any doctor or hospital (except in life-threatening emergencies or annual eye/gynecological checkups), you must call an independent 24/7 medical advice hotline (such as Medgate or Santé24). The tele-doctor gives advice and issues an electronic referral window for in-person treatment.',
    practicalTip:
      'Always log your consultation window or call timestamp. Visiting a doctor without prior hotline authorization can lead to bills being denied.',
  },
  {
    id: 'unfallversicherung',
    termEn: 'Accident Insurance (UVG / LAA)',
    termDe: 'Unfallversicherung (UVG)',
    termFr: 'Assurance-accidents (LAA)',
    termIt: 'Assicurazione contro gli infortuni (LAINF)',
    shortDefinition:
      'Insurance covering medical treatment, disability, and loss of earnings caused by accidents.',
    fullExplanation:
      'Swiss law strictly separates illness from accidents. Anyone employed for at least 8 hours per week with the same employer is automatically insured for both occupational (BU) and non-occupational (NBU) accidents through their employer under UVG/LAA. In this case, you can exclude accident cover from your health insurance, saving approximately 7% on basic premiums.',
    practicalTip:
      'If you are self-employed, unemployed without UVG eligibility, or working under 8 hours a week, you must include accident coverage in your health insurance.',
  },
  {
    id: 'praemie',
    termEn: 'Insurance Premium',
    termDe: 'Krankenkassenprämie',
    termFr: 'Prime d’assurance-maladie',
    termIt: 'Premio dell’assicurazione malattie',
    shortDefinition:
      'The fixed monthly amount you pay to your health insurer to maintain coverage.',
    fullExplanation:
      'Premiums in Switzerland are community-rated per canton/region and age group. They do NOT depend on your income, gender, or health history. Each autumn, the federal government approves the premium rates for the following calendar year.',
    practicalTip:
      'Premiums are paid in advance, typically monthly. Many insurers offer a small discount (approx. 1% to 2%) if you choose semi-annual or annual pre-payment.',
  },
  {
    id: 'spitalbeitrag',
    termEn: 'Hospital Stay Daily Contribution',
    termDe: 'Spitalbeitrag',
    termFr: 'Contribution aux frais de séjour hospitalier',
    termIt: 'Contributo alle spese di degenza ospedaliera',
    shortDefinition:
      'A statutory co-payment of CHF 15 per day when hospitalized in a general ward.',
    fullExplanation:
      'Adults without dependent children contribute CHF 15 per overnight hospital stay toward living costs (food, lodging) that they would otherwise incur at home. Children, young adults in education up to age 25, and maternity hospitalizations are legally exempt.',
    practicalTip:
      'This CHF 15 daily charge applies independently of whether your franchise and CHF 700 coinsurance cap have already been reached.',
  },
];
