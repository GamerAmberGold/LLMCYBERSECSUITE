import React, { useState, useEffect } from 'react';
import { firestore, isFirebaseConfigured } from '../services/firebase';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Incident, IncidentSeverity, IncidentStatus } from '../types';
import { SeverityBadge, StatusBadge } from '../components/ui/Badge';
import { PlusCircle, Loader2, AlertTriangle } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';

const CreateIncidentForm: React.FC<{ onClose: () => void, onIncidentCreated: () => void }> = ({ onClose, onIncidentCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<IncidentSeverity>(IncidentSeverity.MEDIUM);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFirebaseConfigured()) {
            alert("Firebase is not configured. Cannot create incident.");
            return;
        }
        setIsSaving(true);
        const newIncident: Omit<Incident, 'id'> = {
            title,
            description,
            severity,
            status: IncidentStatus.NEW,
            ownerId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        try {
            await firestore.collection('incidents').add(newIncident);
            onIncidentCreated();
            onClose();
        } catch (error) {
            console.error("Error creating incident:", error);
            alert("Failed to create incident.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-1">Title</label>
                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
                <label htmlFor="severity" className="block text-sm font-medium text-muted-foreground mb-1">Severity</label>
                <select id="severity" value={severity} onChange={(e) => setSeverity(e.target.value as IncidentSeverity)} required className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    {Object.values(IncidentSeverity).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Creating...</> : 'Create Incident'}
                </Button>
            </div>
        </form>
    );
};

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Cannot fetch incidents.");
      setIsLoading(false);
      return;
    }

    const incidentsQuery = firestore.collection('incidents').orderBy('createdAt', 'desc');

    const unsubscribe = incidentsQuery.onSnapshot((querySnapshot) => {
      const incidentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Incident));
      setIncidents(incidentsData);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching incidents: ", err);
      setError("Failed to load incidents. Please check your connection and Firebase setup.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <tbody>
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="border-b border-border">
              <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
              <td className="px-6 py-4"><Skeleton className="h-4 w-64" /></td>
              <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
              <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
              <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
              <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
            </tr>
          ))}
        </tbody>
      );
    }

    if (error) {
        return (
            <tbody>
                <tr>
                    <td colSpan={6} className="text-center py-16">
                        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                        <h3 className="mt-4 text-lg font-semibold">Error Loading Data</h3>
                        <p className="mt-1 text-muted-foreground">{error}</p>
                    </td>
                </tr>
            </tbody>
        );
    }
    
    if (incidents.length === 0) {
        return (
             <tbody>
                <tr>
                    <td colSpan={6} className="text-center py-16">
                        <h3 className="text-lg font-semibold">No Incidents Found</h3>
                        <p className="mt-1 text-muted-foreground">Try creating a new incident using the button above.</p>
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
      <tbody>
        {incidents.map((incident) => (
          <tr key={incident.id} className="border-b border-border hover:bg-muted cursor-pointer">
            <td className="px-6 py-4 font-mono text-xs">{incident.id.substring(0,8)}...</td>
            <td className="px-6 py-4 font-medium text-foreground max-w-sm truncate">{incident.title}</td>
            <td className="px-6 py-4"><SeverityBadge severity={incident.severity} /></td>
            <td className="px-6 py-4"><StatusBadge status={incident.status} /></td>
            <td className="px-6 py-4">{incident.ownerId || 'Unassigned'}</td>
            <td className="px-6 py-4">{new Date(incident.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Incident Management" description="Track, prioritize, and respond to security incidents." />
        <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4"/> Create Incident
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Incidents</CardTitle>
          <CardDescription>A real-time list of all incidents from Firestore.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Severity</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Owner</th>
                            <th scope="col" className="px-6 py-3">Created At</th>
                        </tr>
                    </thead>
                    {renderContent()}
                </table>
            </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Incident">
        <CreateIncidentForm 
          onClose={() => setIsModalOpen(false)} 
          onIncidentCreated={() => { /* The real-time listener will auto-update the table */ }} 
        />
      </Modal>
    </>
  );
};

export default Incidents;