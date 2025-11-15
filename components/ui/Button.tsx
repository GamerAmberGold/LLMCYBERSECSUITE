

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'default',
  children,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background transform hover:scale-[1.03] active:scale-[0.98]";

  const variants = {
    primary: "bg-primary-600 text-primary-foreground hover:bg-primary-600/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-muted text-muted-foreground hover:bg-muted/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;