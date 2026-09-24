export interface FAQItem {
  question: string;
  answer: string;
  category: 'about' | 'rules' | 'privacy';
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'Is this an insurance broker or intermediary?',
    answer:
      'No. We are not an insurance broker, agent, or intermediary. We do not sell insurance policies, earn sales commissions, receive kickbacks from insurers, or recommend any commercial brand. This is a 100% independent educational software tool.',
    category: 'about',
  },
  {
    question: 'Does this tool recommend a specific insurer for me?',
    answer:
      'No. By federal law, mandatory basic health insurance (KVG) provides 100% identical medical benefits across all Swiss insurance companies. We help you calculate your total annual costs, understand franchise trade-offs, and compare care models, then direct you to Switzerland’s official Priminfo portal to verify current rates.',
    category: 'about',
  },
  {
    question: 'Does the tool tell me which franchise I must choose?',
    answer:
      'No. Choosing a franchise involves personal financial risk tolerance and liquid emergency savings. We show you the exact mathematical trade-off: how much you save in annual premiums versus your maximum out-of-pocket medical exposure, and calculate the break-even healthcare spending point between your scenarios.',
    category: 'rules',
  },
  {
    question: 'Where do the premiums come from?',
    answer:
      'You enter your current premium (from your monthly bill or policy letter) and real alternative quotes found via Switzerland’s official federal comparison tool, Priminfo (priminfo.admin.ch), or directly from insurer quote portals.',
    category: 'rules',
  },
  {
    question: 'Why doesn’t the tool automatically scrape and display every insurer quote?',
    answer:
      'Swiss health insurance premiums vary across 26 cantons, hundreds of municipal regions, three age brackets, and dozens of alternative care model combinations, and are officially updated every autumn. Rather than displaying third-party data that can quickly become stale, our tool equips you with the financial understanding and questions to compare real, authoritative rates on Priminfo.',
    category: 'about',
  },
  {
    question: 'Does this tool replace official Priminfo?',
    answer:
      'Absolutely not. Priminfo is the official federal comparison portal run by the Swiss Federal Office of Public Health (FOPH / BAG). Swiss Health Insurance Optimizer is an educational analytical tool that works alongside Priminfo to help you understand what the numbers mean for your total annual budget.',
    category: 'about',
  },
  {
    question: 'Is this considered financial, legal, or medical advice?',
    answer:
      'No. This product provides general educational information, mathematical calculations, and organizational checklists. It does not constitute personal financial, insurance, legal, or medical advice.',
    category: 'about',
  },
  {
    question: 'Can newcomers to Switzerland use this?',
    answer:
      'Yes. In fact, it was built specifically for expats and newcomers who find Swiss health insurance terminology unfamiliar. We explain franchises, coinsurance, care models, and accident coverage in plain English without bureaucratic jargon.',
    category: 'about',
  },
  {
    question: 'Can existing Swiss residents use this to review their setup?',
    answer:
      'Yes. Many long-time Swiss residents remain on default CHF 300 franchises or expensive Standard models simply because they have never calculated the annual difference of an alternative model or CHF 2,500 franchise.',
    category: 'about',
  },
  {
    question: 'Is my personal healthcare or financial data stored on a server?',
    answer:
      'No. All calculations run client-side in your web browser. We do not ask for medical history, diagnoses, or sensitive personal identifiers. You can save your progress locally in your browser’s localStorage and wipe it completely at any time with a single click of "Delete My Data".',
    category: 'privacy',
  },
];
