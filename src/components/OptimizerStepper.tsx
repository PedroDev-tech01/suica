import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import {
  AgeGroup,
  Employment8Hours,
  EmploymentStatus,
  HealthcareUsage,
  InsuranceModel,
  AccidentCoverage,
  InsurancePlan,
  UserProfile,
} from '../types/insurance';
import { SWISS_CANTONS } from '../data/cantons';
import { SWISS_KVG_RULES } from '../config/appConfig';
import { TermExplainerButton } from './TermExplainerModal';
import { formatCHF } from '../lib/insuranceCalculations';
import { analytics } from '../services/analytics';

interface OptimizerStepperProps {
  profile?: UserProfile;
  initialProfile?: UserProfile;
  currentPlan?: InsurancePlan;
  initialCurrentPlan?: InsurancePlan;
  altPlan?: InsurancePlan;
  initialAltPlan?: InsurancePlan;
  usage?: HealthcareUsage;
  initialUsage?: HealthcareUsage;
  onUpdateProfile?: (profile: UserProfile) => void;
  onUpdateCurrentPlan?: (plan: InsurancePlan) => void;
  onUpdateAltPlan?: (plan: InsurancePlan) => void;
  onUpdateUsage?: (usage: HealthcareUsage) => void;
  onComplete: (
    profile: UserProfile,
    currentPlan: InsurancePlan,
    altPlan: InsurancePlan,
    usage: HealthcareUsage
  ) => void;
  onCancel?: () => void;
  onSaveProgress?: () => void;
  onOpenTermExplainer?: (termId: string) => void;
}

type StepKey = 'welcome' | 'profile' | 'current_plan' | 'usage' | 'alternative';

const DEFAULT_PROFILE: UserProfile = {
  canton: 'ZH',
  municipality: 'Zurich',
  ageGroup: '26+',
  employmentStatus: 'employee',
  employment8Hours: 'yes',
  accidentCoveredByEmployer: 'yes',
};

const DEFAULT_CURRENT_PLAN: InsurancePlan = {
  insurerName: 'Assura',
  monthlyPremium: 380,
  franchise: 2500,
  model: 'standard',
  accidentCoverage: 'without',
};

const DEFAULT_ALT_PLAN: InsurancePlan = {
  insurerName: 'Sanitas',
  monthlyPremium: 310,
  franchise: 2500,
  model: 'telmed',
  accidentCoverage: 'without',
};

const DEFAULT_USAGE: HealthcareUsage = {
  expectedAnnualDoctorVisits: 2,
  takesRegularPrescriptionMeds: 'no',
  plannedHospitalOrMaternity: 'no',
  hasChronicCondition: 'no',
  availableLiquidEmergencySavings: 3500,
};

