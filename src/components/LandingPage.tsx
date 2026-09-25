import React, { useState, useEffect, useRef } from 'react';
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
  X,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { PRODUCT_CONFIG } from '../config/appConfig';
import { FAQ_DATA } from '../data/faqData';
import { analytics } from '../services/analytics';
import { formatCHF } from '../lib/insuranceCalculations';
import { HOTMART_CHECKOUT_URL, redirectToHotmartCheckout } from '../config/payment';

interface LandingPageProps {
  onStartOptimizer?: () => void;
  onNavigateToBonuses?: () => void;
  onNavigateToSources?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartOptimizer,
  onNavigateToBonuses,
  onNavigateToSources,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [previewExpense, setPreviewExpense] = useState<number>(1500);
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);
  const [stickyDismissed, setStickyDismissed] = useState<boolean>(false);

  // Section observer refs for analytics
  const previewRef = useRef<HTMLElement | null>(null);
  const howItWorksRef = useRef<HTMLElement | null>(null);
  const benefitsRef = useRef<HTMLElement | null>(null);
  const pricingRef = useRef<HTMLElement | null>(null);
  const faqRef = useRef<HTMLElement | null>(null);

  // Track landing page view on mount
  useEffect(() => {
    analytics.track('landing_page_view', {
      edition: PRODUCT_CONFIG.editionYear,
      price: PRODUCT_CONFIG.priceCHF,
    });
  }, []);

  // Monitor scroll for mobile sticky bar
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      if (window.scrollY > 340) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection observer for section impression tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const sections = [
      { ref: previewRef, event: 'product_preview_view' as const },
      { ref: howItWorksRef, event: 'how_it_works_view' as const },
      { ref: benefitsRef, event: 'benefits_view' as const },
      { ref: pricingRef, event: 'pricing_view' as const },
      { ref: faqRef, event: 'faq_view' as const },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const match = sections.find((s) => s.ref.current === entry.target);
            if (match) {
              analytics.track(match.event);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach((s) => {
      if (s.ref.current) observer.observe(s.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Central checkout handler with exact funnel tracking
  const handleCheckout = (
    source:
      | 'hero_cta_click'
      | 'preview_cta_click'
      | 'how_it_works_cta_click'
      | 'benefits_cta_click'
      | 'pricing_cta_click'
      | 'sticky_cta_click'
      | 'faq_cta_click'
      | 'final_cta_click'
  ) => {
    analytics.track(source, {
      price: PRODUCT_CONFIG.priceCHF,
      currency: PRODUCT_CONFIG.currency,
      edition: PRODUCT_CONFIG.editionYear,
    });
    analytics.track('checkout_click', {
      source,
      price: PRODUCT_CONFIG.priceCHF,
      currency: PRODUCT_CONFIG.currency,
    });
    redirectToHotmartCheckout();
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Live preview calculations for interactive sandbox
  const sampleLowFPremium = 460; // CHF 300 franchise
  const sampleHighFPremium = 345; // CHF 2,500 franchise
  const sampleLowFAnnual = sampleLowFPremium * 12; // 5520
  const sampleHighFAnnual = sampleHighFPremium * 12; // 4140

  const lowF_OOP = Math.min(previewExpense, 300) + Math.min(Math.max(0, previewExpense - 300) * 0.1, 700);
  const highF_OOP = Math.min(previewExpense, 2500) + Math.min(Math.max(0, previewExpense - 2500) * 0.1, 700);
  const lowFTotal = sampleLowFAnnual + lowF_OOP;
  const highFTotal = sampleHighFAnnual + highF_OOP;

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-[#080A0D]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (REFINED FOR COMPACTNESS & INSTANT MOBILE VISIBILITY) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-16 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-extrabold tracking-wider uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-[#E30613]" />
            <span>SWISS HEALTH INSURANCE OPTIMIZER — 2026 / 2027 EDITION</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#080A0D] leading-[1.2] max-w-3xl mx-auto">
            Could Your Swiss Health Insurance Be Costing You More Than Necessary?
          </h1>

          {/* Subheadline */}
          <p className="mt-3.5 sm:mt-4 text-sm sm:text-base lg:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Review your premium, franchise, insurance model and accident coverage in about 5 minutes — and see what you should check before making changes.
          </p>

          {/* Audience Indicator */}
          <p className="mt-2 text-xs sm:text-sm font-semibold text-neutral-500">
            🇨🇭 Built for expats living in Switzerland.
          </p>

          {/* Direct Visible Price */}
          <div className="mt-5 flex flex-col items-center justify-center">
            <div className="inline-flex items-baseline gap-2 bg-neutral-50 border border-neutral-200 px-4 py-1.5 rounded-xl shadow-2xs">
              <span className="text-2xl sm:text-3xl font-black text-[#080A0D] font-mono tracking-tight">
                CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500 font-medium">
              One-time payment • Instant access • No subscription
            </p>
          </div>

          {/* Primary CTA + Secondary CTA */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <button
              type="button"
              id="hero-cta-btn"
              onClick={() => handleCheckout('hero_cta_click')}
              className="w-full min-h-[54px] sm:min-h-[58px] px-8 py-3.5 bg-[#E30613] hover:bg-[#c90510] active:scale-[0.99] text-white text-base font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => scrollToSection('whats-included')}
              className="text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer py-1"
            >
              <span>SEE WHAT'S INCLUDED ↓</span>
            </button>
          </div>

          {/* Reassurance Points */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-neutral-700">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Interactive tool</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Independent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>No subscription</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REAL PRODUCT PREVIEW (IMMEDIATELY AFTER HERO) */}
      {/* ========================================================================= */}
      <section
        id="product-preview"
        ref={previewRef}
        className="py-12 sm:py-16 bg-white border-b border-neutral-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#E30613]" />
              <span>REAL PRODUCT PREVIEW</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight">
              See Exactly What You Get
            </h2>
            <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
              The optimizer guides you through the key elements of your Swiss health insurance setup and helps you review important cost and coverage factors in one place.
            </p>
          </div>

          {/* Interactive Simulation Sandbox */}
          <div className="bg-[#0D1117] text-white rounded-2xl p-4 sm:p-7 shadow-xl border border-neutral-800">
            {/* Header bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-neutral-800 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                <span className="text-xs font-mono text-neutral-400 ml-1">
                  interactive_optimizer.preview
                </span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                Interactive Cost Sandbox
              </span>
            </div>

            {/* Slider Control */}
            <div className="bg-neutral-900/90 p-4 rounded-xl border border-neutral-800 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-2">
                <label htmlFor="preview-slider" className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  Hypothetical Annual Covered Medical Bills:
                </label>
                <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                  {formatCHF(previewExpense)}
                </span>
              </div>
              <input
                id="preview-slider"
                type="range"
                min="0"
                max="8000"
                step="250"
                value={previewExpense}
                onChange={(e) => setPreviewExpense(Number(e.target.value))}
                className="w-full accent-[#E30613] h-2.5 bg-neutral-800 rounded-lg cursor-pointer"
                aria-label="Medical expenses slider"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-1">
                <span>CHF 0 (Healthy)</span>
                <span>CHF 2,000 (Checkups)</span>
                <span>CHF 5,000+ (Specialist)</span>
              </div>
            </div>

            {/* Scenarios Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Scenario A: CHF 300 */}
              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
                  <span className="text-xs font-bold text-neutral-200">Standard Setup</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold">
                    Franchise CHF 300
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Annual Premium (12x):</span>
                    <span className="font-semibold text-neutral-200">{formatCHF(sampleLowFAnnual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Out-of-Pocket:</span>
                    <span className="font-semibold text-neutral-200">{formatCHF(lowF_OOP)}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                    <span>Total Annual Cost:</span>
                    <span className="font-mono text-white">{formatCHF(lowFTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Scenario B: CHF 2,500 */}
              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 relative">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
                  <span className="text-xs font-bold text-neutral-200">Alternative Setup</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 font-bold">
                    Franchise CHF 2,500
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-400">
                  <div className="flex justify-between">
                    <span>Annual Premium (12x):</span>
                    <span className="font-semibold text-neutral-200">{formatCHF(sampleHighFAnnual)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Out-of-Pocket:</span>
                    <span className="font-semibold text-neutral-200">{formatCHF(highF_OOP)}</span>
                  </div>
                  <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                    <span>Total Annual Cost:</span>
                    <span className="font-mono text-emerald-400">{formatCHF(highFTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational observation note */}
            <div className="mt-3.5 p-3 bg-neutral-900/80 rounded-lg border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Educational Insight: </strong>
                {lowFTotal > highFTotal ? (
                  <span>
                    At this expense level ({formatCHF(previewExpense)}), Scenario B has a lower total annual cost by{' '}
                    <strong className="text-emerald-400 font-mono">{formatCHF(lowFTotal - highFTotal)}</strong> because premium savings exceed medical bills.
                  </span>
                ) : (
                  <span>
                    At this expense level ({formatCHF(previewExpense)}), Scenario A has a lower total annual cost by{' '}
                    <strong className="text-emerald-400 font-mono">{formatCHF(highFTotal - lowFTotal)}</strong> due to higher out-of-pocket medical bills.
                  </span>
                )}
              </div>
            </div>

            {/* CTA Button After Preview */}
            <div className="mt-6 pt-5 border-t border-neutral-800 text-center">
              <button
                type="button"
                id="preview-cta-btn"
                onClick={() => handleCheckout('preview_cta_click')}
                className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-[#E30613] hover:bg-[#c90510] active:scale-[0.99] text-white text-sm sm:text-base font-extrabold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <p className="mt-2 text-[11px] text-neutral-400">
                One-time payment • Instant access • No subscription
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CORE PROBLEMS (CONCISE 4 PRIMARY DECISION POINTS) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-[#F4F5F7] border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight">
              Swiss Health Insurance Can Get Confusing Fast
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Expats often struggle with four critical decision factors:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Franchise Decisions */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] font-black flex items-center justify-center mb-2.5 text-xs">
                01
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-base mb-1">
                Franchise Decisions
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Understand how franchise choices affect your annual cost exposure.
              </p>
            </div>

            {/* 2. Insurance Models */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] font-black flex items-center justify-center mb-2.5 text-xs">
                02
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-base mb-1">
                Insurance Models
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Compare Standard, GP, HMO and Telmed more clearly.
              </p>
            </div>

            {/* 3. Accident Coverage */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] font-black flex items-center justify-center mb-2.5 text-xs">
                03
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-base mb-1">
                Accident Coverage
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Check whether accident coverage may already come through your employer.
              </p>
            </div>

            {/* 4. Annual Costs */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] font-black flex items-center justify-center mb-2.5 text-xs">
                04
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-base mb-1">
                Annual Costs
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Look beyond the monthly premium and understand the bigger picture.
              </p>
            </div>
          </div>

          {/* Connecting transition */}
          <div className="mt-7 p-4 bg-white rounded-xl border border-neutral-200 text-center max-w-xl mx-auto shadow-xs">
            <p className="text-xs sm:text-sm font-semibold text-neutral-800">
              The Swiss Health Insurance Optimizer brings these decisions together in one simple assessment.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW THE OPTIMIZER WORKS (3 SIMPLE STEPS) */}
      {/* ========================================================================= */}
      <section
        id="how-it-works"
        ref={howItWorksRef}
        className="py-12 sm:py-16 bg-white border-b border-neutral-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-9">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E30613]">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight mt-1">
              How the Optimizer Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="bg-[#F4F5F7] p-5 sm:p-6 rounded-xl border border-neutral-200 relative flex flex-col">
              <span className="text-xl font-black text-[#E30613] font-mono mb-2 block">
                01
              </span>
              <h3 className="font-extrabold text-[#080A0D] text-base mb-1.5">
                Enter Your Current Setup
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Premium, franchise, model, accident coverage and basic profile information.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#F4F5F7] p-5 sm:p-6 rounded-xl border border-neutral-200 relative flex flex-col">
              <span className="text-xl font-black text-[#E30613] font-mono mb-2 block">
                02
              </span>
              <h3 className="font-extrabold text-[#080A0D] text-base mb-1.5">
                Compare Your Scenario
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Review annualized costs and potential alternatives side by side.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#F4F5F7] p-5 sm:p-6 rounded-xl border border-neutral-200 relative flex flex-col">
              <span className="text-xl font-black text-[#E30613] font-mono mb-2 block">
                03
              </span>
              <h3 className="font-extrabold text-[#080A0D] text-base mb-1.5">
                See What to Check Next
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Get clear flags, questions and an action checklist before making changes.
              </p>
            </div>
          </div>

          {/* CTA Button After How It Works */}
          <div className="mt-9 text-center">
            <button
              type="button"
              id="how-it-works-cta-btn"
              onClick={() => handleCheckout('how_it_works_cta_click')}
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-[#E30613] hover:bg-[#c90510] active:scale-[0.99] text-white text-sm sm:text-base font-extrabold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <p className="mt-2 text-[11px] text-neutral-500 font-medium">
              One-time payment • Instant access • No subscription
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. OUTCOMES / BENEFITS (WHAT YOU'LL KNOW AFTER USING THE OPTIMIZER) */}
      {/* ========================================================================= */}
      <section
        id="benefits"
        ref={benefitsRef}
        className="py-12 sm:py-16 bg-[#F4F5F7] border-b border-neutral-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-9">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E30613]">
              Clarity & Decision Support
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight mt-1">
              What You'll Know After Using the Optimizer
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Clear outcomes instead of complicated insurance jargon:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Benefit 1 */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center mb-2.5">
                <Calculator className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-sm mb-1">
                Your annual premium cost
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                See your monthly premium translated into an annual figure.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center mb-2.5">
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-sm mb-1">
                Your potential maximum healthcare exposure
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Understand franchise + co-payment implications more clearly.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center mb-2.5">
                <TrendingDown className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-sm mb-1">
                Whether another setup deserves investigation
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Compare different scenarios side by side.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center mb-2.5">
                <HelpCircle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-sm mb-1">
                Questions to ask before switching
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Know what to confirm with Priminfo or an insurer.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center mb-2.5">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-sm mb-1">
                Accident coverage considerations
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Check whether employer UVG/LAA coverage may affect your setup.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex flex-col">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E30613] flex items-center justify-center mb-2.5">
                <FileText className="w-4 h-4 stroke-[2.5]" />
              </div>
              <h3 className="font-extrabold text-[#080A0D] text-sm mb-1">
                A clear next-step checklist
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Leave with practical actions instead of more confusion.
              </p>
            </div>
          </div>

          {/* CTA Button After Benefits Section */}
          <div className="mt-9 text-center">
            <button
              type="button"
              id="benefits-cta-btn"
              onClick={() => handleCheckout('benefits_cta_click')}
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-[#E30613] hover:bg-[#c90510] active:scale-[0.99] text-white text-sm sm:text-base font-extrabold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <p className="mt-2 text-[11px] text-neutral-500 font-medium">
              One-time payment • Instant access • No subscription
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EVERYTHING INCLUDED (PERCEIVED VALUE WITHOUT FAKE PRICING) */}
      {/* ========================================================================= */}
      <section id="whats-included" className="py-12 sm:py-16 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-9">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E30613]">
              Complete Toolkit
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight mt-1">
              Everything Included
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Immediate digital access to the full suite upon purchase:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                title: 'Interactive Swiss Health Insurance Optimizer',
                desc: 'Step-by-step simulator to input and compare your health insurance setup.',
                icon: Compass,
              },
              {
                title: 'Franchise Comparison Worksheet',
                desc: 'Calculate break-even expenditure between CHF 300 and CHF 2,500 options.',
                icon: Calculator,
              },
              {
                title: 'Annual Healthcare Cost Planner',
                desc: 'Forecast combined costs of premiums, deductibles, and coinsurance limits.',
                icon: TrendingDown,
              },
              {
                title: 'Insurance Comparison Checklist',
                desc: 'Key items to verify before committing to an alternative policy model.',
                icon: CheckCircle2,
              },
              {
                title: 'New to Switzerland Starter Guide',
                desc: 'Practical overview of statutory deadlines and mandatory coverage rules.',
                icon: BookOpen,
              },
              {
                title: 'Swiss Insurance Multilingual Glossary',
                desc: 'German, French and English terms decoded into plain language.',
                icon: Layers,
              },
              {
                title: '10 Questions to Ask Before Changing Your Setup',
                desc: 'Targeted questions to confirm directly with an insurer or broker.',
                icon: HelpCircle,
              },
              {
                title: 'Printable Assessment Report',
                desc: 'Clean summary format of your personal scenarios for offline reference.',
                icon: FileText,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F4F5F7] p-4 rounded-xl border border-neutral-200 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white text-[#E30613] flex items-center justify-center shrink-0 border border-neutral-200 shadow-2xs mt-0.5">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#080A0D] text-xs sm:text-sm">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5 leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PRICING CARD (STRONG HIERARCHY, CREDIBILITY & ZERO DARK PATTERNS) */}
      {/* ========================================================================= */}
      <section
        id="pricing"
        ref={pricingRef}
        className="py-14 sm:py-20 bg-[#F4F5F7] border-b border-neutral-200"
      >
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border-2 border-neutral-900 p-6 sm:p-9 shadow-xl relative">
            {/* Header */}
            <div className="pb-5 border-b border-neutral-200 text-center sm:text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E30613] block mb-1">
                SWISS HEALTH INSURANCE OPTIMIZER
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#080A0D] tracking-tight">
                2026 / 2027 EDITION
              </h2>

              <div className="mt-4 flex items-baseline justify-center sm:justify-start gap-2.5">
                <span className="text-3xl sm:text-4xl font-black text-[#080A0D] font-mono">
                  CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-neutral-600 uppercase tracking-wide">
                  ONE-TIME PAYMENT
                </span>
              </div>
            </div>

            {/* Checklist */}
            <div className="py-5 space-y-2.5 text-xs sm:text-sm text-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="font-semibold">Interactive optimizer</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="font-semibold">Full toolkit (all 6 companion worksheets)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="font-semibold">Instant digital access</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="font-semibold">No subscription</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="font-semibold">Independent tool</span>
              </div>
            </div>

            {/* Primary Purchase CTA */}
            <div className="pt-4 border-t border-neutral-200">
              <button
                type="button"
                id="pricing-cta-btn"
                onClick={() => handleCheckout('pricing_cta_click')}
                className="w-full min-h-[54px] sm:min-h-[58px] py-4 bg-[#E30613] hover:bg-[#c90510] active:scale-[0.99] text-white text-base sm:text-lg font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="mt-3.5 text-center text-xs text-neutral-500 font-medium">
                Secure checkout • One-time payment • No subscription
              </div>

              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-center gap-2 text-[11px] text-neutral-400">
                <Lock className="w-3 h-3" />
                <span>Encrypted checkout via Hotmart</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FAQ SECTION (ANSWERING PURCHASE OBJECTIONS FIRST) */}
      {/* ========================================================================= */}
      <section
        id="faq"
        ref={faqRef}
        className="py-12 sm:py-16 bg-white border-b border-neutral-200"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-9">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E30613]">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight mt-1">
              Clear, Honest Answers
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-600">
              What you need to know before getting instant access:
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_DATA.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#F4F5F7] rounded-xl border border-neutral-200 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-extrabold text-xs sm:text-sm text-[#080A0D]">
                      {faq.question}
                    </span>
                    <span className="text-neutral-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-4.5 pb-4 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-200/60 pt-2.5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Button After FAQ */}
          <div className="mt-9 text-center">
            <button
              type="button"
              id="faq-cta-btn"
              onClick={() => handleCheckout('faq_cta_click')}
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 bg-[#E30613] hover:bg-[#c90510] active:scale-[0.99] text-white text-sm sm:text-base font-extrabold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
            <p className="mt-2 text-[11px] text-neutral-500 font-medium">
              One-time payment • Instant access • No subscription
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. INDEPENDENT BY DESIGN (CREDIBILITY SECTION) */}
      {/* ========================================================================= */}
      <section className="py-10 sm:py-14 bg-white border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-neutral-700" />
            <span>Independent by Design</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#080A0D] tracking-tight">
            Independent by Design
          </h2>
          <div className="mt-3.5 p-5 bg-[#F4F5F7] rounded-xl border border-neutral-200 text-left text-xs sm:text-sm text-neutral-600 space-y-2 leading-relaxed">
            <p>
              <strong>Swiss Health Insurance Optimizer</strong> is an independent educational and decision-support tool.
            </p>
            <p>
              It is not an insurance company, broker or Swiss government service.
            </p>
            <p>
              Users should verify current premiums, coverage conditions and official rules with their insurer and relevant official Swiss sources (such as <strong>Priminfo</strong>) before making insurance changes.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL PURCHASE SECTION */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#F4F5F7] border-b border-neutral-200 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight">
            Understand Your Swiss Health Insurance Before Making Your Next Decision
          </h2>
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
            Review your current setup, compare important factors and see what you should verify next.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-black text-[#080A0D] font-mono">
              CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-neutral-500 uppercase mt-1">
              One-time payment
            </span>
          </div>

          <div className="mt-6 max-w-md mx-auto">
            <button
              type="button"
              id="final-cta-btn"
              onClick={() => handleCheckout('final_cta_click')}
              className="w-full min-h-[54px] sm:min-h-[58px] px-8 py-4 bg-[#E30613] hover:bg-[#c90510] active:scale-[0.99] text-white text-base sm:text-lg font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <p className="mt-3 text-xs text-neutral-500 font-medium">
            Instant access • No subscription
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. MOBILE STICKY PURCHASE BAR */}
      {/* ========================================================================= */}
      {showStickyBar && !stickyDismissed && (
        <aside
          aria-label="Quick purchase bar"
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-t border-neutral-300 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] px-4 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] transition-transform duration-200 ease-out"
        >
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            {/* Title & Price */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-extrabold text-[#080A0D] truncate">
                Swiss Health Optimizer
              </span>
              <span className="text-xs font-mono font-bold text-[#E30613]">
                CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="mobile-sticky-cta-btn"
                onClick={() => handleCheckout('sticky_cta_click')}
                className="min-h-[46px] px-4 py-2.5 bg-[#E30613] hover:bg-[#c90510] active:scale-[0.99] text-white text-xs font-black rounded-lg shadow-sm uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <span>GET ACCESS</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => setStickyDismissed(true)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-md cursor-pointer"
                aria-label="Dismiss purchase bar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Safe bottom padding for mobile when sticky bar is active */}
      <div className="md:hidden h-16" />
    </div>
  );
};
