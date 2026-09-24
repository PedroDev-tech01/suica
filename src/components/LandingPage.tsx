import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  ArrowRight,
  TrendingDown,
  HelpCircle,
  FileText,
  Calculator,
  Compass,
  Lock,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';
import { PRODUCT_CONFIG } from '../config/appConfig';
import { FAQ_DATA } from '../data/faqData';
import { analytics } from '../services/analytics';
import { formatCHF } from '../lib/insuranceCalculations';
import { HOTMART_CHECKOUT_URL } from '../config/payment';

interface LandingPageProps {
  onStartOptimizer: () => void;
  onNavigateToBonuses: () => void;
  onNavigateToSources: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOptimizer,
  onNavigateToBonuses,
  onNavigateToSources,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [previewFranchise, setPreviewFranchise] = useState<number>(2500);
  const [previewExpense, setPreviewExpense] = useState<number>(1500);

  const handleCtaClick = (source: string) => {
    analytics.track('cta_clicked', { source });
    onStartOptimizer();
  };

  // Live preview calculations for the real interactive product preview section
  const sampleLowFPremium = 460; // CHF 300 franchise
  const sampleHighFPremium = 345; // CHF 2,500 franchise
  const sampleLowFAnnual = sampleLowFPremium * 12; // 5520
  const sampleHighFAnnual = sampleHighFPremium * 12; // 4140
  const samplePremiumDiff = sampleLowFAnnual - sampleHighFAnnual; // 1380

