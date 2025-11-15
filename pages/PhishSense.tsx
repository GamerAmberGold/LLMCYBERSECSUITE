import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { PhishResult, PhishVerdict } from '../types';
import { VerdictBadge } from '../components/ui/Badge';
import Skeleton from '../components/ui/Skeleton';
import { AlertTriangle, Bot, FileText, Loader2 } from 'lucide-react';
import { analyzeEmail, PhishAnalysis } from '../services/geminiService';
import { firestore, isFirebaseConfigured } from '../services/firebase';


const PhishSense: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PhishResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [history, setHistory] = useState<PhishResult[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const fetchHistory = useCallback(() => {
      if (!isFirebaseConfigured()) {
          setIsHistoryLoading(false);
          return;
      }
      setIsHistoryLoading(true);
      const historyQuery = firestore.collection('phish_results').orderBy('createdAt', 'desc').limit(5);
      
      historyQuery.get().then(snapshot => {
          const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PhishResult));
          setHistory(historyData);
          setIsHistoryLoading(false);
      }).catch(err => {
          console.error("Error fetching analysis history: ", err);
          setIsHistoryLoading(false);
      });
  }, []);

  useEffect(() => {
      fetchHistory();
  }, [fetchHistory]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    const result = await analyzeEmail(subject, body);
    
    if ('error' in result) {
        setError(result.error);
    } else {
        const newResult: Omit<PhishResult, 'id'> = {
            ...result,
            subject,
            body,
            createdAt: new Date().toISOString()
        };

        if (isFirebaseConfigured()) {
            try {
                const docRef = await firestore.collection('phish_results').add(newResult);
                setAnalysisResult({ ...newResult, id: docRef.id });
                fetchHistory(); // Refresh history
            } catch (dbError) {
                console.error("Error saving analysis to Firestore:", dbError);
                // Still show result to user even if save fails
                setAnalysisResult({ ...newResult, id: 'local-unsaved' });
            }
        } else {
            // If firebase isn't configured, just display the result locally
            setAnalysisResult({ ...newResult, id: 'local-unconfigured' });
        }
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <PageHeader title="PhishSense" description="Analyze email content for phishing indicators using Gemini." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <form onSubmit={handleAnalyze}>
            <CardHeader>
              <CardTitle>Manual Analysis</CardTitle>
              <CardDescription>Paste email subject and body to get an instant AI analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Email subject"
                  required
                />
              </div>
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-muted-foreground mb-1">Body</label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Email body content"
                  rows={8}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || !subject || !body}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Analyze with AI'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col">
            {isLoading && (
                <div className="space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                </div>
            )}
            {error && <p className="text-destructive text-center m-auto">{error}</p>}
            {analysisResult && (
              <div className="space-y-4 animate-fadeInUp">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-foreground break-words pr-4">{analysisResult.subject}</h3>
                  <VerdictBadge verdict={analysisResult.verdict} />
                </div>
                <div>
                  <h4 className="font-semibold text-muted-foreground flex items-center"><FileText size={16} className="mr-2"/>Reasons</h4>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {analysisResult.reasons.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                 <div>
                  <h4 className="font-semibold text-muted-foreground flex items-center"><Bot size={16} className="mr-2"/>AI Evidence</h4>
                  <p className="text-sm mt-1 bg-muted/50 p-3 rounded-md">{analysisResult.llm_evidence}</p>
                </div>
                <Button variant="destructive" size="sm" className="flex items-center">
                    <AlertTriangle size={16} className="mr-2" /> Escalate to Incident
                </Button>
              </div>
            )}
            {!isLoading && !analysisResult && !error && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                <p>Submit an email for analysis to see results here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
          <CardHeader>
              <CardTitle>Recent Analysis History</CardTitle>
              <CardDescription>Latest 5 analyses from Firestore.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                      <thead className="text-xs text-muted-foreground uppercase">
                          <tr>
                              <th scope="col" className="px-6 py-3">Subject</th>
                              <th scope="col" className="px-6 py-3">Verdict</th>
                              <th scope="col" className="px-6 py-3">Score</th>
                              <th scope="col" className="px-6 py-3">Date</th>
                          </tr>
                      </thead>
                      <tbody>
                          {isHistoryLoading ? (
                               [...Array(3)].map((_, i) => (
                                   <tr key={i} className="border-b border-border">
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-full"/></td>
                                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full"/></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-8"/></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32"/></td>
                                   </tr>
                               ))
                          ) : history.length > 0 ? (
                              history.map((result) => (
                                  <tr key={result.id} className="border-b border-border hover:bg-muted">
                                      <td className="px-6 py-4 font-medium text-foreground truncate max-w-md">{result.subject}</td>
                                      <td className="px-6 py-4"><VerdictBadge verdict={result.verdict} /></td>
                                      <td className="px-6 py-4">{result.score}</td>
                                      <td className="px-6 py-4">{new Date(result.createdAt).toLocaleString()}</td>
                                  </tr>
                              ))
                          ) : (
                              <tr>
                                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                                      {isFirebaseConfigured() ? 'No history found.' : 'Firebase not configured.'}
                                  </td>
                              </tr>
                          )}
                      </tbody>
                  </table>
              </div>
          </CardContent>
      </Card>
    </>
  );
};

export default PhishSense;