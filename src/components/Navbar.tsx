import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  ExternalLink,
  Menu,
  X,
  BookOpen,
  Layers,
  Award,
  User,
  LogOut,
  Lock,
} from 'lucide-react';
import { AppView } from '../types/insurance';
import { PRODUCT_CONFIG } from '../config/appConfig';

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <button
            type="button"
            id="nav-brand-logo"
            onClick={() => handleNav('landing')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            {/* Swiss Cross Emblem */}
            <div className="w-9 h-9 rounded-lg bg-[#E30613] flex items-center justify-center shadow-xs group-hover:opacity-95 transition-opacity">
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
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 border border-amber-500/40 shadow-xs tracking-wide">
                  {PRODUCT_CONFIG.editionYear} EDITION
                </span>
              </div>
              <span className="block text-[11px] font-semibold text-neutral-500 -mt-0.5 tracking-wider uppercase">
                Insurance Optimizer
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              id="nav-link-landing"
              onClick={() => handleNav('landing')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                currentView === 'landing'
                  ? 'text-[#E30613] bg-red-50/70'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Overview
            </button>

            <button
              type="button"
              id="nav-link-optimizer"
              onClick={() => handleNav('optimizer')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                currentView === 'optimizer' || currentView === 'results'
                  ? 'text-[#E30613] bg-red-50/70'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Interactive Optimizer
            </button>

            <button
              type="button"
              id="nav-link-bonuses"
              onClick={() => handleNav('bonuses')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                currentView === 'bonuses'
                  ? 'text-[#E30613] bg-red-50/70'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Bonus Toolkit
            </button>

            <a
              href={PRODUCT_CONFIG.officialPriminfoUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="nav-link-priminfo"
              className="px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors inline-flex items-center gap-1.5"
            >
              <span>Priminfo (Official)</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>

            <button
              type="button"
              id="nav-link-sources"
              onClick={() => handleNav('sources')}
              className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors ${
                currentView === 'sources' || currentView === 'methodology'
                  ? 'text-[#E30613] bg-red-50/70'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Sources & Methodology
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-2">
            {userEmail ? (
              <div className="flex items-center gap-2 pr-2 border-r border-neutral-200">
                <span className="text-xs text-neutral-600 font-medium max-w-[150px] truncate flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate">{userEmail}</span>
                </span>
                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    title="Sair da conta"
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                id="nav-btn-login"
                onClick={() => handleNav('login')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border ${
                  currentView === 'login'
                    ? 'bg-neutral-100 text-neutral-900 border-neutral-300'
                    : 'text-neutral-700 hover:text-neutral-900 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <span>Área de Membros</span>
              </button>
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
                onClick={() => handleNav('optimizer')}
                className="px-4 py-2 bg-[#E30613] text-white text-xs font-bold rounded-lg hover:bg-[#c90510] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start Optimizer</span>
                <span className="opacity-90 font-normal">| CHF 19.90</span>
              </button>
            )}
          </div>

          {/* Mobile & Tablet menu toggle (visible on screens < 768px) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            type="button"
            onClick={() => handleNav('landing')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => handleNav('optimizer')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            Interactive Optimizer
          </button>
          <button
            type="button"
            onClick={() => handleNav('bonuses')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            Bonus Toolkit (6 Tools)
          </button>
          <a
            href={PRODUCT_CONFIG.officialPriminfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            <span>Official Priminfo Comparison</span>
            <ExternalLink className="w-4 h-4 text-neutral-400" />
          </a>
          <button
            type="button"
            onClick={() => handleNav('sources')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-800 hover:bg-neutral-100"
          >
            Sources & Methodology
          </button>

          {/* Member Login / User Area on Mobile */}
          <div className="pt-2 border-t border-neutral-100">
            {userEmail ? (
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
                    <span>Sair</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNav('login')}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-neutral-800 hover:bg-neutral-100 flex items-center justify-between"
              >
                <span>Área de Membros (Login)</span>
                <Lock className="w-4 h-4 text-neutral-400" />
              </button>
            )}
          </div>

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
                onClick={() => handleNav('optimizer')}
                className="w-full py-3 bg-[#E30613] text-white text-center font-bold text-sm rounded-lg"
              >
                Start Optimizer (CHF 19.90)
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
