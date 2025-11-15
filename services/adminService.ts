
import { GMailAccount } from '../types';

// In-memory store to simulate a database for Gmail accounts
let mockGmailAccounts: GMailAccount[] = [
    { id: 'gmail-1', email: 'soc-mailbox@example.com', lastSync: new Date(Date.now() - 3600 * 1000).toISOString() }
];

// --- Mock API Functions ---

/**
 * Simulates fetching the list of connected Gmail accounts from the backend.
 */
export const getGmailAccounts = (): Promise<GMailAccount[]> => {
    console.log('[Mock API] Fetching Gmail accounts...');
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('[Mock API] Fetched accounts:', mockGmailAccounts);
            resolve([...mockGmailAccounts]);
        }, 800); // 800ms delay to simulate network latency
    });
};

/**
 * Simulates disconnecting a Gmail account.
 * @param accountId The ID of the account to disconnect.
 */
export const disconnectGmailAccount = (accountId: string): Promise<{ success: true }> => {
    console.log(`[Mock API] Disconnecting Gmail account with ID: ${accountId}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const accountIndex = mockGmailAccounts.findIndex(acc => acc.id === accountId);
            if (accountIndex > -1) {
                mockGmailAccounts.splice(accountIndex, 1);
                console.log(`[Mock API] Account ${accountId} disconnected.`);
                resolve({ success: true });
            } else {
                console.error(`[Mock API] Account ${accountId} not found.`);
                reject(new Error('Account not found'));
            }
        }, 1200);
    });
};

/**
 * Simulates the backend process of exchanging an OAuth code for a token
 * and creating a new connected account record.
 * @param authCode The mock authorization code from the simulated consent screen.
 */
export const handleOauthCallback = (authCode: string): Promise<GMailAccount> => {
    console.log(`[Mock API] Handling OAuth callback with code: ${authCode}`);
    return new Promise(resolve => {
        setTimeout(() => {
            // Create a new mock account
            const newAccount: GMailAccount = {
                id: `gmail-${Date.now()}`,
                email: `newly.connected.${Math.floor(Math.random() * 1000)}@example.com`,
                lastSync: new Date().toISOString(),
            };
            mockGmailAccounts.push(newAccount);
            console.log('[Mock API] New account created:', newAccount);
            resolve(newAccount);
        }, 1500);
    });
};
