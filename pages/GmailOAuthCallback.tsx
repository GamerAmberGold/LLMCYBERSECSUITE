
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { handleOauthCallback } from '../services/adminService';
import { Loader2 } from 'lucide-react';

const GmailOAuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing authentication...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const authCode = searchParams.get('code');

        if (!authCode) {
            setError('Authorization code not found. Returning to admin page.');
            setTimeout(() => navigate('/admin'), 3000);
            return;
        }

        const processCallback = async () => {
            try {
                setStatus('Securely connecting your account...');
                await handleOauthCallback(authCode);
                
                // This is a simple way to notify the Admin page to refetch data.
                // In a real app, you might use a global state manager.
                // We dispatch a 'storage' event which the Admin page listens for.
                localStorage.setItem('gmail_sync_trigger', Date.now().toString());
                
                setStatus('Connection successful! Redirecting...');
                setTimeout(() => {
                    navigate('/admin');
                }, 1500);

            } catch (err) {
                setError('Failed to connect the account. Please try again.');
                setTimeout(() => navigate('/admin'), 3000);
            }
        };

        processCallback();
    }, [searchParams, navigate]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-400 mb-6" />
            <h1 className="text-2xl font-semibold text-foreground">
                {error ? 'Connection Failed' : 'Connecting Your Gmail Account'}
            </h1>
            <p className="mt-2 text-muted-foreground">
                {error || status}
            </p>
        </div>
    );
};

export default GmailOAuthCallback;
