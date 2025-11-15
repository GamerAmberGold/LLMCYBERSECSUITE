

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-card rounded-xl border border-border shadow-sm transition-all hover:border-border/80 hover:shadow-lg dark:hover:shadow-primary/10 ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-6 flex flex-row items-center justify-between space-y-1.5 pb-2 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight text-card-foreground ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardProps> = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>
    {children}
  </p>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };