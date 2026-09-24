import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, FileText, Sliders, Calculator, Award, Sparkles } from 'lucide-react';
import { PRODUCT_CONFIG } from '../config/appConfig';

interface FullAccessWelcomeProps {
  onStartAssessment: () => void;
}

export const FullAccessWelcome: React.FC<FullAccessWelcomeProps> = ({ onStartAssessment }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      {/* Swiss Access Confirmation Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
        {/* Top Status Strip */}
        <div className="bg-emerald-600 px-6 py-3 text-white flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-100" />
            <span>FULL OPTIMIZER ACCESS ACTIVE</span>
          </div>
          <span className="font-mono text-[11px] bg-emerald-700/80 px-2.5 py-0.5 rounded-full">
            {PRODUCT_CONFIG.editionYear} Edition • Unlocked
          </span>
        </div>

        <div className="p-6 sm:p-10 lg:p-12 space-y-6">
          {/* Badge & Icon */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                Hotmart Club Member Access
              </span>
              <span className="text-xs text-neutral-500 font-medium">
                Personalized Dossier Generator
              </span>
            </div>
          </div>

          {/* Requested Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#080A0D] tracking-tight uppercase leading-tight">
            Welcome! Your access is ready. Complete the Optimizer to generate your personalized assessment.
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
            Your full access includes all analytical modules, the interactive healthcare cost simulator,
            UVG / LAA accident coverage verification, deductible break-even calculation, and the complete
            6-part Expat Decision Toolkit.
          </p>

          {/* Steps Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200/80 space-y-1">
              <span className="text-[11px] font-bold text-[#E30613] uppercase tracking-wider">Step 1</span>
              <h4 className="text-xs font-bold text-neutral-900">Profile & Canton</h4>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Select your canton of residence and age bracket (under 30 seconds).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200/80 space-y-1">
              <span className="text-[11px] font-bold text-[#E30613] uppercase tracking-wider">Step 2 & 3</span>
              <h4 className="text-xs font-bold text-neutral-900">Current vs Alternative</h4>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Enter your current monthly premium and test an alternative model quote.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F8F9FA] border border-neutral-200/80 space-y-1">
              <span className="text-[11px] font-bold text-[#E30613] uppercase tracking-wider">Step 4</span>
              <h4 className="text-xs font-bold text-neutral-900">Full Assessment</h4>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Instantly view and print your comprehensive report with zero locked areas.
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              type="button"
              id="btn-start-my-assessment"
              onClick={onStartAssessment}
              className="px-8 py-4 bg-[#E30613] hover:bg-[#c90510] text-white text-base font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wide group"
            >
              <span>START MY ASSESSMENT</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-xs text-neutral-500 text-center sm:text-left">
              Takes ~2 minutes • Answers saved locally on your device
            </span>
          </div>
        </div>

        {/* Included Modules Footer Summary */}
        <div className="bg-[#F8F9FA] border-t border-neutral-200 p-6 sm:p-8 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Included in your complete Personalized Assessment:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-neutral-700">
            {[
              'Current vs Alternative Setup',
              'Annual Premium Comparison',
              'Annual Cost Simulator',
              'Cost Trajectory & Breakdown',
              'Franchise Break-Even Analysis',
              'UVG / LAA Accident Check',
              'Care Model Analysis (HMO/Telmed)',
              'Due-Diligence Checklist & Deadlines',
              'Printable Official PDF Report',
              'Bonus: Franchise Comparison Worksheet',
              'Bonus: Annual Healthcare Cost Planner',
              'Bonus: Insurance Comparison Checklist',
              'Bonus: New to Switzerland Starter Guide',
              'Bonus: Swiss Insurance Multilingual Glossary',
              'Bonus: 10 Questions Before Changing Your Setup',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
