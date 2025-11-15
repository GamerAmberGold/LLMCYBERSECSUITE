import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { ShieldCheck, AlertOctagon, UserCheck, Clock } from 'lucide-react';
import { PhishResult, Incident, IncidentSeverity } from '../types';
import { VerdictBadge } from '../components/ui/Badge';
import { firestore, isFirebaseConfigured } from '../services/firebase';
import Skeleton from '../components/ui/Skeleton';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    isLoading?: boolean;
    linkTo?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, isLoading, linkTo }) => {
    const cardContent = (
        <Card className="transition-all hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{value}</div>}
            </CardContent>
        </Card>
    );

    if (linkTo) {
        return <Link to={linkTo} className="focus:outline-none focus:ring-2 focus:ring-ring rounded-xl">{cardContent}</Link>;
    }
    return cardContent;
};

const Dashboard: React.FC = () => {
    const [recentPhish, setRecentPhish] = useState<PhishResult[]>([]);
    const [incidentStats, setIncidentStats] = useState<{ activeCount: number; bySeverity: any[] }>({ activeCount: 0, bySeverity: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [firebaseReady, setFirebaseReady] = useState(false);

    useEffect(() => {
        if (!isFirebaseConfigured()) {
            setIsLoading(false);
            return;
        }
        setFirebaseReady(true);

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch recent phish results
                const phishQuery = firestore.collection('phish_results').orderBy('createdAt', 'desc').limit(3);
                const phishSnapshot = await phishQuery.get();
                const phishData = phishSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                } as PhishResult));
                setRecentPhish(phishData);

                // Fetch incident stats
                const incidentsQuery = firestore.collection('incidents');
                const incidentsSnapshot = await incidentsQuery.get();
                const allIncidents = incidentsSnapshot.docs.map(doc => doc.data() as Incident);
                
                const activeCount = allIncidents.filter(inc => inc.status !== 'Closed' && inc.status !== 'Resolved').length;
                
                const bySeverity = allIncidents.reduce((acc, incident) => {
                    if (incident.severity) {
                        acc[incident.severity] = (acc[incident.severity] || 0) + 1;
                    }
                    return acc;
                }, {} as Record<IncidentSeverity, number>);

                const chartData = [
                  { name: 'Low', count: bySeverity.Low || 0, fill: 'var(--chart-green)' },
                  { name: 'Medium', count: bySeverity.Medium || 0, fill: 'var(--chart-amber)' },
                  { name: 'High', count: bySeverity.High || 0, fill: 'var(--chart-red)' },
                  { name: 'Critical', count: bySeverity.Critical || 0, fill: 'var(--chart-critical)' },
                ];

                setIncidentStats({ activeCount, bySeverity: chartData });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="rounded-lg border border-border bg-card p-2 shadow-sm">
              <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
            </div>
          );
        }
        return null;
    };
    
    const renderFirebaseWarning = (featureName: string) => (
         <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8">
            <p>Firebase is not configured. {featureName} cannot be displayed.</p>
        </div>
    );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, Analyst. Here's your security overview for ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Phish Detections (24h)" value="1,204" icon={ShieldCheck} isLoading={isLoading} linkTo="/phish-sense" />
        <StatCard title="Active Incidents" value={incidentStats.activeCount} icon={AlertOctagon} isLoading={!firebaseReady || isLoading} linkTo="/incidents" />
        <StatCard title="Users Trained" value="489" icon={UserCheck} isLoading={isLoading} linkTo="/training" />
        <StatCard title="Avg. Triage Time" value="12m 45s" icon={Clock} isLoading={isLoading} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Phish Results</CardTitle>
            <CardDescription>Latest emails analyzed by PhishSense from Firestore.</CardDescription>
          </CardHeader>
          <CardContent>
            {!firebaseReady ? renderFirebaseWarning("Recent Phish Results") :
             isLoading ? (
                <ul className="space-y-4">
                    {[...Array(3)].map((_, i) => <li key={i}><Skeleton className="h-12 w-full"/></li>)}
                </ul>
            ) : recentPhish.length > 0 ? (
                <ul className="space-y-4">
                    {recentPhish.map((result, index) => (
                        <li 
                          key={result.id} 
                          className="flex items-center justify-between animate-fadeIn"
                          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                        >
                            <div className="truncate">
                                <p className="text-sm font-medium text-foreground truncate">{result.subject}</p>
                                <p className="text-xs text-muted-foreground">{new Date(result.createdAt).toLocaleString()}</p>
                            </div>
                            <VerdictBadge verdict={result.verdict} />
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No phish results found in Firestore.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Incidents by Severity</CardTitle>
             <CardDescription>Live overview of all incidents from Firestore.</CardDescription>
          </CardHeader>
          <CardContent>
             {!firebaseReady ? renderFirebaseWarning("Incidents by Severity chart") :
              isLoading ? <Skeleton className="h-[250px] w-full" /> : (
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={incidentStats.bySeverity} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip cursor={{fill: 'hsl(var(--accent))'}} content={<CustomTooltip />} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {incidentStats.bySeverity.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;