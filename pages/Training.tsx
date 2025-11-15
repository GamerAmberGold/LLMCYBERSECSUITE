
import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Training: React.FC = () => {
  return (
    <>
      <PageHeader title="Training & User Risk" description="Create and manage security awareness training for your team." />
       <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">Training Module Coming Soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              This area will allow you to build micro-lessons, assign them to users, and track their progress.
            </p>
            <Button className="mt-4">Request Early Access</Button>
          </div>
        </div>
    </>
  );
};

export default Training;
