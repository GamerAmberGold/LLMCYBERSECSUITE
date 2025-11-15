import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fadeIn" 
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-card rounded-lg shadow-xl w-full max-w-lg animate-fadeInUp" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
