import React, { useState } from 'react';
import { HelpCircle, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { SWISS_INSURANCE_GLOSSARY } from '../data/glossary';

interface TermExplainerProps {
  termId: string;
  label?: string;
}

export const TermExplainerButton: React.FC<TermExplainerProps> = ({ termId, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const term = SWISS_INSURANCE_GLOSSARY.find((t) => t.id === termId) || {
    id: termId,
    termEn: label || termId,
    termDe: '',
    termFr: '',
    termIt: '',
    shortDefinition: 'Swiss health insurance statutory parameter.',
    fullExplanation: 'Please verify current conditions with FOPH/BAG or your insurer.',
    practicalTip: 'Always check your insurance policy document for exact wording.',
  };

  return (
    <>
      <button
        type="button"
        id={`btn-explain-${termId}`}
        onClick={() => setIsOpen(true)}
        aria-label={`Explain ${term.termEn}`}
        className="inline-flex items-center justify-center w-5 h-5 ml-1.5 text-xs text-neutral-500 hover:text-[#E30613] hover:bg-red-50 rounded-full transition-colors cursor-pointer border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#E30613]/30"
        title="Click to understand this term"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-[#E30613] rounded">
                    Swiss Health Insurance Term
                  </span>
                  {term.termDe && (
                    <span className="text-xs text-neutral-500 font-mono">
                      DE: {term.termDe}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#080A0D] mt-1">
                  {term.termEn}
                </h3>
              </div>
              <button
                type="button"
                id={`btn-close-${termId}`}
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-sm text-neutral-700 leading-relaxed">
              <div className="p-3 bg-[#F4F5F7] rounded-lg border border-neutral-200/70 font-medium text-neutral-900">
                {term.shortDefinition}
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  How It Works in Switzerland
                </h4>
                <p>{term.fullExplanation}</p>
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 text-xs flex gap-2.5 items-start">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Practical Expat Tip:</span>
                  {term.practicalTip}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                <div>
                  <span className="block text-neutral-400 text-[10px] uppercase font-bold">German</span>
                  <span className="font-medium text-neutral-800">{term.termDe || '—'}</span>
                </div>
                <div>
                  <span className="block text-neutral-400 text-[10px] uppercase font-bold">French</span>
                  <span className="font-medium text-neutral-800">{term.termFr || '—'}</span>
                </div>
                <div>
                  <span className="block text-neutral-400 text-[10px] uppercase font-bold">Italian</span>
                  <span className="font-medium text-neutral-800">{term.termIt || '—'}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                id={`btn-gotit-${termId}`}
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#101722] text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface TermExplainerModalProps {
  termId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TermExplainerModal: React.FC<TermExplainerModalProps> = ({
  termId,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !termId) return null;

  const term = SWISS_INSURANCE_GLOSSARY.find((t) => t.id === termId) || {
    id: termId,
    termEn: termId,
    termDe: '',
    termFr: '',
    termIt: '',
    shortDefinition: 'Swiss health insurance statutory parameter.',
    fullExplanation: 'Please verify current conditions with FOPH/BAG or your insurer.',
    practicalTip: 'Always check your insurance policy document for exact wording.',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-[#E30613] rounded">
                Swiss Health Insurance Term
              </span>
              {term.termDe && (
                <span className="text-xs text-neutral-500 font-mono">
                  DE: {term.termDe}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#080A0D] mt-1">
              {term.termEn}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-sm text-neutral-700 leading-relaxed">
          <div className="p-3 bg-[#F4F5F7] rounded-lg border border-neutral-200/70 font-medium text-neutral-900">
            {term.shortDefinition}
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              How It Works in Switzerland
            </h4>
            <p>{term.fullExplanation}</p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 text-xs flex gap-2.5 items-start">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Practical Expat Tip:</span>
              {term.practicalTip}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            <div>
              <span className="block text-neutral-400 text-[10px] uppercase font-bold">German</span>
              <span className="font-medium text-neutral-800">{term.termDe || '—'}</span>
            </div>
            <div>
              <span className="block text-neutral-400 text-[10px] uppercase font-bold">French</span>
              <span className="font-medium text-neutral-800">{term.termFr || '—'}</span>
            </div>
            <div>
              <span className="block text-neutral-400 text-[10px] uppercase font-bold">Italian</span>
              <span className="font-medium text-neutral-800">{term.termIt || '—'}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-neutral-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#101722] text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
