
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { User, UserRole, GMailAccount } from '../types';
import { Trash2, Shield, Loader2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { getGmailAccounts, disconnectGmailAccount } from '../services/adminService';
import Skeleton from '../components/ui/Skeleton';

// Fix: Added missing 'name' property to each user object.
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@cybersec.io', roles: [UserRole.ADMIN], createdAt: '2023-01-01T00:00:00Z', enabled: true },
  { id: '2', name: 'Analyst One', email: 'analyst1@cybersec.io', roles: [UserRole.ANALYST], createdAt: '2023-02-15T00:00:00Z', enabled: true },
  { id: '3', name: 'Trainee User', email: 'trainee@cybersec.io', roles: [UserRole.TRAINEE], createdAt: '2023-09-01T00:00:00Z', enabled: true },
  { id: '4', name: 'Disabled User', email: 'disabled.user@cybersec.io', roles: [UserRole.ANALYST], createdAt: '2023-05-20T00:00:00Z', enabled: false },
];

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [gmailAccounts, setGmailAccounts] = useState<GMailAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const accounts = await getGmailAccounts();
      setGmailAccounts(accounts);
    } catch (err) {
      setError('Failed to fetch Gmail accounts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // This effect listens for the 'storage' event which we'll dispatch from the callback page
  // to ensure the admin page reloads its data when a new account is added.
  useEffect(() => {
    const handleStorageChange = () => {
      fetchAccounts();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchAccounts]);

  const handleConnectGmail = () => {
    // In a real app, this would redirect to a backend endpoint.
    // Here, we redirect to our simulated consent screen.
    navigate('/gmail-oauth-consent');
  };

  const handleDisconnect = async (accountId: string) => {
    setIsDisconnecting(accountId);
    try {
      await disconnectGmailAccount(accountId);
      // Refetch the list to show the change
      fetchAccounts();
    } catch (err) {
      alert('Failed to disconnect account. Please try again.');
    } finally {
      setIsDisconnecting(null);
    }
  };

  return (
    <>
      <PageHeader title="Admin Console" description="Manage users, roles, and integrations." />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gmail Integration</CardTitle>
            <CardDescription>Connect Gmail accounts for automated mailbox scanning.</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[150px]">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : error ? (
              <p className="text-destructive">{error}</p>
            ) : (
              <div className="space-y-4">
                {gmailAccounts.length === 0 ? (
                    <p className="text-muted-foreground text-sm text-center py-8">No Gmail accounts connected.</p>
                ) : (
                    gmailAccounts.map(account => (
                      <div key={account.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{account.email}</p>
                            <Badge variant="success">Connected</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Last sync: {new Date(account.lastSync).toLocaleString()}</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDisconnect(account.id)}
                          disabled={isDisconnecting === account.id}
                        >
                          {isDisconnecting === account.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Disconnect'}
                        </Button>
                      </div>
                    ))
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-border pt-6">
              <Button onClick={handleConnectGmail}>Connect New Gmail Account</Button>
          </CardFooter>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Add, remove, and manage user roles.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase">
                            <tr>
                                <th scope="col" className="px-4 py-3">User</th>
                                <th scope="col" className="px-4 py-3">Role</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map(user => (
                                <tr key={user.id} className="border-b border-border">
                                    <td className="px-4 py-3 font-medium text-foreground">{user.email}</td>
                                    <td className="px-4 py-3">{user.roles.join(', ').replace('ROLE_','')}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.enabled ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
                                            {user.enabled ? 'Enabled' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <Button variant="ghost" size="icon"><Shield className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-red-400"><Trash2 className="h-4 w-4"/></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Admin;
