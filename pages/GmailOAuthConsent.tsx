
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';

const GmailOAuthConsent: React.FC = () => {
    const navigate = useNavigate();
    const [isAllowing, setIsAllowing] = useState(false);

    const handleAllow = () => {
        setIsAllowing(true);
        // Simulate a brief delay before redirecting to the callback URL
        setTimeout(() => {
            // In a real OAuth flow, Google would redirect to this URI.
            // We are simulating this by navigating within our React app.
            const mockAuthCode = `4/0AdTh5-fA_..._${Date.now()}`;
            navigate(`/gmail-oauth-callback?code=${mockAuthCode}`);
        }, 1500);
    };

    const handleDeny = () => {
        // If denied, just go back to the admin page.
        navigate('/admin');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-primary-400" />
                    <h1 className="mt-4 text-2xl font-bold text-foreground">
                        CyberSec Suite wants to access your Google Account
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This will allow CyberSec Suite to:
                    </p>
                </div>

                <div className="space-y-4 text-sm text-card-foreground">
                    <div className="flex items-start gap-4">
                        <Mail className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Read, compose, and send emails from your Gmail account</p>
                            <p className="text-muted-foreground">Used for scanning incoming emails for threats and sending alerts.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Shield className="h-5 w-5 mt-1 text-muted-foreground" />
                        <div>
                             <p className="font-semibold">Manage your labels</p>
                            <p className="text-muted-foreground">Used to apply labels like 'PhishSense-Malicious' to triaged emails.</p>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                    By clicking Allow, you agree to the CyberSec Suite <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
                </p>

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="ghost" onClick={handleDeny} disabled={isAllowing}>
                        Deny
                    </Button>
                    <Button onClick={handleAllow} disabled={isAllowing}>
                        {isAllowing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Allowing...
                            </>
                        ) : (
                            'Allow'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GmailOAuthConsent;
