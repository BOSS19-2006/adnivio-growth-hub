import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsSummary {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  ctr: string;
  conversionRate: string;
  roi: string;
}

interface DailyData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
}

interface CampaignPerformance {
  id: string;
  name: string;
  status: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: string;
}

export const useAnalytics = (period: '24h' | '7d' | '30d' | '90d' = '7d') => {
  const { user, session } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignPerformance[]>([]);
  const [trends, setTrends] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!user || !session) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch summary
      const summaryResponse = await supabase.functions.invoke('campaign-analytics', {
        body: { action: 'get_summary', period },
      });

      if (summaryResponse.error) throw summaryResponse.error;
      
      setSummary(summaryResponse.data.summary);
      setDailyData(summaryResponse.data.dailyData || []);

      // Fetch campaign performance
      const campaignResponse = await supabase.functions.invoke('campaign-analytics', {
        body: { action: 'get_campaign_performance', period },
      });

      if (campaignResponse.error) throw campaignResponse.error;
      setCampaigns(campaignResponse.data.campaigns || []);

      // Fetch trends
      const trendsResponse = await supabase.functions.invoke('campaign-analytics', {
        body: { action: 'get_trends', period },
      });

      if (trendsResponse.error) throw trendsResponse.error;
      setTrends(trendsResponse.data.trends || []);

    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [user, session, period]);

  const trackEvent = useCallback(async (
    campaign_id: string, 
    event_type: 'impression' | 'click' | 'conversion',
    revenue?: number
  ) => {
    if (!session) return;

    try {
      const response = await supabase.functions.invoke('campaign-analytics', {
        body: { action: 'track_event', campaign_id, event_type, revenue },
      });

      if (response.error) throw response.error;
      return response.data;
    } catch (err: any) {
      console.error('Error tracking event:', err);
      throw err;
    }
  }, [session]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    summary,
    dailyData,
    campaigns,
    trends,
    loading,
    error,
    refetch: fetchAnalytics,
    trackEvent,
  };
};
