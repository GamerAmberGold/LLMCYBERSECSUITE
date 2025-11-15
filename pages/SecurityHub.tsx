import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import ThreatLevelIndicator, { ThreatLevel } from '../components/ui/ThreatLevelIndicator';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Incident, IncidentSeverity } from '../types';
import { SeverityBadge, StatusBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { firestore, isFirebaseConfigured } from '../services/firebase';
import Skeleton from '../components/ui/Skeleton';

const vulnerabilityData = [
    { name: 'Critical', value: 8, color: '#b91c1c' },
    { name: 'High', value: 22, color: '#dc2626' },
    { name: 'Medium', value: 45, color: '#f59e0b' },
    { name: 'Low', value: 120, color: '#16a34a' },
];

const calculateThreatLevel = (incidents: Incident[]): ThreatLevel => {
    const activeIncidents = incidents.filter(inc => inc.status !== 'Closed' && inc.status !== 'Resolved');
    if (activeIncidents.some(inc => inc.severity === IncidentSeverity.CRITICAL)) {
        return ThreatLevel.SEVERE;
    }
    if (activeIncidents.some(inc => inc.severity === IncidentSeverity.HIGH)) {
        return ThreatLevel.HIGH;
    }
    const mediumCount = activeIncidents.filter(inc => inc.severity === IncidentSeverity.MEDIUM).length;
    if (mediumCount > 2) {
        return ThreatLevel.ELEVATED;
    }
    if (activeIncidents.length > 0) {
        return ThreatLevel.GUARDED;
    }
    return ThreatLevel.LOW;
};

const SecurityHub: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [threatLevel, setThreatLevel] = useState<ThreatLevel>(ThreatLevel.LOW);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isFirebaseConfigured()) {
            setIsLoading(false);
            return;
        }

        const fetchIncidents = async () => {
            setIsLoading(true);
            try {
                const incidentsQuery = firestore.collection('incidents');
                const snapshot = await incidentsQuery.get();
                const allIncidents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Incident));
                
                const recentHighPriority = allIncidents
                    .filter(inc => inc.status !== 'Closed' && inc.status !== 'Resolved')
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 3);
                
                setIncidents(recentHighPriority);
                setThreatLevel(calculateThreatLevel(allIncidents));
            } catch (error) {
                console.error("Error fetching incidents:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIncidents();
    }, []);

    return (
        <>
            <PageHeader
                title="Security Hub"
                description="A real-time overview of security posture, active threats, and system vulnerabilities."
            />

            <div className="grid gap-6">
                <ThreatLevelIndicator level={threatLevel} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>High-Priority Incidents</CardTitle>
                            <CardDescription>Top 3 active incidents requiring attention from Firestore.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <ul className="space-y-4">
                                    {[...Array(3)].map((_, i) => <li key={i}><Skeleton className="h-16 w-full" /></li>)}
                                </ul>
                            ) : incidents.length > 0 ? (
                                <ul className="space-y-4">
                                    {incidents.map(incident => (
                                        <li key={incident.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md border border-transparent hover:bg-muted hover:border-border transition-colors">
                                            <div className="flex-1 mb-2 sm:mb-0">
                                                <p className="font-semibold text-foreground truncate">{incident.title}</p>
                                                <p className="text-xs text-muted-foreground">{incident.id.substring(0,8)}... &bull; Created: {new Date(incident.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <SeverityBadge severity={incident.severity} />
                                                <StatusBadge status={incident.status} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                 <p className="text-sm text-muted-foreground text-center py-8">{isFirebaseConfigured() ? 'No active incidents found.' : 'Firebase not configured.'}</p>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Link to="/incidents" className="w-full">
                                <Button variant="secondary" className="w-full">
                                    View All Incidents <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vulnerability Overview</CardTitle>
                            <CardDescription>Distribution of vulnerabilities across all scanned assets.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={vulnerabilityData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                    >
                                        {vulnerabilityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            borderColor: 'hsl(var(--border))',
                                            borderRadius: '0.5rem',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                             <div className="flex justify-center flex-wrap gap-4 mt-4 text-xs">
                                {vulnerabilityData.map((entry) => (
                                    <div key={entry.name} className="flex items-center">
                                        <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
                                        <span>{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default SecurityHub;