import React, { useEffect, useState } from 'react';
import {
  Check,
  Lock,
  ArrowRight,
  Shield,
  FileText,
  Calculator,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  CreditCard,
  Building2,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  UserProfile,
  InsurancePlan,
  HealthcareUsage,
  ComparisonResult,
} from '../types/insurance';
import { formatCHF, getModelName } from '../lib/insuranceCalculations';
import { PRODUCT_CONFIG } from '../config/appConfig';
import { analytics } from '../services/analytics';
import { HOTMART_CHECKOUT_URL, redirectToHotmartCheckout } from '../config/payment';

interface ResultPreviewPaywallProps {
  profile: UserProfile;
  currentPlan: InsurancePlan;
  altPlan: InsurancePlan;
  usage: HealthcareUsage;
  calculation: ComparisonResult;
  onUnlockClick: () => void;
  onEditSetup: () => void;
  hasAbandonedCheckout?: boolean;
}

export const ResultPreviewPaywall: React.FC<ResultPreviewPaywallProps> = ({
  profile,
  currentPlan,
  altPlan,
  usage,
  calculation,
  onUnlockClick,
  onEditSetup,
  hasAbandonedCheckout = false,
}) => {
  // Fire analytics on mount
  useEffect(() => {
    analytics.track('result_preview_viewed', {
      canton: profile.canton,
      age: profile.ageGroup,
    });
    analytics.track('paywall_viewed', {
      canton: profile.canton,
      age: profile.ageGroup,
      price: PRODUCT_CONFIG.priceCHF,
    });
  }, [profile]);

  // Annual premium calculations for the preview
  const currentAnnualPremium = currentPlan.monthlyPremium * 12;
  const altAnnualPremium = altPlan.monthlyPremium * 12;
  const annualPremiumDiff = Math.abs(currentAnnualPremium - altAnnualPremium);
  const isAltCheaperOnPremiums = altAnnualPremium < currentAnnualPremium;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* 1. Abandoned Checkout Reassurance Banner */}
      {hasAbandonedCheckout && (
        <div
          id="abandoned-checkout-banner"
          className="p-4 sm:p-5 bg-amber-50 border border-amber-300 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Your Assessment Is Still Ready
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-amber-950 mt-0.5">
                Continue where you left off and unlock your complete personalized analysis.
              </h2>
              <p className="text-xs text-amber-900/90 mt-0.5">
                All your questionnaire answers and calculations have been preserved.
              </p>
            </div>
          </div>
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-resume-checkout"
            onClick={() => {
              analytics.track('hotmart_checkout_clicked', { url: HOTMART_CHECKOUT_URL });
            }}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-[#E30613] hover:bg-[#c90510] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer no-underline uppercase tracking-wider"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>UNLOCK MY REPORT — CHF 19.90</span>
          </a>
        </div>
      )}

      {/* 2. Top Header with Metadata */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-[#E30613] text-xs font-bold tracking-wide uppercase">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#E30613]" />
          <span>PERSONALIZED ASSESSMENT</span>
          <span className="text-neutral-300">•</span>
          <span className="text-neutral-600 font-mono">
            Canton: {profile.canton} • Age: {profile.ageGroup}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#080A0D] tracking-tight uppercase leading-tight">
          Your Personalized Swiss Health Insurance Assessment Is Ready.
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
          We analyzed your current setup against the alternative scenario you entered.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onEditSetup}
            className="text-xs text-neutral-500 hover:text-neutral-900 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Modify Your Questionnaire Inputs</span>
          </button>
        </div>
      </div>

      {/* 3. LIMITED RESULT PREVIEW (Visible Setup Comparison) */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-neutral-100 pb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E30613]">
              Preliminary Comparison
            </span>
            <h2 className="text-lg font-extrabold text-[#080A0D] uppercase">
              Current Setup vs. Alternative Scenario
            </h2>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">
            Based on your entries for Canton {profile.canton}
          </span>
        </div>

        {/* 2 Side-by-side cards, cleanly stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Current Setup Card */}
          <div className="bg-[#F8F9FA] rounded-xl border border-neutral-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Current Setup
              </span>
              <span className="text-xs font-mono font-bold text-neutral-900 px-2 py-0.5 bg-white border border-neutral-200 rounded">
                {currentPlan.insurerName}
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-600">Monthly Premium:</span>
                <span className="font-bold text-neutral-900 font-mono">
                  {formatCHF(currentPlan.monthlyPremium)} / mo
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-600">Franchise (Deductible):</span>
                <span className="font-bold text-neutral-900 font-mono">
                  CHF {currentPlan.franchise}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-600">Insurance Model:</span>
                <span className="font-bold text-neutral-900">
                  {getModelName(currentPlan.model)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-600">Accident Coverage:</span>
                <span className="font-bold text-neutral-900 capitalize">
                  {currentPlan.accidentCoverage} accident
                </span>
              </div>
            </div>
          </div>

          {/* Alternative Setup Card */}
          <div className="bg-[#F8F9FA] rounded-xl border border-neutral-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#E30613] uppercase tracking-wider">
                Alternative Scenario
              </span>
              <span className="text-xs font-mono font-bold text-[#E30613] px-2 py-0.5 bg-red-50 border border-red-200 rounded">
                {altPlan.insurerName}
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-600">Monthly Premium:</span>
                <span className="font-bold text-neutral-900 font-mono">
                  {formatCHF(altPlan.monthlyPremium)} / mo
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-600">Franchise (Deductible):</span>
                <span className="font-bold text-neutral-900 font-mono">
                  CHF {altPlan.franchise}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60">
                <span className="text-neutral-600">Insurance Model:</span>
                <span className="font-bold text-neutral-900">
                  {getModelName(altPlan.model)}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-600">Accident Coverage:</span>
                <span className="font-bold text-neutral-900 capitalize">
                  {altPlan.accidentCoverage} accident
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Highlighted Difference Callout */}
        <div className="p-4 sm:p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-blue-950">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
              We found a difference between your two setups.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <span className="text-xs font-semibold text-blue-900">
              Potential annual premium difference identified:
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono text-blue-950">
              {formatCHF(annualPremiumDiff)}
              <span className="text-xs font-normal text-blue-800 ml-1">/ year</span>
            </span>
          </div>

          <div className="pt-2 border-t border-blue-200/60 text-xs text-blue-900/90 space-y-1">
            <p className="font-semibold text-[11px] uppercase tracking-wide text-blue-800">
              Annual premium difference
            </p>
            <p className="leading-relaxed">
              Your complete report analyzes how medical expenses, franchise and out-of-pocket costs may change this comparison.
            </p>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONVERSION PAYWALL CARD */}
      <div
        id="main-paywall-card"
        className="relative bg-gradient-to-b from-white to-[#FAFAFA] rounded-2xl border-2 border-[#E30613]/80 p-6 sm:p-10 shadow-xl overflow-hidden"
      >
        {/* Top ribbon */}
        <div className="absolute top-0 right-0 bg-[#E30613] text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider shadow-xs">
          {PRODUCT_CONFIG.editionYear} Edition • Complete Access
        </div>

        <div className="max-w-2xl mx-auto text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-[#E30613] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase">
            Unlock Your Complete Assessment
          </h2>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Get your complete personalized analysis, interactive cost simulator, verification checklist and all 6 bonus decision tools.
          </p>

          {/* Pricing Box */}
          <div className="pt-4 pb-2">
            <div className="inline-block p-4 sm:px-8 bg-neutral-900 text-white rounded-2xl shadow-md text-center">
              <span className="text-xs uppercase tracking-widest text-neutral-400 font-bold block">
                Total One-Time Investment
              </span>
              <div className="flex items-baseline justify-center gap-1.5 mt-1">
                <span className="text-3xl sm:text-4xl font-black font-mono text-white">
                  CHF 19.90
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-bold block mt-1">
                One-time payment • No subscription
              </span>
            </div>
          </div>
        </div>

        {/* 10 Value Checklist Points */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 text-center">
            What is included in your full unlocked dossier:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto text-xs text-neutral-800">
            {[
              'Full Annual Cost Comparison across low, moderate, and high expense scenarios',
              'Interactive Healthcare Cost Simulator with custom expense slider',
              'Mathematical Break-Even Analysis for your franchise',
              'Employer Accident Coverage (UVG / LAA) Verification',
              'Insurance Model Restrictions & Gatekeeping Rules Breakdown',
              'Canton-Specific Assessment based on your profile',
              'Personalized Action Checklist & Important Deadlines',
              'Exportable & Printable PDF Dossier',
              'Complete Bonus Toolkit with all 6 decision guides',
              'Instant lifetime access to your calculation results',
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA & Trust Badges */}
        <div className="mt-8 max-w-md mx-auto space-y-3">
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="paywall-btn-unlock"
            onClick={() => {
              analytics.track('hotmart_checkout_clicked', { url: HOTMART_CHECKOUT_URL });
            }}
            className="w-full py-4 bg-[#E30613] hover:bg-[#c90510] text-white text-base font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer no-underline text-center uppercase tracking-wide"
          >
            <Lock className="w-4 h-4" />
            <span>UNLOCK MY FULL REPORT — CHF 19.90</span>
          </a>

          <div className="text-center space-y-1">
            <p className="text-xs font-bold text-neutral-800">
              One-time payment • Instant access • No subscription
            </p>
            <p className="text-[11px] text-neutral-500">
              Independent educational tool • Secure Hotmart checkout
            </p>
          </div>

          {/* Payment Method Badges */}
          <div className="pt-3 border-t border-neutral-200/70 flex flex-wrap items-center justify-center gap-3 text-neutral-500 text-[11px]">
            <span className="flex items-center gap-1 font-semibold text-neutral-700">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Credit Card</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1 font-semibold text-neutral-700">
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>TWINT</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="flex items-center gap-1 font-semibold text-neutral-700">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>PostFinance</span>
            </span>
            <span className="text-neutral-300">•</span>
            <span className="font-semibold text-neutral-700"> Apple Pay</span>
          </div>

          <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Hotmart encrypted checkout</span>
          </div>
        </div>
      </div>

      {/* 5. LOCKED HIGH-VALUE RESULTS TEASER GRID */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Locked Modules
          </span>
          <h2 className="text-xl font-extrabold text-[#080A0D] uppercase mt-0.5">
            Content Waiting Inside Your Complete Report
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Unlock to reveal deep calculations tailored to your exact entries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Full Annual Cost Comparison',
              desc: 'Total estimated annual costs across minimum, moderate and high healthcare expense scenarios.',
              icon: Calculator,
            },
            {
              title: 'Interactive Healthcare Cost Simulator',
              desc: 'Custom medical spending slider to test your exact projected bills against both plans.',
              icon: Sliders,
            },
            {
              title: 'Franchise & Break-Even Analysis',
              desc: 'Mathematical break-even analysis showing where franchise spending advantages flip.',
              icon: Shield,
            },
            {
              title: 'Accident Coverage Check — UVG / LAA',
              desc: 'Audit of duplicate accident coverage if employed ≥ 8 hours per week with mandatory employer UVG.',
              icon: CheckCircle2,
            },
            {
              title: 'Care Model Analysis',
              desc: 'Restrictions, primary doctor protocols, and referral rules for Telmed, HMO, and Standard models.',
              icon: AlertTriangle,
            },
            {
              title: 'Personalized Due-Diligence Flags',
              desc: 'Crucial checks for cancellation deadlines (Nov 30), insurer reserves, and deductible timing.',
              icon: FileText,
            },
            {
              title: 'Personalized Action Plan',
              desc: 'Step-by-step checklist tailored to your situation to ensure seamless execution.',
              icon: Check,
            },
            {
              title: 'Printable Personalized Report',
              desc: 'Clean, printer-friendly PDF dossier of your complete personalized comparison.',
              icon: Download,
            },
            {
              title: '6 Bonus Decision Tools',
              desc: 'Full access to all 6 decision tools: Franchise Comparison Worksheet, Annual Cost Planner, Insurance Comparison Checklist, New to Switzerland Starter Guide, Multilingual Glossary, and 10 Questions Before Changing Your Setup.',
              icon: Sparkles,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="relative bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between overflow-hidden group hover:border-neutral-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full">
                      <Lock className="w-3 h-3 text-neutral-400" />
                      <span>Locked</span>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400 font-medium">
                  <span>CHF 19.90 one-time</span>
                  <a
                    href={HOTMART_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      analytics.track('hotmart_checkout_clicked', { url: HOTMART_CHECKOUT_URL });
                    }}
                    className="text-[#E30613] font-bold hover:underline cursor-pointer flex items-center gap-0.5 no-underline"
                  >
                    <span>Unlock</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Partially Blurred Report Preview Background (Desktop visual depth) */}
      <div className="relative rounded-2xl border border-neutral-200 bg-white p-6 overflow-hidden">
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="p-3 rounded-full bg-white shadow-md border border-neutral-200 text-[#E30613] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#080A0D]">
            Full Personalized Assessment Dossier Below
          </h3>
          <p className="text-xs text-neutral-600 max-w-md mt-1 mb-4">
            Unlock your full personalized comparison and download your exportable summary.
          </p>
          <a
            href={HOTMART_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              analytics.track('hotmart_checkout_clicked', { url: HOTMART_CHECKOUT_URL });
            }}
            className="px-6 py-2.5 bg-[#E30613] hover:bg-[#c90510] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer no-underline uppercase tracking-wide"
          >
            UNLOCK FULL REPORT — CHF 19.90
          </a>
        </div>

        {/* Faint preview layout underneath blur */}
        <div className="opacity-30 filter blur-[1px] select-none pointer-events-none space-y-4">
          <div className="h-6 w-48 bg-neutral-300 rounded"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 bg-neutral-200 rounded-xl"></div>
            <div className="h-24 bg-neutral-200 rounded-xl"></div>
            <div className="h-24 bg-neutral-200 rounded-xl"></div>
          </div>
          <div className="h-40 bg-neutral-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};
