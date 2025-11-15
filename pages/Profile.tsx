
import React, { useState, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateUser({ name, email });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3s
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return <div>Loading profile...</div>;
  }

  return (
    <>
      <PageHeader title="Profile Settings" description="Manage your personal information." />
      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your name and email address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
            </Button>
            {saveSuccess && <p className="text-sm text-green-500">Profile updated successfully!</p>}
          </CardFooter>
        </form>
      </Card>
    </>
  );
};

export default Profile;
