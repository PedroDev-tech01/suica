import React from 'react';
import { ExternalLink, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';
import { VERIFIED_SOURCES } from '../data/sourcesData';
import { PRODUCT_CONFIG, SWISS_KVG_RULES } from '../config/appConfig';

interface SourcesAndMethodologyViewProps {
  onBackToOptimizer: () => void;
}

export const SourcesAndMethodologyView: React.FC<SourcesAndMethodologyViewProps> = ({
  onBackToOptimizer,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 bg-red-50 text-[#E30613] rounded border border-red-200">
              Transparency & Legal Basis
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              Last Verified: {PRODUCT_CONFIG.lastVerifiedDate}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase">
            Official Sources & Methodology
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1">
            Full transparency regarding Swiss legal statutes, mathematical formulas, and scope limitations.
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

      {/* 58. METHODOLOGY SECTION */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">
            Calculation Logic
          </span>
          <h2 className="text-xl font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
            Transparent Mathematical Methodology
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            This transparency is an essential product feature. Here is how all numbers are derived:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Rule 1 */}
          <div className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 space-y-2">
            <span className="font-bold text-sm text-neutral-900 block">
              1. Annual Basic Premiums
            </span>
            <p className="text-neutral-700 leading-relaxed">
              Calculated strictly as: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200">monthlyPremium × 12</code>.
              Health insurance in Switzerland is paid monthly in advance. When insurers offer an annual prepayment discount (typically 1% to 2%), policyholders should verify this directly with the insurer.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 space-y-2">
            <span className="font-bold text-sm text-neutral-900 block">
              2. Out-of-Pocket Medical Costs (KVG Art. 64)
            </span>
            <p className="text-neutral-700 leading-relaxed">
              For any covered annual medical bills:
              <br />
              • First, you pay 100% up to your chosen <strong>Franchise</strong> (e.g. CHF 300 to CHF 2,500).
              <br />
              • Second, on expenses exceeding the franchise, you pay a <strong>10% Coinsurance</strong> (Selbstbehalt / Quote-part).
              <br />
              • Third, this 10% coinsurance is legally capped at <strong>CHF 700</strong> per calendar year for adults (CHF 350 for children).
            </p>
          </div>

          {/* Rule 3 */}
          <div className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 space-y-2">
            <span className="font-bold text-sm text-neutral-900 block">
              3. Maximum Annual Out-of-Pocket Exposure
            </span>
            <p className="text-neutral-700 leading-relaxed">
              Your worst-case medical expenditure in a calendar year (excluding fixed premiums and hospital fees) is mathematically:
              <br />
              <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-neutral-200">
                Franchise + CHF 700 Coinsurance Cap
              </code>
              <br />
              For CHF 300 franchise: <strong>CHF 1,000</strong> max.
              <br />
              For CHF 2,500 franchise: <strong>CHF 3,200</strong> max.
            </p>
          </div>

          {/* Rule 4 */}
          <div className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 space-y-2">
            <span className="font-bold text-sm text-neutral-900 block">
              4. Break-Even Medical Spending Area
            </span>
            <p className="text-neutral-700 leading-relaxed">
              When comparing a high-franchise/low-premium plan against a low-franchise/high-premium plan, the tool calculates the exact point where the higher out-of-pocket bills offset the annual premium savings. Below this spending level, the high-franchise plan costs less; above it, the low-franchise plan costs less.
            </p>
          </div>
        </div>

        {/* Scope Limitations & Exclusions */}
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-2">
          <span className="font-bold text-sm text-amber-900 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Scope Assumptions & Explicit Exclusions</span>
          </span>
          <p className="leading-relaxed">
            • <strong>Voluntary Supplementary Insurance (VVG / LCA):</strong> Dental, private ward hospital coverage, or alternative medicine plans are excluded from KVG calculations as their pricing and underwriting are privatized and unregulated.
            <br />
            • <strong>Hospital Stay Daily Fee:</strong> Adults without dependent children pay an additional CHF 15/day for overnight hospital stays (KVG Art. 64 Para. 5).
            <br />
            • <strong>Uncovered Treatments:</strong> Experimental procedures or medications not listed on the FOPH Specialty List (Spezialitätenliste) are not reimbursed by basic insurance and do not count toward the franchise.
          </p>
        </div>
      </div>

      {/* 57. OFFICIAL SOURCES REPOSITORY */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">
            Verified Citations
          </span>
          <h2 className="text-xl font-extrabold text-[#080A0D] uppercase tracking-tight mt-0.5">
            Official Authorities & Swiss Legislation
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Every calculation rule and educational insight traces back to official federal documentation:
          </p>
        </div>

        <div className="space-y-4">
          {VERIFIED_SOURCES.map((source, index) => (
            <div
              key={index}
              className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 space-y-2 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-200/60 pb-2">
                <span className="font-bold text-sm text-[#080A0D]">{source.rule}</span>
                <span className="text-[10px] font-mono text-neutral-500">
                  Verified: {source.lastVerified}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-700">
                <div>
                  <span className="font-semibold text-neutral-900 block">Authority:</span>
                  <span>{source.sourceAuthority}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-900 block">Statutory Reference:</span>
                  <span className="font-mono text-neutral-800">{source.legalReference}</span>
                </div>
              </div>

              <p className="text-neutral-600 leading-relaxed">{source.summary}</p>

              <div className="pt-1">
                <a
                  href={source.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E30613] hover:underline font-semibold inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Verify at official portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
