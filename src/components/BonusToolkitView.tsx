import React, { useState } from 'react';
import {
  Sparkles,
  Calculator,
  CheckSquare,
  Compass,
  BookOpen,
  HelpCircle,
  Search,
  CheckCircle2,
  Printer,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { BONUS_TOOLS_LIST, NEWCOMER_CHECKLIST_ITEMS, TEN_QUESTIONS_BEFORE_SWITCHING } from '../data/bonusTools';
import { SWISS_INSURANCE_GLOSSARY } from '../data/glossary';
import { formatCHF } from '../lib/insuranceCalculations';

interface BonusToolkitViewProps {
  onBackToOptimizer: () => void;
}

export const BonusToolkitView: React.FC<BonusToolkitViewProps> = ({ onBackToOptimizer }) => {
  const [activeBonusTab, setActiveBonusTab] = useState<string>('franchise-worksheet');

  // Bonus 1: Interactive Worksheet state
  const [worksheetEmergencyBuffer, setWorksheetEmergencyBuffer] = useState<number>(3500);
  const [worksheetHealthVisitsPerYear, setWorksheetHealthVisitsPerYear] = useState<number>(2);

  // Bonus 2: Cost Planner items
  const [plannerGpVisits, setPlannerGpVisits] = useState<number>(2);
  const [plannerSpecialistVisits, setPlannerSpecialistVisits] = useState<number>(1);
  const [plannerMonthlyMeds, setPlannerMonthlyMeds] = useState<number>(30);
  const [plannerPhysioSessions, setPlannerPhysioSessions] = useState<number>(0);

  // Bonus 3: Comparison Checklist ticks
  const [comparisonChecks, setComparisonChecks] = useState<Record<string, boolean>>({});

  // Bonus 5: Glossary search query
  const [glossaryQuery, setGlossaryQuery] = useState<string>('');

  // Calculations for Bonus 2
  // Approximate official Tarmed / outpatient rates in Switzerland: GP visit ~CHF 150, Specialist ~CHF 250, Physio session ~CHF 55
  const estimatedGpCosts = plannerGpVisits * 150;
  const estimatedSpecialistCosts = plannerSpecialistVisits * 250;
  const estimatedMedsAnnual = plannerMonthlyMeds * 12;
  const estimatedPhysioCosts = plannerPhysioSessions * 55;
  const totalPlannedMedicalSpending =
    estimatedGpCosts + estimatedSpecialistCosts + estimatedMedsAnnual + estimatedPhysioCosts;

  const filteredGlossary = SWISS_INSURANCE_GLOSSARY.filter((term) => {
    const q = glossaryQuery.toLowerCase();
    return (
      term.termEn.toLowerCase().includes(q) ||
      term.termDe.toLowerCase().includes(q) ||
      term.termFr.toLowerCase().includes(q) ||
      term.termIt.toLowerCase().includes(q) ||
      term.shortDefinition.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 bg-red-50 text-[#E30613] rounded border border-red-200">
              Included Bonus Area
            </span>
            <span className="text-xs text-neutral-500 font-mono">6 Interactive Decision Tools</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase">
            Your Swiss Expat Insurance Toolkit
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Practical worksheets, planning templates, and multilingual reference guides.
          </p>
        </div>

        <button
          type="button"
          onClick={onBackToOptimizer}
          className="px-4 py-2 bg-[#E30613] text-white text-xs font-bold rounded-lg hover:bg-[#c90510] transition-colors cursor-pointer"
        >
          Return to Optimizer
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {BONUS_TOOLS_LIST.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => setActiveBonusTab(tool.id)}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
              activeBonusTab === tool.id
                ? 'border-[#E30613] bg-red-50/60 shadow-xs'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <div>
              <span
                className={`text-[10px] font-mono font-bold block mb-1 ${
                  activeBonusTab === tool.id ? 'text-[#E30613]' : 'text-neutral-400'
                }`}
              >
                BONUS #{tool.number}
              </span>
              <span className="text-xs font-bold text-neutral-900 line-clamp-2">
                {tool.title}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* TOOL 1: FRANCHISE COMPARISON WORKSHEET */}
      {activeBonusTab === 'franchise-worksheet' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#E30613]">BONUS #1</span>
            <h2 className="text-xl font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
              Franchise Comparison Worksheet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Evaluate your liquidity buffer and risk profile before committing to a CHF 2,500 deductible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-[#F4F5F7] rounded-xl space-y-3 text-xs">
                <label className="font-bold text-neutral-900 block">
                  1. Dedicated Liquid Emergency Health Cushion:
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 font-mono">Available:</span>
                  <span className="font-mono font-bold text-base text-neutral-900">
                    {formatCHF(worksheetEmergencyBuffer)}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="250"
                  value={worksheetEmergencyBuffer}
                  onChange={(e) => setWorksheetEmergencyBuffer(Number(e.target.value))}
                  className="w-full accent-[#E30613] cursor-pointer"
                />
                <p className="text-[11px] text-neutral-500 leading-normal">
                  If you choose a CHF 2,500 franchise, you must have at least <strong>CHF 3,200</strong> readily available in a Swiss bank account (CHF 2,500 franchise + CHF 700 coinsurance cap).
                </p>
              </div>

              <div className="p-4 bg-[#F4F5F7] rounded-xl space-y-3 text-xs">
                <label className="font-bold text-neutral-900 block">
                  2. Anticipated Doctor / Specialist Visits:
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Visits per calendar year:</span>
                  <span className="font-mono font-bold text-base text-neutral-900">
                    {worksheetHealthVisitsPerYear} visits
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={worksheetHealthVisitsPerYear}
                  onChange={(e) => setWorksheetHealthVisitsPerYear(Number(e.target.value))}
                  className="w-full accent-[#E30613] cursor-pointer"
                />
              </div>
            </div>

            {/* Diagnostic Evaluation Card */}
            <div className="p-5 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Liquidity & Risk Diagnosis
                </span>
                {worksheetEmergencyBuffer >= 3200 ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 space-y-1">
                    <span className="font-bold block text-sm">✅ Liquid Buffer Criterion Satisfied</span>
                    <p className="text-[11px]">
                      Your liquid health savings ({formatCHF(worksheetEmergencyBuffer)}) comfortably exceed the CHF 3,200 statutory maximum adult out-of-pocket exposure. A CHF 2,500 franchise is a mathematically viable scenario for you to evaluate.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-950 space-y-1">
                    <span className="font-bold block text-sm">⚠️ Liquidity Cushion Warning</span>
                    <p className="text-[11px]">
                      Your liquid savings ({formatCHF(worksheetEmergencyBuffer)}) are below the CHF 3,200 maximum exposure. If you suffer an unexpected health event, paying medical invoices before insurance takes over could cause personal cashflow stress.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-100 pt-3 text-[11px] text-neutral-600 space-y-1">
                <span className="font-bold text-neutral-900 block">Swiss Rule of Thumb:</span>
                <p>
                  In Switzerland, the intermediate franchises (CHF 500, 1,000, 1,500, 2,000) are almost never mathematically optimal because the premium discounts offered are smaller relative to the added deductible risk. Most financial consumer advocates analyze either CHF 300 or CHF 2,500.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: ANNUAL HEALTHCARE COST PLANNER */}
      {activeBonusTab === 'cost-planner' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#E30613]">BONUS #2</span>
            <h2 className="text-xl font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
              Annual Healthcare Cost Planner
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Itemize anticipated doctor visits, regular prescription medications, and therapies to estimate your expected medical bill total.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-[#F4F5F7] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 block">General Practitioner (GP) Visits</span>
                  <span className="text-[11px] text-neutral-500">Approx. CHF 150 per consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlannerGpVisits(Math.max(0, plannerGpVisits - 1))}
                    className="w-7 h-7 bg-white rounded border border-neutral-300 font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm w-5 text-center">{plannerGpVisits}</span>
                  <button
                    type="button"
                    onClick={() => setPlannerGpVisits(plannerGpVisits + 1)}
                    className="w-7 h-7 bg-white rounded border border-neutral-300 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-[#F4F5F7] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 block">Specialist Consultations</span>
                  <span className="text-[11px] text-neutral-500">Approx. CHF 250 per consultation</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlannerSpecialistVisits(Math.max(0, plannerSpecialistVisits - 1))}
                    className="w-7 h-7 bg-white rounded border border-neutral-300 font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm w-5 text-center">{plannerSpecialistVisits}</span>
                  <button
                    type="button"
                    onClick={() => setPlannerSpecialistVisits(plannerSpecialistVisits + 1)}
                    className="w-7 h-7 bg-white rounded border border-neutral-300 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-[#F4F5F7] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 block">Monthly Prescription Medicines</span>
                  <span className="text-[11px] text-neutral-500">Estimated monthly cost</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-neutral-500 font-bold">CHF</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={plannerMonthlyMeds}
                    onChange={(e) => setPlannerMonthlyMeds(Math.max(0, Number(e.target.value)))}
                    className="w-20 px-2 py-1 bg-white border border-neutral-300 rounded font-mono font-bold text-right text-xs"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-[#F4F5F7] rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-neutral-900 block">Physiotherapy Sessions</span>
                  <span className="text-[11px] text-neutral-500">Approx. CHF 55 per session (with prescription)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlannerPhysioSessions(Math.max(0, plannerPhysioSessions - 1))}
                    className="w-7 h-7 bg-white rounded border border-neutral-300 font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm w-5 text-center">{plannerPhysioSessions}</span>
                  <button
                    type="button"
                    onClick={() => setPlannerPhysioSessions(plannerPhysioSessions + 1)}
                    className="w-7 h-7 bg-white rounded border border-neutral-300 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total Planned Output */}
            <div className="p-5 rounded-xl border border-neutral-200 bg-white flex flex-col justify-between space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Itemized Cost Projection
                </span>
                <div className="space-y-2 border-b border-neutral-100 pb-3">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">GP Visits ({plannerGpVisits}):</span>
                    <span className="font-mono">{formatCHF(estimatedGpCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Specialist Visits ({plannerSpecialistVisits}):</span>
                    <span className="font-mono">{formatCHF(estimatedSpecialistCosts)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Prescription Meds (Annual):</span>
                    <span className="font-mono">{formatCHF(estimatedMedsAnnual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Physiotherapy ({plannerPhysioSessions}):</span>
                    <span className="font-mono">{formatCHF(estimatedPhysioCosts)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline pt-3">
                  <span className="font-bold text-sm text-[#080A0D]">Total Planned Medical Spending:</span>
                  <span className="font-black text-lg text-[#E30613] font-mono">
                    {formatCHF(totalPlannedMedicalSpending)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F4F5F7] rounded-lg text-[11px] text-neutral-600">
                💡 <strong>Takeaway for your Franchise Choice:</strong> At an estimated medical spending of {formatCHF(totalPlannedMedicalSpending)}, test this number directly in the Optimizer's Annual Cost Simulator to see which franchise produces lower total spending.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: INSURANCE COMPARISON CHECKLIST */}
      {activeBonusTab === 'comparison-checklist' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#E30613]">BONUS #3</span>
            <h2 className="text-xl font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
              Insurance Comparison Checklist
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Since basic KVG medical coverage is 100% identical by federal law, use these criteria to evaluate insurers:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              { id: 'c1', title: 'Reimbursement Model (Tiers payant vs Tiers garant)', desc: 'Tiers payant: insurer pays doctors directly; Tiers garant: you pay invoices upfront and claim reimbursement later.' },
              { id: 'c2', title: 'Mobile App & Invoice Scanning', desc: 'Can you snap a photo of medical bills with your smartphone and track deductible balances in real time?' },
              { id: 'c3', title: 'Multilingual Hotline Support', desc: 'Does the insurer provide dedicated customer support and policy documents in English?' },
              { id: 'c4', title: 'Doctor Network Compatibility', desc: 'If choosing a GP (Hausarzt) or HMO model, are your preferred local doctors included in their approved list?' },
              { id: 'c5', title: 'Claim Reimbursement Speed', desc: 'Does the insurer process claims within 10 to 14 days, or does processing take over a month?' },
              { id: 'c6', title: 'Prepayment Discount', desc: 'Does the company offer a 1% to 2% discount if you pay your annual premium upfront in January?' },
            ].map((check) => {
              const isChecked = Boolean(comparisonChecks[check.id]);
              return (
                <label
                  key={check.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-start gap-3 ${
                    isChecked ? 'bg-emerald-50/50 border-emerald-200' : 'bg-[#F4F5F7] border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() =>
                      setComparisonChecks({ ...comparisonChecks, [check.id]: !isChecked })
                    }
                    className="mt-0.5 w-4 h-4 accent-[#E30613] rounded cursor-pointer"
                  />
                  <div>
                    <span className={`font-bold block ${isChecked ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                      {check.title}
                    </span>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                      {check.desc}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* TOOL 4: NEW TO SWITZERLAND STARTER GUIDE */}
      {activeBonusTab === 'newcomer-checklist' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#E30613]">BONUS #4</span>
            <h2 className="text-xl font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
              New to Switzerland Starter Guide
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Verified legal timeline and essential requirements for newcomers to Switzerland.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {NEWCOMER_CHECKLIST_ITEMS.map((item) => (
              <div key={item.id} className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#E30613]">
                  {item.step}
                </span>
                <h3 className="font-bold text-sm text-[#080A0D]">{item.title}</h3>
                <p className="text-neutral-700 leading-relaxed">{item.detail}</p>
                <div className="p-2.5 bg-white rounded border border-neutral-200/80 text-[11px] text-neutral-800">
                  ⚠️ <strong>Crucial Point:</strong> {item.importantNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 5: MULTILINGUAL GLOSSARY */}
      {activeBonusTab === 'glossary-tool' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-[#E30613]">BONUS #5</span>
              <h2 className="text-xl font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
                Swiss Insurance Multilingual Glossary
              </h2>
              <p className="text-xs text-neutral-600 mt-1">
                German (DE), French (FR), Italian (IT), and English (EN) definitions.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search term or language..."
                value={glossaryQuery}
                onChange={(e) => setGlossaryQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F4F5F7] border border-neutral-300 rounded-lg text-xs outline-none focus:border-[#E30613]"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredGlossary.map((term) => (
              <div key={term.id} className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200/60 pb-2">
                  <span className="font-extrabold text-sm text-[#080A0D]">{term.termEn}</span>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-600">
                    <span className="bg-white px-2 py-0.5 rounded border border-neutral-200">DE: {term.termDe}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-neutral-200">FR: {term.termFr}</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-neutral-200">IT: {term.termIt}</span>
                  </div>
                </div>

                <p className="font-medium text-neutral-900">{term.shortDefinition}</p>
                <p className="text-neutral-700 leading-relaxed">{term.fullExplanation}</p>

                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  <strong>Practical Expat Tip:</strong> {term.practicalTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOOL 6: 10 QUESTIONS BEFORE CHANGING YOUR SETUP */}
      {activeBonusTab === 'questions-before-switching' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <span className="text-xs font-mono font-bold text-[#E30613]">BONUS #6</span>
            <h2 className="text-xl font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
              10 Questions Before Changing Your Setup
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Vital due-diligence questions to review before sending your cancellation letter by November 30.
            </p>
          </div>

          <div className="space-y-3">
            {TEN_QUESTIONS_BEFORE_SWITCHING.map((item) => (
              <div
                key={item.number}
                className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 text-xs space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#E30613] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    {item.number}
                  </span>
                  <h3 className="font-bold text-sm text-[#080A0D]">{item.question}</h3>
                </div>
                <p className="text-neutral-700 pl-7 leading-relaxed">{item.whyItMatters}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
