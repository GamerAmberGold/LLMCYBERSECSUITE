import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Bot, Search, FileText } from 'lucide-react';
import { performAiSearchStream } from '../services/geminiService';
import Skeleton from '../components/ui/Skeleton';

const AISearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ answer: string; sources: string[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setIsLoading(true);
        setResult({ answer: '', sources: [] }); // Reset for streaming
        setError(null);

        try {
            for await (const partialResult of performAiSearchStream(query)) {
                if ('error' in partialResult) {
                    setError(partialResult.error);
                    setResult(null);
                    break;
                }
                setResult(currentResult => ({
                    answer: (currentResult?.answer ?? "") + partialResult.answer,
                    sources: partialResult.sources,
                }));
            }
        } catch (err) {
            setError('An unexpected error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <PageHeader title="AI Search" description="Ask questions and get answers from your internal knowledge base, powered by Gemini." />

            <Card className="mb-6">
                <CardContent className="p-6">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., 'What is the playbook for a phishing incident?'"
                                className="w-full bg-input border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !query}>
                             {isLoading ? (
                                <>
                                    <Bot className="mr-2 h-4 w-4 animate-spin-slow" /> Thinking...
                                </>
                            ) : (
                                'Ask AI'
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><Bot className="mr-2 h-5 w-5"/> AI Response</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[200px]">
                    {isLoading && !result?.answer && (
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    )}
                    {error && <p className="text-destructive">{error}</p>}
                    {result && (
                        <div>
                            <div className="prose prose-invert prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: result.answer.replace(/\n/g, '<br />') }} />

                            {result.sources.length > 0 && (
                                <div className="pt-4 border-t border-border">
                                    <h4 className="font-semibold text-muted-foreground text-sm mb-2">Sources:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {result.sources.map(source => (
                                            <div key={source} className="flex items-center bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">
                                                <FileText className="h-3 w-3 mr-1.5" /> {source}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                     {!isLoading && !result && !error && (
                         <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Ask a question to get a response from the AI assistant.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default AISearch;