export const OptimizerStepper: React.FC<OptimizerStepperProps> = ({
  profile: propProfile,
  initialProfile,
  currentPlan: propCurrentPlan,
  initialCurrentPlan,
  altPlan: propAltPlan,
  initialAltPlan,
  usage: propUsage,
  initialUsage,
  onUpdateProfile,
  onUpdateCurrentPlan,
  onUpdateAltPlan,
  onUpdateUsage,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<StepKey>('welcome');

  // Form states with guaranteed non-null fallbacks
  const [profile, setProfileState] = useState<UserProfile>(() => ({
    ...DEFAULT_PROFILE,
    ...(initialProfile || propProfile || {}),
  }));

  const [currentPlan, setCurrentPlanState] = useState<InsurancePlan>(() => ({
    ...DEFAULT_CURRENT_PLAN,
    ...(initialCurrentPlan || propCurrentPlan || {}),
  }));

  const [altPlan, setAltPlanState] = useState<InsurancePlan>(() => ({
    ...DEFAULT_ALT_PLAN,
    ...(initialAltPlan || propAltPlan || {}),
  }));

  const [usage, setUsageState] = useState<HealthcareUsage>(() => {
    const passed = initialUsage || propUsage;
    if (passed && typeof passed === 'object') {
      return { ...DEFAULT_USAGE, ...passed };
    }
    return DEFAULT_USAGE;
  });

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    onUpdateProfile?.(newProfile);
  };

  const setCurrentPlan = (newPlan: InsurancePlan) => {
    setCurrentPlanState(newPlan);
    onUpdateCurrentPlan?.(newPlan);
  };

  const setAltPlan = (newPlan: InsurancePlan) => {
    setAltPlanState(newPlan);
    onUpdateAltPlan?.(newPlan);
  };

  const setUsage = (newUsage: HealthcareUsage) => {
    setUsageState(newUsage);
    onUpdateUsage?.(newUsage);
  };

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isChild = (profile?.ageGroup || '26+') === '0-18';
  const availableFranchises = isChild
    ? SWISS_KVG_RULES.childFranchises
    : SWISS_KVG_RULES.adultFranchises;

  // Validation routines per step
  const validateProfile = (): boolean => {
    const errs: Record<string, string> = {};
    if (!profile.canton) errs.canton = 'Please select your canton of residence.';
    if (profile.zipCode && !/^[1-9][0-9]{3}$/.test(profile.zipCode.trim())) {
      errs.zipCode = 'Swiss ZIP codes must be 4 digits (e.g. 8001, 1201).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCurrentPlan = (): boolean => {
    const errs: Record<string, string> = {};
    if (!currentPlan.monthlyPremium || currentPlan.monthlyPremium <= 0) {
      errs.monthlyPremium = 'Please enter your current monthly basic insurance premium in CHF.';
    } else if (currentPlan.monthlyPremium > 1500) {
      errs.monthlyPremium = 'Monthly basic premium seems unusually high (standard range is CHF 200–800). Please check your policy.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateAlternative = (): boolean => {
    const errs: Record<string, string> = {};
    if (!altPlan.monthlyPremium || altPlan.monthlyPremium <= 0) {
      errs.altMonthlyPremium = 'Please enter an alternative monthly premium quote from Priminfo or your insurer.';
    } else if (altPlan.monthlyPremium > 1500) {
      errs.altMonthlyPremium = 'Alternative premium seems unusually high. Please verify the quote.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goToNext = () => {
    if (currentStep === 'welcome') {
      analytics.track('optimizer_started');
      setCurrentStep('profile');
    } else if (currentStep === 'profile') {
      if (!validateProfile()) return;
      analytics.track('optimizer_step_1_completed', { canton: profile.canton, age: profile.ageGroup });
      analytics.track('profile_completed', { canton: profile.canton, age: profile.ageGroup });
      setCurrentStep('current_plan');
    } else if (currentStep === 'current_plan') {
      if (!validateCurrentPlan()) return;
      analytics.track('optimizer_step_2_completed', { premium: currentPlan.monthlyPremium, franchise: currentPlan.franchise });
      analytics.track('current_plan_completed', { premium: currentPlan.monthlyPremium, franchise: currentPlan.franchise });
      setCurrentStep('usage');
    } else if (currentStep === 'usage') {
      analytics.track('optimizer_step_3_completed');
      analytics.track('comparison_started', { usage });
      setCurrentStep('alternative');
    } else if (currentStep === 'alternative') {
      if (!validateAlternative()) return;
      analytics.track('optimizer_step_4_completed');
      analytics.track('results_viewed');
      onComplete(profile, currentPlan, altPlan, usage);
    }
  };

  const goToPrev = () => {
    setErrors({});
    if (currentStep === 'profile') setCurrentStep('welcome');
    else if (currentStep === 'current_plan') setCurrentStep('profile');
    else if (currentStep === 'usage') setCurrentStep('current_plan');
    else if (currentStep === 'alternative') setCurrentStep('usage');
  };

  // Stepper Header Progress Items
  const stepsList: { key: StepKey; label: string }[] = [
    { key: 'profile', label: 'PROFILE' },
    { key: 'current_plan', label: 'CURRENT PLAN' },
    { key: 'usage', label: 'HEALTHCARE USAGE' },
    { key: 'alternative', label: 'COMPARE' },
  ];

  const getStepIndex = (s: StepKey) => {
    switch (s) {
      case 'welcome': return -1;
      case 'profile': return 0;
      case 'current_plan': return 1;
      case 'usage': return 2;
      case 'alternative': return 3;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* 14. PROGRESS INDICATOR (When past welcome screen) */}
      {currentStep !== 'welcome' && (
        <div className="mb-8">
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 text-[11px] font-bold tracking-wider text-neutral-500">
            {stepsList.map((st, idx) => {
              const currentIdx = getStepIndex(currentStep);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div key={st.key} className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-[#E30613] text-white shadow-xs'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={isCurrent ? 'text-[#080A0D] font-extrabold' : isPast ? 'text-neutral-700' : ''}>
                    {st.label}
                  </span>
                  {idx < stepsList.length - 1 && (
                    <span className="text-neutral-300 mx-1">→</span>
                  )}
                </div>
              );
            })}
            <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
              <span>→</span>
              <span>RESULTS</span>
            </div>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#E30613] h-full transition-all duration-300"
              style={{
                width: `${((getStepIndex(currentStep) + 1) / stepsList.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* STEP CONTAINER CARD */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 sm:p-10">
        {/* 14. WELCOME ONBOARDING */}
        {currentStep === 'welcome' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E30613] text-white flex items-center justify-center mx-auto mb-6 shadow-md">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="4" width="4" height="16" rx="0.5" />
                <rect x="4" y="10" width="16" height="4" rx="0.5" />
              </svg>
            </div>

            <div className="inline-block px-3 py-1 bg-red-50 text-[#E30613] font-bold text-xs uppercase tracking-wider rounded-full mb-3">
              {SWISS_KVG_RULES.authority} Framework
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#080A0D] tracking-tight uppercase">
              Swiss Health Insurance Optimizer
            </h2>
            <p className="mt-3 text-base text-neutral-600 max-w-md mx-auto">
              Understand your setup in about 5 minutes.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto text-xs text-neutral-700">
              <div className="p-3 bg-[#F4F5F7] rounded-xl border border-neutral-200">
                <span className="font-bold block text-neutral-900 mb-1">1. Your Profile</span>
                Canton, age bracket, and employment accident check.
              </div>
              <div className="p-3 bg-[#F4F5F7] rounded-xl border border-neutral-200">
                <span className="font-bold block text-neutral-900 mb-1">2. Cost Breakdown</span>
                Annualize your monthly premium and identify out-of-pocket maximums.
              </div>
              <div className="p-3 bg-[#F4F5F7] rounded-xl border border-neutral-200">
                <span className="font-bold block text-neutral-900 mb-1">3. Clear Flags</span>
                Actionable questions to verify on official Priminfo.
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                id="btn-start-check"
                onClick={goToNext}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#E30613] hover:bg-[#c90510] text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>START MY CHECK →</span>
              </button>
              <button
                type="button"
                onClick={() => (onCancel ? onCancel() : setCurrentStep('welcome'))}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 py-2 px-4 cursor-pointer"
              >
                Return to Overview
              </button>
            </div>
          </div>
        )}

        {/* 15. SCREEN — YOUR PROFILE */}
        {currentStep === 'profile' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Step 1 of 4</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
                Let's start with the basics.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Swiss health insurance regulations, approved premiums, and subsidies depend on your location and age.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Canton */}
              <div>
                <label htmlFor="select-canton" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Canton of Residence *
                </label>
                <select
                  id="select-canton"
                  value={profile.canton}
                  onChange={(e) => {
                    setProfile({ ...profile, canton: e.target.value });
                    if (errors.canton) setErrors({ ...errors, canton: '' });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                >
                  <option value="">Select your Swiss Canton...</option>
                  {SWISS_CANTONS.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                {errors.canton && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.canton}</span>
                  </p>
                )}
              </div>

              {/* ZIP Code */}
              <div>
                <label htmlFor="input-zip" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  ZIP Code (Optional)
                </label>
                <input
                  id="input-zip"
                  type="text"
                  maxLength={4}
                  placeholder="e.g. 8001 or 1201"
                  value={profile.zipCode}
                  onChange={(e) => {
                    setProfile({ ...profile, zipCode: e.target.value });
                    if (errors.zipCode) setErrors({ ...errors, zipCode: '' });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.zipCode}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Age Group *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['0-18', '19-25', '26+'] as AgeGroup[]).map((grp) => (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, ageGroup: grp });
                      // Adjust franchise if child switched
                      if (grp === '0-18' && currentPlan.franchise > 600) {
                        setCurrentPlan({ ...currentPlan, franchise: 0 });
                        setAltPlan({ ...altPlan, franchise: 0 });
                      } else if (grp !== '0-18' && currentPlan.franchise < 300) {
                        setCurrentPlan({ ...currentPlan, franchise: 300 });
                        setAltPlan({ ...altPlan, franchise: 2500 });
                      }
                    }}
                    className={`py-3 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      profile.ageGroup === grp
                        ? 'border-[#E30613] bg-red-50/60 text-[#E30613] shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <span className="block text-sm">{grp}</span>
                    <span className="text-[10px] text-neutral-500 font-normal">
                      {grp === '0-18' ? 'Children (Franchise 0–600)' : grp === '19-25' ? 'Young Adults (~22% discount)' : 'Adults (Full Tariff)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Employment Status */}
            <div>
              <label htmlFor="select-employment" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Employment Status *
              </label>
              <select
                id="select-employment"
                value={profile.employmentStatus}
                onChange={(e) =>
                  setProfile({ ...profile, employmentStatus: e.target.value as EmploymentStatus })
                }
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
              >
                <option value="employee">Employed / Salaried Worker</option>
                <option value="self-employed">Self-Employed (Independent)</option>
                <option value="student">Student / In Training</option>
                <option value="unemployed">Unemployed (RAV / ALV)</option>
                <option value="other">Other / Homemaker</option>
              </select>
            </div>

            {/* 8 Hours per week question */}
            <div className="p-4 bg-[#F4F5F7] rounded-xl border border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#080A0D]">
                  Are you employed at least 8 hours per week by the same employer?
                </span>
                <TermExplainerButton termId="unfallversicherung" label="Accident Insurance UVG" />
              </div>
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                This helps determine whether your employer covers non-occupational accidents under the Federal Accident Insurance Act (UVG / LAA).
              </p>
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {(['yes', 'no', 'unsure'] as Employment8Hours[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setProfile({ ...profile, employment8Hours: val })}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                      profile.employment8Hours === val
                        ? 'border-[#E30613] bg-red-50 text-[#E30613]'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    {val === 'yes' ? 'Yes (8+ hrs/wk)' : val === 'no' ? 'No (<8 hrs or none)' : "I'm not sure"}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-neutral-500 italic pt-1">
                * Note: This answer does not automatically conclude legal requirements; it is used only to flag accident coverage as something worth checking.
              </p>
            </div>
          </div>
        )}

        {/* 16. CURRENT PLAN */}
        {currentStep === 'current_plan' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Step 2 of 4</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
                Your Current Insurance
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Take these details directly from your current health insurance policy or monthly invoice.
              </p>
            </div>

            {/* Current Insurer (Optional) */}
            <div>
              <label htmlFor="input-insurer-name" className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Current Insurer Name (Optional)
              </label>
              <input
                id="input-insurer-name"
                type="text"
                placeholder="e.g. Swica, Helsana, CSS, Sanitas, Concordia..."
                value={currentPlan.insurerName || ''}
                onChange={(e) => setCurrentPlan({ ...currentPlan, insurerName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
              />
            </div>

            {/* Monthly Premium */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="input-monthly-premium" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Monthly Basic Insurance Premium *
                </label>
                <div className="flex items-center">
                  <span className="text-xs text-neutral-500">Per person</span>
                  <TermExplainerButton termId="praemie" label="Insurance Premium" />
                </div>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 font-bold text-sm">
                  CHF
                </span>
                <input
                  id="input-monthly-premium"
                  type="number"
                  step="0.05"
                  min="0"
                  placeholder="e.g. 465.30"
                  value={currentPlan.monthlyPremium || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setCurrentPlan({ ...currentPlan, monthlyPremium: isNaN(val) ? 0 : val });
                    if (errors.monthlyPremium) setErrors({ ...errors, monthlyPremium: '' });
                  }}
                  className="w-full pl-14 pr-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                />
              </div>
              {errors.monthlyPremium ? (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.monthlyPremium}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-neutral-500">
                  Annual premium: <strong className="text-neutral-800">{formatCHF(currentPlan.monthlyPremium * 12)}</strong> / year
                </p>
              )}
            </div>

            {/* Franchise */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="select-current-franchise" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Current Franchise (Annual Deductible) *
                </label>
                <TermExplainerButton termId="franchise" label="Franchise" />
              </div>
              <select
                id="select-current-franchise"
                value={currentPlan.franchise}
                onChange={(e) => setCurrentPlan({ ...currentPlan, franchise: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none font-mono"
              >
                {availableFranchises.map((f) => (
                  <option key={f} value={f}>
                    CHF {f.toLocaleString('de-CH')} {f === (isChild ? 0 : 300) ? '(Standard minimum)' : f === (isChild ? 600 : 2500) ? '(Maximum deductible)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Care Model */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="select-current-model" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Insurance Care Model *
                </label>
                <TermExplainerButton termId="hausarztmodell" label="Insurance Models" />
              </div>
              <select
                id="select-current-model"
                value={currentPlan.model}
                onChange={(e) => setCurrentPlan({ ...currentPlan, model: e.target.value as InsuranceModel })}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
              >
                <option value="standard">Standard Model (Free choice of any doctor)</option>
                <option value="family_doctor">Family Doctor / GP Model (Hausarzt)</option>
                <option value="hmo">HMO Model (Health center group practice)</option>
                <option value="telmed">Telmed Model (Mandatory 24/7 phone consultation first)</option>
                <option value="other">Other / Special Network Model</option>
                <option value="unsure">I don't know / Not sure</option>
              </select>
            </div>

            {/* Accident Coverage */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Accident Coverage in Basic Health Insurance *
                </label>
                <TermExplainerButton termId="unfallversicherung" label="Accident Coverage" />
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'included', label: 'Included in Policy' },
                  { key: 'excluded', label: 'Excluded (Have Employer UVG)' },
                  { key: 'unsure', label: "I don't know" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCurrentPlan({ ...currentPlan, accidentCoverage: item.key as AccidentCoverage })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      currentPlan.accidentCoverage === item.key
                        ? 'border-[#E30613] bg-red-50 text-[#E30613]'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 18. HEALTHCARE USAGE */}
        {currentStep === 'usage' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Step 3 of 4</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
                How much healthcare do you generally use?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Select your broad anticipated medical usage for a typical 12-month calendar year.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  key: 'low',
                  title: 'LOW',
                  tagline: '“I rarely visit doctors and have few healthcare expenses.”',
                  detail: 'Expected medical expenses under CHF 500 / year. Primarily preventive checkups or occasional prescriptions.',
                  franchiseNote: 'High franchise (CHF 2,500) often yields lower total costs when medical usage is low.',
                },
                {
                  key: 'medium',
                  title: 'MEDIUM',
                  tagline: '“I use healthcare several times during a typical year.”',
                  detail: 'Expected medical expenses around CHF 1,000–2,000 / year. Regular GP visits, physiotherapy, or occasional specialist consults.',
                  franchiseNote: 'This is the typical break-even transition territory where out-of-pocket bills offset premium savings.',
                },
                {
                  key: 'high',
                  title: 'HIGH',
                  tagline: '“I regularly have healthcare expenses.”',
                  detail: 'Expected medical expenses exceeding CHF 2,500–3,000 / year. Chronic prescriptions, ongoing therapies, or scheduled surgery.',
                  franchiseNote: 'Low franchise (CHF 300) almost always provides a lower total cost cap when spending is high.',
                },
              ].map((card) => {
                const isSelected = usage === card.key;
                return (
                  <div
                    key={card.key}
                    onClick={() => setUsage(card.key as HealthcareUsage)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#E30613] bg-red-50/40 shadow-xs'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-extrabold ${isSelected ? 'text-[#E30613]' : 'text-neutral-900'}`}>
                          {card.title}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#E30613] bg-[#E30613]' : 'border-neutral-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-neutral-800 italic mb-2">
                        {card.tagline}
                      </p>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {card.detail}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-200/60 text-[10px] text-neutral-500 font-medium">
                      {card.franchiseNote}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 bg-[#F4F5F7] rounded-xl border border-neutral-200 text-xs text-neutral-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <span>
                <strong>Educational Notice: </strong>
                This is only used to illustrate different cost scenarios. It is not a medical assessment or diagnostic tool.
              </span>
            </div>
          </div>
        )}

        {/* 20. ALTERNATIVE SCENARIO */}
        {currentStep === 'alternative' && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#E30613]">Step 4 of 4</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#080A0D] tracking-tight uppercase mt-1">
                Compare Another Setup
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Use Priminfo or an insurer quote to find a real alternative premium, then enter it below.
              </p>
            </div>

            {/* Priminfo Helper Banner */}
            <div className="p-4 bg-red-50/70 border border-red-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#E30613] block">Need real alternative quotes for your canton?</span>
                <span className="text-neutral-700">
                  Open Switzerland's official federal comparison tool (Priminfo) in a new tab to find approved premiums.
                </span>
              </div>
              <a
                href={SWISS_KVG_RULES.lastVerified ? 'https://www.priminfo.admin.ch/' : '#'}
                target="_blank"
                rel="noopener noreferrer"
                id="link-priminfo-step4"
                className="px-3.5 py-2 bg-white text-[#E30613] font-bold rounded-lg border border-red-200 shadow-2xs hover:bg-neutral-50 shrink-0 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Open Priminfo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Alternative Monthly Premium */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="input-alt-premium" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Alternative Monthly Premium Quote *
                </label>
                <span className="text-xs text-neutral-500">Per person</span>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 font-bold text-sm">
                  CHF
                </span>
                <input
                  id="input-alt-premium"
                  type="number"
                  step="0.05"
                  min="0"
                  placeholder="e.g. 345.00"
                  value={altPlan.monthlyPremium || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAltPlan({ ...altPlan, monthlyPremium: isNaN(val) ? 0 : val });
                    if (errors.altMonthlyPremium) setErrors({ ...errors, altMonthlyPremium: '' });
                  }}
                  className="w-full pl-14 pr-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
                />
              </div>
              {errors.altMonthlyPremium ? (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.altMonthlyPremium}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-neutral-500">
                  Annual premium: <strong className="text-neutral-800">{formatCHF(altPlan.monthlyPremium * 12)}</strong> / year
                </p>
              )}
            </div>

            {/* Alternative Franchise */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="select-alt-franchise" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Alternative Franchise *
                </label>
                <TermExplainerButton termId="franchise" label="Franchise" />
              </div>
              <select
                id="select-alt-franchise"
                value={altPlan.franchise}
                onChange={(e) => setAltPlan({ ...altPlan, franchise: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none font-mono"
              >
                {availableFranchises.map((f) => (
                  <option key={f} value={f}>
                    CHF {f.toLocaleString('de-CH')} {f === (isChild ? 0 : 300) ? '(Standard minimum)' : f === (isChild ? 600 : 2500) ? '(Maximum deductible)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Alternative Model */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="select-alt-model" className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Alternative Care Model *
                </label>
                <TermExplainerButton termId="telmed" label="Telmed / HMO Models" />
              </div>
              <select
                id="select-alt-model"
                value={altPlan.model}
                onChange={(e) => setAltPlan({ ...altPlan, model: e.target.value as InsuranceModel })}
                className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613] outline-none"
              >
                <option value="standard">Standard Model (Free choice of doctor)</option>
                <option value="family_doctor">Family Doctor / GP Model (Hausarzt)</option>
                <option value="hmo">HMO Model (Health center practice)</option>
                <option value="telmed">Telmed Model (Mandatory phone consultation first)</option>
                <option value="other">Other / Special Network Model</option>
              </select>
            </div>

            {/* Alternative Accident Coverage */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Alternative Accident Coverage *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { key: 'included', label: 'Include Accident' },
                  { key: 'excluded', label: 'Exclude (Covered by Employer UVG)' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setAltPlan({ ...altPlan, accidentCoverage: item.key as AccidentCoverage })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      altPlan.accidentCoverage === item.key
                        ? 'border-[#E30613] bg-red-50 text-[#E30613]'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION BUTTONS */}
        {currentStep !== 'welcome' && (
          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between gap-3">
            <button
              type="button"
              id="stepper-btn-back"
              onClick={goToPrev}
              className="px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              id="stepper-btn-next"
              onClick={goToNext}
              className="px-6 py-3 bg-[#E30613] hover:bg-[#c90510] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{currentStep === 'alternative' ? 'COMPARE SCENARIOS →' : 'Next Step'}</span>
              {currentStep !== 'alternative' && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
