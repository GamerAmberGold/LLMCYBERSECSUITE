
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

interface DropdownContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown component');
  }
  return context;
};

const Dropdown: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative" ref={dropdownRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

const DropdownTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setIsOpen } = useDropdown();
  return (
    <div onClick={() => setIsOpen(o => !o)} className="cursor-pointer">
      {children}
    </div>
  );
};

const DropdownContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const { isOpen } = useDropdown();
  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-border ${className}`}>
      <div className="py-1" role="menu" aria-orientation="vertical">
        {children}
      </div>
    </div>
  );
};

const DropdownItem: React.FC<{ children: React.ReactNode; onSelect?: () => void; className?: string }> = ({ children, onSelect, className }) => {
  const { setIsOpen } = useDropdown();
  const handleSelect = () => {
    onSelect?.();
    setIsOpen(false);
  };
  return (
    <div
      onClick={handleSelect}
      className={`flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted cursor-pointer ${className}`}
      role="menuitem"
    >
      {children}
    </div>
  );
};


export { Dropdown, DropdownTrigger, DropdownContent, DropdownItem };
