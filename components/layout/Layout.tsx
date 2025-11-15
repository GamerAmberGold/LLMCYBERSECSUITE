


import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, Home, BarChart2, AlertTriangle, Users, LifeBuoy, Settings, Bot, Menu, Sun, Moon, User as UserIcon, LogOut, HeartPulse } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '../ui/Dropdown';
import { isFirebaseConfigured } from '../../services/firebase';

const baseNavItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Security Hub', path: '/security-hub', icon: HeartPulse },
  { name: 'PhishSense', path: '/phish-sense', icon: Shield },
  { name: 'Threat Intel', path: '/threat-intel', icon: BarChart2 },
  { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
  { name: 'Training', path: '/training', icon: Users },
  { name: 'Vuln Predictor', path: '/vuln-predictor', icon: LifeBuoy },
  { name: 'AI Search', path: '/ai-search', icon: Bot },
];

const adminNavItem = { name: 'Admin', path: '/admin', icon: Settings };

const useTheme = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(initialTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newTheme;
        });
    }, []);

    return { theme, toggleTheme };
};

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    if (!theme) return null; 

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { isAdmin } = useAuth();
  const navItems = isAdmin ? [...baseNavItems, adminNavItem] : baseNavItems;

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-card border-r border-border transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}>
      <div className="flex items-center justify-center h-16 border-b border-border">
        <Shield className="h-8 w-8 text-primary-400" />
        <span className="ml-2 text-xl font-bold text-foreground">CyberSec Suite</span>
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-all text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1 ${
                isActive ? 'bg-muted text-foreground' : ''
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const UserProfileDropdown: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center font-bold text-primary-200 cursor-pointer transition-transform hover:scale-110">
          {getInitials(currentUser.name)}
        </div>
      </DropdownTrigger>
      <DropdownContent>
        <div className="px-4 py-2 border-b border-border">
          <p className="text-sm font-medium text-foreground truncate">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
        </div>
        <Link to="/profile">
          <DropdownItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownItem>
        </Link>
        <DropdownItem onSelect={logout} className="text-red-400">
           <LogOut className="mr-2 h-4 w-4" />
           <span>Logout</span>
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  );
};


const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => (
  <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-card/80 backdrop-blur-lg border-b border-border sm:justify-end">
    <button onClick={onMenuClick} className="sm:hidden p-2 rounded-md text-muted-foreground hover:bg-muted">
      <Menu size={24} />
    </button>
    <div className="flex items-center space-x-4">
      <ThemeToggle />
      <UserProfileDropdown />
    </div>
  </header>
);

const FirebaseNotConfiguredBanner: React.FC = () => (
    <div className="bg-destructive text-destructive-foreground p-3 text-center text-sm font-semibold">
        <strong>ACTION REQUIRED:</strong> Firebase is not configured. Please update <code>/services/firebase.ts</code> with your project credentials to enable database-dependent features.
    </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const firebaseConfigured = isFirebaseConfigured();

  return (
    <div className="min-h-screen bg-background">
      {!firebaseConfigured && <FirebaseNotConfiguredBanner />}
      <Sidebar isOpen={sidebarOpen} />
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/50 sm:hidden"></div>}
      <div className="sm:pl-64">
        <Header onMenuClick={() => setSidebarOpen(s => !s)} />
        <main className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;