  // Out of pocket for selected preview expense
  const lowF_OOP = Math.min(previewExpense, 300) + Math.min(Math.max(0, previewExpense - 300) * 0.1, 700);
  const highF_OOP = Math.min(previewExpense, previewFranchise) + Math.min(Math.max(0, previewExpense - previewFranchise) * 0.1, 700);
  const lowFTotal = sampleLowFAnnual + lowF_OOP;
  const highFTotal = sampleHighFAnnual + highF_OOP;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* 10. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-[#E30613] text-xs font-bold tracking-wide uppercase mb-6">
            <span className="text-sm">🇨🇭</span>
            <span>BUILT FOR EXPATS IN SWITZERLAND</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-600 font-semibold">{PRODUCT_CONFIG.editionYear} EDITION</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#080A0D] leading-[1.15] max-w-4xl mx-auto uppercase">
            Understand your Swiss health insurance{' '}
            <span className="text-[#E30613] inline-block">before choosing your plan.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            A practical interactive tool that helps you understand your premium, franchise,
            insurance model and annual cost scenarios — without the confusing insurance jargon.
          </p>

          {/* Three Key Benefits */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-sm font-semibold text-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span>Understand your current setup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span>Compare cost scenarios</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span>Know what to verify before switching</span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              type="button"
              id="hero-cta-btn"
              onClick={() => handleCtaClick('hero_primary')}
              className="w-full sm:w-auto px-8 py-4 bg-[#E30613] hover:bg-[#c90510] text-white text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <span>GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#how-it-works"
              className="px-6 py-4 text-sm font-bold text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              SEE HOW IT WORKS ↓
            </a>
          </div>

          <p className="mt-4 text-xs text-neutral-500 font-medium">
            One-time payment • Interactive tool • No subscription • 100% independent
          </p>
        </div>
      </section>

      {/* 11. PROBLEM SECTION */}
      <section className="py-16 sm:py-24 bg-[#F4F5F7] border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase">
              Swiss health insurance can get confusing fast.
            </h2>
            <p className="mt-3 text-neutral-600 text-base">
              New to Switzerland or reviewing your renewal? These common dilemmas cost expats thousands of Francs each year when misunderstood:
            </p>
          </div>

          {/* Question Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { q: 'CHF 300 or CHF 2,500 franchise?', a: 'Is the lower monthly premium really worth the higher medical deductible exposure?' },
              { q: 'Standard, HMO, Telmed or family doctor?', a: 'What happens if you visit a specialist without calling the mandatory hotline first?' },
              { q: 'Do I need accident coverage?', a: 'Are you already covered through your employer under UVG/LAA or paying twice?' },
              { q: 'Am I comparing premiums correctly?', a: 'Why comparing only monthly premiums without out-of-pocket maximums leads to bad choices.' },
              { q: 'What could this cost me over a full year?', a: 'How do doctor visits, prescription medicine, and hospital stays interact with your budget?' },
              { q: 'Where can I compare official premiums?', a: 'How to avoid biased broker commission sites and use the official federal Priminfo portal.' },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl border border-neutral-200/90 shadow-xs hover:border-neutral-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] font-bold flex items-center justify-center shrink-0 text-sm">
                    ?
                  </div>
                  <div>
                    <h3 className="font-bold text-[#080A0D] text-sm leading-snug">
                      "{card.q}"
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                      {card.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-white rounded-xl border border-neutral-200 text-center max-w-2xl mx-auto shadow-xs">
            <p className="text-base font-semibold text-[#080A0D]">
              “You shouldn’t need to become an insurance expert just to understand what you’re paying for.”
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Our interactive tool bridges the gap between confusing Swiss regulations and your personal budget.
            </p>
          </div>
        </div>
      </section>

      {/* 12. VALUE PROPOSITION */}
      <section className="py-16 sm:py-20 bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#101722] text-white rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-red-400 block mb-2">
                Core Financial Principle
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight uppercase">
                Don’t just compare monthly premiums.
              </h2>
              <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed">
                A lower monthly premium does <strong className="text-white">not</strong> automatically mean lower total healthcare spending. Before deciding, you must understand how these 6 interconnected elements interact over a full 12-month calendar year:
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 text-neutral-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#E30613]" />
                  <span>Annual Premiums (Monthly × 12)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#E30613]" />
                  <span>Franchise (CHF 300 to 2,500)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#E30613]" />
                  <span>10% Coinsurance (Capped at CHF 700)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#E30613]" />
                  <span>Care Model Gatekeeper Rules</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#E30613]" />
                  <span>Accident Coverage (UVG / LAA)</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-200 bg-white/5 p-2.5 rounded-lg border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#E30613]" />
                  <span>Anticipated Healthcare Use</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  id="vp-check-setup-btn"
                  onClick={() => handleCtaClick('value_prop')}
                  className="px-6 py-3.5 bg-[#E30613] hover:bg-[#c90510] text-white text-sm font-bold rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>CHECK MY SETUP →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-[#F4F5F7] border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Simple 5-Minute Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
              How the Optimizer Works
            </h2>
            <p className="mt-3 text-neutral-600 text-sm">
              We guide you step-by-step through a clear financial check tailored to Swiss healthcare law.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'TELL US ABOUT YOUR SETUP',
                desc: 'Enter your canton, age group, employment status, and current basic monthly premium and franchise.',
              },
              {
                step: '02',
                title: 'UNDERSTAND YOUR COSTS',
                desc: 'See your monthly bills translated into clear annual numbers and out-of-pocket exposure limits.',
              },
              {
                step: '03',
                title: 'COMPARE A SCENARIO',
                desc: 'Enter an alternative quote or franchise to see the real mathematical break-even point.',
              },
              {
                step: '04',
                title: 'KNOW WHAT TO CHECK',
                desc: 'Receive tailored verification flags, an action checklist, and direct links to official Priminfo.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-neutral-200/90 shadow-xs relative flex flex-col"
              >
                <span className="text-2xl font-black text-[#E30613] font-mono mb-3 block">
                  {s.step}
                </span>
                <h3 className="font-bold text-[#080A0D] text-sm tracking-tight mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed mt-auto">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 37. REAL INTERACTIVE PRODUCT PREVIEW (NOT GENERIC FAKE SCREENSHOTS) */}
      <section className="py-16 sm:py-24 bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Interactive Demonstration</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
              Live Product Preview
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Try a mini-simulation below. Move the slider to see how medical expenses shift the total cost balance between a CHF 300 and CHF 2,500 franchise.
            </p>
          </div>

          {/* Interactive Preview Box */}
          <div className="bg-[#080A0D] text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-neutral-800 max-w-4xl mx-auto">
            {/* Header bar */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-neutral-800 gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span className="text-xs font-mono text-neutral-400 ml-2">
                  swiss-health-optimizer.preview // live_simulator
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                Interactive Cost Sandbox
              </span>
            </div>

            {/* Controls */}
            <div className="bg-neutral-900/90 p-5 rounded-xl border border-neutral-800 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <label htmlFor="preview-expense-slider" className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Hypothetical Annual Covered Medical Bills:
                </label>
                <span className="text-base font-extrabold text-emerald-400 font-mono">
                  {formatCHF(previewExpense)}
                </span>
              </div>
              <input
                id="preview-expense-slider"
                type="range"
                min="0"
                max="8000"
                step="250"
                value={previewExpense}
                onChange={(e) => setPreviewExpense(Number(e.target.value))}
                className="w-full accent-[#E30613] h-2 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                <span>CHF 0 (Healthy year)</span>
                <span>CHF 2,000 (Checkups & meds)</span>
                <span>CHF 5,000+ (Specialist or clinic)</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Scenario A: CHF 300 */}
              <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-300">Scenario A (Baseline)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">Franchise CHF 300</span>
                </div>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Monthly Premium:</span>
                    <span className="font-semibold text-neutral-200">CHF 460.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Premium (×12):</span>
                    <span className="font-semibold text-neutral-200">{formatCHF(sampleLowFAnnual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Out-of-Pocket:</span>
                    <span className="font-semibold text-neutral-200">{formatCHF(lowF_OOP)}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                    <span>Estimated Total Cost:</span>
                    <span className="font-mono text-white">{formatCHF(lowFTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Scenario B: CHF 2,500 */}
              <div className="bg-neutral-900 p-5 rounded-xl border border-neutral-800 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-300">Scenario B (High Franchise)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-emerald-400">Franchise CHF 2,500</span>
                </div>
                <div className="space-y-2 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Monthly Premium:</span>
                    <span className="font-semibold text-neutral-200">CHF 345.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Premium (×12):</span>
                    <span className="font-semibold text-neutral-200">{formatCHF(sampleHighFAnnual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Out-of-Pocket:</span>
                    <span className="font-semibold text-neutral-200">{formatCHF(highF_OOP)}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                    <span>Estimated Total Cost:</span>
                    <span className="font-mono text-emerald-400">{formatCHF(highFTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic observation */}
            <div className="mt-5 p-3.5 bg-neutral-900/60 rounded-lg border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Educational Observation: </strong>
                {lowFTotal > highFTotal ? (
                  <span>
                    At this healthcare expense level ({formatCHF(previewExpense)}), Scenario B has a lower total annual cost by{' '}
                    <strong className="text-emerald-400 font-mono">{formatCHF(lowFTotal - highFTotal)}</strong> because the annual premium savings (CHF 1,380) outweigh the out-of-pocket medical bills paid.
                  </span>
                ) : (
                  <span>
                    At this healthcare expense level ({formatCHF(previewExpense)}), Scenario A has a lower total annual cost by{' '}
                    <strong className="text-emerald-400 font-mono">{formatCHF(highFTotal - lowFTotal)}</strong> because the higher franchise of Scenario B requires paying more medical bills out-of-pocket.
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                id="preview-cta-btn"
                onClick={() => handleCtaClick('live_preview')}
                className="px-6 py-3 bg-[#E30613] hover:bg-[#c90510] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>RUN THIS ANALYSIS WITH YOUR REAL NUMBERS →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 38. WHAT YOU GET */}
      <section className="py-16 sm:py-24 bg-[#F4F5F7] border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Complete Package</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
              More than a guide. A decision tool.
            </h2>
            <p className="mt-3 text-neutral-600 text-sm">
              Everything included in your CHF 19.90 one-time access:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: 'INTERACTIVE OPTIMIZER',
                desc: 'Translate monthly quotes and franchise tiers into total annual cost figures for your canton.',
              },
              {
                icon: Calculator,
                title: 'FRANCHISE CALCULATOR',
                desc: 'Compare risk trade-offs and calculate the exact mathematical break-even threshold.',
              },
              {
                icon: TrendingDown,
                title: 'ANNUAL COST SIMULATOR',
                desc: 'See how varying levels of medical use, doctor visits, and medications interact with premiums.',
              },
              {
                icon: Shield,
                title: 'ACCIDENT COVERAGE CHECK',
                desc: 'Identify whether employer UVG/LAA applies to prevent paying duplicate accident premiums.',
              },
              {
                icon: FileText,
                title: 'INSURANCE MODEL GUIDE',
                desc: 'Understand the pros, restrictions, and emergency exceptions for Standard, GP, HMO, and Telmed.',
              },
              {
                icon: Sparkles,
                title: '6 BONUS TOOLKIT ITEMS',
                desc: 'Includes printable worksheets, newcomer checklists, 10 due-diligence questions, and 4-language glossary.',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-neutral-200/90 shadow-xs flex flex-col"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#080A0D] text-sm tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 39. PRICING SECTION */}
      <section className="py-16 sm:py-24 bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-neutral-900 p-8 sm:p-10 shadow-xl relative">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-neutral-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇨🇭</span>
                  <span className="font-extrabold text-lg text-[#080A0D]">
                    SWISS HEALTH INSURANCE OPTIMIZER
                  </span>
                </div>
                <span className="text-xs font-bold text-[#E30613] tracking-wider uppercase">
                  {PRODUCT_CONFIG.editionYear} EDITION
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-500 uppercase font-bold block">One-Time Payment</span>
                <span className="text-3xl sm:text-4xl font-black text-[#080A0D] font-mono">
                  CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checklist of features */}
            <div className="py-6 space-y-3">
              {[
                'Interactive Swiss Health Insurance Optimizer',
                'Side-by-side Franchise & Care Model Comparison',
                'Annual Healthcare Cost & Break-Even Simulator',
                'Accident Coverage (UVG / LAA) Verification Tool',
                'Personalized Decision Checklist & Action Plan',
                'Print-friendly & Downloadable Assessment Report',
                'Bonus 1: Franchise Comparison Worksheet',
                'Bonus 2: Annual Healthcare Cost Planner',
                'Bonus 3: Insurance Comparison Checklist',
                'Bonus 4: New to Switzerland Starter Guide',
                'Bonus 5: Swiss Insurance Multilingual Glossary',
                'Bonus 6: 10 Questions Before Changing Your Setup',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-800">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-neutral-200 space-y-2.5">
              <a
                href={HOTMART_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                id="pricing-cta-btn"
                onClick={() => analytics.track('hotmart_checkout_clicked', { source: 'pricing_card' })}
                className="w-full py-4 bg-[#E30613] hover:bg-[#c90510] text-white text-base font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer no-underline text-center uppercase tracking-wide"
              >
                <span>BUY ON HOTMART — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <button
                type="button"
                id="pricing-quiz-btn"
                onClick={() => handleCtaClick('pricing_card_quiz')}
                className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Or Run Free Step-by-Step Assessment First →</span>
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-neutral-500 font-medium">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-neutral-400" />
                  No subscription
                </span>
                <span>•</span>
                <span>Encrypted Hotmart Checkout</span>
                <span>•</span>
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 40. FAQ SECTION */}
      <section className="py-16 sm:py-24 bg-[#F4F5F7] border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Frequently Asked Questions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
              Clear, Honest Answers
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              We believe in total transparency. Here is exactly what this tool is and is not.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_DATA.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-neutral-200/90 shadow-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#080A0D]">
                      {faq.question}
                    </span>
                    <span className="text-neutral-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 41. OFFICIAL DISCLAIMER & FOOTER */}
      <footer className="py-12 bg-white text-neutral-500 text-xs border-t border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 text-neutral-700 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-neutral-900 mb-1">
              <Shield className="w-4 h-4 text-[#E30613]" />
              <span>IMPORTANT LEGAL & REGULATORY INFORMATION</span>
            </div>
            <p className="text-[11px] leading-normal text-neutral-600">
              Swiss Health Insurance Optimizer provides general educational information and mathematical illustrations only.
              It does not constitute insurance, financial, legal or medical advice and does not recommend any insurer, policy,
              franchise or insurance model. Premiums, regulations, deadlines, coverage and insurer conditions can change.
              Always verify current information using official Swiss sources, Priminfo, FOPH/BAG and the relevant insurer before making insurance decisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 text-neutral-800 font-bold text-xs">
              <div className="w-5 h-5 rounded bg-[#E30613] text-white flex items-center justify-center text-[10px]">
                +
              </div>
              <span>Swiss Health Insurance Optimizer</span>
              <span className="text-neutral-400 font-normal">| {PRODUCT_CONFIG.editionYear} Edition</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <button
                type="button"
                onClick={onNavigateToSources}
                className="hover:text-neutral-900 transition-colors underline"
              >
                Official Sources & Methodology
              </button>
              <button
                type="button"
                onClick={onNavigateToBonuses}
                className="hover:text-neutral-900 transition-colors underline"
              >
                Bonus Toolkit
              </button>
              <a
                href={PRODUCT_CONFIG.officialPriminfoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-900 transition-colors inline-flex items-center gap-1"
              >
                <span>Priminfo (admin.ch)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="text-center text-[11px] text-neutral-400">
            © {PRODUCT_CONFIG.editionYear} Swiss Health Insurance Optimizer. Independent educational product not affiliated with the Swiss Federal Government.
          </div>
        </div>
      </footer>
    </div>
  );
};
