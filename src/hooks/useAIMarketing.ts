import { useState, useCallback } from 'react';

interface MarketingData {
  productName?: string;
  productCategory?: string;
  productFeatures?: string;
  productPrice?: string;
  serviceName?: string;
  serviceType?: string;
  targetAudience?: string;
  salesGoal?: string;
  budget?: string;
  message?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  userType?: 'product' | 'service';
}

type RequestType = 'product_description' | 'ad_copy' | 'campaign_suggestion' | 'chat';

import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-marketing`;

export function useAIMarketing() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamAIResponse = useCallback(async (
    type: RequestType,
    data: MarketingData,
    onDelta: (deltaText: string) => void,
    onDone: () => void
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get the user's session for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      
      if (!accessToken) {
        throw new Error('Please log in to use AI features');
      }

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ type, data }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch { /* ignore */ }
        }
      }

      onDone();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('AI Marketing Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateProductDescription = useCallback((data: MarketingData) => {
    return new Promise<string>((resolve, reject) => {
      let result = '';
      streamAIResponse(
        'product_description',
        data,
        (delta) => { result += delta; },
        () => resolve(result)
      ).catch(reject);
    });
  }, [streamAIResponse]);

  const generateAdCopy = useCallback((data: MarketingData) => {
    return new Promise<string>((resolve, reject) => {
      let result = '';
      streamAIResponse(
        'ad_copy',
        data,
        (delta) => { result += delta; },
        () => resolve(result)
      ).catch(reject);
    });
  }, [streamAIResponse]);

  const generateCampaignSuggestion = useCallback((data: MarketingData) => {
    return new Promise<string>((resolve, reject) => {
      let result = '';
      streamAIResponse(
        'campaign_suggestion',
        data,
        (delta) => { result += delta; },
        () => resolve(result)
      ).catch(reject);
    });
  }, [streamAIResponse]);

  return {
    isLoading,
    error,
    streamAIResponse,
    generateProductDescription,
    generateAdCopy,
    generateCampaignSuggestion,
  };
}
