
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const GoogleIcon = () => (
    <svg className="mx-auto h-8 w-8 mb-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2C327.3 125.2 290.5 108 248 108c-73.4 0-134.3 59.9-134.3 134.3s60.9 134.3 134.3 134.3c81.8 0 112.5-52.5 115.4-78.1H248v-95.6h236.3c2.3 12.7 3.7 26.5 3.7 40.8z"></path>
    </svg>
);


const GoogleSignIn: React.FC = () => {
    const { login } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSignIn = async () => {
        setIsLoggingIn(true);
        // The login function automatically navigates to the dashboard on success.
        await login('analyst.google@cybersec.io', UserRole.ANALYST);
        setIsLoggingIn(false); // Only reached if login fails somehow
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-4">
            <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-lg p-8 space-y-6 text-center animate-fadeIn">
                <GoogleIcon />
                <h1 className="text-2xl font-bold text-foreground">Sign in with Google</h1>
                <p className="text-sm text-muted-foreground">
                    Choose an account to continue to <strong>CyberSec Suite</strong>
                </p>
                <div 
                    className="w-full text-left p-3 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors flex items-center gap-4"
                    onClick={!isLoggingIn ? handleSignIn : undefined}
                >
                    <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center font-bold text-primary-200">
                        AU
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Analyst User</p>
                        <p className="text-xs text-muted-foreground">analyst.google@cybersec.io</p>
                    </div>
                </div>
                
                <p className="text-xs text-muted-foreground pt-4">
                    To continue, Google will share your name, email address, and profile picture with CyberSec Suite.
                </p>
                 {isLoggingIn && (
                    <div className="flex items-center justify-center pt-2">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground"/>
                        <span className="ml-2 text-sm text-muted-foreground">Redirecting...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoogleSignIn;
