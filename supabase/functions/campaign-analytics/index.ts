import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsRequest {
  action: 'get_summary' | 'get_campaign_performance' | 'get_trends' | 'track_event';
  period?: '24h' | '7d' | '30d' | '90d';
  campaign_id?: string;
  event_type?: 'impression' | 'click' | 'conversion';
  revenue?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, period = '7d', campaign_id, event_type, revenue } = await req.json() as AnalyticsRequest;

    console.log(`Analytics action: ${action}, period: ${period}, user: ${user.id}`);

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    if (action === 'get_summary') {
      // Get aggregated analytics summary
      const { data: analytics, error } = await supabase
        .from('campaign_analytics')
        .select('impressions, clicks, conversions, revenue, cost, date')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }

      // Aggregate the data
      const summary = (analytics || []).reduce((acc, curr) => ({
        impressions: acc.impressions + (curr.impressions || 0),
        clicks: acc.clicks + (curr.clicks || 0),
        conversions: acc.conversions + (curr.conversions || 0),
        revenue: acc.revenue + Number(curr.revenue || 0),
        cost: acc.cost + Number(curr.cost || 0),
      }), { impressions: 0, clicks: 0, conversions: 0, revenue: 0, cost: 0 });

      // Calculate derived metrics
      const ctr = summary.impressions > 0 ? (summary.clicks / summary.impressions) * 100 : 0;
      const conversionRate = summary.clicks > 0 ? (summary.conversions / summary.clicks) * 100 : 0;
      const roi = summary.cost > 0 ? ((summary.revenue - summary.cost) / summary.cost) * 100 : 0;

      return new Response(JSON.stringify({
        summary: {
          ...summary,
          ctr: ctr.toFixed(2),
          conversionRate: conversionRate.toFixed(2),
          roi: roi.toFixed(2),
        },
        dailyData: analytics,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_campaign_performance') {
      // Get performance by campaign
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id, name, status, budget, spent')
        .eq('user_id', user.id);

      if (campaignsError) throw campaignsError;

      const campaignPerformance = await Promise.all((campaigns || []).map(async (campaign) => {
        const { data: analytics } = await supabase
          .from('campaign_analytics')
          .select('impressions, clicks, conversions, revenue, cost')
          .eq('campaign_id', campaign.id)
          .gte('date', startDate.toISOString().split('T')[0]);

        const totals = (analytics || []).reduce((acc, curr) => ({
          impressions: acc.impressions + (curr.impressions || 0),
          clicks: acc.clicks + (curr.clicks || 0),
          conversions: acc.conversions + (curr.conversions || 0),
          revenue: acc.revenue + Number(curr.revenue || 0),
          cost: acc.cost + Number(curr.cost || 0),
        }), { impressions: 0, clicks: 0, conversions: 0, revenue: 0, cost: 0 });

        const roi = totals.cost > 0 ? ((totals.revenue - totals.cost) / totals.cost) * 100 : 0;

        return {
          ...campaign,
          ...totals,
          roi: roi.toFixed(2),
        };
      }));

      return new Response(JSON.stringify({ campaigns: campaignPerformance }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_trends') {
      // Get daily trend data for charts
      const { data: analytics, error } = await supabase
        .from('campaign_analytics')
        .select('date, impressions, clicks, conversions, revenue, cost')
        .eq('user_id', user.id)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) throw error;

      // Group by date
      const trends = (analytics || []).reduce((acc: Record<string, any>, curr) => {
        const date = curr.date;
        if (!acc[date]) {
          acc[date] = { date, impressions: 0, clicks: 0, conversions: 0, revenue: 0, cost: 0 };
        }
        acc[date].impressions += curr.impressions || 0;
        acc[date].clicks += curr.clicks || 0;
        acc[date].conversions += curr.conversions || 0;
        acc[date].revenue += Number(curr.revenue || 0);
        acc[date].cost += Number(curr.cost || 0);
        return acc;
      }, {});

      return new Response(JSON.stringify({ trends: Object.values(trends) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'track_event' && campaign_id && event_type) {
      // Verify campaign ownership before tracking events
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('id, user_id')
        .eq('id', campaign_id)
        .eq('user_id', user.id)
        .single();

      if (campaignError || !campaign) {
        console.log(`Campaign ownership check failed: campaign_id=${campaign_id}, user_id=${user.id}`);
        return new Response(JSON.stringify({ error: 'Campaign not found or access denied' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const today = new Date().toISOString().split('T')[0];

      // Check if record exists for today
      const { data: existing } = await supabase
        .from('campaign_analytics')
        .select('id, impressions, clicks, conversions, revenue')
        .eq('campaign_id', campaign_id)
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing record
        const updates: Record<string, number> = {};
        if (event_type === 'impression') updates.impressions = (existing.impressions || 0) + 1;
        if (event_type === 'click') updates.clicks = (existing.clicks || 0) + 1;
        if (event_type === 'conversion') {
          updates.conversions = (existing.conversions || 0) + 1;
          if (revenue) updates.revenue = Number(existing.revenue || 0) + revenue;
        }

        const { error } = await supabase
          .from('campaign_analytics')
          .update(updates)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new record
        const newRecord = {
          campaign_id,
          user_id: user.id,
          date: today,
          impressions: event_type === 'impression' ? 1 : 0,
          clicks: event_type === 'click' ? 1 : 0,
          conversions: event_type === 'conversion' ? 1 : 0,
          revenue: event_type === 'conversion' && revenue ? revenue : 0,
          cost: 0,
        };

        const { error } = await supabase
          .from('campaign_analytics')
          .insert(newRecord);

        if (error) throw error;
      }

      // Create notification for significant events
      if (event_type === 'conversion') {
        await supabase.from('notifications').insert({
          user_id: user.id,
          type: 'conversion',
          title: 'New Conversion! 🎉',
          message: `Your campaign just got a new conversion${revenue ? ` worth ₹${revenue}` : ''}!`,
          data: { campaign_id, revenue },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in campaign-analytics function:', error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
