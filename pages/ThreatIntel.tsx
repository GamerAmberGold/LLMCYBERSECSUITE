import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import { Search, FileText, Bot } from 'lucide-react';
import { performAiSearch } from '../services/geminiService';

const ThreatIntel: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ answer: string; sources: string[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setIsLoading(true);
        setResult(null);
        setError(null);

        try {
            const searchResult = await performAiSearch(query);
            if ('error' in searchResult) {
                setError(searchResult.error);
            } else {
                setResult(searchResult);
            }
        } catch (err) {
            setError('An unexpected error occurred during the search.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Simple markdown-to-HTML for displaying the result
    const formatAnswer = (text: string) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\* (.*?)(?=\n|\* |$)/g, '<li>$1</li>') // List items
            .replace(/\n/g, '<br/>');
    };

    return (
        <>
            <PageHeader title="Threat Intelligence" description="Summarize and prioritize threat intel from internal and external sources using Gemini." />

            <Card className="mb-6">
                <CardContent className="p-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., 'Summarize TTPs for FIN6'"
                                className="w-full bg-input border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !query}>
                            {isLoading ? <><Bot className="mr-2 h-4 w-4 animate-spin-slow" /> Searching...</> : 'Summarize'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>AI Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[250px]">
                        {isLoading && (
                            <div className="space-y-3">
                                <Skeleton className="h-5 w-1/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-5 w-1/3 mt-4" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-3/5" />
                            </div>
                        )}
                        {error && <p className="text-destructive text-center m-auto">{error}</p>}
                        {result && (
                            <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: formatAnswer(result.answer) }} />
                        )}
                        {!isLoading && !result && !error && (
                             <div className="flex items-center justify-center h-48 text-muted-foreground text-center">
                                <p>Enter a query to generate a threat summary from the knowledge base.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Retrieved Sources</CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[250px]">
                         {result && result.sources.length > 0 && (
                            <ul className="space-y-3">
                                {result.sources.map(docId => (
                                    <li key={docId} className="flex items-start p-2 rounded-md hover:bg-muted">
                                        <FileText className="h-5 w-5 text-primary-400 mt-0.5 mr-3 flex-shrink-0"/>
                                        <div>
                                            <p className="font-semibold text-foreground">{docId}</p>
                                            <p className="text-xs text-muted-foreground">Internal Knowledge Base</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                         {!isLoading && (!result || result.sources.length === 0) && (
                             <div className="flex items-center justify-center h-48 text-muted-foreground text-center text-sm p-4">
                                <p>Sources used for the summary will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ThreatIntel;