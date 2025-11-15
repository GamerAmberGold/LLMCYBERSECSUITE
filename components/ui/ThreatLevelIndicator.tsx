import React from 'react';

export enum ThreatLevel {
    LOW = 'LOW',
    GUARDED = 'GUARDED',
    ELEVATED = 'ELEVATED',
    HIGH = 'HIGH',
    SEVERE = 'SEVERE',
}

interface ThreatLevelIndicatorProps {
  level: ThreatLevel;
}

const levelConfig = {
  [ThreatLevel.LOW]: {
    label: 'Low',
    color: 'bg-green-500',
    textColor: 'text-green-100',
    description: 'No significant threats detected. Standard monitoring in effect.',
    pulseColor: 'ring-green-500/50',
  },
  [ThreatLevel.GUARDED]: {
    label: 'Guarded',
    color: 'bg-blue-500',
    textColor: 'text-blue-100',
    description: 'General threat of unspecified malicious activity. Increased vigilance recommended.',
    pulseColor: 'ring-blue-500/50',
  },
  [ThreatLevel.ELEVATED]: {
    label: 'Elevated',
    color: 'bg-yellow-500',
    textColor: 'text-yellow-900',
    description: 'Significant risk of malicious activity. Proactive measures are advised.',
    pulseColor: 'ring-yellow-500/50',
  },
  [ThreatLevel.HIGH]: {
    label: 'High',
    color: 'bg-orange-500',
    textColor: 'text-orange-100',
    description: 'High risk of targeted attacks. Incident response teams should be on alert.',
    pulseColor: 'ring-orange-500/50',
  },
  [ThreatLevel.SEVERE]: {
    label: 'Severe',
    color: 'bg-red-600',
    textColor: 'text-red-100',
    description: 'Severe risk of attack. Active threats detected. Immediate action required.',
    pulseColor: 'ring-red-600/50',
  },
};

const ThreatLevelIndicator: React.FC<ThreatLevelIndicatorProps> = ({ level }) => {
  const config = levelConfig[level];

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-lg border border-border overflow-hidden ${config.color}/20`}>
        <div className={`absolute inset-0 animate-pulse ring-4 ${config.pulseColor} rounded-lg`}></div>
        <div className="relative z-10 text-center">
            <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${config.color} ${config.textColor}`}>
                THREAT LEVEL
            </div>
            <h2 className="mt-4 text-6xl font-bold tracking-tighter text-foreground">{config.label}</h2>
            <p className="mt-2 text-muted-foreground">{config.description}</p>
        </div>
    </div>
  );
};

export default ThreatLevelIndicator;
