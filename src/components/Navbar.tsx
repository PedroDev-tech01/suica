import React, { useState } from 'react';
import {
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
} from 'lucide-react';
import { AppView } from '../types/insurance';
import { PRODUCT_CONFIG } from '../config/appConfig';
import { redirectToHotmartCheckout } from '../config/payment';
import { analytics } from '../services/analytics';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  hasSavedData?: boolean;
  isFullAccess?: boolean;
  userEmail?: string | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  hasSavedData = false,
  isFullAccess = false,
  userEmail = null,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: AppView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const scrollToAnchor = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCheckoutClick = (source: string) => {
    analytics.track('checkout_click', { source });
    redirectToHotmartCheckout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <button
            type="button"
            id="nav-brand-logo"
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            {/* Swiss Cross Emblem */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#E30613] flex items-center justify-center shadow-xs group-hover:opacity-95 transition-opacity shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <rect x="10" y="4" width="4" height="16" rx="0.5" />
                <rect x="4" y="10" width="16" height="4" rx="0.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#080A0D]">
                  SWISS HEALTH
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 tracking-wider">
                  2026 / 2027
                </span>
              </div>
              <span className="block text-[10px] sm:text-[11px] font-semibold text-neutral-500 -mt-0.5 tracking-wider uppercase">
                Insurance Optimizer
              </span>
            </div>
          </button>

          {/* Focused Sales Navigation (CRO: No conversion leaks) */}
          <nav className="hidden md:flex items-center gap-2">
            {!isFullAccess ? (
              <>
                <button
                  type="button"
                  onClick={() => scrollToAnchor('how-it-works')}
                  className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  How It Works
                </button>
                <button
                  type="button"
                  onClick={() => scrollToAnchor('whats-included')}
                  className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  What's Included
                </button>
                <button
                  type="button"
                  onClick={() => scrollToAnchor('pricing')}
                  className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  Pricing
                </button>
                <button
                  type="button"
                  onClick={() => scrollToAnchor('faq')}
                  className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleNav('optimizer')}
                  className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  Interactive Optimizer
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('bonuses')}
                  className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  Bonus Toolkit
                </button>
                <button
                  type="button"
                  onClick={() => handleNav('sources')}
                  className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  Sources
                </button>
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-2">
            {userEmail && (
              <div className="flex items-center gap-2 pr-2 border-r border-neutral-200">
                <span className="text-xs text-neutral-600 font-medium max-w-[150px] truncate flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">{userEmail}</span>
                </span>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    title="Logout"
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            )}

            {isFullAccess ? (
              <button
                type="button"
                id="nav-btn-cta-top"
                onClick={() => handleNav(hasSavedData ? 'results' : 'optimizer')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{hasSavedData ? 'My Full Report' : 'Start Assessment'}</span>
              </button>
            ) : (
              <button
                type="button"
                id="nav-btn-cta-top"
                onClick={() => handleCheckoutClick('navbar_desktop')}
                className="px-4 py-2.5 bg-[#E30613] hover:bg-[#c90510] text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <span>GET ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}</span>
              </button>
            )}
          </div>

          {/* Mobile menu toggle (visible on screens < 768px) */}
          <div className="flex md:hidden items-center gap-2">
            {!isFullAccess && (
              <button
                type="button"
                onClick={() => handleCheckoutClick('navbar_mobile_pill')}
                className="px-3 py-1.5 bg-[#E30613] text-white text-[11px] font-extrabold rounded-lg uppercase tracking-wider"
              >
                CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}
              </button>
            )}
            <button
              type="button"
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Streamlined Mobile Drawer (Eliminates conversion leakage) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {!isFullAccess ? (
            <>
              <button
                type="button"
                onClick={() => scrollToAnchor('how-it-works')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-100"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToAnchor('whats-included')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-100"
              >
                What's Included
              </button>
              <button
                type="button"
                onClick={() => scrollToAnchor('pricing')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-100"
              >
                Pricing (CHF 19.90)
              </button>
              <button
                type="button"
                onClick={() => scrollToAnchor('faq')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-100"
              >
                Frequently Asked Questions
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleNav('optimizer')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-100"
              >
                Interactive Optimizer
              </button>
              <button
                type="button"
                onClick={() => handleNav('bonuses')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-100"
              >
                Bonus Toolkit
              </button>
            </>
          )}

          {userEmail && (
            <div className="pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg text-xs">
                <span className="flex items-center gap-1.5 font-medium text-neutral-700 truncate max-w-[200px]">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="truncate">{userEmail}</span>
                </span>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="text-[#E30613] font-bold text-xs flex items-center gap-1 hover:underline"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            {isFullAccess ? (
              <button
                type="button"
                onClick={() => handleNav(hasSavedData ? 'results' : 'optimizer')}
                className="w-full py-3 bg-emerald-700 text-white text-center font-bold text-sm rounded-lg"
              >
                {hasSavedData ? 'View My Full Assessment' : 'Start Assessment'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleCheckoutClick('navbar_mobile_drawer')}
                className="w-full py-3.5 bg-[#E30613] hover:bg-[#c90510] text-white text-center font-extrabold text-sm rounded-xl uppercase tracking-wider shadow-md"
              >
                GET INSTANT ACCESS — CHF {PRODUCT_CONFIG.priceCHF.toFixed(2)}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
