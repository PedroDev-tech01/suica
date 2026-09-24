import React from 'react';
import { Printer, ArrowLeft, ExternalLink, Shield } from 'lucide-react';
import { ComparisonResult, InsurancePlan, UserProfile } from '../types/insurance';
import { formatCHF, getModelName } from '../lib/insuranceCalculations';
import { PRODUCT_CONFIG } from '../config/appConfig';

interface PrintableReportProps {
  profile: UserProfile;
  currentPlan: InsurancePlan;
  altPlan: InsurancePlan;
  calculation: ComparisonResult;
  checklistState: Record<string, boolean>;
  onBack: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  profile,
  currentPlan,
  altPlan,
  calculation,
  checklistState,
  onBack,
}) => {
  const isPremiumLower = calculation.premiumDifference > 0;
  const printDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

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
    <div className="min-h-screen bg-[#F4F5F7] py-8 px-4 sm:px-6">
      {/* Non-printed Controls Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-white text-neutral-700 text-xs font-bold rounded-lg border border-neutral-300 hover:bg-neutral-50 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <button
          type="button"
          id="btn-trigger-print"
          onClick={handlePrint}
          className="px-5 py-2.5 bg-[#E30613] hover:bg-[#c90510] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet (Standard A4 style container) */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 sm:p-12 border border-neutral-200 print:shadow-none print:border-none print:p-0">
        {/* Report Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-neutral-900 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🇨🇭</span>
              <span className="font-extrabold text-sm tracking-tight text-[#080A0D]">
                SWISS HEALTH INSURANCE OPTIMIZER
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-700">
                {PRODUCT_CONFIG.editionYear} EDITION
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#080A0D] tracking-tight uppercase">
              Personalized Insurance Check Report
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Independent Educational Assessment • Calculated locally
            </p>
          </div>

          <div className="text-right text-xs text-neutral-500 space-y-0.5">
            <div><strong>Date:</strong> {printDate}</div>
            <div><strong>Canton:</strong> {profile?.canton || 'ZH'}</div>
            <div><strong>Age Bracket:</strong> {profile?.ageGroup || '26+'}</div>
          </div>
        </div>

        {/* Section 1: Side-by-Side Comparison */}
        <div className="mt-8 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
            1. Setup Comparison Matrix
          </h2>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Current */}
            <div className="p-4 bg-[#F4F5F7] rounded-lg border border-neutral-200 space-y-2">
              <span className="font-bold text-neutral-900 block uppercase text-[11px]">
                Current Setup
              </span>
              <div className="flex justify-between">
                <span className="text-neutral-500">Monthly Premium:</span>
                <span className="font-mono font-bold">{formatCHF(currentPlan.monthlyPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Annual Premium:</span>
                <span className="font-mono font-extrabold">{formatCHF(calculation.currentAnnualPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Franchise:</span>
                <span className="font-mono">CHF {currentPlan.franchise.toLocaleString('de-CH')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Model:</span>
                <span>{getModelName(currentPlan.model)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Accident:</span>
                <span className="capitalize">{currentPlan.accidentCoverage}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-neutral-300 font-semibold">
                <span>Max Out-of-Pocket:</span>
                <span className="font-mono">{formatCHF(calculation.currentMaxOutOfPocket)}</span>
              </div>
            </div>

            {/* Alternative */}
            <div className="p-4 bg-white rounded-lg border-2 border-neutral-900 space-y-2">
              <span className="font-bold text-[#E30613] block uppercase text-[11px]">
                Alternative Scenario
              </span>
              <div className="flex justify-between">
                <span className="text-neutral-500">Monthly Premium:</span>
                <span className="font-mono font-bold">{formatCHF(altPlan.monthlyPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Annual Premium:</span>
                <span className="font-mono font-extrabold">{formatCHF(calculation.alternativeAnnualPremium)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Franchise:</span>
                <span className="font-mono">CHF {altPlan.franchise.toLocaleString('de-CH')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Model:</span>
                <span>{getModelName(altPlan.model)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Accident:</span>
                <span className="capitalize">{altPlan.accidentCoverage}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-neutral-300 font-semibold">
                <span>Max Out-of-Pocket:</span>
                <span className="font-mono">{formatCHF(calculation.alternativeMaxOutOfPocket)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Mathematical Trade-off */}
        <div className="mt-8 space-y-3 text-xs">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
            2. Annual Premium & Franchise Trade-off
          </h2>
          <div className="p-4 bg-neutral-900 text-white rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold">Annual Basic Premium Difference:</span>
              <span className="font-mono font-black text-sm">
                {isPremiumLower
                  ? `Alternative is ${formatCHF(calculation.premiumDifference)} lower`
                  : calculation.premiumDifference < 0
                  ? `Alternative is ${formatCHF(Math.abs(calculation.premiumDifference))} higher`
                  : 'Identical annual premium'}
              </span>
            </div>
            {calculation.breakEvenExpense !== null && (
              <div className="flex justify-between items-center text-neutral-300 border-t border-neutral-800 pt-2">
                <span>Estimated Break-Even Medical Spending Area:</span>
                <span className="font-mono font-bold text-white">~{formatCHF(calculation.breakEvenExpense)} / year</span>
              </div>
            )}
          </div>
          <p className="text-neutral-600 text-[11px] leading-relaxed">
            Note: A lower monthly premium does not automatically mean lower total healthcare spending. The higher-franchise scenario increases your out-of-pocket medical bill responsibility up to your franchise plus 10% coinsurance (capped at CHF {(profile?.ageGroup || '26+') === '0-18' ? 350 : 700}).
          </p>
        </div>

        {/* Section 3: Educational Due Diligence Flags */}
        <div className="mt-8 space-y-3 text-xs">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
            3. Due Diligence & Educational Flags
          </h2>
          <div className="space-y-2">
            {calculation.flags.map((flag) => (
              <div key={flag.id} className="p-3 bg-[#F4F5F7] rounded border border-neutral-200">
                <span className="font-bold text-neutral-900 block mb-0.5">{flag.title}</span>
                <p className="text-neutral-700">{flag.detail}</p>
                {flag.actionAdvice && (
                  <p className="text-neutral-900 font-semibold mt-1">Action: {flag.actionAdvice}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Action Checklist */}
        <div className="mt-8 space-y-3 text-xs">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
            4. Your Action Plan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {actionItems.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <span className="font-mono text-neutral-500">[ {checklistState[item.id] ? 'X' : ' '} ]</span>
                <span className={checklistState[item.id] ? 'line-through text-neutral-500' : 'text-neutral-800'}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Official Priminfo Link & Disclaimer */}
        <div className="mt-8 pt-6 border-t-2 border-neutral-900 text-xs text-neutral-600 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-neutral-900">Official Premium Verification:</span>
            <span className="font-mono text-[#E30613] font-semibold">https://www.priminfo.admin.ch/</span>
          </div>
          <p className="text-[10px] text-neutral-500 leading-normal">
            <strong>Legal Disclaimer:</strong> Swiss Health Insurance Optimizer provides general educational information and mathematical calculations only. It does not constitute insurance, financial, legal or medical advice and does not recommend any insurer, policy, franchise or insurance model. Always verify current information with official Swiss authorities (FOPH/BAG) and the relevant insurer before signing or modifying any contract.
          </p>
        </div>
      </div>
    </div>
  );
};
