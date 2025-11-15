
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const GitHubIcon = () => (
    <svg className="mx-auto h-8 w-8 mb-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
        <path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-6-2.3zm47.2 4.5c-1.2 2.3-1.2 5.2 1.5 6.8 2.9 1.6 6.2 1.2 7.4-1.5s1.2-5.2-1.5-6.8c-2.9-1.5-6.2-1.2-7.4 1.5zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-6-2.3zm47.2 4.5c-1.2 2.3-1.2 5.2 1.5 6.8 2.9 1.6 6.2 1.2 7.4-1.5s1.2-5.2-1.5-6.8c-2.9-1.5-6.2-1.2-7.4 1.5zM496 256c0 137-111 248-248 248S0 393 0 256 111 8 248 8s248 111 248 248zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.2 1.6 1.6 4.3 1.6 5.9 0 1.6-1.6 1.6-3.9 0-5.2-1.6-1.6-4.3-1.6-5.9 0z"></path>
    </svg>
);

const GithubSignIn: React.FC = () => {
    const { login } = useAuth();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSignIn = async () => {
        setIsLoggingIn(true);
        // The login function automatically navigates to the dashboard on success.
        await login('analyst.github@cybersec.io', UserRole.ANALYST);
        setIsLoggingIn(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-lg p-8 space-y-6 text-center animate-fadeIn">
                <GitHubIcon />
                <h1 className="text-xl font-semibold text-foreground">Authorize CyberSec Suite</h1>
                <p className="text-sm text-muted-foreground -mt-2">
                    wants to access your account
                </p>
                <div className="bg-muted/50 p-4 rounded-lg text-left space-y-3 border border-border text-sm">
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center font-bold text-primary-200 text-xs">
                            AU
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Analyst User</p>
                            <p className="text-muted-foreground">analyst.github@cybersec.io</p>
                        </div>
                    </div>
                     <p className="text-green-400 font-mono text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        Signed in
                    </p>
                </div>
                 <p className="text-xs text-muted-foreground pt-2">
                    By clicking "Authorize", you are allowing CyberSec Suite to access your identity.
                </p>
                <Button onClick={handleSignIn} disabled={isLoggingIn} className="w-full bg-green-600 hover:bg-green-700 text-white">
                    {isLoggingIn ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Authorize CyberSec Suite'}
                </Button>
            </div>
        </div>
    );
};

export default GithubSignIn;
