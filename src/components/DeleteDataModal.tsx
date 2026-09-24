import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteDataModal: React.FC<DeleteDataModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 text-red-600 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#080A0D]">Clear Local Storage?</h3>
            <span className="text-xs text-neutral-500">Privacy & Data Management</span>
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed mb-5">
          This will permanently delete all saved questionnaire entries, insurance figures, and checklist items stored in your browser's local storage. This action cannot be undone.
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Keep Data
          </button>
          <button
            type="button"
            id="modal-confirm-delete-button"
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            className="flex-1 py-2.5 bg-[#E30613] hover:bg-[#c90510] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Yes, Delete All
          </button>
        </div>
      </div>
    </div>
  );
};
