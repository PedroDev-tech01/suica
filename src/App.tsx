import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import {
  AppView,
  HealthcareUsage,
  InsurancePlan,
  UserProfile,
} from './types/insurance';
import { calculateComparison } from './lib/insuranceCalculations';
import { dbService, StoredInsuranceState } from './services/database';
import { analytics } from './services/analytics';
import { HOTMART_CHECKOUT_URL, redirectToHotmartCheckout } from './config/payment';
import { PRODUCT_CONFIG } from './config/appConfig';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';

// Lazy-loaded views to optimize initial load time and minimize bundle size
const OptimizerStepper = lazy(() =>
  import('./components/OptimizerStepper').then((m) => ({ default: m.OptimizerStepper }))
);
const ResultPreviewPaywall = lazy(() =>
  import('./components/ResultPreviewPaywall').then((m) => ({ default: m.ResultPreviewPaywall }))
);
const FullAccessWelcome = lazy(() =>
  import('./components/FullAccessWelcome').then((m) => ({ default: m.FullAccessWelcome }))
);
const ResultsDashboard = lazy(() =>
  import('./components/ResultsDashboard').then((m) => ({ default: m.ResultsDashboard }))
);
const PrintableReport = lazy(() =>
  import('./components/PrintableReport').then((m) => ({ default: m.PrintableReport }))
);
const BonusToolkitView = lazy(() =>
  import('./components/BonusToolkitView').then((m) => ({ default: m.BonusToolkitView }))
);
const SourcesAndMethodologyView = lazy(() =>
  import('./components/SourcesAndMethodologyView').then((m) => ({ default: m.SourcesAndMethodologyView }))
);
const TermExplainerModal = lazy(() =>
  import('./components/TermExplainerModal').then((m) => ({ default: m.TermExplainerModal }))
);
const DeleteDataModal = lazy(() =>
  import('./components/DeleteDataModal').then((m) => ({ default: m.DeleteDataModal }))
);

import { Check, ExternalLink, Loader2 } from 'lucide-react';

/**
 * Helper to determine if the current browser URL corresponds to the full-access route.
 * Supports /optimizer-access, /#optimizer-access, /#?route=optimizer-access, etc.
 */
function checkIsOptimizerAccessRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  return (
    path.includes('/optimizer-access') ||
    path.endsWith('optimizer-access') ||
    hash.includes('optimizer-access') ||
    search.includes('optimizer-access') ||
    search.includes('route=optimizer-access') ||
    search.includes('access=full') ||
    search.includes('access=true') ||
    search.includes('access=1')
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [hasPaidUserAccess, setHasPaidUserAccess] = useState<boolean>(false);

  // App Core State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    canton: 'ZH',
    municipality: 'Zurich',
    ageGroup: '26+',
    employmentStatus: 'employee',
    employment8Hours: 'yes',
    accidentCoveredByEmployer: 'yes',
  });

  const [currentPlan, setCurrentPlan] = useState<InsurancePlan>({
    insurerName: 'Assura',
    monthlyPremium: 380,
    franchise: 2500,
    model: 'standard',
    accidentCoverage: 'without',
  });

  const [altPlan, setAltPlan] = useState<InsurancePlan>({
    insurerName: 'Sanitas',
    monthlyPremium: 310,
    franchise: 2500,
    model: 'telmed',
    accidentCoverage: 'without',
  });

  const [usage, setUsage] = useState<HealthcareUsage>({
    expectedAnnualDoctorVisits: 2,
    takesRegularPrescriptionMeds: 'no',
    plannedHospitalOrMaternity: 'no',
    hasChronicCondition: 'no',
    availableLiquidEmergencySavings: 3500,
  });

  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [explainerTermId, setExplainerTermId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // Show auto-dismissing toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to persist current questionnaire state locally in the user's browser
  const persistStateLocally = (
    updatedProfile?: UserProfile,
    updatedCurrent?: InsurancePlan,
    updatedAlt?: InsurancePlan,
    updatedUsage?: HealthcareUsage,
    completedFlag?: boolean
  ) => {
    const p = updatedProfile || userProfile;
    const cp = updatedCurrent || currentPlan;
    const ap = updatedAlt || altPlan;
    const u = updatedUsage || usage;

    dbService.saveInsuranceState({
      profile: p,
      currentPlan: cp,
      altPlan: ap,
      usage: u,
      checklist: checklistState,
      hasCompletedQuestionnaire: completedFlag ?? dbService.hasSavedQuestionnaire(),
      updatedAt: new Date().toISOString(),
    });
  };

  // Restore saved data from localStorage helper
  const restoreSavedState = (saved: StoredInsuranceState) => {
    if (saved.profile && typeof saved.profile === 'object') {
      setUserProfile((prev) => ({
        ...prev,
        ...saved.profile,
        canton: saved.profile?.canton || prev.canton || 'ZH',
        ageGroup: saved.profile?.ageGroup || prev.ageGroup || '26+',
        employmentStatus: saved.profile?.employmentStatus || prev.employmentStatus || 'employee',
        employment8Hours: saved.profile?.employment8Hours || prev.employment8Hours || 'yes',
      }));
    }
    if (saved.currentPlan && typeof saved.currentPlan === 'object') {
      setCurrentPlan((prev) => ({ ...prev, ...saved.currentPlan }));
    }
    if (saved.altPlan && typeof saved.altPlan === 'object') {
      setAltPlan((prev) => ({ ...prev, ...saved.altPlan }));
    }
    if (saved.usage && typeof saved.usage === 'object') {
      setUsage((prev) => ({ ...prev, ...saved.usage }));
    }
    if (saved.checklist && typeof saved.checklist === 'object') {
      setChecklistState(saved.checklist);
    }
  };

  // Lifecycle: Check route and initialize on mount
  useEffect(() => {
    analytics.track('app_loaded');

    const isAccessRoute = checkIsOptimizerAccessRoute();
    const wasFullAccessGranted = dbService.isFullAccessGranted();
    const hasAccess = isAccessRoute || wasFullAccessGranted;

    // Load any existing saved data from local storage
    const saved = dbService.loadInsuranceState();
    if (saved) {
      restoreSavedState(saved);
    }

    if (hasAccess) {
      setHasPaidUserAccess(true);
      dbService.setFullAccessGranted(true);

      const hasSavedAnswers = dbService.hasSavedQuestionnaire();
      if (hasSavedAnswers) {
        // Automatically restore questionnaire answers and regenerate personalized report
        setCurrentView('results');
        analytics.track('full_report_viewed', { source: 'optimizer-access-restored' });
        showToast('Welcome to your Full Assessment! Your report has been generated.');
      } else {
        // Show the required welcome screen when no questionnaire data exists yet
        setCurrentView('full-access-welcome');
      }
    } else {
      setHasPaidUserAccess(false);
      // Public optimizer visitor: check if user directly opened a hash view or start on landing
      setCurrentView('landing');
    }
  }, []);

  // Listen for browser navigation changes (e.g. back/forward or typing in URL)
  useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsOptimizerAccessRoute()) {
        setHasPaidUserAccess(true);
        dbService.setFullAccessGranted(true);
        const hasSavedAnswers = dbService.hasSavedQuestionnaire();
        if (hasSavedAnswers) {
          const saved = dbService.loadInsuranceState();
          if (saved) restoreSavedState(saved);
          setCurrentView('results');
        } else {
          setCurrentView('full-access-welcome');
        }
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleSaveProgress = () => {
    persistStateLocally();
    analytics.track('progress_saved');
    showToast('Your answers have been securely saved locally in your browser.');
  };

  const handleConfirmDeleteAll = () => {
    dbService.clearAllData();
    setUserProfile({
      canton: 'ZH',
      municipality: 'Zurich',
      ageGroup: '26+',
      employmentStatus: 'employee',
      employment8Hours: 'yes',
      accidentCoveredByEmployer: 'yes',
    });
    setCurrentPlan({
      insurerName: '',
      monthlyPremium: 380,
      franchise: 2500,
      model: 'standard',
      accidentCoverage: 'without',
    });
    setAltPlan({
      insurerName: '',
      monthlyPremium: 310,
      franchise: 2500,
      model: 'telmed',
      accidentCoverage: 'without',
    });
    setChecklistState({});

    if (hasPaidUserAccess) {
      setCurrentView('full-access-welcome');
    } else {
      setCurrentView('landing');
    }

    analytics.track('data_cleared');
    showToast('All locally stored answers and data have been completely erased.');
  };

  const handleToggleChecklist = (id: string) => {
    setChecklistState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      dbService.saveInsuranceState({
        profile: userProfile,
        currentPlan,
        altPlan,
        usage,
        checklist: next,
        hasCompletedQuestionnaire: dbService.hasSavedQuestionnaire(),
        updatedAt: new Date().toISOString(),
      });
      return next;
    });
  };

  // Real-time memoized calculation of comparative metrics
  const calculationResult = useMemo(
    () => calculateComparison(currentPlan, altPlan, userProfile),
    [currentPlan, altPlan, userProfile]
  );

  // Unified router
  const navigateTo = (view: AppView) => {
    if (view === 'optimizer-access') {
      setHasPaidUserAccess(true);
      dbService.setFullAccessGranted(true);
      if (dbService.hasSavedQuestionnaire()) {
        const saved = dbService.loadInsuranceState();
        if (saved) restoreSavedState(saved);
        setCurrentView('results');
      } else {
        setCurrentView('full-access-welcome');
      }
      try {
        window.history.pushState(null, '', '/optimizer-access');
      } catch {
        // Ignore
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Route guard for public optimizer:
    // If user has not gained full access, protect results and report views with the paywall preview
    if ((view === 'results' || view === 'report' || view === 'print-report') && !hasPaidUserAccess) {
      setCurrentView('preview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    analytics.track('view_changed', { view });
    if (view === 'results') {
      analytics.track('full_report_viewed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F5F7] text-[#080A0D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#101722] text-white px-4 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-neutral-700 animate-in fade-in slide-from-bottom-2"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        hasSavedData={Boolean(userProfile?.canton && currentPlan?.monthlyPremium > 0)}
        isFullAccess={hasPaidUserAccess}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {/* VIEW: Landing Page */}
        {currentView === 'landing' && (
          <LandingPage
            onStartOptimizer={() => navigateTo('optimizer')}
            onNavigateToBonuses={() => {
              analytics.track('bonus_toolkit_opened');
              navigateTo('bonuses');
            }}
            onNavigateToSources={() => navigateTo('sources')}
          />
        )}

        {/* Lazy-loaded Sub-Views with Accessible Fallback */}
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex flex-col items-center justify-center py-20 px-4">
              <div className="flex items-center gap-3 text-neutral-600">
                <Loader2 className="w-5 h-5 animate-spin text-[#E30613]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Loading view...
                </span>
              </div>
            </div>
          }
        >
          {/* VIEW: Full Access Welcome Screen (when opening /optimizer-access without saved questionnaire data) */}
          {currentView === 'full-access-welcome' && (
            <FullAccessWelcome
              onStartAssessment={() => {
                analytics.track('optimizer_started', { source: 'full_access_welcome' });
                navigateTo('optimizer');
              }}
            />
          )}

          {/* VIEW: Interactive Optimizer Stepper (Steps 1 to 4) */}
          {currentView === 'optimizer' && (
            <div className="py-8">
              <OptimizerStepper
                profile={userProfile}
                initialProfile={userProfile}
                currentPlan={currentPlan}
                initialCurrentPlan={currentPlan}
                altPlan={altPlan}
                initialAltPlan={altPlan}
                usage={usage}
                initialUsage={usage}
                onUpdateProfile={(p) => {
                  setUserProfile(p);
                  persistStateLocally(p, undefined, undefined, undefined);
                }}
                onUpdateCurrentPlan={(cp) => {
                  setCurrentPlan(cp);
                  persistStateLocally(undefined, cp, undefined, undefined);
                }}
                onUpdateAltPlan={(ap) => {
                  setAltPlan(ap);
                  persistStateLocally(undefined, undefined, ap, undefined);
                }}
                onUpdateUsage={(u) => {
                  setUsage(u);
                  persistStateLocally(undefined, undefined, undefined, u);
                }}
                onComplete={(updatedProfile, updatedCurrentPlan, updatedAltPlan, updatedUsage) => {
                  const p = updatedProfile || userProfile;
                  const cp = updatedCurrentPlan || currentPlan;
                  const ap = updatedAltPlan || altPlan;
                  const u = updatedUsage || usage;

                  if (updatedProfile) setUserProfile(p);
                  if (updatedCurrentPlan) setCurrentPlan(cp);
                  if (updatedAltPlan) setAltPlan(ap);
                  if (updatedUsage) setUsage(u);

                  // Save answers to localStorage
                  persistStateLocally(p, cp, ap, u, true);

                  // If user is already on full access route, navigate straight to complete report
                  if (hasPaidUserAccess) {
                    analytics.track('full_report_viewed');
                    navigateTo('results');
                  } else {
                    // Public optimizer: navigate to locked preview paywall
                    navigateTo('preview');
                  }
                }}
                onCancel={() => {
                  if (hasPaidUserAccess) {
                    if (dbService.hasSavedQuestionnaire()) {
                      navigateTo('results');
                    } else {
                      navigateTo('full-access-welcome');
                    }
                  } else {
                    navigateTo('landing');
                  }
                }}
                onSaveProgress={handleSaveProgress}
                onOpenTermExplainer={(termId) => setExplainerTermId(termId)}
              />
            </div>
          )}

          {/* VIEW: Result Preview & Paywall (Public Optimizer: Steps 1-4 completed) */}
          {currentView === 'preview' && (
            <ResultPreviewPaywall
              profile={userProfile}
              currentPlan={currentPlan}
              altPlan={altPlan}
              usage={usage}
              calculation={calculationResult}
              checkoutUrl={HOTMART_CHECKOUT_URL}
              onUnlockClick={() => {
                redirectToHotmartCheckout();
              }}
              onEditSetup={() => navigateTo('optimizer')}
            />
          )}

          {/* VIEW: Complete Personalized Assessment (Full Optimizer: Unlocked) */}
          {currentView === 'results' && (
            <ResultsDashboard
              profile={userProfile}
              currentPlan={currentPlan}
              altPlan={altPlan}
              usage={usage}
              calculation={calculationResult}
              checklistState={checklistState}
              paymentConfirmed={true}
              onToggleChecklistItem={handleToggleChecklist}
              onPrintReport={() => navigateTo('report')}
              onEditScenario={() => navigateTo('optimizer')}
              onNavigateToBonuses={() => {
                analytics.track('bonus_toolkit_opened');
                navigateTo('bonuses');
              }}
            />
          )}

          {/* VIEW: Official Printable Dossier */}
          {currentView === 'report' && (
            <PrintableReport
              profile={userProfile}
              currentPlan={currentPlan}
              altPlan={altPlan}
              calculation={calculationResult}
              checklistState={checklistState}
              onBack={() => navigateTo('results')}
            />
          )}

          {/* VIEW: Bonus Toolkit (6 Interactive Tools) */}
          {currentView === 'bonuses' && (
            <BonusToolkitView
              onBackToOptimizer={() => {
                if (hasPaidUserAccess && dbService.hasSavedQuestionnaire()) {
                  navigateTo('results');
                } else {
                  navigateTo('optimizer');
                }
              }}
            />
          )}

          {/* VIEW: Sources & Methodology */}
          {currentView === 'sources' && (
            <SourcesAndMethodologyView
              onBackToOptimizer={() => {
                if (hasPaidUserAccess && dbService.hasSavedQuestionnaire()) {
                  navigateTo('results');
                } else {
                  navigateTo('optimizer');
                }
              }}
            />
          )}
        </Suspense>
      </main>

      {/* Global Comprehensive Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-16 text-neutral-600 text-xs no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand & Independence */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#E30613] flex items-center justify-center text-white text-[10px] font-bold">
                  +
                </span>
                <span className="font-extrabold text-[#080A0D] tracking-tight">
                  SWISS HEALTH INSURANCE OPTIMIZER — {PRODUCT_CONFIG.editionYear} EDITION
                </span>
              </div>
              <p className="text-neutral-500 leading-relaxed max-w-md">
                An independent educational software product. We do not sell insurance, accept commissions or kickbacks from health insurers, or operate as an insurance broker or intermediary.
              </p>
              <div className="text-[11px] text-neutral-400">
                Official data sources: Federal Office of Public Health (FOPH/BAG) & Priminfo.
              </div>
            </div>

            {/* Quick Navigation */}
            <div>
              <span className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider block mb-3">
                Toolkit & Reference
              </span>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('landing')}
                    className="hover:text-neutral-900 cursor-pointer"
                  >
                    Home Overview
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('optimizer')}
                    className="hover:text-neutral-900 cursor-pointer"
                  >
                    Scenario Simulator
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('bonuses')}
                    className="hover:text-neutral-900 cursor-pointer"
                  >
                    6 Decision Worksheets
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateTo('sources')}
                    className="hover:text-neutral-900 cursor-pointer"
                  >
                    Sources & Methodology
                  </button>
                </li>
                <li>
                  <a
                    href={PRODUCT_CONFIG.officialPriminfoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E30613] inline-flex items-center gap-1"
                  >
                    <span>Priminfo Official (FOPH)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Privacy & Session Actions */}
            <div>
              <span className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider block mb-3">
                Privacy & Data
              </span>
              <ul className="space-y-2 text-neutral-600">
                <li>
                  <button
                    type="button"
                    onClick={handleSaveProgress}
                    className="hover:text-neutral-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Save My Progress</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                  >
                    Delete My Data (Clear Storage)
                  </button>
                </li>
                <li>
                  <span className="text-[11px] text-neutral-400 block pt-1">
                    All questionnaire inputs remain stored exclusively on your device.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Strict Statutory Legal Disclaimer */}
          <div className="pt-6 border-t border-neutral-100 text-[11px] text-neutral-400 leading-relaxed space-y-2">
            <p>
              <strong>Legal Disclaimer:</strong> Swiss Health Insurance Optimizer provides general educational information and calculation tools only. It does not constitute insurance, financial, legal, or medical advice and does not recommend any specific insurance company, policy, franchise, or care model.
            </p>
            <p>
              Swiss health insurance rules (KVG/LAMal, UVG/LAA) are established by federal statute and administered by the Federal Office of Public Health (FOPH/BAG). Always verify current premiums and policy terms with the relevant insurer and official Swiss government sources (priminfo.admin.ch) before making any insurance decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-neutral-100">
              <span>© {PRODUCT_CONFIG.editionYear} Swiss Health Insurance Optimizer. Independent Educational Tool.</span>
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals with Suspense fallback */}
      <Suspense fallback={null}>
        {/* Glossary Term Explainer Modal */}
        <TermExplainerModal
          termId={explainerTermId}
          isOpen={explainerTermId !== null}
          onClose={() => setExplainerTermId(null)}
        />

        {/* Local Data Deletion Confirmation Modal */}
        <DeleteDataModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirmDelete={handleConfirmDeleteAll}
        />
      </Suspense>
    </div>
  );
}
