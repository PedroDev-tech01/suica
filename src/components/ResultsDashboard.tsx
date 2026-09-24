import React, { useState } from 'react';
import {
  Shield,
  TrendingDown,
  AlertTriangle,
  Info,
  CheckCircle2,
  Printer,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Briefcase,
  Layers,
  Check,
  Download,
} from 'lucide-react';
import {
  ComparisonResult,
  HealthcareUsage,
  InsurancePlan,
  UserProfile,
} from '../types/insurance';
import {
  calculateOutOfPocket,
  calculateTotalAnnualCost,
  formatCHF,
  formatCHFRound,
  getModelName,
} from '../lib/insuranceCalculations';
import { PRODUCT_CONFIG, SWISS_KVG_RULES } from '../config/appConfig';
import { SWISS_INSURANCE_MODELS } from '../data/modelsExplainer';
import { analytics } from '../services/analytics';
import { TermExplainerButton } from './TermExplainerModal';

interface ResultsDashboardProps {
  profile: UserProfile;
  currentPlan: InsurancePlan;
  altPlan: InsurancePlan;
  usage: HealthcareUsage;
  calculation: ComparisonResult;
  checklistState: Record<string, boolean>;
  onToggleChecklistItem: (id: string) => void;
  onPrintReport: () => void;
  onEditScenario: () => void;
  onNavigateToBonuses: () => void;
  paymentConfirmed?: boolean;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  profile,
  currentPlan,
  altPlan,
  usage,
  calculation,
  checklistState,
  onToggleChecklistItem,
  onPrintReport,
  onEditScenario,
  onNavigateToBonuses,
  paymentConfirmed = true,
}) => {
  const isChild = (profile?.ageGroup || '26+') === '0-18';
  const [simulatedExpense, setSimulatedExpense] = useState<number>(1800);
  const [showAccidentDetails, setShowAccidentDetails] = useState<boolean>(false);
  const [selectedModelTab, setSelectedModelTab] = useState<string>(altPlan.model || 'telmed');

  // Dynamic simulation for user slider input
  const currentSimOOP = calculateOutOfPocket(simulatedExpense, currentPlan.franchise, isChild);
  const altSimOOP = calculateOutOfPocket(simulatedExpense, altPlan.franchise, isChild);
  const currentSimTotal = calculation.currentAnnualPremium + currentSimOOP.totalOutOfPocket;
  const altSimTotal = calculation.alternativeAnnualPremium + altSimOOP.totalOutOfPocket;
  const simTotalDiff = Math.round((currentSimTotal - altSimTotal) * 100) / 100;

  const isPremiumLower = calculation.premiumDifference > 0;
  const isFranchiseDifferent = currentPlan.franchise !== altPlan.franchise;

  const actionItems = [
    { id: 'act-1', text: 'Confirm current annual basic premium (monthly × 12)' },
    { id: 'act-2', text: 'Run official municipal check on Priminfo (priminfo.admin.ch)' },
    { id: 'act-3', text: 'Verify total out-of-pocket maximum under the chosen franchise' },
    { id: 'act-4', text: 'Review care model doctor access conditions & hotline requirements' },
    { id: 'act-5', text: 'Ask employer/HR if UVG/LAA non-occupational accident cover applies' },
    { id: 'act-6', text: 'Read specific insurer general terms of contract (AVB / CGA)' },
    { id: 'act-7', text: 'Ensure written cancellation notice reaches current insurer by November 30' },
    { id: 'act-8', text: 'Confirm all outstanding bills with current insurer are fully settled' },
    { id: 'act-9', text: 'Keep written confirmation from your new insurer on file' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Payment Confirmation Banner */}
      {paymentConfirmed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Full Access Active
                </span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-mono px-2 py-0.5 rounded-full font-bold">
                  {PRODUCT_CONFIG.editionYear} Edition • Complete Assessment
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950 mt-0.5">
                Your Complete Assessment Is Unlocked
              </h2>
              <p className="text-xs text-emerald-800/90 mt-1">
                All 9 analytical modules, interactive healthcare simulator, accident verification, and 6 bonus decision tools are fully unlocked.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onPrintReport}
            className="shrink-0 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      )}

      {/* 28. DASHBOARD HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 bg-red-50 text-[#E30613] rounded border border-red-200">
              Personalized Assessment
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Canton: {profile?.canton || 'ZH'} • Age: {profile?.ageGroup || '26+'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase">
            Your Swiss Health Insurance Check
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Comparing your current setup against your alternative scenario.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="btn-edit-scenario"
            onClick={onEditScenario}
            className="px-3.5 py-2 text-xs font-bold text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Edit Setup</span>
          </button>
          <button
            type="button"
            id="btn-print-report"
            onClick={() => {
              analytics.track('report_downloaded');
              onPrintReport();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-[#101722] hover:bg-neutral-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 21. SIDE-BY-SIDE SETUP COMPARISON CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CURRENT SETUP */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                Current Setup
              </span>
              <span className="text-xs font-semibold text-neutral-800">
                {currentPlan.insurerName || 'Current Insurer'}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-baseline">
                <span className="text-neutral-500">Monthly Premium:</span>
                <span className="font-bold text-neutral-900 font-mono">
                  {formatCHF(currentPlan.monthlyPremium)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-neutral-500">Annual Basic Premium (×12):</span>
                <span className="font-extrabold text-neutral-900 font-mono text-base">
                  {formatCHF(calculation.currentAnnualPremium)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Franchise (Deductible):</span>
                <span className="font-semibold text-neutral-900 font-mono px-2 py-0.5 bg-neutral-100 rounded">
                  CHF {currentPlan.franchise.toLocaleString('de-CH')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Insurance Model:</span>
                <span className="font-semibold text-neutral-900 text-right">
                  {getModelName(currentPlan.model)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Accident Coverage:</span>
                <span className="font-semibold text-neutral-900 capitalize">
                  {currentPlan.accidentCoverage}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 text-xs flex justify-between items-center text-neutral-500">
            <span>Max Annual Out-of-Pocket (excl. premiums):</span>
            <span className="font-bold font-mono text-neutral-900">
              {formatCHF(calculation.currentMaxOutOfPocket)}
            </span>
          </div>
        </div>

        {/* ALTERNATIVE SETUP */}
        <div className="bg-white rounded-2xl border-2 border-neutral-900 p-6 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#E30613]">
                Alternative Scenario
              </span>
              <span className="text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                Priminfo / Quote
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-baseline">
                <span className="text-neutral-500">Monthly Premium:</span>
                <span className="font-bold text-neutral-900 font-mono">
                  {formatCHF(altPlan.monthlyPremium)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-neutral-500">Annual Basic Premium (×12):</span>
                <span className="font-extrabold text-neutral-900 font-mono text-base">
                  {formatCHF(calculation.alternativeAnnualPremium)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Franchise (Deductible):</span>
                <span className="font-semibold text-neutral-900 font-mono px-2 py-0.5 bg-neutral-100 rounded">
                  CHF {altPlan.franchise.toLocaleString('de-CH')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Insurance Model:</span>
                <span className="font-semibold text-neutral-900 text-right">
                  {getModelName(altPlan.model)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Accident Coverage:</span>
                <span className="font-semibold text-neutral-900 capitalize">
                  {altPlan.accidentCoverage}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-neutral-100 text-xs flex justify-between items-center text-neutral-500">
            <span>Max Annual Out-of-Pocket (excl. premiums):</span>
            <span className="font-bold font-mono text-neutral-900">
              {formatCHF(calculation.alternativeMaxOutOfPocket)}
            </span>
          </div>
        </div>
      </div>

      {/* ANNUAL PREMIUM DIFFERENCE BANNER (Strict Compliance: Never "Guaranteed Savings") */}
      <div className="bg-[#101722] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
              Annual Premium Comparison
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-mono">
              {isPremiumLower ? (
                <span>
                  Alternative annual premiums are{' '}
                  <span className="text-emerald-400">
                    {formatCHF(calculation.premiumDifference)} lower.
                  </span>
                </span>
              ) : calculation.premiumDifference < 0 ? (
                <span>
                  Alternative annual premiums are{' '}
                  <span className="text-amber-400">
                    {formatCHF(Math.abs(calculation.premiumDifference))} higher.
                  </span>
                </span>
              ) : (
                <span>Annual basic premiums are identical.</span>
              )}
            </h3>
            <p className="text-xs text-neutral-400 mt-2 max-w-2xl leading-relaxed">
              Formula: Current Annual Premium ({formatCHF(calculation.currentAnnualPremium)}) minus
              Alternative Annual Premium ({formatCHF(calculation.alternativeAnnualPremium)}).
              Remember: this calculates fixed premium bills only, before factoring in your out-of-pocket medical bills.
            </p>
          </div>

          <div className="shrink-0 p-4 bg-white/5 rounded-xl border border-white/10 text-right sm:min-w-[180px]">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Difference</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {formatCHF(Math.abs(calculation.premiumDifference))}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">per calendar year</span>
          </div>
        </div>
      </div>

      {/* 22. FRANCHISE TRADE-OFF ALERT */}
      {isFranchiseDifferent && (
        <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-[#080A0D] uppercase tracking-tight">
                Lower monthly premium does not automatically mean lower total annual cost.
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-[#F4F5F7] rounded-lg">
                  <span className="block text-neutral-500 text-[10px] uppercase font-bold">Current Franchise</span>
                  <span className="font-extrabold text-neutral-900 font-mono text-sm">
                    CHF {currentPlan.franchise.toLocaleString('de-CH')}
                  </span>
                </div>
                <div className="p-3 bg-[#F4F5F7] rounded-lg">
                  <span className="block text-neutral-500 text-[10px] uppercase font-bold">Alternative Franchise</span>
                  <span className="font-extrabold text-neutral-900 font-mono text-sm">
                    CHF {altPlan.franchise.toLocaleString('de-CH')}
                  </span>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <span className="block text-amber-800 text-[10px] uppercase font-bold">Franchise Difference</span>
                  <span className="font-extrabold text-amber-900 font-mono text-sm">
                    CHF {Math.abs(calculation.franchiseDifference).toLocaleString('de-CH')}
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                The higher-franchise scenario may reduce premiums, but increases the amount of healthcare spending you must cover yourself before insurance contributions begin under applicable Swiss cost-sharing rules.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 23. INTERACTIVE SCENARIO CALCULATOR */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">
              Scenario Simulator
            </span>
            <span className="text-[11px] text-neutral-500">
              Art. 64 KVG (10% Coinsurance capped at CHF {isChild ? 350 : 700})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
            Annual Cost Simulator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Enter a hypothetical amount of annual covered healthcare expenses to see how premiums and out-of-pocket costs interact:
          </p>
        </div>

        {/* Input & Preset Chips */}
        <div className="bg-[#F4F5F7] p-5 rounded-xl border border-neutral-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <label htmlFor="sim-expense-input" className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
              Hypothetical Annual Covered Medical Expenses:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-500">CHF</span>
              <input
                id="sim-expense-input"
                type="number"
                min="0"
                max="25000"
                step="100"
                value={simulatedExpense}
                onChange={(e) => setSimulatedExpense(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-32 px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-sm font-extrabold text-neutral-900 font-mono text-right outline-none focus:border-[#E30613]"
              />
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            value={simulatedExpense}
            onChange={(e) => setSimulatedExpense(parseFloat(e.target.value))}
            className="w-full accent-[#E30613] h-2 bg-neutral-300 rounded-lg cursor-pointer"
          />

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-[11px] font-bold text-neutral-500 self-center mr-1">Quick Scenarios:</span>
            {[
              { label: 'CHF 0 (Healthy)', val: 0 },
              { label: 'CHF 600 (Doctor + Rx)', val: 600 },
              { label: 'CHF 1,500 (Therapies)', val: 1500 },
              { label: 'CHF 3,500 (Specialist)', val: 3500 },
              { label: 'CHF 7,000+ (Hospital / Surgery)', val: 7500 },
            ].map((chip) => (
              <button
                key={chip.val}
                type="button"
                onClick={() => setSimulatedExpense(chip.val)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                  simulatedExpense === chip.val
                    ? 'bg-[#101722] text-white'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Calculation Output Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-neutral-200 bg-white">
            <span className="text-xs font-bold text-neutral-500 uppercase block mb-2">
              Current Setup (Franchise CHF {currentPlan.franchise})
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Annual Premium:</span>
                <span className="font-mono">{formatCHF(calculation.currentAnnualPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Franchise paid:</span>
                <span className="font-mono">{formatCHF(currentSimOOP.franchisePaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">10% Coinsurance paid:</span>
                <span className="font-mono">{formatCHF(currentSimOOP.coinsurancePaid)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-neutral-100">
                <span>Total Out-of-Pocket:</span>
                <span className="font-mono text-neutral-900">{formatCHF(currentSimOOP.totalOutOfPocket)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-2 border-t border-neutral-200 text-[#080A0D]">
                <span>Total Annual Cost:</span>
                <span className="font-mono">{formatCHF(currentSimTotal)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border-2 border-neutral-900 bg-white">
            <span className="text-xs font-bold text-[#E30613] uppercase block mb-2">
              Alternative Setup (Franchise CHF {altPlan.franchise})
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Annual Premium:</span>
                <span className="font-mono">{formatCHF(calculation.alternativeAnnualPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Franchise paid:</span>
                <span className="font-mono">{formatCHF(altSimOOP.franchisePaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">10% Coinsurance paid:</span>
                <span className="font-mono">{formatCHF(altSimOOP.coinsurancePaid)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-neutral-100">
                <span>Total Out-of-Pocket:</span>
                <span className="font-mono text-neutral-900">{formatCHF(altSimOOP.totalOutOfPocket)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-2 border-t border-neutral-200 text-[#080A0D]">
                <span>Total Annual Cost:</span>
                <span className="font-mono">{formatCHF(altSimTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Observation at this medical spending level */}
        <div className="p-3.5 bg-[#F4F5F7] rounded-xl text-xs text-neutral-700 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#E30613] shrink-0 mt-0.5" />
          <div>
            <strong className="text-neutral-900">Analysis at {formatCHF(simulatedExpense)} healthcare use: </strong>
            {currentSimTotal > altSimTotal ? (
              <span>
                The alternative scenario would cost approximately{' '}
                <strong className="text-emerald-700 font-mono">{formatCHF(currentSimTotal - altSimTotal)} less</strong> in total annual expenses (premiums + medical bills combined).
              </span>
            ) : currentSimTotal < altSimTotal ? (
              <span>
                Your current scenario would cost approximately{' '}
                <strong className="text-amber-700 font-mono">{formatCHF(altSimTotal - currentSimTotal)} less</strong> in total annual expenses because the lower franchise shields you from the higher out-of-pocket bills.
              </span>
            ) : (
              <span>Both scenarios result in approximately equal total annual healthcare costs at this exact expense level.</span>
            )}
          </div>
        </div>
      </div>

      {/* 24 & 25. VISUAL COST GRAPH & BREAK-EVEN AREA */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Cost Trajectory</span>
            <h3 className="text-xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-0.5">
              Visual Cost Comparison & Break-Even
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500 italic">
            Educational cost scenario — not an insurance quote.
          </span>
        </div>

        {/* 25. Break-even highlight box */}
        {isFranchiseDifferent ? (
          calculation.breakEvenExpense !== null ? (
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-950">
              <span className="font-bold text-sm block mb-1 text-blue-900">
                Estimated Break-Even Area: ~{formatCHF(calculation.breakEvenExpense)} in annual medical expenses
              </span>
              <p className="leading-relaxed text-blue-900/90">
                This illustrates approximately where the premium advantage of one scenario may be offset by higher out-of-pocket healthcare costs. Below this spending level, the higher-franchise scenario generally costs less overall; above this level, the lower-franchise scenario generally caps total costs more effectively.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-[#F4F5F7] border border-neutral-200 rounded-xl text-xs text-neutral-700">
              <span className="font-bold block mb-1">Constant Relationship Across Expense Levels</span>
              <p className="leading-relaxed">
                Because both scenarios share different franchises but one plan is consistently more cost-effective across the expense spectrum, the total cost trajectory does not cross within standard spending ranges.
              </p>
            </div>
          )
        ) : (
          <div className="p-5 bg-[#F4F5F7] border border-neutral-200 rounded-xl text-xs text-neutral-800 space-y-2">
            <h3 className="font-bold text-sm text-[#080A0D]">
              No Franchise Break-Even Required
            </h3>
            <p className="leading-relaxed">
              Both scenarios use the same franchise of CHF {currentPlan.franchise}.
            </p>
            <p className="leading-relaxed text-neutral-600">
              Because the deductible structure is the same, the primary mathematical difference in this comparison comes from the annual premiums and any differences in applicable plan conditions.
            </p>
          </div>
        )}

        {/* Responsive Table Representation of the Expense Spectrum */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-[#F4F5F7] text-neutral-600 font-bold uppercase text-[10px]">
                <th className="py-2.5 px-3">Annual Healthcare Bills</th>
                <th className="py-2.5 px-3">Current Total Cost</th>
                <th className="py-2.5 px-3">Alternative Total Cost</th>
                <th className="py-2.5 px-3">Net Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {calculation.scenarios.map((sc) => {
                const altCostsLess = sc.totalDifference > 0;
                return (
                  <tr key={sc.annualHealthcareExpenses} className="hover:bg-neutral-50">
                    <td className="py-2.5 px-3 font-semibold text-neutral-900 font-mono">
                      {formatCHF(sc.annualHealthcareExpenses)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700">
                      {formatCHF(sc.currentTotalCost)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-neutral-700">
                      {formatCHF(sc.alternativeTotalCost)}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold">
                      {altCostsLess ? (
                        <span className="text-emerald-700">Alt is {formatCHF(sc.totalDifference)} lower</span>
                      ) : sc.totalDifference < 0 ? (
                        <span className="text-amber-700">Current is {formatCHF(Math.abs(sc.totalDifference))} lower</span>
                      ) : (
                        <span className="text-neutral-500">Equal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 26. ACCIDENT COVERAGE CHECK */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">UVG / LAA Check</span>
              <h3 className="text-lg font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
                Accident Coverage Verification
              </h3>
            </div>
          </div>

          <button
            type="button"
            id="btn-toggle-accident-verify"
            onClick={() => setShowAccidentDetails(!showAccidentDetails)}
            className="px-3 py-1.5 bg-[#F4F5F7] text-neutral-800 hover:bg-neutral-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>{showAccidentDetails ? 'Hide Guide' : 'WHAT SHOULD I VERIFY?'}</span>
            {showAccidentDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
          {profile.employmentStatus === 'employee' && profile.employment8Hours === 'yes'
            ? 'Your profile indicates you are employed for 8 or more hours per week. Your employer may already provide compulsory occupational (BU) and non-occupational (NBU) accident coverage under Swiss UVG rules. If so, paying for accident coverage through your basic health insurance is usually redundant.'
            : 'If you are self-employed without private UVG accident insurance, a student, unemployed, or working fewer than 8 hours per week with the same employer, accident coverage must remain included in your basic health insurance policy.'}
        </p>

        {showAccidentDetails && (
          <div className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-2.5">
            <span className="font-bold text-neutral-900 block">3 Verification Steps Before Changing Coverage:</span>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Ask employer / HR:</strong> Check whether your employment contract includes mandatory non-occupational accident insurance (NBU / AANP).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Check your monthly payslip:</strong> Look for a salary deduction labeled “NBU” or “AANP” (typically 1% to 3% of gross salary).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Confirm with insurer:</strong> Notify your health insurer in writing to suspend/exclude accident coverage. Never remove accident coverage until employer coverage is formally active.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 27. INSURANCE MODEL EXPLAINER */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Care Models</span>
            <h3 className="text-lg font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
              Understanding Care Model Restrictions
            </h3>
          </div>
          <span className="text-[11px] text-neutral-500">
            Compare Gatekeeper Rules
          </span>
        </div>

        {/* Model Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SWISS_INSURANCE_MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedModelTab(m.id)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                selectedModelTab === m.id
                  ? 'border-[#E30613] bg-red-50/60 text-[#E30613] shadow-2xs'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
              }`}
            >
              {m.name.split(' (')[0]}
            </button>
          ))}
        </div>

        {/* Selected Model Content Card */}
        {(() => {
          const model = SWISS_INSURANCE_MODELS.find((m) => m.id === selectedModelTab) || SWISS_INSURANCE_MODELS[0];
          return (
            <div className="p-5 bg-[#F4F5F7] rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-extrabold text-neutral-900 block">{model.name}</span>
                  <span className="text-[11px] text-neutral-500 font-mono">{model.germanName}</span>
                </div>
                <span className="px-2 py-0.5 bg-white border border-neutral-200 rounded font-semibold text-neutral-800">
                  {model.typicalPremiumDiscount}
                </span>
              </div>

              <p className="leading-relaxed text-neutral-800">{model.howItWorks}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-3 rounded-lg border border-neutral-200/80">
                  <span className="font-bold text-neutral-900 block mb-1">Required First Contact:</span>
                  <span className="text-neutral-700">{model.firstPointOfContact}</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-neutral-200/80">
                  <span className="font-bold text-neutral-900 block mb-1">Standard Exceptions:</span>
                  <span className="text-neutral-700">{model.exceptions.join(' • ')}</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 italic pt-1">
                * Exact conditions vary by insurer. Always read the specific model conditions before enrolling.
              </div>
            </div>
          );
        })()}
      </div>

      {/* 28 & 29. EDUCATIONAL RESULTS FLAGS */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Due Diligence</span>
          <h3 className="text-lg font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
            Things Worth Checking Before You Decide
          </h3>
          <p className="text-xs text-neutral-600 mt-1">
            Generated strictly from your answers and official Swiss KVG rules.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {calculation.flags.map((flag) => (
            <div
              key={flag.id}
              className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                flag.level === 'red'
                  ? 'bg-red-50/50 border-red-200 text-red-950'
                  : flag.level === 'yellow'
                  ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="shrink-0 mt-0.5 text-sm">
                {flag.level === 'red' ? '🔴' : flag.level === 'yellow' ? '🟡' : '🟢'}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-neutral-900">{flag.title}</h4>
                <p className="font-medium text-neutral-800">{flag.summary}</p>
                <p className="text-neutral-700">{flag.detail}</p>
                {flag.actionAdvice && (
                  <p className="font-semibold text-neutral-900 pt-1">
                    Recommendation: {flag.actionAdvice}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30. OFFICIAL PRIMINFO INTEGRATION */}
      <div className="bg-white rounded-2xl border-2 border-[#E30613] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🇨🇭</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">
                Official Swiss Federal Comparison
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#080A0D] tracking-tight uppercase">
              Ready to check real premiums?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
              Use Switzerland’s official premium comparison tool: <strong>PRIMINFO</strong>.
              It is run by the Federal Office of Public Health (FOPH / BAG), completely independent,
              and contains all legally approved premiums for your canton and municipality without broker kickbacks.
            </p>
          </div>

          <a
            href={PRODUCT_CONFIG.officialPriminfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-open-priminfo-dashboard"
            onClick={() => analytics.track('priminfo_clicked')}
            className="px-6 py-3.5 bg-[#E30613] hover:bg-[#c90510] text-white font-bold text-sm rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>COMPARE OFFICIAL PREMIUMS →</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="mt-4 text-[10px] text-neutral-400 border-t border-neutral-100 pt-3 leading-normal">
          Priminfo is provided by the relevant Swiss federal authority (FOPH / BAG). Swiss Health Insurance Optimizer is an independent educational product and is not affiliated with or endorsed by the Swiss government.
        </p>
      </div>

      {/* 31. ACTION PLAN (Checklist) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Your Action Plan</span>
          <h3 className="text-lg font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
            Your Next Steps
          </h3>
          <p className="text-xs text-neutral-600 mt-1">
            Check off each step as you complete your due-diligence before the switching deadline.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          {actionItems.map((item) => {
            const isDone = Boolean(checklistState[item.id]);
            return (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  isDone ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => onToggleChecklistItem(item.id)}
                  className="mt-0.5 w-4 h-4 accent-[#E30613] rounded cursor-pointer"
                />
                <span className={`text-xs ${isDone ? 'line-through text-neutral-500 font-normal' : 'text-neutral-900 font-semibold'}`}>
                  {item.text}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ACCESS 6 BONUS TOOLS CTA */}
      <div className="p-6 bg-neutral-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1">
            Included in your toolkit
          </span>
          <h4 className="text-lg font-extrabold">Explore Your 6 Bonus Decision Tools</h4>
          <p className="text-xs text-neutral-400 mt-1">
            Franchise comparison worksheet, annual healthcare cost planner, comparison checklist, starter guide, glossary, and 10 questions before changing setup.
          </p>
        </div>
        <button
          type="button"
          id="btn-go-to-bonuses"
          onClick={onNavigateToBonuses}
          className="px-5 py-2.5 bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs rounded-xl transition-colors shrink-0 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>OPEN BONUS TOOLKIT →</span>
        </button>
      </div>

      {/* 67. FUTURE UPSELL (Non-intrusive, after full value delivered) */}
      <div className="p-5 bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-100 text-[#E30613] flex items-center justify-center font-bold text-sm shrink-0">
            🇨🇭
          </div>
          <div>
            <span className="font-extrabold text-[#080A0D] text-sm block">
              SWISS EXPAT TAX KIT — {PRODUCT_CONFIG.editionYear}
            </span>
            <span className="text-neutral-500 text-[11px]">
              Now that you understand health insurance, understand your Swiss taxes. Quellensteuer, 3a pillars, and deductions.
            </span>
          </div>
        </div>
        <a
          href="https://www.ch.ch/en/taxes-and-finances/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-lg text-xs shrink-0 transition-colors inline-flex items-center gap-1"
        >
          <span>Learn More</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
        </a>
      </div>
    </div>
  );
};
