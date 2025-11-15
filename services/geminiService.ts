import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { PhishVerdict } from "../types";

let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns a singleton instance of the GoogleGenAI client.
 * Returns null if the API key is not available, allowing for graceful error handling.
 */
const getGenAI = (): GoogleGenAI | null => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    console.error("Gemini API key not found. Please set the API_KEY environment variable in your project's .env file or configuration.");
    return null;
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};


// In a real application, this context would be dynamically retrieved from a vector database or knowledge base.
const KNOWLEDGE_BASE_CONTEXT = `
  You are an AI assistant for CyberSec Suite, a Security Operations Center (SOC) tool.
  Your knowledge base consists of the following documents:
  
  Doc ID: KN001
  Title: Playbook for Phishing Incident Response
  Content: 
  1. Isolate the affected machine from the network.
  2. Reset user credentials immediately.
  3. Scan the user's mailbox for similar emails and delete them.
  4. Block the sender's domain and any malicious URLs found in the email.
  5. Document the incident in the incident management system.

  Doc ID: KN002
  Title: Common IOCs for Ransomware
  Content: 
  - Unusual file encryption activity (files renamed with new extensions).
  - Presence of ransom notes (e.g., README.txt, DECRYPT_INSTRUCTIONS.html).
  - Disabled security software or backups.
  - High CPU/disk activity.
  - Network traffic to known C2 servers.

  Doc ID: KN003
  Title: Threat Actor Profile: FIN6
  Content:
  FIN6 is a financially motivated cybercrime group known for targeting point-of-sale (POS) systems in the retail and hospitality sectors. They primarily use malware like TRINITY and FrameworkPOS to scrape credit card data. Their initial access vector is often through phishing emails or exploiting vulnerabilities in public-facing applications.
`;

export const performAiSearch = async (query: string): Promise<{ answer: string; sources: string[] } | { error: string }> => {
  const ai = getGenAI();
  if (!ai) {
    return {
      error: "Gemini API key is not configured. Please contact an administrator.",
    };
  }

  try {
    const fullPrompt = `${KNOWLEDGE_BASE_CONTEXT}\n\nBased on the knowledge base, answer the following question: "${query}". Be concise and clear. Cite the document IDs of the sources you used.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    
    const text = response.text;
    const sources = text.match(/KN\d{3}/g) || [];
    
    return {
      answer: text,
      sources: Array.from(new Set(sources)),
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      error: "There was an error communicating with the AI. Please try again later.",
    };
  }
};

export async function* performAiSearchStream(query: string) {
    const ai = getGenAI();
    if (!ai) {
        yield { error: "Gemini API key is not configured. Please contact an administrator." };
        return;
    }

    try {
        const fullPrompt = `${KNOWLEDGE_BASE_CONTEXT}\n\nBased on the knowledge base, answer the following question: "${query}". Be concise and clear. Cite the document IDs of the sources you used.`;
        
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });

        let fullText = "";
        for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            fullText += chunkText;
            const sources = fullText.match(/KN\d{3}/g) || [];
            yield { answer: chunkText, sources: Array.from(new Set(sources)) };
        }
    } catch (error) {
        console.error("Error streaming from Gemini API:", error);
        yield { error: "There was an error communicating with the AI. Please try again later." };
    }
}

export interface PhishAnalysis {
    verdict: PhishVerdict;
    score: number; // 0-100
    reasons: string[];
    llm_evidence: string;
}

export const analyzeEmail = async (subject: string, body: string): Promise<PhishAnalysis | { error: string }> => {
    const ai = getGenAI();
    if (!ai) {
        return { error: "Gemini API key is not configured. Please contact an administrator." };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following email for phishing indicators.
            Subject: ${subject}
            Body: ${body}
            
            Based on the content, provide a verdict, a confidence score from 0 to 100, a list of reasons for your verdict, and a brief summary of the evidence.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        verdict: {
                            type: Type.STRING,
                            enum: [PhishVerdict.BENIGN, PhishVerdict.SUSPICIOUS, PhishVerdict.MALICIOUS],
                            description: "The final verdict for the email."
                        },
                        score: {
                            type: Type.NUMBER,
                            description: "A confidence score from 0 (definitely benign) to 100 (definitely malicious)."
                        },
                        reasons: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of 2-4 key reasons for the verdict (e.g., 'Urgency language', 'Suspicious link')."
                        },
                        llm_evidence: {
                            type: Type.STRING,
                            description: "A 1-2 sentence summary explaining the evidence for the verdict."
                        }
                    },
                    required: ["verdict", "score", "reasons", "llm_evidence"],
                },
            },
        });

        const jsonStr = response.text.trim();
        const analysisResult = JSON.parse(jsonStr) as PhishAnalysis;
        return analysisResult;
    } catch (error) {
        console.error("Error calling Gemini API for email analysis:", error);
        return { error: "There was an error communicating with the AI. Please try again later." };
    }
};