
import React from 'react';
import { PhishVerdict, IncidentSeverity, IncidentStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const Badge: React.FC<BadgeProps> = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-primary-700 text-primary-100 border-transparent',
    secondary: 'bg-muted text-muted-foreground border-transparent',
    destructive: 'bg-red-700 text-red-100 border-transparent',
    warning: 'bg-amber-600 text-amber-100 border-transparent',
    success: 'bg-green-700 text-green-100 border-transparent',
    outline: 'text-foreground',
  };

  const baseClasses = 'inline-flex items-center border rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export const VerdictBadge: React.FC<{ verdict: PhishVerdict }> = ({ verdict }) => {
  const variantMap: Record<PhishVerdict, BadgeProps['variant']> = {
    [PhishVerdict.BENIGN]: 'success',
    [PhishVerdict.SUSPICIOUS]: 'warning',
    [PhishVerdict.MALICIOUS]: 'destructive',
  };
  return <Badge variant={variantMap[verdict]}>{verdict}</Badge>;
};

export const SeverityBadge: React.FC<{ severity: IncidentSeverity }> = ({ severity }) => {
  const variantMap: Record<IncidentSeverity, BadgeProps['variant']> = {
    [IncidentSeverity.LOW]: 'success',
    [IncidentSeverity.MEDIUM]: 'warning',
    [IncidentSeverity.HIGH]: 'destructive',
    [IncidentSeverity.CRITICAL]: 'destructive',
  };
  const criticalClass = severity === IncidentSeverity.CRITICAL ? 'animate-pulse' : '';
  return <Badge variant={variantMap[severity]} className={`${criticalClass}`}>{severity}</Badge>;
};

export const StatusBadge: React.FC<{ status: IncidentStatus }> = ({ status }) => {
  const variantMap: Record<IncidentStatus, BadgeProps['variant']> = {
    [IncidentStatus.NEW]: 'default',
    [IncidentStatus.IN_PROGRESS]: 'warning',
    [IncidentStatus.RESOLVED]: 'success',
    [IncidentStatus.CLOSED]: 'secondary',
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
};


export default Badge;
